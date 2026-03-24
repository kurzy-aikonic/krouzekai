import type { PaymentProduct } from "@/lib/payment";

/** Záznam uložený po úspěšné přihlášce (soubor / webhook / později DB). */
export type RegistrationRecord = {
  id: string;
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
  /** ISO čas přijetí (doplňuje persist vrstva) */
  receivedAt?: string;
};
