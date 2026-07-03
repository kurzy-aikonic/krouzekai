import { z } from "zod";
import {
  adminEmailsConfigured,
  adminSecretConfigured,
  isAdminEmail,
  normalizeAdminEmail,
  signAdminMagicToken,
} from "@/lib/admin-auth";
import { apiJson } from "@/lib/api-response";
import { sendAdminMagicLink } from "@/lib/email";
import { rejectOversizedJsonBody } from "@/lib/json-body-limit";
import { rateLimitResponse } from "@/lib/rate-limit";
import { site } from "@/lib/site-config";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  email: z.string().email().max(320),
});

const genericOk = {
  ok: true,
  message:
    "Pokud je e-mail mezi oprávněnými administrátory, poslali jsme vám přihlašovací odkaz. Zkontrolujte schránku (i spam).",
} as const;

export async function POST(request: Request) {
  if (!adminSecretConfigured()) {
    return apiJson(
      { error: "ADMIN_SECRET není nastaven (min. 16 znaků)." },
      { status: 503 },
    );
  }

  if (!adminEmailsConfigured()) {
    return apiJson(
      {
        error:
          "Přihlášení e-mailem není aktivní. Použijte tajný klíč nebo kontaktujte správce.",
      },
      { status: 503 },
    );
  }

  const tooLarge = rejectOversizedJsonBody(request);
  if (tooLarge) return tooLarge;

  const limited = await rateLimitResponse(request, "adminMagic");
  if (limited) return limited;

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return apiJson({ error: "Neplatný JSON." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return apiJson({ error: "Zadejte platný e-mail." }, { status: 422 });
  }

  const email = normalizeAdminEmail(parsed.data.email);

  if (isAdminEmail(email)) {
    const token = signAdminMagicToken(email);
    if (!token) {
      return apiJson(
        { error: "Přihlášení není na serveru aktivní." },
        { status: 503 },
      );
    }
    const base = site.baseUrl.replace(/\/$/, "");
    const magicUrl = `${base}/api/admin/magic?token=${encodeURIComponent(token)}`;
    const sent = await sendAdminMagicLink(email, magicUrl);
    if (!sent.ok) {
      console.error("[admin/magic-request]", sent);
      return apiJson(
        { error: "Nepodařilo se odeslat e-mail. Zkuste to později." },
        { status: 500 },
      );
    }
  }

  return apiJson(genericOk);
}
