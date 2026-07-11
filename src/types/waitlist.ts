/** Stav zájemce v čekací listině. */
export const waitlistStatuses = ["nova", "kontaktovano", "prevedeno", "uzavreno"] as const;
export type WaitlistStatus = (typeof waitlistStatuses)[number];

export const waitlistStatusLabelsCs: Record<WaitlistStatus, string> = {
  nova: "Nová",
  kontaktovano: "Kontaktováno",
  prevedeno: "Převedeno na přihlášku",
  uzavreno: "Uzavřeno",
};

export function parseWaitlistStatus(value: unknown): WaitlistStatus {
  if (
    typeof value === "string" &&
    (waitlistStatuses as readonly string[]).includes(value)
  ) {
    return value as WaitlistStatus;
  }
  return "nova";
}

/**
 * Zájemce o termín, který je momentálně plný — chceme ho oslovit, až se uvolní
 * místo nebo otevřeme nový běh stejného formátu. Lehčí obdoba `RegistrationRecord`.
 */
export type WaitlistEntry = {
  id: string;
  format: "skupina" | "individual";
  /** Termín, který byl v době zápisu plný (může chybět, pokud zájemce nevybíral konkrétní). */
  runId: string | null;
  runLabel?: string;
  childName?: string;
  childAge?: number;
  parentName: string;
  parentEmail: string;
  parentPhone?: string;
  note?: string;
  consentPrivacy: boolean;
  status: WaitlistStatus;
  internalNotes?: string;
  receivedAt?: string;
  updatedAt?: string;
};
