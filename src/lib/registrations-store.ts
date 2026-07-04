import { readFile, writeFile } from "fs/promises";
import path from "path";
import {
  appendAdminHistory,
  appendEmailLog,
  historyForBulkRun,
  historyForBulkStatus,
  historyForPatch,
} from "@/lib/admin-history";
import { getCourseRunById } from "@/lib/course-runs-store";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import type { PaymentProduct } from "@/lib/payment";
import { normalizeParentEmail } from "@/lib/parent-auth";
import {
  getPublicRegistrationCode,
  isRegistrationUuidLookup,
  isShortRegistrationCodeLookup,
  REGISTRATION_CODE_REGEX,
} from "@/lib/registration-code";
import {
  type AdminHistoryEntry,
  type RegistrationEmailLogEntry,
  type RegistrationRecord,
  type RegistrationStatus,
  parseRegistrationStatus,
} from "@/types/registration";

function registrationsPath(): string {
  return path.join(process.cwd(), "data", "registrations.jsonl");
}

export function isRegistrationsJsonlWritable(): boolean {
  return !process.env.REGISTRATIONS_WEBHOOK_URL?.trim();
}

function isRecord(x: unknown): x is Record<string, unknown> & {
  id: string;
  parentEmail: string;
} {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return typeof o.id === "string" && typeof o.parentEmail === "string";
}

function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function num(v: unknown): number {
  return typeof v === "number" && !Number.isNaN(v) ? v : 0;
}

function bool(v: unknown): boolean {
  return v === true;
}

function runIdFromParsed(o: Record<string, unknown>): string | null {
  if (o.runId === null || o.runId === undefined) return null;
  if (typeof o.runId === "string" && o.runId.length > 0) return o.runId;
  return null;
}

function paymentProductFromParsed(o: Record<string, unknown>): PaymentProduct {
  const p = o.paymentProduct;
  if (p === "individual-course") return "individual-course";
  return "skupina-course";
}

function normalizeRecord(
  parsed: Record<string, unknown>,
): RegistrationRecord {
  const format =
    parsed.format === "individual" ? "individual" : "skupina";
  const notesRaw = parsed.internalNotes;
  const internalNotes =
    typeof notesRaw === "string" && notesRaw.length > 0 ? notesRaw : undefined;
  const updatedAt =
    typeof parsed.updatedAt === "string" ? parsed.updatedAt : undefined;
  const receivedAt =
    typeof parsed.receivedAt === "string" ? parsed.receivedAt : undefined;

  let adminHistory = undefined;
  const ahRaw = parsed.adminHistory;
  if (Array.isArray(ahRaw)) {
    adminHistory = ahRaw
      .filter((x) => x && typeof x === "object")
      .map((x) => {
        const o = x as Record<string, unknown>;
        return {
          at: typeof o.at === "string" ? o.at : "",
          actor: typeof o.actor === "string" ? o.actor : "—",
          action: typeof o.action === "string" ? o.action : "",
          summary: typeof o.summary === "string" ? o.summary : "",
          changes:
            o.changes && typeof o.changes === "object"
              ? (o.changes as AdminHistoryEntry["changes"])
              : undefined,
        };
      })
      .filter((e) => e.at && e.summary);
  }

  let emailLog = undefined;
  const elRaw = parsed.emailLog;
  if (Array.isArray(elRaw)) {
    emailLog = elRaw
      .filter((x) => x && typeof x === "object")
      .map((x) => {
        const o = x as Record<string, unknown>;
        const kind = o.kind;
        const validKind: RegistrationEmailLogEntry["kind"] =
          kind === "confirmation" ||
          kind === "status_change" ||
          kind === "resend_confirmation" ||
          kind === "bulk_status_change"
            ? kind
            : "confirmation";
        return {
          at: typeof o.at === "string" ? o.at : "",
          kind: validKind,
          to: typeof o.to === "string" ? o.to : "",
          ok: o.ok === true,
          actor: typeof o.actor === "string" ? o.actor : undefined,
          note: typeof o.note === "string" ? o.note : undefined,
        };
      })
      .filter((e) => e.at && e.to) as RegistrationEmailLogEntry[];
  }

  let registrationCode: string | undefined;
  const rcRaw = parsed.registrationCode;
  if (typeof rcRaw === "string") {
    const up = rcRaw.trim().toUpperCase();
    if (REGISTRATION_CODE_REGEX.test(up)) registrationCode = up;
  }

  return {
    id: str(parsed.id),
    registrationCode,
    format,
    runId: runIdFromParsed(parsed),
    childName: str(parsed.childName),
    childAge: num(parsed.childAge),
    parentName: str(parsed.parentName),
    parentEmail: str(parsed.parentEmail),
    parentPhone: str(parsed.parentPhone),
    consentTerms: bool(parsed.consentTerms),
    consentPrivacy: bool(parsed.consentPrivacy),
    consentAiTools: bool(parsed.consentAiTools),
    consentEarlyServiceStart: bool(parsed.consentEarlyServiceStart),
    paymentProduct: paymentProductFromParsed(parsed),
    amountCzk: num(parsed.amountCzk),
    status: parseRegistrationStatus(parsed.status),
    receivedAt,
    internalNotes,
    updatedAt,
    adminHistory,
    emailLog,
  };
}

async function readAllLines(): Promise<string[]> {
  try {
    const raw = await readFile(registrationsPath(), "utf-8");
    return raw.trim().split("\n").filter(Boolean);
  } catch {
    return [];
  }
}

function recordsFromJsonlLines(lines: string[]): RegistrationRecord[] {
  const byId = new Map<string, RegistrationRecord>();
  for (const line of lines) {
    try {
      const parsed: unknown = JSON.parse(line);
      if (!isRecord(parsed)) continue;
      const rec = normalizeRecord(parsed);
      byId.set(rec.id, rec);
    } catch {
      continue;
    }
  }
  return Array.from(byId.values());
}

async function loadRegistrationsFromSupabase(): Promise<RegistrationRecord[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("web_registrations")
    .select("payload");
  if (error) {
    console.error("[registrations] Supabase read:", error.message);
    return [];
  }
  if (!data?.length) return [];
  const out: RegistrationRecord[] = [];
  for (const row of data) {
    const p = row.payload;
    if (!p || typeof p !== "object") continue;
    const o = p as Record<string, unknown>;
    if (!isRecord(o)) continue;
    try {
      out.push(normalizeRecord(o));
    } catch {
      continue;
    }
  }
  return out;
}

function registrationRecordToPayload(record: RegistrationRecord): Record<string, unknown> {
  return JSON.parse(JSON.stringify(record)) as Record<string, unknown>;
}

async function upsertRegistrationInSupabase(record: RegistrationRecord): Promise<void> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    throw new Error("Supabase není nakonfigurováno.");
  }
  const payload = registrationRecordToPayload(record);
  const now = new Date().toISOString();
  const { error } = await supabase.from("web_registrations").upsert(
    {
      id: record.id,
      payload,
      updated_at: now,
    },
    { onConflict: "id" },
  );
  if (error) {
    throw new Error(error.message);
  }
}

/**
 * Sloučí JSONL + Supabase podle `id` — záznam ze Supabase přepíše stejné id ze souboru.
 */
export async function listRegistrationsMerged(): Promise<RegistrationRecord[]> {
  const fromFile = recordsFromJsonlLines(await readAllLines());
  const fromDb = await loadRegistrationsFromSupabase();
  const byId = new Map<string, RegistrationRecord>();
  for (const r of fromFile) {
    byId.set(r.id, r);
  }
  for (const r of fromDb) {
    byId.set(r.id, r);
  }
  return Array.from(byId.values()).sort((a, b) =>
    String(b.receivedAt ?? "").localeCompare(String(a.receivedAt ?? "")),
  );
}

/** Všechny přihlášky podle e-mailu zákonného zástupce (normalizovaně). */
export async function listRegistrationsByParentEmail(
  email: string,
): Promise<RegistrationRecord[]> {
  const norm = normalizeParentEmail(email);
  const list = await listRegistrationsMerged();
  return list.filter(
    (r) => normalizeParentEmail(r.parentEmail) === norm,
  );
}

/**
 * Najde přihlášku podle technického UUID nebo podle krátkého `registrationCode`.
 * Zdroje: `data/registrations.jsonl` + Supabase `web_registrations` (sloučeno).
 * Při pouhém webhooku (`REGISTRATIONS_WEBHOOK_URL`) tato funkce data z webhooku nevidí.
 */
export async function findRegistrationById(
  lookup: string,
): Promise<RegistrationRecord | null> {
  const t = lookup.trim();
  if (!t) return null;
  const list = await listRegistrationsMerged();
  if (isRegistrationUuidLookup(t)) {
    return list.find((r) => r.id === t) ?? null;
  }
  if (isShortRegistrationCodeLookup(t)) {
    const u = t.toUpperCase();
    return list.find((r) => getPublicRegistrationCode(r) === u) ?? null;
  }
  return null;
}

export type RegistrationAdminPatch = Partial<
  Pick<RegistrationRecord, "status" | "internalNotes" | "runId">
>;

export type UpdateRegistrationOptions = {
  actor?: string;
};

async function persistSingleRegistration(
  all: RegistrationRecord[],
  record: RegistrationRecord,
): Promise<void> {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    await upsertRegistrationInSupabase(record);
    return;
  }

  const body =
    all
      .sort((a, b) =>
        String(b.receivedAt ?? "").localeCompare(String(a.receivedAt ?? "")),
      )
      .map((r) => JSON.stringify(r))
      .join("\n") + (all.length ? "\n" : "");

  await writeFile(registrationsPath(), body, "utf-8");
}

/**
 * Přepíše celý JSONL sloučenými záznamy (atomicky jedním zápisem).
 * V režimu webhooku (`REGISTRATIONS_WEBHOOK_URL`) nelze — hodit chybu.
 */
export async function updateRegistration(
  id: string,
  patch: RegistrationAdminPatch,
  options?: UpdateRegistrationOptions,
): Promise<RegistrationRecord | null> {
  if (!isRegistrationsJsonlWritable()) {
    throw new Error("REGISTRATIONS_WEBHOOK_URL: úpravy přes admin nejsou podporovány.");
  }

  const all = await listRegistrationsMerged();
  const key = id.trim();
  const idx = all.findIndex((r) => {
    if (r.id === key) return true;
    if (isShortRegistrationCodeLookup(key)) {
      return getPublicRegistrationCode(r) === key.toUpperCase();
    }
    return false;
  });
  if (idx === -1) return null;

  const current = all[idx]!;
  const actor = options?.actor?.trim() || "admin";
  let next: RegistrationRecord = {
    ...current,
    updatedAt: new Date().toISOString(),
  };

  if (patch.status !== undefined) {
    next.status = patch.status;
  }

  if (patch.internalNotes !== undefined) {
    const t = patch.internalNotes.trim();
    next.internalNotes = t === "" ? undefined : t;
  }

  if (patch.runId !== undefined) {
    if (patch.runId !== null) {
      const run = await getCourseRunById(patch.runId);
      if (!run) {
        throw new Error("Neplatný termín (runId).");
      }
      if (run.format !== current.format) {
        throw new Error("Termín neodpovídá formátu přihlášky (skupina vs. 1:1).");
      }
      next.runId = patch.runId;
    } else {
      next.runId = null;
    }
  }

  const hist = historyForPatch({ actor, before: current, patch });
  if (hist) {
    next = appendAdminHistory(next, hist);
  }

  all[idx] = next;

  await persistSingleRegistration(all, next);
  return next;
}

function resolveLookupToRecordId(
  lookup: string,
  all: RegistrationRecord[],
): string | null {
  const key = lookup.trim();
  if (!key) return null;
  for (const r of all) {
    if (r.id === key) return r.id;
    if (
      isShortRegistrationCodeLookup(key) &&
      getPublicRegistrationCode(r) === key.toUpperCase()
    ) {
      return r.id;
    }
  }
  return null;
}

export type BulkStatusResult = {
  /** Počet řádků, u kterých se stav skutečně změnil. */
  updated: number;
  /** Vybrané přihlášky, které už nový stav měly. */
  alreadyHadStatus: number;
  /** Identifikátory (kód / UUID), které v datech nebyly. */
  notFound: string[];
  /** Záznamy se změněným stavem (pro volitelné e-maily). */
  changed: {
    record: RegistrationRecord;
    previousStatus: RegistrationStatus;
  }[];
};

/**
 * Hromadná změna stavu podle veřejného kódu nebo UUID.
 * Jedním zápisem JSONL. Neodesílá e-maily (kvůli hromadné akci).
 */
export async function bulkUpdateRegistrationStatus(
  lookups: string[],
  newStatus: RegistrationStatus,
  options?: { actor?: string },
): Promise<BulkStatusResult> {
  if (!isRegistrationsJsonlWritable()) {
    throw new Error("REGISTRATIONS_WEBHOOK_URL: úpravy přes admin nejsou podporovány.");
  }

  const all = await listRegistrationsMerged();
  const notFound: string[] = [];
  const targetIds = new Set<string>();

  for (const raw of lookups) {
    const id = resolveLookupToRecordId(raw, all);
    if (id == null) {
      const t = raw.trim();
      if (t) notFound.push(t);
      continue;
    }
    targetIds.add(id);
  }

  const now = new Date().toISOString();
  const actor = options?.actor?.trim() || "admin";
  let updated = 0;
  let alreadyHadStatus = 0;
  const changed: BulkStatusResult["changed"] = [];

  const nextList = all.map((r) => {
    if (!targetIds.has(r.id)) return r;
    if (r.status === newStatus) {
      alreadyHadStatus += 1;
      return r;
    }
    updated += 1;
    let next: RegistrationRecord = { ...r, status: newStatus, updatedAt: now };
    next = appendAdminHistory(
      next,
      historyForBulkStatus({
        actor,
        previousStatus: r.status,
        newStatus,
      }),
    );
    changed.push({ record: next, previousStatus: r.status });
    return next;
  });

  if (updated > 0) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      for (const r of nextList) {
        if (!targetIds.has(r.id)) continue;
        const orig = all.find((x) => x.id === r.id);
        if (!orig || orig.status === newStatus) continue;
        await upsertRegistrationInSupabase(r);
      }
    } else {
      const body =
        nextList
          .sort((a, b) =>
            String(b.receivedAt ?? "").localeCompare(String(a.receivedAt ?? "")),
          )
          .map((r) => JSON.stringify(r))
          .join("\n") + (nextList.length ? "\n" : "");

      await writeFile(registrationsPath(), body, "utf-8");
    }
  }

  return { updated, alreadyHadStatus, notFound, changed };
}

export type BulkRunResult = {
  updated: number;
  skippedFormat: number;
  notFound: string[];
  changed: {
    record: RegistrationRecord;
    previousRunId: string | null;
  }[];
};

export async function bulkUpdateRegistrationRunId(
  lookups: string[],
  runId: string | null,
  options?: { actor?: string },
): Promise<BulkRunResult> {
  if (!isRegistrationsJsonlWritable()) {
    throw new Error("REGISTRATIONS_WEBHOOK_URL: úpravy přes admin nejsou podporovány.");
  }

  let targetRun: Awaited<ReturnType<typeof getCourseRunById>> | null = null;
  if (runId !== null) {
    targetRun = await getCourseRunById(runId);
    if (!targetRun) {
      throw new Error("Neplatný termín (runId).");
    }
  }

  const all = await listRegistrationsMerged();
  const notFound: string[] = [];
  const targetIds = new Set<string>();

  for (const raw of lookups) {
    const id = resolveLookupToRecordId(raw, all);
    if (id == null) {
      const t = raw.trim();
      if (t) notFound.push(t);
      continue;
    }
    targetIds.add(id);
  }

  const now = new Date().toISOString();
  const actor = options?.actor?.trim() || "admin";
  let updated = 0;
  let skippedFormat = 0;
  const changed: BulkRunResult["changed"] = [];

  const nextList = all.map((r) => {
    if (!targetIds.has(r.id)) return r;
    if (r.runId === runId) return r;

    if (targetRun && targetRun.format !== r.format) {
      skippedFormat += 1;
      return r;
    }

    updated += 1;
    let next: RegistrationRecord = {
      ...r,
      runId,
      updatedAt: now,
    };
    next = appendAdminHistory(
      next,
      historyForBulkRun({
        actor,
        previousRunId: r.runId,
        newRunId: runId,
      }),
    );
    changed.push({ record: next, previousRunId: r.runId });
    return next;
  });

  if (updated > 0) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      for (const r of nextList) {
        if (!targetIds.has(r.id)) continue;
        const orig = all.find((x) => x.id === r.id);
        if (!orig || orig.runId === r.runId) continue;
        if (targetRun && targetRun.format !== orig.format) continue;
        await upsertRegistrationInSupabase(r);
      }
    } else {
      const body =
        nextList
          .sort((a, b) =>
            String(b.receivedAt ?? "").localeCompare(String(a.receivedAt ?? "")),
          )
          .map((r) => JSON.stringify(r))
          .join("\n") + (nextList.length ? "\n" : "");

      await writeFile(registrationsPath(), body, "utf-8");
    }
  }

  return { updated, skippedFormat, notFound, changed };
}

/** Přidá záznam do historie přihlášky a uloží. */
export async function appendRegistrationAdminHistory(
  lookup: string,
  entry: Omit<AdminHistoryEntry, "at">,
): Promise<RegistrationRecord | null> {
  if (!isRegistrationsJsonlWritable()) return null;

  const all = await listRegistrationsMerged();
  const key = lookup.trim();
  const idx = all.findIndex((r) => {
    if (r.id === key) return true;
    if (isShortRegistrationCodeLookup(key)) {
      return getPublicRegistrationCode(r) === key.toUpperCase();
    }
    return false;
  });
  if (idx === -1) return null;

  const current = all[idx]!;
  const next = appendAdminHistory(current, entry);
  all[idx] = next;
  await persistSingleRegistration(all, next);
  return next;
}

/** Přidá záznam do e-mail logu přihlášky a uloží. */
export async function appendRegistrationEmailLog(
  lookup: string,
  entry: Omit<RegistrationEmailLogEntry, "at">,
): Promise<RegistrationRecord | null> {
  if (!isRegistrationsJsonlWritable()) return null;

  const all = await listRegistrationsMerged();
  const key = lookup.trim();
  const idx = all.findIndex((r) => {
    if (r.id === key) return true;
    if (isShortRegistrationCodeLookup(key)) {
      return getPublicRegistrationCode(r) === key.toUpperCase();
    }
    return false;
  });
  if (idx === -1) return null;

  const current = all[idx]!;
  const next = appendEmailLog(current, entry);
  all[idx] = next;
  await persistSingleRegistration(all, next);
  return next;
}
