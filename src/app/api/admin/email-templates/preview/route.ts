import { z } from "zod";
import { apiJson } from "@/lib/api-response";
import { getAdminSecret, verifyAdminRequest } from "@/lib/admin-auth";
import { renderEmailTemplate } from "@/lib/email-template-render";
import { sampleEmailTemplateVars } from "@/lib/email-template-samples";
import { EMAIL_TEMPLATE_IDS } from "@/lib/email-template-types";
import { rateLimitResponse } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  templateId: z.enum(EMAIL_TEMPLATE_IDS),
  subject: z.string().min(1).max(300),
  htmlBody: z.string().min(1).max(100_000),
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

  const { templateId, subject, htmlBody } = parsed.data;
  const vars = sampleEmailTemplateVars(templateId);
  const rendered = renderEmailTemplate({ subject, htmlBody }, vars);

  return apiJson({
    ok: true,
    subject: rendered.subject,
    html: rendered.html,
  });
}
