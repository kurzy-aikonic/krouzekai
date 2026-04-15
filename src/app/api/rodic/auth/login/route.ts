import { NextResponse } from "next/server";
import { z } from "zod";
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

export async function POST(request: Request) {
  if (!parentAuthSecretConfigured()) {
    return NextResponse.json(
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
    return NextResponse.json({ error: "Neplatný JSON." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Neplatný vstup." }, { status: 422 });
  }

  const email = normalizeParentEmail(parsed.data.email);
  const account = await findParentAccountByEmail(email);
  if (!account) {
    return NextResponse.json(
      { error: "Neplatný e-mail nebo heslo." },
      { status: 401 },
    );
  }

  const okPass = await verifyParentPassword(account, parsed.data.password);
  if (!okPass) {
    return NextResponse.json(
      { error: "Neplatný e-mail nebo heslo." },
      { status: 401 },
    );
  }

  const session = signSessionValue(email);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(PARENT_SESSION_COOKIE, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  return res;
}
