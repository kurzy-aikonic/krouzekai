import { getCourseRunById } from "@/lib/course-runs-store";
import { renderEmailTemplate } from "@/lib/email-template-render";
import { sampleEmailTemplateVars } from "@/lib/email-template-samples";
import {
  buildAdminTestVars,
  buildMagicLinkVars,
  buildRegistrationConfirmationVars,
  buildRegistrationInternalVars,
  buildRegistrationStatusChangeVars,
} from "@/lib/email-template-vars";
import type { EmailTemplateId } from "@/lib/email-template-types";
import { getEmailTemplate } from "@/lib/email-templates-store";
import { getPublicRegistrationCode } from "@/lib/registration-code";
import { site } from "@/lib/site-config";
import type { RegistrationRecord, RegistrationStatus } from "@/types/registration";

async function sendResendEmail(args: {
  apiKey: string;
  from: string;
  to: string[];
  subject: string;
  html: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${args.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: args.from,
      to: args.to,
      subject: args.subject,
      html: args.html,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    return { ok: false, error: `Resend ${res.status}: ${text}` };
  }
  return { ok: true };
}

function resendConfig():
  | { ready: true; apiKey: string; from: string }
  | { ready: false } {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM_EMAIL?.trim();
  if (!apiKey || !from) {
    return { ready: false };
  }
  return { ready: true, apiKey, from };
}

export type SendRegistrationResult =
  | { ok: true; provider: "resend" }
  | { ok: true; provider: "skipped"; reason: "no_api_key" }
  | { ok: false; error: string };

async function sendFromTemplate(args: {
  templateId: EmailTemplateId;
  to: string[];
  vars: Record<string, string>;
  logLabel: string;
}): Promise<SendRegistrationResult> {
  const cfg = resendConfig();
  if (!cfg.ready) {
    console.info(`[email] ${args.logLabel} (bez Resend):`, args.to.join(", "));
    return { ok: true, provider: "skipped", reason: "no_api_key" };
  }

  const template = await getEmailTemplate(args.templateId);
  const rendered = renderEmailTemplate(template, args.vars);

  const sent = await sendResendEmail({
    apiKey: cfg.apiKey,
    from: cfg.from,
    to: args.to,
    subject: rendered.subject,
    html: rendered.html,
  });
  if (!sent.ok) return sent;
  return { ok: true, provider: "resend" };
}

/** Odešle libovolnou šablonu s ukázkovými nebo vlastními daty (admin test). */
export async function sendTemplatedEmail(args: {
  templateId: EmailTemplateId;
  to: string;
  vars?: Record<string, string>;
}): Promise<SendRegistrationResult> {
  const vars = args.vars ?? sampleEmailTemplateVars(args.templateId);
  return sendFromTemplate({
    templateId: args.templateId,
    to: [args.to.trim()],
    vars,
    logLabel: `test šablony ${args.templateId}`,
  });
}

export async function sendRegistrationConfirmation(
  record: RegistrationRecord,
): Promise<SendRegistrationResult> {
  const internalTo = process.env.RESEND_INTERNAL_TO ?? site.contactEmail;

  const runCandidate = record.runId
    ? await getCourseRunById(record.runId)
    : undefined;
  const run =
    runCandidate && runCandidate.format === record.format
      ? runCandidate
      : undefined;
  const internalRunLabel =
    run?.label ??
    (record.runId
      ? `neznámý / starý termín (${record.runId})`
      : "zatím bez termínu");

  const parentResult = await sendFromTemplate({
    templateId: "registration_confirmation",
    to: [record.parentEmail],
    vars: buildRegistrationConfirmationVars(record, run),
    logLabel: `potvrzení přihlášky ${getPublicRegistrationCode(record)}`,
  });

  if (!parentResult.ok) {
    return parentResult;
  }

  const internalRecipients = internalTo
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
  if (internalRecipients.length > 0) {
    const internalMail = await sendFromTemplate({
      templateId: "registration_internal",
      to: internalRecipients,
      vars: buildRegistrationInternalVars(record, internalRunLabel),
      logLabel: `interní kopie ${getPublicRegistrationCode(record)}`,
    });
    if (!internalMail.ok) {
      console.error("[email][internal]", internalMail.error);
    }
  }

  return parentResult;
}

export async function sendRegistrationStatusChangeNotice(
  record: RegistrationRecord,
  previousStatus: RegistrationStatus,
): Promise<SendRegistrationResult> {
  return sendFromTemplate({
    templateId: "registration_status_change",
    to: [record.parentEmail],
    vars: buildRegistrationStatusChangeVars(record, previousStatus),
    logLabel: `změna stavu ${getPublicRegistrationCode(record)}`,
  });
}

export async function sendAdminTestEmail(to: string): Promise<SendRegistrationResult> {
  return sendTemplatedEmail({
    templateId: "admin_test",
    to,
    vars: buildAdminTestVars(),
  });
}

export async function sendParentPortalMagicLink(
  toEmail: string,
  magicUrl: string,
): Promise<SendRegistrationResult> {
  const cfg = resendConfig();
  if (!cfg.ready) {
    console.info("[email] Rodičovský odkaz (bez Resend):", magicUrl);
    return { ok: true, provider: "skipped", reason: "no_api_key" };
  }
  return sendFromTemplate({
    templateId: "parent_magic_link",
    to: [toEmail],
    vars: buildMagicLinkVars("parent_magic_link", magicUrl),
    logLabel: "rodičovský magic link",
  });
}

export async function sendAdminMagicLink(
  toEmail: string,
  magicUrl: string,
): Promise<SendRegistrationResult> {
  const cfg = resendConfig();
  if (!cfg.ready) {
    console.info("[email] Admin magic link (bez Resend):", magicUrl);
    return { ok: true, provider: "skipped", reason: "no_api_key" };
  }
  return sendFromTemplate({
    templateId: "admin_magic_link",
    to: [toEmail],
    vars: buildMagicLinkVars("admin_magic_link", magicUrl),
    logLabel: "admin magic link",
  });
}
