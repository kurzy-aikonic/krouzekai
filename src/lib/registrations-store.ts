import { readFile } from "fs/promises";
import path from "path";
import type { RegistrationRecord } from "@/types/registration";

function registrationsPath(): string {
  return path.join(process.cwd(), "data", "registrations.jsonl");
}

function isRecord(x: unknown): x is RegistrationRecord {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return typeof o.id === "string" && typeof o.parentEmail === "string";
}

/**
 * Najde přihlášku v lokálním JSONL (dev / VPS s diskem).
 * Na Vercelu bez DB a bez souboru vrací null — stránka platby zobrazí obecné instrukce.
 */
export async function findRegistrationById(
  id: string,
): Promise<RegistrationRecord | null> {
  try {
    const raw = await readFile(registrationsPath(), "utf-8");
    const lines = raw.trim().split("\n").filter(Boolean);
    for (let i = lines.length - 1; i >= 0; i--) {
      try {
        const parsed: unknown = JSON.parse(lines[i]!);
        if (isRecord(parsed) && parsed.id === id) return parsed;
      } catch {
        continue;
      }
    }
  } catch {
    return null;
  }
  return null;
}
