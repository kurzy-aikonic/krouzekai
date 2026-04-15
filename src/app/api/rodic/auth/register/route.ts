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
  createParentAccount,
  findParentAccountByEmail,
} from "@/lib/parent-accounts-store";
import { rateLimitResponse } from "@/lib/rate-limit";
import { listRegistrationsByParentEmail } from "@/lib/registrations-store";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  email: z.string().email().max(320),
  password: z.string().min(8).max(200),
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
    return NextResponse.json(
      { error: "Heslo alespoň 8 znaků a platný e-mail." },
      { status: 422 },
    );
  }

  const email = normalizeParentEmail(parsed.data.email);
  const regs = await listRegistrationsByParentEmail(email);
  if (regs.length === 0) {
    return NextResponse.json(
      {
        error:
          "Na tento e-mail nemáme přihlášku. Nejdřív vyplňte přihlášku na kurz, nebo zkuste odkaz e-mailem.",
      },
      { status: 422 },
    );
  }

  const existing = await findParentAccountByEmail(email);
  if (existing) {
    return NextResponse.json(
      { error: "Účet na tento e-mail už existuje — přihlaste se." },
      { status: 409 },
    );
  }

  try {
    await createParentAccount(email, parsed.data.password);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Nepodařilo se vytvořit účet." }, { status: 500 });
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
