import { escapeHtml } from "@/lib/escape-html";
import { getPublicRegistrationCode } from "@/lib/registration-code";
import { site } from "@/lib/site-config";
import { variableSymbolFromRegistrationId } from "@/lib/payment";
import type { CourseRun } from "@/data/course-runs";
import type { EmailTemplateId } from "@/lib/email-template-types";
import type { RegistrationRecord, RegistrationStatus } from "@/types/registration";
import { registrationStatusLabelsCs } from "@/types/registration";

function paymentUrl(registrationId: string): string {
  const base = site.baseUrl.replace(/\/$/, "");
  return `${base}/platba?registrace=${encodeURIComponent(registrationId)}`;
}

function formatLabel(format: RegistrationRecord["format"]): string {
  return format === "individual" ? "Individuální 1:1" : "Skupinový kurz";
}

function magicButtonHtml(magicUrl: string, label: string): string {
  const href = escapeHtml(magicUrl);
  const text = escapeHtml(label);
  return `<p><a href="${href}" style="display:inline-block;margin:12px 0;padding:12px 20px;background:#7c3aed;color:#fff;text-decoration:none;border-radius:12px;font-weight:bold;">${text}</a></p>`;
}

export function buildRegistrationConfirmationVars(
  record: RegistrationRecord,
  run: CourseRun | undefined,
): Record<string, string> {
  const publicCode = getPublicRegistrationCode(record);
  const runLineHtml =
    run != null
      ? `<p><strong>Zvolený termín:</strong> ${escapeHtml(run.label)}</p>`
      : "";

  return {
    siteName: escapeHtml(site.name),
    siteShortName: escapeHtml(site.shortName),
    contactEmail: escapeHtml(site.contactEmail),
    registrationCode: escapeHtml(publicCode),
    formatLabel: escapeHtml(formatLabel(record.format)),
    lessons: escapeHtml(String(site.pricing.lessons)),
    lessonMinutes: escapeHtml(String(site.pricing.lessonMinutes)),
    amountCzk: escapeHtml(String(record.amountCzk)),
    vatNote: escapeHtml(site.pricing.vatNote),
    runLineHtml,
    variableSymbol: escapeHtml(variableSymbolFromRegistrationId(record.id)),
    paymentUrl: escapeHtml(paymentUrl(publicCode)),
  };
}

export function buildRegistrationInternalVars(
  record: RegistrationRecord,
  runLabel: string,
): Record<string, string> {
  const publicCode = getPublicRegistrationCode(record);
  return {
    registrationCode: escapeHtml(publicCode),
    registrationUuid: escapeHtml(record.id),
    statusLabel: escapeHtml(registrationStatusLabelsCs[record.status]),
    parentName: escapeHtml(record.parentName),
    parentEmail: escapeHtml(record.parentEmail),
    parentPhone: escapeHtml(record.parentPhone),
    childName: escapeHtml(record.childName),
    childAge: escapeHtml(String(record.childAge)),
    formatLabel: escapeHtml(formatLabel(record.format)),
    amountCzk: escapeHtml(String(record.amountCzk)),
    runLabel: escapeHtml(runLabel),
    paymentUrl: escapeHtml(paymentUrl(publicCode)),
  };
}

export function buildRegistrationStatusChangeVars(
  record: RegistrationRecord,
  previousStatus: RegistrationStatus,
): Record<string, string> {
  const publicCode = getPublicRegistrationCode(record);
  const base = site.baseUrl.replace(/\/$/, "");
  return {
    childName: escapeHtml(record.childName),
    registrationCode: escapeHtml(publicCode),
    previousStatusLabel: escapeHtml(registrationStatusLabelsCs[previousStatus]),
    newStatusLabel: escapeHtml(registrationStatusLabelsCs[record.status]),
    paymentUrl: escapeHtml(paymentUrl(publicCode)),
    parentPortalUrl: escapeHtml(`${base}/rodic/prihlaseni`),
    contactEmail: escapeHtml(site.contactEmail),
    siteShortName: escapeHtml(site.shortName),
  };
}

export function buildMagicLinkVars(
  templateId: Extract<EmailTemplateId, "parent_magic_link" | "admin_magic_link">,
  magicUrl: string,
): Record<string, string> {
  const label =
    templateId === "parent_magic_link"
      ? "Otevřít přehled"
      : "Přihlásit do adminu";
  return {
    siteName: escapeHtml(site.name),
    siteShortName: escapeHtml(site.shortName),
    magicUrl: escapeHtml(magicUrl),
    magicButtonHtml: magicButtonHtml(magicUrl, label),
  };
}

export function buildAdminTestVars(): Record<string, string> {
  return {
    siteName: escapeHtml(site.name),
    siteShortName: escapeHtml(site.shortName),
  };
}
