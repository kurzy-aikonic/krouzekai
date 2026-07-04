import { z } from "zod";
import { apiJson } from "@/lib/api-response";
import { getAdminSecret, verifyAdminRequest } from "@/lib/admin-auth";
import {
  emailTemplatesPersistenceMode,
  getEmailTemplatesConfig,
  replaceEmailTemplates,
} from "@/lib/email-templates-store";
import { EMAIL_TEMPLATE_IDS } from "@/lib/email-template-types";
import { rateLimitResponse } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const templateSchema = z.object({
  subject: z.string().min(1).max(300),
  htmlBody: z.string().min(1).max(100_000),
});

const putSchema = z.object({
  templates: z.record(z.enum(EMAIL_TEMPLATE_IDS), templateSchema).optional(),
  templateId: z.enum(EMAIL_TEMPLATE_IDS).optional(),
  subject: z.string().min(1).max(300).optional(),
  htmlBody: z.string().min(1).max(100_000).optional(),
});

export async function GET(request: Request) {
  const limited = await rateLimitResponse(request, "adminApi");
  if (limited) return limited;

  if (!getAdminSecret()) {
    return apiJson({ error: "ADMIN_SECRET není nastaven." }, { status: 503 });
  }
  if (!verifyAdminRequest(request)) {
    return apiJson({ error: "Neautorizováno." }, { status: 401 });
  }

  const config = await getEmailTemplatesConfig();
  return apiJson({
    ok: true,
    ...config,
    storage: emailTemplatesPersistenceMode(),
  });
}

export async function PUT(request: Request) {
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

  const parsed = putSchema.safeParse(json);
  if (!parsed.success) {
    return apiJson(
      { error: "Neplatná data.", details: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const body = parsed.data;
  let templatesInput: Parameters<typeof replaceEmailTemplates>[0]["templates"];

  if (body.templates) {
    templatesInput = body.templates;
  } else if (
    body.templateId &&
    body.subject != null &&
    body.htmlBody != null
  ) {
    templatesInput = {
      [body.templateId]: {
        subject: body.subject,
        htmlBody: body.htmlBody,
      },
    };
  } else {
    return apiJson(
      { error: "Pošlete templates nebo templateId + subject + htmlBody." },
      { status: 422 },
    );
  }

  try {
    const config = await replaceEmailTemplates({ templates: templatesInput });
    return apiJson({
      ok: true,
      ...config,
      storage: emailTemplatesPersistenceMode(),
    });
  } catch (e) {
    console.error(e);
    return apiJson({ error: "Nepodařilo se uložit šablony." }, { status: 500 });
  }
}
