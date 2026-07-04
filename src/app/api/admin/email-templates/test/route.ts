import { z } from "zod";
import { apiJson } from "@/lib/api-response";
import { getAdminSecret, verifyAdminRequest } from "@/lib/admin-auth";
import { sendTemplatedEmail } from "@/lib/email";
import { EMAIL_TEMPLATE_IDS } from "@/lib/email-template-types";
import { site } from "@/lib/site-config";
import { rateLimitResponse } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  templateId: z.enum(EMAIL_TEMPLATE_IDS),
  to: z.string().email().max(320).optional(),
  subject: z.string().min(1).max(300).optional(),
  htmlBody: z.string().min(1).max(100_000).optional(),
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

  const to = parsed.data.to?.trim() || site.contactEmail;

  if (parsed.data.subject && parsed.data.htmlBody) {
    const { renderEmailTemplate } = await import("@/lib/email-template-render");
    const { sampleEmailTemplateVars } = await import(
      "@/lib/email-template-samples"
    );
    const vars = sampleEmailTemplateVars(parsed.data.templateId);
    const rendered = renderEmailTemplate(
      { subject: parsed.data.subject, htmlBody: parsed.data.htmlBody },
      vars,
    );

    const apiKey = process.env.RESEND_API_KEY?.trim();
    const from = process.env.RESEND_FROM_EMAIL?.trim();
    if (!apiKey || !from) {
      return apiJson(
        { error: "RESEND_API_KEY nebo RESEND_FROM_EMAIL chybí." },
        { status: 503 },
      );
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: rendered.subject,
        html: rendered.html,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      return apiJson({ error: `Resend ${res.status}: ${text}` }, { status: 502 });
    }

    return apiJson({ ok: true, to, preview: true });
  }

  const result = await sendTemplatedEmail({
    templateId: parsed.data.templateId,
    to,
  });

  if (!result.ok) {
    return apiJson({ error: result.error }, { status: 502 });
  }
  if (result.provider === "skipped") {
    return apiJson(
      { error: "RESEND není nastaven — e-mail se neodeslal." },
      { status: 503 },
    );
  }

  return apiJson({ ok: true, to });
}
