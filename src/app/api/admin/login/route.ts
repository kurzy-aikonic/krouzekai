import { NextResponse } from "next/server";
import { z } from "zod";
import {
  ADMIN_SESSION_COOKIE,
  constantTimeEqual,
  getAdminSecret,
} from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  secret: z.string().min(1).max(500),
});

export async function POST(request: Request) {
  const secret = getAdminSecret();
  if (!secret) {
    return NextResponse.json(
      { error: "ADMIN_SECRET není nastaven (min. 16 znaků)." },
      { status: 503 },
    );
  }

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

  if (!constantTimeEqual(parsed.data.secret, secret)) {
    return NextResponse.json({ error: "Neplatné přihlášení." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_SESSION_COOKIE, secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  return res;
}
