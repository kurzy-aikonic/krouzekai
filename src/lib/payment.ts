import { site } from "@/lib/site-config";

/**
 * Fáze 3 — platby: napoj Stripe / GoPay / jinou bránu.
 * Po úspěšné platbě (webhook) aktualizuj stav přihlášky v úložišti.
 */

export type PaymentProduct = "skupina-course" | "individual-course";

export function productFromFormat(
  format: "skupina" | "individual",
): PaymentProduct {
  return format === "skupina" ? "skupina-course" : "individual-course";
}

export function coursePriceCzk(product: PaymentProduct): number {
  switch (product) {
    case "skupina-course":
      return site.pricing.skupinaCourse;
    case "individual-course":
      return site.pricing.individualCourse;
    default: {
      const _exhaustive: never = product;
      return _exhaustive;
    }
  }
}

/** Variabilní symbol: 10 číslic odvozených z UUID (stabilita pro převod). */
export function variableSymbolFromRegistrationId(id: string): string {
  const hex = id.replace(/-/g, "");
  if (!/^[a-f0-9]{32}$/i.test(hex)) return "0000000000";
  const n = BigInt(`0x${hex}`) % BigInt(10_000_000_000);
  return n.toString().padStart(10, "0");
}

/** Vytvoří platební session u brány — doplníš implementaci. */
export async function createCheckoutSession(args: {
  product: PaymentProduct;
  registrationId: string;
  customerEmail: string;
  amountCzk: number;
}): Promise<{ url: string } | null> {
  void args;
  return null;
}
