import { normalizeParentEmail } from "@/lib/parent-auth";
import { getPublicRegistrationCode } from "@/lib/registration-code";
import type { RegistrationRecord } from "@/types/registration";

export type DuplicateGroup = {
  key: string;
  parentEmail: string;
  childName: string;
  count: number;
  codes: string[];
};

/** Stejný e-mail rodiče + jméno dítěte (≥ 2 přihlášky). */
export function findDuplicateGroups(
  items: RegistrationRecord[],
): DuplicateGroup[] {
  const map = new Map<
    string,
    { parentEmail: string; childName: string; codes: string[] }
  >();

  for (const r of items) {
    const email = normalizeParentEmail(r.parentEmail);
    const child = r.childName.trim().toLowerCase();
    if (!email || !child) continue;
    const key = `${email}\0${child}`;
    const prev = map.get(key);
    const code = getPublicRegistrationCode(r);
    if (prev) {
      prev.codes.push(code);
    } else {
      map.set(key, { parentEmail: r.parentEmail, childName: r.childName, codes: [code] });
    }
  }

  return Array.from(map.entries())
    .filter(([, v]) => v.codes.length >= 2)
    .map(([key, v]) => ({
      key,
      parentEmail: v.parentEmail,
      childName: v.childName,
      count: v.codes.length,
      codes: v.codes,
    }))
    .sort((a, b) => b.count - a.count);
}
