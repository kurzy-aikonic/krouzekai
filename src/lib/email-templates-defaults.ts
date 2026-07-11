import type { EmailTemplateContent, EmailTemplateId } from "@/lib/email-template-types";
import { EMAIL_TEMPLATE_IDS } from "@/lib/email-template-types";

const WRAPPER_START = `<!DOCTYPE html>
<html lang="cs">
<body style="font-family: system-ui, sans-serif; line-height: 1.5; color: #334155;">`;

const WRAPPER_END = `</body>
</html>`;

function wrap(inner: string): string {
  return `${WRAPPER_START}\n${inner.trim()}\n${WRAPPER_END}`;
}

export const DEFAULT_EMAIL_TEMPLATES: Record<
  EmailTemplateId,
  EmailTemplateContent
> = {
  registration_confirmation: {
    subject: "Přihláška přijata — další kroky ({{siteShortName}})",
    htmlBody: wrap(`
  <p>Dobrý den,</p>
  <p>děkujeme za přihlášku do kurzu <strong>{{siteName}}</strong>. Přihlášku jsme v pořádku přijali.</p>
  <p><strong>Číslo přihlášky:</strong> {{registrationCode}}<br/>
  <strong>Formát:</strong> {{formatLabel}}<br/>
  <strong>Rozsah kurzu:</strong> {{lessons}} lekcí × {{lessonMinutes}} minut<br/>
  <strong>Částka:</strong> {{amountCzk}} Kč ({{vatNote}})</p>
  {{runLineHtml}}
  <h2 style="font-size: 18px; margin: 24px 0 8px;">Co bude následovat</h2>
  <ol style="padding-left: 20px; margin: 0 0 14px;">
    <li>Ozveme se vám, projdeme detaily a domluvíme termín podle zájmu a věkové skupiny.</li>
    <li>Po domluvě vám zašleme <strong>fakturu</strong> (papírově / poštou dle vaší domluvy) a upřesníme platbu.</li>
    <li>Až bude platba uhrazena, potvrdíme místo v kurzu a pošleme organizační info k první lekci.</li>
  </ol>
  <p>
    <strong>Orientační přehled</strong> (částka, variabilní symbol, údaje k převodu) máte také na stránce:
    <a href="{{paymentUrl}}">Orientační přehled platby na webu</a> — slouží jako pomůcka; platbu řešíme až po vystavení faktury.
  </p>
  <p>Variabilní symbol pro párování platby: <strong>{{variableSymbol}}</strong> (použijte prosím až podle instrukcí ve faktuře).</p>
  <p style="font-size: 14px; color: #475569;">Pokud budete chtít cokoli upřesnit, napište nám na <a href="mailto:{{contactEmail}}">{{contactEmail}}</a>.</p>
  <p>S pozdravem,<br/>{{siteShortName}}</p>`),
  },
  registration_internal: {
    subject: "Nová přihláška: {{childName}} ({{registrationCode}})",
    htmlBody: wrap(`
  <h2 style="margin: 0 0 12px;">Nová přihláška ({{registrationCode}})</h2>
  <p style="margin: 0 0 12px; font-size: 13px; color: #64748b;">Technické ID: {{registrationUuid}}</p>
  <p style="margin: 0 0 8px;"><strong>Rodič:</strong> {{parentName}}</p>
  <p style="margin: 0 0 8px;"><strong>E-mail:</strong> {{parentEmail}}</p>
  <p style="margin: 0 0 8px;"><strong>Telefon:</strong> {{parentPhone}}</p>
  <p style="margin: 0 0 8px;"><strong>Dítě:</strong> {{childName}} ({{childAge}} let)</p>
  <p style="margin: 0 0 8px;"><strong>Stav:</strong> {{statusLabel}}</p>
  <p style="margin: 0 0 8px;"><strong>Formát:</strong> {{formatLabel}}</p>
  <p style="margin: 0 0 8px;"><strong>Termín:</strong> {{runLabel}}</p>
  <p style="margin: 0 0 8px;"><strong>Částka:</strong> {{amountCzk}} Kč</p>
  <p style="margin: 12px 0 0;"><a href="{{paymentUrl}}">Orientační přehled platby (web)</a></p>`),
  },
  registration_status_change: {
    subject: "Stav přihlášky: {{newStatusLabel}} ({{registrationCode}})",
    htmlBody: wrap(`
  <p>Dobrý den,</p>
  <p>u přihlášky vašeho dítěte <strong>{{childName}}</strong> jsme aktualizovali stav.</p>
  <p><strong>Číslo přihlášky:</strong> {{registrationCode}}<br/>
  <strong>Předchozí stav:</strong> {{previousStatusLabel}}<br/>
  <strong>Nový stav:</strong> {{newStatusLabel}}</p>
  <p>Podrobnosti a platební přehled najdete na webu:</p>
  <ul style="padding-left:20px;margin:8px 0;">
    <li><a href="{{paymentUrl}}">Orientační přehled k platbě</a></li>
    <li><a href="{{parentPortalUrl}}">Přehled pro rodiče</a> (přihlášení stejným e-mailem jako u přihlášky)</li>
  </ul>
  <p style="font-size:14px;color:#475569;">Dotazy? Napište na <a href="mailto:{{contactEmail}}">{{contactEmail}}</a>.</p>
  <p>S pozdravem,<br/>{{siteShortName}}</p>`),
  },
  waitlist_confirmation: {
    subject: "Zapsáno do čekací listiny ({{siteShortName}})",
    htmlBody: wrap(`
  <p>Dobrý den,</p>
  <p>děkujeme za zájem o kurz <strong>{{siteName}}</strong>. Vybraný termín je momentálně plný, zapsali jsme vás proto do <strong>čekací listiny</strong>.</p>
  <p><strong>Formát:</strong> {{formatLabel}}</p>
  {{runLineHtml}}
  <p>Ozveme se vám, jakmile se uvolní místo, nebo jakmile otevřeme nový termín stejného formátu. Zápis do čekací listiny nic nestojí a nezavazuje k platbě.</p>
  <p style="font-size: 14px; color: #475569;">Pokud budete chtít cokoli upřesnit, napište nám na <a href="mailto:{{contactEmail}}">{{contactEmail}}</a>.</p>
  <p>S pozdravem,<br/>{{siteShortName}}</p>`),
  },
  waitlist_internal: {
    subject: "Nový zájemce v čekací listině: {{childName}}",
    htmlBody: wrap(`
  <h2 style="margin: 0 0 12px;">Nový zájemce v čekací listině</h2>
  <p style="margin: 0 0 8px;"><strong>Rodič:</strong> {{parentName}}</p>
  <p style="margin: 0 0 8px;"><strong>E-mail:</strong> {{parentEmail}}</p>
  <p style="margin: 0 0 8px;"><strong>Telefon:</strong> {{parentPhone}}</p>
  <p style="margin: 0 0 8px;"><strong>Dítě:</strong> {{childName}}</p>
  <p style="margin: 0 0 8px;"><strong>Formát:</strong> {{formatLabel}}</p>
  <p style="margin: 0 0 8px;"><strong>Termín, o který byl zájem:</strong> {{runLabel}}</p>
  <p style="margin: 0 0 8px;"><strong>Poznámka:</strong> {{note}}</p>`),
  },
  parent_magic_link: {
    subject: "Přehled pro rodiče — odkaz ({{siteShortName}})",
    htmlBody: wrap(`
  <p>Dobrý den,</p>
  <p>požádali jste o přístup do <strong>přehledu pro rodiče</strong> u kurzu <strong>{{siteName}}</strong>.</p>
  {{magicButtonHtml}}
  <p style="font-size:14px;color:#64748b;">Odkaz je jednorázový a brzy vyprší. Pokud jste o nic nežádali, e-mail ignorujte.</p>
  <p style="font-size:13px;word-break:break-all;color:#475569;">{{magicUrl}}</p>
  <p>S pozdravem,<br/>{{siteShortName}}</p>`),
  },
  admin_magic_link: {
    subject: "Přihlášení do administrace ({{siteShortName}})",
    htmlBody: wrap(`
  <p>Dobrý den,</p>
  <p>požádali jste o přístup do <strong>interní administrace</strong> webu <strong>{{siteName}}</strong>.</p>
  {{magicButtonHtml}}
  <p style="font-size:14px;color:#64748b;">Odkaz je jednorázový a brzy vyprší. Pokud jste o nic nežádali, e-mail ignorujte.</p>
  <p style="font-size:13px;word-break:break-all;color:#475569;">{{magicUrl}}</p>
  <p>S pozdravem,<br/>{{siteShortName}}</p>`),
  },
  admin_test: {
    subject: "Test e-mail — {{siteShortName}}",
    htmlBody: wrap(`
  <p>Dobrý den,</p>
  <p>toto je <strong>testovací zpráva</strong> z administrace webu <strong>{{siteName}}</strong>.</p>
  <p style="font-size: 14px; color: #64748b;">Když ji vidíte v schránce, Resend a odesílatel jsou nastavené v pořádku.</p>
  <p>S pozdravem,<br/>{{siteShortName}}</p>`),
  },
};

export function defaultEmailTemplatesRecord(): Record<
  EmailTemplateId,
  EmailTemplateContent
> {
  return { ...DEFAULT_EMAIL_TEMPLATES };
}

export function isEmailTemplateId(value: string): value is EmailTemplateId {
  return (EMAIL_TEMPLATE_IDS as readonly string[]).includes(value);
}
