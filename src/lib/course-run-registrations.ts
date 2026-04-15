import { getPublicRegistrationCode } from "@/lib/registration-code";
import type { RegistrationRecord } from "@/types/registration";
import type { RegistrationStatus } from "@/types/registration";

/** Stavy, které se nepočítají do kapacity termínu. */
const EXCLUDED_FROM_CAPACITY: RegistrationStatus[] = [
  "zruseno",
  "vraceny_penize",
  "reklamace",
];

export function registrationCountsTowardRunCapacity(
  status: RegistrationStatus,
): boolean {
  return !EXCLUDED_FROM_CAPACITY.includes(status);
}

/** Přihlášky přiřazené k termínu (libovolný stav). */
export function listRegistrationsOnRun(
  runId: string,
  runFormat: "skupina" | "individual",
  registrations: RegistrationRecord[],
): RegistrationRecord[] {
  const id = runId.trim();
  if (!id) return [];
  return registrations.filter(
    (r) => r.format === runFormat && r.runId === id,
  );
}

/** Počet míst „obsazených“ podle přihlášek (bez zrušených / reklamací). */
export function countedOccupancyForRun(
  runId: string,
  runFormat: "skupina" | "individual",
  registrations: RegistrationRecord[],
): number {
  return listRegistrationsOnRun(runId, runFormat, registrations).filter((r) =>
    registrationCountsTowardRunCapacity(r.status),
  ).length;
}

export type RunRegistrationRow = {
  id: string;
  publicCode: string;
  childName: string;
  parentName: string;
  parentEmail: string;
  status: RegistrationStatus;
  receivedAt?: string;
  format: "skupina" | "individual";
};

export function buildRunOccupancyMap(
  registrations: RegistrationRecord[],
): Record<string, RunRegistrationRow[]> {
  const map: Record<string, RunRegistrationRow[]> = {};
  for (const r of registrations) {
    if (!r.runId?.trim()) continue;
    if (r.format !== "skupina" && r.format !== "individual") continue;
    const id = r.runId;
    if (!map[id]) map[id] = [];
    map[id].push({
      id: r.id,
      publicCode: getPublicRegistrationCode(r),
      childName: r.childName,
      parentName: r.parentName,
      parentEmail: r.parentEmail,
      status: r.status,
      receivedAt: r.receivedAt,
      format: r.format,
    });
  }
  for (const rows of Object.values(map)) {
    rows.sort((a, b) =>
      String(b.receivedAt ?? "").localeCompare(String(a.receivedAt ?? "")),
    );
  }
  return map;
}
