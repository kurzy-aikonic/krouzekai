import type { RegistrationRecord, RegistrationStatus } from "@/types/registration";

const AWAITING_PAYMENT_STATUSES: RegistrationStatus[] = ["nova", "kontaktovano"];

export function isAwaitingPayment(status: RegistrationStatus): boolean {
  return AWAITING_PAYMENT_STATUSES.includes(status);
}

export function countAwaitingPayment(items: RegistrationRecord[]): number {
  return items.filter((r) => isAwaitingPayment(r.status)).length;
}

export function sumAwaitingPaymentCzk(items: RegistrationRecord[]): number {
  return items
    .filter((r) => isAwaitingPayment(r.status))
    .reduce((sum, r) => sum + r.amountCzk, 0);
}
