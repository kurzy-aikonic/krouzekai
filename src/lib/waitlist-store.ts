import { appendFile, mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import {
  parseWaitlistStatus,
  type WaitlistEntry,
  type WaitlistStatus,
} from "@/types/waitlist";

function waitlistPath(): string {
  return path.join(process.cwd(), "data", "waitlist.jsonl");
}

function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function isRecord(x: unknown): x is Record<string, unknown> & {
  id: string;
  parentEmail: string;
} {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return typeof o.id === "string" && typeof o.parentEmail === "string";
}

function normalizeEntry(parsed: Record<string, unknown>): WaitlistEntry {
  return {
    id: str(parsed.id),
    format: parsed.format === "individual" ? "individual" : "skupina",
    runId: typeof parsed.runId === "string" && parsed.runId ? parsed.runId : null,
    runLabel: typeof parsed.runLabel === "string" ? parsed.runLabel : undefined,
    childName: typeof parsed.childName === "string" ? parsed.childName : undefined,
    childAge: typeof parsed.childAge === "number" ? parsed.childAge : undefined,
    parentName: str(parsed.parentName),
    parentEmail: str(parsed.parentEmail),
    parentPhone: typeof parsed.parentPhone === "string" ? parsed.parentPhone : undefined,
    note: typeof parsed.note === "string" && parsed.note ? parsed.note : undefined,
    consentPrivacy: parsed.consentPrivacy === true,
    status: parseWaitlistStatus(parsed.status),
    internalNotes:
      typeof parsed.internalNotes === "string" && parsed.internalNotes
        ? parsed.internalNotes
        : undefined,
    receivedAt: typeof parsed.receivedAt === "string" ? parsed.receivedAt : undefined,
    updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : undefined,
  };
}

async function readAllLines(): Promise<string[]> {
  try {
    const raw = await readFile(waitlistPath(), "utf-8");
    return raw.trim().split("\n").filter(Boolean);
  } catch {
    return [];
  }
}

function entriesFromJsonlLines(lines: string[]): WaitlistEntry[] {
  const byId = new Map<string, WaitlistEntry>();
  for (const line of lines) {
    try {
      const parsed: unknown = JSON.parse(line);
      if (!isRecord(parsed)) continue;
      byId.set(parsed.id, normalizeEntry(parsed));
    } catch {
      continue;
    }
  }
  return Array.from(byId.values());
}

async function loadFromSupabase(): Promise<WaitlistEntry[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];
  const { data, error } = await supabase.from("web_waitlist").select("payload");
  if (error) {
    console.error("[waitlist] Supabase read:", error.message);
    return [];
  }
  if (!data?.length) return [];
  const out: WaitlistEntry[] = [];
  for (const row of data) {
    const p = row.payload;
    if (!p || typeof p !== "object") continue;
    const o = p as Record<string, unknown>;
    if (!isRecord(o)) continue;
    try {
      out.push(normalizeEntry(o));
    } catch {
      continue;
    }
  }
  return out;
}

function entryToPayload(entry: WaitlistEntry): Record<string, unknown> {
  return JSON.parse(JSON.stringify(entry)) as Record<string, unknown>;
}

async function upsertInSupabase(entry: WaitlistEntry): Promise<void> {
  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error("Supabase není nakonfigurováno.");
  const { error } = await supabase.from("web_waitlist").upsert(
    { id: entry.id, payload: entryToPayload(entry), updated_at: new Date().toISOString() },
    { onConflict: "id" },
  );
  if (error) throw new Error(error.message);
}

async function writeAllToFile(entries: WaitlistEntry[]): Promise<void> {
  const dir = path.join(process.cwd(), "data");
  await mkdir(dir, { recursive: true });
  const body =
    entries
      .sort((a, b) => String(b.receivedAt ?? "").localeCompare(String(a.receivedAt ?? "")))
      .map((e) => JSON.stringify(e))
      .join("\n") + (entries.length ? "\n" : "");
  await writeFile(waitlistPath(), body, "utf-8");
}

/** Sloučí JSONL + Supabase podle `id` — záznam ze Supabase přepíše stejné id ze souboru. */
export async function listWaitlistEntries(): Promise<WaitlistEntry[]> {
  const [fromFile, fromDb] = await Promise.all([
    readAllLines().then(entriesFromJsonlLines),
    loadFromSupabase(),
  ]);
  const byId = new Map<string, WaitlistEntry>();
  for (const e of fromFile) byId.set(e.id, e);
  for (const e of fromDb) byId.set(e.id, e);
  return Array.from(byId.values()).sort((a, b) =>
    String(b.receivedAt ?? "").localeCompare(String(a.receivedAt ?? "")),
  );
}

export async function createWaitlistEntry(
  entry: WaitlistEntry,
): Promise<void> {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const receivedAt = entry.receivedAt ?? new Date().toISOString();
    const withMeta = { ...entry, receivedAt };
    const { error } = await supabase.from("web_waitlist").insert({
      id: withMeta.id,
      payload: entryToPayload(withMeta),
      updated_at: receivedAt,
    });
    if (error) throw new Error(error.message);
    return;
  }

  const dir = path.join(process.cwd(), "data");
  await mkdir(dir, { recursive: true });
  const line = JSON.stringify({ ...entry, receivedAt: entry.receivedAt ?? new Date().toISOString() }) + "\n";
  await appendFile(waitlistPath(), line, "utf-8");
}

export async function updateWaitlistEntryStatus(
  id: string,
  status?: WaitlistStatus,
  internalNotes?: string,
): Promise<WaitlistEntry | null> {
  const all = await listWaitlistEntries();
  const idx = all.findIndex((e) => e.id === id);
  if (idx === -1) return null;

  const next: WaitlistEntry = {
    ...all[idx]!,
    status: status !== undefined ? status : all[idx]!.status,
    internalNotes: internalNotes !== undefined ? internalNotes : all[idx]!.internalNotes,
    updatedAt: new Date().toISOString(),
  };
  all[idx] = next;

  const supabase = getSupabaseAdmin();
  if (supabase) {
    await upsertInSupabase(next);
  } else {
    await writeAllToFile(all);
  }
  return next;
}
