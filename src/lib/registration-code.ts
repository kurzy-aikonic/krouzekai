import { randomInt } from "crypto";
import type { RegistrationRecord } from "@/types/registration";

/**
 * 5 znaků — číslice + písmena bez0/O, 1/I/L kvůli přepisům a omylům.
 */
export const REGISTRATION_CODE_ALPHABET =
  "23456789ABCDEFGHJKMNPRSTUVWXYZ" as const;

/** Velká písmena + číslice podle abecedy výše. */
export const REGISTRATION_CODE_REGEX =
  /^[23456789ABCDEFGHJKMNPRSTUVWXYZ]{5}$/i;

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isRegistrationUuidLookup(s: string): boolean {
  return UUID_RE.test(s.trim());
}

export function isShortRegistrationCodeLookup(s: string): boolean {
  return REGISTRATION_CODE_REGEX.test(s.trim().toUpperCase());
}

/** Veřejné číslo přihlášky (5 znaků). U starých záznamů bez pole odvozeno stabilně z UUID. */
export function getPublicRegistrationCode(
  record: Pick<RegistrationRecord, "id" | "registrationCode">,
): string {
  const c = record.registrationCode?.trim().toUpperCase();
  if (c && REGISTRATION_CODE_REGEX.test(c)) return c;
  return registrationCodeFromUuid(record.id);
}

/** Deterministický kód pro legacy řádky v JSONL bez `registrationCode`. */
export function registrationCodeFromUuid(id: string): string {
  const hex = id.replace(/-/g, "");
  if (!/^[a-f0-9]{32}$/i.test(hex)) return "XXXXX";
  const base = BigInt(REGISTRATION_CODE_ALPHABET.length);
  let x = BigInt(`0x${hex}`);
  let s = "";
  for (let i = 0; i < 5; i++) {
    const idx = Number(x % base);
    s = REGISTRATION_CODE_ALPHABET[idx] + s;
    x = x / base;
  }
  return s;
}

export function randomRegistrationCode(): string {
  const n = REGISTRATION_CODE_ALPHABET.length;
  let s = "";
  for (let i = 0; i < 5; i++) {
    s += REGISTRATION_CODE_ALPHABET[randomInt(n)]!;
  }
  return s;
}

export function pickUniqueRegistrationCode(
  existing: Pick<RegistrationRecord, "id" | "registrationCode">[],
): string {
  const taken = new Set(
    existing.map((r) => getPublicRegistrationCode(r).toUpperCase()),
  );
  for (let i = 0; i < 64; i++) {
    const c = randomRegistrationCode();
    if (!taken.has(c)) return c;
  }
  throw new Error("Nepodařilo se vygenerovat unikátní kód přihlášky.");
}
