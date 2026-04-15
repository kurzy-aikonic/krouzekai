/**
 * GDPR / ePrivacy (EU) — evidence volby cookies a podobných technologií v localStorage.
 * Nezbytné technologie nevyžadují souhlas; analytika a marketing jen po výslovném souhlasu.
 */

export const COOKIE_CONSENT_STORAGE_KEY = "krouzek-cookie-consent";

/** Otevře panel nastavení z patičky / stránky cookies. */
export const COOKIE_SETTINGS_OPEN_EVENT = "krouzek-open-cookie-settings";

/** Zvýšte po změně zásad cookies — uživatel uvidí lištu znovu. */
export const COOKIE_CONSENT_POLICY_VERSION = 2;

export type CookieConsentPreferences = {
  policyVersion: number;
  /** ISO čas uložení / poslední změny */
  decidedAt: string;
  analytics: boolean;
  marketing: boolean;
};

function isRecord(x: unknown): x is Record<string, unknown> {
  return Boolean(x && typeof x === "object");
}

function parseJsonPrefs(raw: string): CookieConsentPreferences | null {
  try {
    const j: unknown = JSON.parse(raw);
    if (!isRecord(j)) return null;
    const pv = j.policyVersion;
    const da = j.decidedAt;
    if (typeof pv !== "number" || typeof da !== "string") return null;
    if (typeof j.analytics !== "boolean" || typeof j.marketing !== "boolean") {
      return null;
    }
    return {
      policyVersion: pv,
      decidedAt: da,
      analytics: j.analytics,
      marketing: j.marketing,
    };
  } catch {
    return null;
  }
}

function migrateLegacyString(raw: string): CookieConsentPreferences | null {
  if (raw === "essential") {
    return {
      policyVersion: COOKIE_CONSENT_POLICY_VERSION,
      decidedAt: new Date().toISOString(),
      analytics: false,
      marketing: false,
    };
  }
  if (raw === "all") {
    return {
      policyVersion: COOKIE_CONSENT_POLICY_VERSION,
      decidedAt: new Date().toISOString(),
      analytics: true,
      marketing: true,
    };
  }
  return null;
}

/**
 * Aktuálně uložená volba, nebo `null` před rozhodnutím / po vymazání úložiště.
 */
export function readCookiePreferences(): CookieConsentPreferences | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
  if (!raw) return null;

  const parsed = parseJsonPrefs(raw);
  if (parsed) {
    if (parsed.policyVersion < COOKIE_CONSENT_POLICY_VERSION) {
      return null;
    }
    return parsed;
  }

  const legacy = migrateLegacyString(raw);
  if (legacy) {
    persistPrefs(legacy, true);
    return legacy;
  }

  return null;
}

export function hasCookieDecision(): boolean {
  return readCookiePreferences() !== null;
}

export function analyticsConsentGranted(): boolean {
  return readCookiePreferences()?.analytics === true;
}

export function marketingConsentGranted(): boolean {
  return readCookiePreferences()?.marketing === true;
}

function persistPrefs(
  prefs: CookieConsentPreferences,
  notify: boolean,
): void {
  localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(prefs));
  if (notify) {
    window.dispatchEvent(new Event("krouzek-cookie-consent"));
  }
}

/** Uloží souhlas a vyvolá událost pro skripty (GA atd.). */
export function saveCookiePreferences(partial: {
  analytics: boolean;
  marketing: boolean;
}): void {
  const prefs: CookieConsentPreferences = {
    policyVersion: COOKIE_CONSENT_POLICY_VERSION,
    decidedAt: new Date().toISOString(),
    analytics: partial.analytics,
    marketing: partial.marketing,
  };
  persistPrefs(prefs, true);
}

/** Jen nezbytné — žádná analytika ani marketing. */
export function saveEssentialOnly(): void {
  saveCookiePreferences({ analytics: false, marketing: false });
}

/** Souhlas se všemi volitelnými kategoriemi. */
export function saveAcceptAll(): void {
  saveCookiePreferences({ analytics: true, marketing: true });
}
