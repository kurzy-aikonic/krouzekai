import { getPublicRegistrationCode } from "@/lib/registration-code";
import type { RegistrationRecord } from "@/types/registration";
import { registrationStatusLabelsCs } from "@/types/registration";

function csvCell(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

const HEADER = [
  "prijato",
  "kod",
  "technické_id",
  "dite",
  "vek",
  "rodic",
  "email",
  "telefon",
  "format",
  "stav",
  "termin_id",
  "termin_popis",
  "interni_poznamka",
] as const;

export function registrationsToCsv(
  rows: RegistrationRecord[],
  resolveRunLabel: (r: RegistrationRecord) => string,
): string {
  const lines = [
    HEADER.join(","),
    ...rows.map((r) =>
      [
        csvCell(r.receivedAt ?? ""),
        csvCell(getPublicRegistrationCode(r)),
        csvCell(r.id),
        csvCell(r.childName),
        csvCell(String(r.childAge)),
        csvCell(r.parentName),
        csvCell(r.parentEmail),
        csvCell(r.parentPhone),
        csvCell(r.format === "skupina" ? "skupina" : "individual"),
        csvCell(registrationStatusLabelsCs[r.status]),
        csvCell(r.runId ?? ""),
        csvCell(resolveRunLabel(r)),
        csvCell(r.internalNotes ?? ""),
      ].join(","),
    ),
  ];
  return lines.join("\r\n") + "\r\n";
}
