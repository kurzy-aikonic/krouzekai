import type { PaymentProduct } from "@/lib/payment";

/** Stav přihlášky pro interní práci (JSONL / webhook / později DB). Uprav ručně v datech nebo přes admin. */
export const registrationStatuses = [
  "nova",
  "kontaktovano",
  "zaplaceno",
  "zruseno",
  "vraceny_penize",
  "reklamace",
] as const;
export type RegistrationStatus = (typeof registrationStatuses)[number];

/** Krátké české popisky (admin, e-maily, filtry). */
export const registrationStatusLabelsCs: Record<RegistrationStatus, string> = {
  nova: "Nová",
  kontaktovano: "Kontaktováno",
  zaplaceno: "Zaplaceno",
  zruseno: "Zrušeno",
  vraceny_penize: "Vráceny peníze",
  reklamace: "Reklamace",
};

export function parseRegistrationStatus(value: unknown): RegistrationStatus {
  if (
    typeof value === "string" &&
    (registrationStatuses as readonly string[]).includes(value)
  ) {
    return value as RegistrationStatus;
  }
  return "nova";
}

/** Záznam uložený po úspěšné přihlášce (soubor / webhook / později DB). */
export type RegistrationRecord = {
  id: string;
  /** Krátké veřejné číslo přihlášky (5 znaků). U starých záznamů může chybět — doplní se odvozeně z `id`. */
  registrationCode?: string;
  format: "skupina" | "individual";
  runId: string | null;
  childName: string;
  childAge: number;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  consentTerms: boolean;
  consentPrivacy: boolean;
  paymentProduct: PaymentProduct;
  amountCzk: number;
  status: RegistrationStatus;
  /** ISO čas přijetí (doplňuje persist vrstva) */
  receivedAt?: string;
  /** Interní poznámky (jen admin / JSONL, ne veřejný web). */
  internalNotes?: string;
  /** ISO čas poslední úpravy přes admin. */
  updatedAt?: string;
};
