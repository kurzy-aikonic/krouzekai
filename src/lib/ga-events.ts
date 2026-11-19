const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ?? "";

const LEAD_DEDUPE_PREFIX = "krouzek-ga-lead:";

type Gtag = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
  }
}

let configured = false;

export function gaConfigured(): boolean {
  return GA_ID.length > 0;
}

export function gaMeasurementId(): string {
  return GA_ID;
}

/** Fronta gtag musí existovat dřív, než se stáhne skript. Bez ní se config nikdy nezavolá. */
export function ensureGtag(): Gtag | undefined {
  if (typeof window === "undefined" || !GA_ID) return undefined;
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== "function") {
    window.gtag = function gtag() {
      // gtag čte objekt `arguments`, ne pole z rest parametrů.
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer?.push(arguments);
    };
  }
  if (!configured) {
    window.gtag("js", new Date());
    window.gtag("config", GA_ID, { send_page_view: false });
    configured = true;
  }
  return window.gtag;
}

export function trackPageView(): void {
  const gtag = ensureGtag();
  if (!gtag || typeof window === "undefined") return;
  gtag("event", "page_view", {
    page_path: window.location.pathname + window.location.search,
    page_location: window.location.href,
    page_title: document.title,
  });
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

  const gtag = ensureGtag();
  if (!gtag) return false;

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
