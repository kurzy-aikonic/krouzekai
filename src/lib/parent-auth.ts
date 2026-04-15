import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const PARENT_SESSION_COOKIE = "krouzek_parent_session";

const MAGIC_MS = 15 * 60 * 1000;
const SESSION_MS = 7 * 24 * 60 * 60 * 1000;

type SignedPayload =
  | { t: "m"; e: string; exp: number }
  | { t: "s"; e: string; exp: number };

export function normalizeParentEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function parentAuthSecretConfigured(): boolean {
  const s = process.env.PARENT_AUTH_SECRET?.trim();
  return Boolean(s && s.length >= 16);
}

function getSecret(): string {
  const s = process.env.PARENT_AUTH_SECRET?.trim();
  if (!s || s.length < 16) {
    throw new Error("PARENT_AUTH_SECRET (min. 16 znaků) není nastaven.");
  }
  return s;
}

function signPayload(payload: SignedPayload): string {
  const body = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const sig = createHmac("sha256", getSecret()).update(body).digest("base64url");
  return `${body}.${sig}`;
}

function verifySigned(token: string): SignedPayload | null {
  const i = token.lastIndexOf(".");
  if (i <= 0) return null;
  const body = token.slice(0, i);
  const sig = token.slice(i + 1);
  if (!body || !sig) return null;
  const expected = createHmac("sha256", getSecret()).update(body).digest("base64url");
  try {
    const a = Buffer.from(sig, "utf8");
    const b = Buffer.from(expected, "utf8");
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }
  try {
    const parsed: unknown = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    if (!parsed || typeof parsed !== "object") return null;
    const o = parsed as Record<string, unknown>;
    if (o.t === "m" && typeof o.e === "string" && typeof o.exp === "number") {
      return { t: "m", e: o.e, exp: o.exp };
    }
    if (o.t === "s" && typeof o.e === "string" && typeof o.exp === "number") {
      return { t: "s", e: o.e, exp: o.exp };
    }
    return null;
  } catch {
    return null;
  }
}

export function signMagicToken(email: string): string {
  const e = normalizeParentEmail(email);
  return signPayload({ t: "m", e, exp: Date.now() + MAGIC_MS });
}

export function verifyMagicToken(token: string): string | null {
  const p = verifySigned(token);
  if (!p || p.t !== "m") return null;
  if (Date.now() > p.exp) return null;
  return p.e;
}

export function signSessionValue(email: string): string {
  const e = normalizeParentEmail(email);
  return signPayload({ t: "s", e, exp: Date.now() + SESSION_MS });
}

export function verifySessionValue(value: string): string | null {
  const p = verifySigned(value);
  if (!p || p.t !== "s") return null;
  if (Date.now() > p.exp) return null;
  return p.e;
}

export async function getParentSessionEmail(): Promise<string | null> {
  if (!parentAuthSecretConfigured()) return null;
  try {
    const jar = await cookies();
    const raw = jar.get(PARENT_SESSION_COOKIE)?.value;
    if (!raw) return null;
    return verifySessionValue(raw);
  } catch {
    return null;
  }
}
