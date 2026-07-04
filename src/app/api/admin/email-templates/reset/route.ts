import { z } from "zod";
import { apiJson } from "@/lib/api-response";
import { getAdminSecret, verifyAdminRequest } from "@/lib/admin-auth";
import {
  emailTemplatesPersistenceMode,
  resetAllEmailTemplates,
  resetEmailTemplate,
} from "@/lib/email-templates-store";
import { EMAIL_TEMPLATE_IDS } from "@/lib/email-template-types";
import { rateLimitResponse } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  templateId: z.enum(EMAIL_TEMPLATE_IDS).optional(),
  all: z.boolean().optional(),
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

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return apiJson({ error: "Neplatný JSON." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return apiJson({ error: "Neplatná data." }, { status: 422 });
  }

  try {
    const config = parsed.data.all
      ? await resetAllEmailTemplates()
      : parsed.data.templateId
        ? await resetEmailTemplate(parsed.data.templateId)
        : null;

    if (!config) {
      return apiJson(
        { error: "Uveďte templateId nebo all: true." },
        { status: 422 },
      );
    }

    return apiJson({
      ok: true,
      ...config,
      storage: emailTemplatesPersistenceMode(),
    });
  } catch (e) {
    console.error(e);
    return apiJson({ error: "Reset se nezdařil." }, { status: 500 });
  }
}
