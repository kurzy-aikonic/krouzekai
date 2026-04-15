import { NextResponse } from "next/server";
import { z } from "zod";
import { sendParentPortalMagicLink } from "@/lib/email";
import { rejectOversizedJsonBody } from "@/lib/json-body-limit";
import {
  normalizeParentEmail,
  parentAuthSecretConfigured,
  signMagicToken,
} from "@/lib/parent-auth";
import { rateLimitResponse } from "@/lib/rate-limit";
import { listRegistrationsByParentEmail } from "@/lib/registrations-store";
import { site } from "@/lib/site-config";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  email: z.string().email().max(320),
});

export async function POST(request: Request) {
  if (!parentAuthSecretConfigured()) {
    return NextResponse.json(
      { error: "Přihlášení rodičů není na serveru aktivní (PARENT_AUTH_SECRET)." },
      { status: 503 },
    );
  }

  const tooLarge = rejectOversizedJsonBody(request);
  if (tooLarge) return tooLarge;

  const limited = await rateLimitResponse(request, "rodicMagic");
  if (limited) return limited;

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Neplatný JSON." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Zadejte platný e-mail." }, { status: 422 });
  }

  const email = normalizeParentEmail(parsed.data.email);
  const regs = await listRegistrationsByParentEmail(email);

  if (regs.length > 0) {
    const token = signMagicToken(email);
    const base = site.baseUrl.replace(/\/$/, "");
    const magicUrl = `${base}/api/rodic/auth/magic?token=${encodeURIComponent(token)}`;
    const sent = await sendParentPortalMagicLink(email, magicUrl);
    if (!sent.ok) {
      console.error("[rodic/magic-request]", sent);
      return NextResponse.json(
        { error: "Nepodařilo se odeslat e-mail. Zkuste to později." },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({
    ok: true,
    message:
      "Pokud u nás máte přihlášku na tento e-mail, poslali jsme vám odkaz. Zkontrolujte schránku (i spam).",
  });
}
