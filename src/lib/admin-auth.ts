import { createHash, createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

/** HttpOnly cookie — podepsaná session (viz `signAdminSession`), ne otevřený ADMIN_SECRET. */
export const ADMIN_SESSION_COOKIE = "krouzek_admin_session";

const MAGIC_MS = 15 * 60 * 1000;
const SESSION_MS = 7 * 24 * 60 * 60 * 1000;

type AdminSignedPayload =
  | { t: "admin"; iat: number }
  | { t: "admin_s"; e: string; exp: number }
  | { t: "admin_m"; e: string; exp: number };

export function normalizeAdminEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function adminSecretConfigured(): boolean {
  const s = process.env.ADMIN_SECRET?.trim();
  return Boolean(s && s.length >= 16);
}

export function getAdminSecret(): string | null {
  const s = process.env.ADMIN_SECRET?.trim();
  if (!s || s.length < 16) return null;
  return s;
}

/**
 * Samostatný klíč pro Bearer přístup k admin API — oddělený od `ADMIN_SECRET`
 * (přihlašovací heslo do UI), aby šel API klíč rotovat/zneplatnit bez dopadu na login.
 * Pokud není nastaven, `verifyAdminRequest` se pro zpětnou kompatibilitu vrátí k `ADMIN_SECRET`.
 */
export function getAdminApiKey(): string | null {
  const s = process.env.ADMIN_API_KEY?.trim();
  if (!s || s.length < 16) return null;
  return s;
}

export function adminApiKeyConfigured(): boolean {
  return getAdminApiKey() !== null;
}

/** Seznam e-mailů administrátorů z ADMIN_EMAILS (oddělené čárkou). */
export function getAdminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS?.trim();
  if (!raw) return [];
  return raw
    .split(",")
    .map((e) => normalizeAdminEmail(e))
    .filter((e) => e.length > 0 && e.includes("@"));
}

export function adminEmailsConfigured(): boolean {
  return getAdminEmails().length > 0;
}

export function isAdminEmail(email: string): boolean {
  const normalized = normalizeAdminEmail(email);
  return getAdminEmails().includes(normalized);
}

/**
 * Porovnání tajemství bez časových úniků. Obě strany se nejdřív hashují na pevnou
 * délku (SHA-256) — jinak by časový rozdíl u nestejně dlouhých vstupů prozradil
 * délku skutečného secretu ještě před `timingSafeEqual`.
 */
export function constantTimeEqual(a: string, b: string): boolean {
  try {
    const ha = createHash("sha256").update(a, "utf8").digest();
    const hb = createHash("sha256").update(b, "utf8").digest();
    return timingSafeEqual(ha, hb);
  } catch {
    return false;
  }
}

function signPayload(payload: AdminSignedPayload): string | null {
  const secret = getAdminSecret();
  if (!secret) return null;
  const body = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const sig = createHmac("sha256", secret).update(body).digest("base64url");
  return `${body}.${sig}`;
}

function verifySigned(token: string): AdminSignedPayload | null {
  const secret = getAdminSecret();
  if (!secret) return null;
  const i = token.lastIndexOf(".");
  if (i <= 0) return null;
  const body = token.slice(0, i);
  const sig = token.slice(i + 1);
  if (!body || !sig) return null;
  const expected = createHmac("sha256", secret).update(body).digest("base64url");
  if (!constantTimeEqual(sig, expected)) return null;
  try {
    const parsed: unknown = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    if (!parsed || typeof parsed !== "object") return null;
    const o = parsed as Record<string, unknown>;
    if (o.t === "admin" && typeof o.iat === "number") {
      return { t: "admin", iat: o.iat };
    }
    if (o.t === "admin_s" && typeof o.e === "string" && typeof o.exp === "number") {
      return { t: "admin_s", e: o.e, exp: o.exp };
    }
    if (o.t === "admin_m" && typeof o.e === "string" && typeof o.exp === "number") {
      return { t: "admin_m", e: o.e, exp: o.exp };
    }
    return null;
  } catch {
    return null;
  }
}

export function signAdminMagicToken(email: string): string | null {
  const e = normalizeAdminEmail(email);
  return signPayload({ t: "admin_m", e, exp: Date.now() + MAGIC_MS });
}

export function verifyAdminMagicToken(token: string): string | null {
  const p = verifySigned(token);
  if (!p || p.t !== "admin_m") return null;
  if (Date.now() > p.exp) return null;
  if (!isAdminEmail(p.e)) return null;
  return p.e;
}

/** Podepsaná hodnota session cookie (legacy bez e-mailu nebo s e-mailem admina). */
export function signAdminSession(email?: string): string | null {
  if (email) {
    const e = normalizeAdminEmail(email);
    if (!isAdminEmail(e)) return null;
    return signPayload({ t: "admin_s", e, exp: Date.now() + SESSION_MS });
  }
  return signPayload({ t: "admin", iat: Date.now() });
}

export function verifyAdminCookie(token: string | undefined): boolean {
  return getAdminSessionEmail(token) !== null;
}

/** E-mail přihlášeného admina, nebo `"legacy"` u starého klíče bez e-mailu. */
export function getAdminSessionEmail(token: string | undefined): string | null {
  if (token == null || token === "") return null;
  const p = verifySigned(token);
  if (!p) return null;
  if (p.t === "admin") {
    // Legacy session (přihlášení jen tajným klíčem, bez e-mailu) musí expirovat stejně
    // jako běžná session — jinak by ukradená cookie zůstala platná navždy.
    if (Date.now() > p.iat + SESSION_MS) return null;
    return "legacy";
  }
  if (p.t === "admin_s") {
    if (Date.now() > p.exp) return null;
    if (!isAdminEmail(p.e)) return null;
    return p.e;
  }
  return null;
}

export async function getAdminSessionEmailFromCookies(): Promise<string | null> {
  if (!adminSecretConfigured()) return null;
  try {
    const jar = await cookies();
    return getAdminSessionEmail(jar.get(ADMIN_SESSION_COOKIE)?.value);
  } catch {
    return null;
  }
}

/** E-mail admina z requestu (cookie), nebo `"legacy"` / `"api"`. */
export function getAdminActorFromRequest(request: Request): string {
  const raw = request.headers.get("cookie");
  if (raw) {
    const parts = raw.split(";").map((p) => p.trim());
    for (const p of parts) {
      if (p.startsWith(`${ADMIN_SESSION_COOKIE}=`)) {
        const value = decodeURIComponent(
          p.slice(ADMIN_SESSION_COOKIE.length + 1),
        );
        const email = getAdminSessionEmail(value);
        if (email) return email;
      }
    }
  }
  const auth = request.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) return "api";
  return "neznámý";
}

/** Ověření pro route handlery: Bearer token (ADMIN_API_KEY, nebo ADMIN_SECRET jako fallback) nebo session cookie. */
export function verifyAdminRequest(request: Request): boolean {
  const secret = getAdminSecret();
  if (!secret) return false;

  const auth = request.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) {
    const token = auth.slice("Bearer ".length).trim();
    const apiKey = getAdminApiKey();
    if (apiKey) return constantTimeEqual(token, apiKey);
    return constantTimeEqual(token, secret);
  }

  const raw = request.headers.get("cookie");
  if (!raw) return false;
  const parts = raw.split(";").map((p) => p.trim());
  for (const p of parts) {
    if (p.startsWith(`${ADMIN_SESSION_COOKIE}=`)) {
      const value = decodeURIComponent(p.slice(ADMIN_SESSION_COOKIE.length + 1));
      return verifyAdminCookie(value);
    }
  }
  return false;
}
