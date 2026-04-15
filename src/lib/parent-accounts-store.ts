import { readFile, appendFile, mkdir } from "fs/promises";
import path from "path";
import bcrypt from "bcryptjs";
import { normalizeParentEmail } from "@/lib/parent-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export type ParentAccountRecord = {
  emailNorm: string;
  passwordHash: string;
  createdAt: string;
};

function accountsPath(): string {
  return path.join(process.cwd(), "data", "parent-accounts.jsonl");
}

function isLine(x: unknown): x is Record<string, unknown> {
  return Boolean(x && typeof x === "object");
}

function parseParentAccountPayload(
  parsed: Record<string, unknown>,
  expectedNorm: string,
): ParentAccountRecord | null {
  if (typeof parsed.emailNorm !== "string") return null;
  if (normalizeParentEmail(parsed.emailNorm) !== expectedNorm) return null;
  if (typeof parsed.passwordHash !== "string") return null;
  return {
    emailNorm: normalizeParentEmail(parsed.emailNorm),
    passwordHash: parsed.passwordHash,
    createdAt:
      typeof parsed.createdAt === "string"
        ? parsed.createdAt
        : new Date().toISOString(),
  };
}

async function findParentAccountInFile(
  norm: string,
): Promise<ParentAccountRecord | null> {
  try {
    const raw = await readFile(accountsPath(), "utf-8");
    const lines = raw.trim().split("\n").filter(Boolean);
    let last: ParentAccountRecord | null = null;
    for (const line of lines) {
      try {
        const parsed: unknown = JSON.parse(line);
        if (!isLine(parsed)) continue;
        const rec = parseParentAccountPayload(parsed, norm);
        if (rec) last = rec;
      } catch {
        continue;
      }
    }
    return last;
  } catch {
    return null;
  }
}

async function findParentAccountInSupabase(
  norm: string,
): Promise<ParentAccountRecord | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("web_parent_accounts")
    .select("payload")
    .eq("email_norm", norm)
    .maybeSingle();
  if (error) {
    console.error("[parent-accounts] Supabase read:", error.message);
    return null;
  }
  const p = data?.payload;
  if (!p || typeof p !== "object") return null;
  return parseParentAccountPayload(p as Record<string, unknown>, norm);
}

/**
 * Nejdřív Supabase (produkce / Vercel), jinak poslední záznam v JSONL (lokální vývoj).
 */
export async function findParentAccountByEmail(
  email: string,
): Promise<ParentAccountRecord | null> {
  const norm = normalizeParentEmail(email);
  const fromDb = await findParentAccountInSupabase(norm);
  if (fromDb) return fromDb;
  return findParentAccountInFile(norm);
}

export async function createParentAccount(
  email: string,
  password: string,
): Promise<void> {
  const emailNorm = normalizeParentEmail(email);
  const passwordHash = await bcrypt.hash(password, 10);
  const row: ParentAccountRecord = {
    emailNorm,
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  const supabase = getSupabaseAdmin();
  if (supabase) {
    const now = new Date().toISOString();
    const { error } = await supabase.from("web_parent_accounts").upsert(
      {
        email_norm: emailNorm,
        payload: row,
        updated_at: now,
      },
      { onConflict: "email_norm" },
    );
    if (error) {
      throw new Error(error.message);
    }
    return;
  }

  const dir = path.join(process.cwd(), "data");
  await mkdir(dir, { recursive: true });
  await appendFile(accountsPath(), `${JSON.stringify(row)}\n`, "utf-8");
}

export async function verifyParentPassword(
  account: ParentAccountRecord,
  password: string,
): Promise<boolean> {
  return bcrypt.compare(password, account.passwordHash);
}
