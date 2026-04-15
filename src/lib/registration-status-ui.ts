import type { RegistrationStatus } from "@/types/registration";

/** Tailwind třídy pro kompaktní štítek stavu (admin tabulka, portál rodiče). */
const pill: Record<RegistrationStatus, string> = {
  nova: "border-amber-200 bg-amber-50 text-amber-950",
  kontaktovano: "border-sky-200 bg-sky-50 text-sky-950",
  zaplaceno: "border-emerald-300 bg-emerald-100 text-emerald-950",
  zruseno: "border-red-300 bg-red-100 text-red-950",
  vraceny_penize: "border-red-300 bg-red-100 text-red-950",
  reklamace: "border-red-300 bg-red-100 text-red-950",
};

export function registrationStatusPillClassName(
  status: RegistrationStatus,
): string {
  return pill[status];
}
