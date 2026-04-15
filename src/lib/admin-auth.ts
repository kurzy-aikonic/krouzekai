import { timingSafeEqual } from "crypto";

/** HttpOnly cookie — hodnota = stejný řetězec jako ADMIN_SECRET (viz .env.example). */
export const ADMIN_SESSION_COOKIE = "krouzek_admin_session";

export function adminSecretConfigured(): boolean {
  const s = process.env.ADMIN_SECRET?.trim();
  return Boolean(s && s.length >= 16);
}

export function getAdminSecret(): string | null {
  const s = process.env.ADMIN_SECRET?.trim();
  if (!s || s.length < 16) return null;
  return s;
}

/** Porovnání tajemství bez časových úniků (stejná délka řetězců). */
export function constantTimeEqual(a: string, b: string): boolean {
  try {
    const ba = Buffer.from(a, "utf8");
    const bb = Buffer.from(b, "utf8");
    if (ba.length !== bb.length) return false;
    return timingSafeEqual(ba, bb);
  } catch {
    return false;
  }
}

export function verifyAdminCookie(token: string | undefined): boolean {
  const secret = getAdminSecret();
  if (!secret || token == null || token === "") return false;
  return constantTimeEqual(token, secret);
}

/** Ověření pro route handlery: Bearer token nebo session cookie. */
export function verifyAdminRequest(request: Request): boolean {
  const secret = getAdminSecret();
  if (!secret) return false;

  const auth = request.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) {
    const token = auth.slice("Bearer ".length).trim();
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
