import { createHmac, timingSafeEqual } from "crypto";

/** HttpOnly cookie — podepsaná session (viz `signAdminSession`), ne otevřený ADMIN_SECRET. */
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
  const i = token.lastIndexOf(".");
  if (i <= 0) return false;
  const body = token.slice(0, i);
  const sig = token.slice(i + 1);
  if (!body || !sig) return false;
  const expected = createHmac("sha256", secret).update(body).digest("base64url");
  return constantTimeEqual(sig, expected);
}

/** Podepsaná hodnota session cookie (nikdy neukládá ADMIN_SECRET v otevřeném tvaru). */
export function signAdminSession(): string | null {
  const secret = getAdminSecret();
  if (!secret) return null;
  const body = Buffer.from(
    JSON.stringify({ t: "admin", iat: Date.now() }),
    "utf8",
  ).toString("base64url");
  const sig = createHmac("sha256", secret).update(body).digest("base64url");
  return `${body}.${sig}`;
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
