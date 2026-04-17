import { z } from "zod";
import { apiJson } from "@/lib/api-response";
import { getAdminSecret, verifyAdminRequest } from "@/lib/admin-auth";
import { sendAdminTestEmail } from "@/lib/email";
import { rateLimitResponse } from "@/lib/rate-limit";
import { site } from "@/lib/site-config";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  to: z.string().email().max(320).optional(),
});

export async function POST(request: Request) {
  const limited = await rateLimitResponse(request, "adminApi");
  if (limited) return limited;

  if (!getAdminSecret()) {
    return apiJson({ error: "ADMIN_SECRET není nastaven." }, { status: 503 });
  }
  if (!verifyAdminRequest(request)) {
    return apiJson({ error: "Neautorizováno." }, { status: 401 });
  }

  let json: unknown = {};
  try {
    const text = await request.text();
    if (text.trim()) json = JSON.parse(text) as unknown;
  } catch {
    return apiJson({ error: "Neplatný JSON." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return apiJson({ error: "Neplatná data." }, { status: 422 });
  }

  const fallback =
    process.env.RESEND_INTERNAL_TO?.split(",")[0]?.trim() ?? site.contactEmail;
  const to = parsed.data.to?.trim() || fallback;

  const result = await sendAdminTestEmail(to);
  if (result.ok && result.provider === "skipped") {
    return apiJson(
      {
        ok: false,
        error:
          "Resend není nastaven (RESEND_API_KEY, RESEND_FROM_EMAIL). Test nelze odeslat.",
      },
      { status: 503 },
    );
  }
  if (!result.ok) {
    return apiJson(
      { ok: false, error: result.error },
      { status: 502 },
    );
  }

  return apiJson({ ok: true, to });
}
