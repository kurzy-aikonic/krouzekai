import { site } from "@/lib/site-config";
import type { EmailTemplateId } from "@/lib/email-template-types";
import { registrationStatusLabelsCs } from "@/types/registration";

/** Ukázková data pro náhled šablon v adminu. */
export function sampleEmailTemplateVars(
  templateId: EmailTemplateId,
): Record<string, string> {
  const base = site.baseUrl.replace(/\/$/, "");
  const sampleCode = "KA7X2M";
  const paymentUrl = `${base}/platba?registrace=${sampleCode}`;
  const parentPortalUrl = `${base}/rodic/prihlaseni`;
  const magicUrl = `${base}/rodic/prihlaseni?token=ukazka-jednorazoveho-odkazu`;
  const magicButtonHtml = `<p><a href="${magicUrl}" style="display:inline-block;margin:12px 0;padding:12px 20px;background:#7c3aed;color:#fff;text-decoration:none;border-radius:12px;font-weight:bold;">Otevřít přehled</a></p>`;

  const common = {
    siteName: site.name,
    siteShortName: site.shortName,
    contactEmail: site.contactEmail,
    registrationCode: sampleCode,
    paymentUrl,
    parentPortalUrl,
    magicUrl,
    magicButtonHtml,
  };

  switch (templateId) {
    case "registration_confirmation":
      return {
        ...common,
        formatLabel: "Skupinový kurz",
        lessons: String(site.pricing.lessons),
        lessonMinutes: String(site.pricing.lessonMinutes),
        amountCzk: "5 000",
        vatNote: site.pricing.vatNote,
        variableSymbol: "1234567890",
        runLineHtml:
          '<p><strong>Zvolený termín:</strong> Skupina A — úterý 17:00 (ukázka)</p>',
      };
    case "registration_internal":
      return {
        ...common,
        registrationUuid: "00000000-0000-4000-8000-000000000001",
        statusLabel: registrationStatusLabelsCs.nova,
        parentName: "Jan Novák",
        parentEmail: "rodic@example.cz",
        parentPhone: "+420 777 123 456",
        childName: "Ema Nováková",
        childAge: "12",
        formatLabel: "Skupinový kurz",
        amountCzk: "5000",
        runLabel: "Skupina A — úterý 17:00",
      };
    case "registration_status_change":
      return {
        ...common,
        childName: "Ema Nováková",
        previousStatusLabel: registrationStatusLabelsCs.nova,
        newStatusLabel: registrationStatusLabelsCs.kontaktovano,
      };
    case "parent_magic_link":
    case "admin_magic_link":
      return common;
    case "admin_test":
      return {
        siteName: site.name,
        siteShortName: site.shortName,
      };
    default: {
      const _exhaustive: never = templateId;
      return _exhaustive;
    }
  }
}
