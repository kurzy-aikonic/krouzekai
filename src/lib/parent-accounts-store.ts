import { readFile, appendFile, mkdir } from "fs/promises";
import path from "path";
import bcrypt from "bcryptjs";
import { normalizeParentEmail } from "@/lib/parent-auth";

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

export async function findParentAccountByEmail(
  email: string,
): Promise<ParentAccountRecord | null> {
  const norm = normalizeParentEmail(email);
  try {
    const raw = await readFile(accountsPath(), "utf-8");
    const lines = raw.trim().split("\n").filter(Boolean);
    let last: ParentAccountRecord | null = null;
    for (const line of lines) {
      try {
        const parsed: unknown = JSON.parse(line);
        if (!isLine(parsed)) continue;
        if (typeof parsed.emailNorm !== "string") continue;
        if (normalizeParentEmail(parsed.emailNorm) !== norm) continue;
        if (typeof parsed.passwordHash !== "string") continue;
        last = {
          emailNorm: normalizeParentEmail(parsed.emailNorm),
          passwordHash: parsed.passwordHash,
          createdAt:
            typeof parsed.createdAt === "string"
              ? parsed.createdAt
              : new Date().toISOString(),
        };
      } catch {
        continue;
      }
    }
    return last;
  } catch {
    return null;
  }
}

export async function createParentAccount(
  email: string,
  password: string,
): Promise<void> {
  const dir = path.join(process.cwd(), "data");
  await mkdir(dir, { recursive: true });
  const emailNorm = normalizeParentEmail(email);
  const passwordHash = await bcrypt.hash(password, 10);
  const row: ParentAccountRecord = {
    emailNorm,
    passwordHash,
    createdAt: new Date().toISOString(),
  };
  await appendFile(accountsPath(), `${JSON.stringify(row)}\n`, "utf-8");
}

export async function verifyParentPassword(
  account: ParentAccountRecord,
  password: string,
): Promise<boolean> {
  return bcrypt.compare(password, account.passwordHash);
}
