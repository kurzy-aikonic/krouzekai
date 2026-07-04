import { z } from "zod";
import bcrypt from "bcryptjs";
import { apiJson } from "@/lib/api-response";
import { rejectOversizedJsonBody } from "@/lib/json-body-limit";
import {
  normalizeParentEmail,
  parentAuthSecretConfigured,
  PARENT_SESSION_COOKIE,
  signSessionValue,
} from "@/lib/parent-auth";
import {
  findParentAccountByEmail,
  verifyParentPassword,
} from "@/lib/parent-accounts-store";
import { rateLimitResponse } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  email: z.string().email().max(320),
  password: z.string().min(1).max(200),
});

/**
 * Dummy hash pro srovnani casu odpovedi pri neexistujicim uctu.
 * Pomaha omezit user-enumeration podle casovani.
 */
const DUMMY_BCRYPT_HASH =
  "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy";

export async function POST(request: Request) {
  if (!parentAuthSecretConfigured()) {
    return apiJson(
      { error: "Přihlášení rodičů není aktivní." },
      { status: 503 },
    );
  }

  const tooLarge = rejectOversizedJsonBody(request);
  if (tooLarge) return tooLarge;

  const limited = await rateLimitResponse(request, "rodicPrihlaseni");
  if (limited) return limited;

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return apiJson({ error: "Neplatný JSON." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return apiJson({ error: "Neplatný vstup." }, { status: 422 });
  }

  const email = normalizeParentEmail(parsed.data.email);
  const limitedByEmail = await rateLimitResponse(
    request,
    "rodicPrihlaseni",
    email,
  );
  if (limitedByEmail) return limitedByEmail;

  const account = await findParentAccountByEmail(email);
  const okPass = account
    ? await verifyParentPassword(account, parsed.data.password)
    : await bcrypt.compare(parsed.data.password, DUMMY_BCRYPT_HASH);
  if (!account || !okPass) {
    return apiJson(
      { error: "Neplatný e-mail nebo heslo." },
      { status: 401 },
    );
  }

  const session = signSessionValue(email);
  const res = apiJson({ ok: true });
  res.cookies.set(PARENT_SESSION_COOKIE, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
    priority: "high",
  });
  return res;
}
