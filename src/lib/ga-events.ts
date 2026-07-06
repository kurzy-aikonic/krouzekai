const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ?? "";

const LEAD_DEDUPE_PREFIX = "krouzek-ga-lead:";

function getGtag(): ((...args: unknown[]) => void) | undefined {
  if (typeof window === "undefined") return undefined;
  return (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
}

export function gaConfigured(): boolean {
  return GA_ID.length > 0;
}

/**
 * GA4 doporučená událost po odeslání přihlášky (bez PII).
 * Vrací true, pokud byla událost odeslána nebo už byla v této relaci zaznamenána.
 */
export function trackRegistrationLead(params: {
  registrationCode: string;
  format: "skupina" | "individual";
  amountCzk: number | null;
}): boolean {
  const code = params.registrationCode.trim();
  if (!code || !GA_ID) return false;

  const gtag = getGtag();
  if (typeof gtag !== "function") return false;

  const dedupeKey = `${LEAD_DEDUPE_PREFIX}${code}`;
  try {
    if (sessionStorage.getItem(dedupeKey)) return true;
  } catch {
    /* sessionStorage nedostupné */
  }

  const eventParams: Record<string, string | number> = {
    course_format: params.format,
  };
  if (typeof params.amountCzk === "number" && Number.isFinite(params.amountCzk)) {
    eventParams.value = params.amountCzk;
    eventParams.currency = "CZK";
  }

  gtag("event", "generate_lead", eventParams);

  try {
    sessionStorage.setItem(dedupeKey, "1");
  } catch {
    /* ignore */
  }

  return true;
}
