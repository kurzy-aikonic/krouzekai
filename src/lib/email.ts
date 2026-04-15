import { escapeHtml } from "@/lib/escape-html";
import { getPublicRegistrationCode } from "@/lib/registration-code";
import { site } from "@/lib/site-config";
import { variableSymbolFromRegistrationId } from "@/lib/payment";
import { getCourseRunById } from "@/lib/course-runs-store";
import type { RegistrationRecord } from "@/types/registration";
import type { RegistrationStatus } from "@/types/registration";
import { registrationStatusLabelsCs } from "@/types/registration";

function paymentUrl(registrationId: string): string {
  const base = site.baseUrl.replace(/\/$/, "");
  return `${base}/platba?registrace=${encodeURIComponent(registrationId)}`;
}

function buildHtml(record: RegistrationRecord, runLineHtml: string): string {
  const publicCode = getPublicRegistrationCode(record);
  const vs = variableSymbolFromRegistrationId(record.id);
  const link = paymentUrl(publicCode);
  const formatLabel =
    record.format === "individual" ? "Individuální 1:1" : "Skupinový kurz";
  const safe = {
    name: escapeHtml(site.name),
    short: escapeHtml(site.shortName),
    id: escapeHtml(publicCode),
    vs: escapeHtml(vs),
    vat: escapeHtml(site.pricing.vatNote),
    linkLabel: escapeHtml("Orientační přehled platby na webu"),
    amount: escapeHtml(String(record.amountCzk)),
    formatLabel: escapeHtml(formatLabel),
    lessons: escapeHtml(String(site.pricing.lessons)),
    lessonMinutes: escapeHtml(String(site.pricing.lessonMinutes)),
    email: escapeHtml(site.contactEmail),
  };
  return `
<!DOCTYPE html>
<html lang="cs">
<body style="font-family: system-ui, sans-serif; line-height: 1.5; color: #334155;">
  <p>Dobrý den,</p>
  <p>děkujeme za přihlášku do kurzu <strong>${safe.name}</strong>. Přihlášku jsme v pořádku přijali.</p>
  <p><strong>Číslo přihlášky:</strong> ${safe.id}<br/>
  <strong>Formát:</strong> ${safe.formatLabel}<br/>
  <strong>Rozsah kurzu:</strong> ${safe.lessons} lekcí × ${safe.lessonMinutes} minut<br/>
  <strong>Částka:</strong> ${safe.amount} Kč (${safe.vat})</p>
  ${runLineHtml}
  <h2 style="font-size: 18px; margin: 24px 0 8px;">Co bude následovat</h2>
  <ol style="padding-left: 20px; margin: 0 0 14px;">
    <li>Ozveme se vám, projdeme detaily a domluvíme termín podle zájmu a věkové skupiny.</li>
    <li>Po domluvě vám zašleme <strong>fakturu</strong> (papírově / poštou dle vaší domluvy) a upřesníme platbu.</li>
    <li>Až bude platba uhrazena, potvrdíme místo v kurzu a pošleme organizační info k první lekci.</li>
  </ol>
  <p>
    <strong>Orientační přehled</strong> (částka, variabilní symbol, údaje k převodu) máte také na stránce:
    <a href="${escapeHtml(link)}">${safe.linkLabel}</a> — slouží jako pomůcka; platbu řešíme až po vystavení faktury.
  </p>
  <p>Variabilní symbol pro párování platby: <strong>${safe.vs}</strong> (použijte prosím až podle instrukcí ve faktuře).</p>
  <p style="font-size: 14px; color: #475569;">Pokud budete chtít cokoli upřesnit, napište nám na <a href="mailto:${safe.email}">${safe.email}</a>.</p>
  <p>S pozdravem,<br/>${safe.short}</p>
</body>
</html>`.trim();
}

function buildInternalHtml(record: RegistrationRecord, runDisplay: string): string {
  const publicCode = getPublicRegistrationCode(record);
  const paymentLink = paymentUrl(publicCode);
  const formatLabel =
    record.format === "individual" ? "Individuální 1:1" : "Skupinový kurz";
  const safe = {
    id: escapeHtml(publicCode),
    idUuid: escapeHtml(record.id),
    status: escapeHtml(registrationStatusLabelsCs[record.status]),
    parentName: escapeHtml(record.parentName),
    parentEmail: escapeHtml(record.parentEmail),
    parentPhone: escapeHtml(record.parentPhone),
    childName: escapeHtml(record.childName),
    childAge: escapeHtml(String(record.childAge)),
    format: escapeHtml(formatLabel),
    amount: escapeHtml(String(record.amountCzk)),
    runId: escapeHtml(runDisplay),
    link: escapeHtml(paymentLink),
  };

  return `
<!DOCTYPE html>
<html lang="cs">
<body style="font-family: system-ui, sans-serif; line-height: 1.5; color: #0f172a;">
  <h2 style="margin: 0 0 12px;">Nová přihláška (${safe.id})</h2>
  <p style="margin: 0 0 12px; font-size: 13px; color: #64748b;">Technické ID: ${safe.idUuid}</p>
  <p style="margin: 0 0 8px;"><strong>Rodič:</strong> ${safe.parentName}</p>
  <p style="margin: 0 0 8px;"><strong>E-mail:</strong> ${safe.parentEmail}</p>
  <p style="margin: 0 0 8px;"><strong>Telefon:</strong> ${safe.parentPhone}</p>
  <p style="margin: 0 0 8px;"><strong>Dítě:</strong> ${safe.childName} (${safe.childAge} let)</p>
  <p style="margin: 0 0 8px;"><strong>Stav:</strong> ${safe.status} <span style="color:#64748b;">(stav měňte v adminu nebo v souboru přihlášek — např. <code>kontaktovano</code>, <code>zaplaceno</code>, <code>zruseno</code>, <code>vraceny_penize</code>, <code>reklamace</code>)</span></p>
  <p style="margin: 0 0 8px;"><strong>Formát:</strong> ${safe.format}</p>
  <p style="margin: 0 0 8px;"><strong>Termín:</strong> ${safe.runId}</p>
  <p style="margin: 0 0 8px;"><strong>Částka:</strong> ${safe.amount} Kč</p>
  <p style="margin: 12px 0 0;"><a href="${safe.link}">Orientační přehled platby (web)</a></p>
</body>
</html>`.trim();
}

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

export type SendRegistrationResult =
  | { ok: true; provider: "resend" }
  | { ok: true; provider: "skipped"; reason: "no_api_key" }
  | { ok: false; error: string };

/**
 * Odešle potvrzení rodiči. Bez RESEND_API_KEY jen zaloguje (dev).
 */
export async function sendRegistrationConfirmation(
  record: RegistrationRecord,
): Promise<SendRegistrationResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const internalTo = process.env.RESEND_INTERNAL_TO ?? site.contactEmail;

  if (!apiKey || !from) {
    console.info(
      "[email] RESEND není nastaven — potvrzení by šlo na:",
      record.parentEmail,
      "přihláška:",
      getPublicRegistrationCode(record),
    );
    return { ok: true, provider: "skipped", reason: "no_api_key" };
  }

  const runCandidate = record.runId
    ? await getCourseRunById(record.runId)
    : undefined;
  const run =
    runCandidate && runCandidate.format === record.format
      ? runCandidate
      : undefined;
  const runLine =
    run != null
      ? `<p><strong>Zvolený termín:</strong> ${escapeHtml(run.label)}</p>`
      : "";
  const internalRunLabel =
    run?.label ??
    (record.runId
      ? `neznámý / starý termín (${record.runId})`
      : "zatím bez termínu");

  const parentMail = await sendResendEmail({
    apiKey,
    from,
    to: [record.parentEmail],
    subject: `Přihláška přijata — další kroky (${site.shortName})`,
    html: buildHtml(record, runLine),
  });

  if (!parentMail.ok) {
    return parentMail;
  }

  const internalRecipients = internalTo
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
  if (internalRecipients.length > 0) {
    const internalMail = await sendResendEmail({
      apiKey,
      from,
      to: internalRecipients,
      subject: `Nová přihláška: ${record.childName} (${getPublicRegistrationCode(record)})`,
      html: buildInternalHtml(record, internalRunLabel),
    });
    if (!internalMail.ok) {
      console.error("[email][internal]", internalMail.error);
    }
  }

  return { ok: true, provider: "resend" };
}

/**
 * Upozornění rodiči po změně stavu přihlášky v adminu.
 * Bez Resend jen zaloguje (stejně jako ostatní pošta).
 */
export async function sendRegistrationStatusChangeNotice(
  record: RegistrationRecord,
  previousStatus: RegistrationStatus,
): Promise<SendRegistrationResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    console.info(
      "[email] změna stavu přihlášky (bez Resend):",
      getPublicRegistrationCode(record),
      previousStatus,
      "→",
      record.status,
    );
    return { ok: true, provider: "skipped", reason: "no_api_key" };
  }

  const code = getPublicRegistrationCode(record);
  const prevLabel = registrationStatusLabelsCs[previousStatus];
  const newLabel = registrationStatusLabelsCs[record.status];
  const pay = paymentUrl(code);
  const base = site.baseUrl.replace(/\/$/, "");
  const rodicUrl = `${base}/rodic/prihlaseni`;

  const html = `
<!DOCTYPE html>
<html lang="cs">
<body style="font-family: system-ui, sans-serif; line-height: 1.5; color: #334155;">
  <p>Dobrý den,</p>
  <p>u přihlášky vašeho dítěte <strong>${escapeHtml(record.childName)}</strong> jsme aktualizovali stav.</p>
  <p><strong>Číslo přihlášky:</strong> ${escapeHtml(code)}<br/>
  <strong>Předchozí stav:</strong> ${escapeHtml(prevLabel)}<br/>
  <strong>Nový stav:</strong> ${escapeHtml(newLabel)}</p>
  <p>Podrobnosti a platební přehled najdete na webu:</p>
  <ul style="padding-left:20px;margin:8px 0;">
    <li><a href="${escapeHtml(pay)}">Orientační přehled k platbě</a></li>
    <li><a href="${escapeHtml(rodicUrl)}">Přehled pro rodiče</a> (přihlášení stejným e-mailem jako u přihlášky)</li>
  </ul>
  <p style="font-size:14px;color:#475569;">Dotazy? Napište na <a href="mailto:${escapeHtml(site.contactEmail)}">${escapeHtml(site.contactEmail)}</a>.</p>
  <p>S pozdravem,<br/>${escapeHtml(site.shortName)}</p>
</body>
</html>`.trim();

  const sent = await sendResendEmail({
    apiKey,
    from,
    to: [record.parentEmail],
    subject: `Stav přihlášky: ${newLabel} (${code})`,
    html,
  });
  if (!sent.ok) return sent;
  return { ok: true, provider: "resend" };
}

/**
 * Testovací e-mail z administrace (ověření Resend a domény odesílatele).
 */
export async function sendAdminTestEmail(to: string): Promise<SendRegistrationResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) {
    console.info(
      "[email] Admin test — chybí RESEND_API_KEY nebo RESEND_FROM_EMAIL",
    );
    return { ok: true, provider: "skipped", reason: "no_api_key" };
  }
  const html = `
<!DOCTYPE html>
<html lang="cs">
<body style="font-family: system-ui, sans-serif; line-height: 1.5; color: #334155;">
  <p>Dobrý den,</p>
  <p>toto je <strong>testovací zpráva</strong> z administrace webu <strong>${escapeHtml(site.name)}</strong>.</p>
  <p style="font-size: 14px; color: #64748b;">Když ji vidíte v schránce, Resend a odesílatel jsou nastavené v pořádku.</p>
  <p>S pozdravem,<br/>${escapeHtml(site.shortName)}</p>
</body>
</html>`.trim();

  const sent = await sendResendEmail({
    apiKey,
    from,
    to: [to.trim()],
    subject: `Test e-mail — ${site.shortName}`,
    html,
  });
  if (!sent.ok) return sent;
  return { ok: true, provider: "resend" };
}

/** Jednorázový odkaz do rodičovského přehledu (platí cca 15 minut). */
export async function sendParentPortalMagicLink(
  toEmail: string,
  magicUrl: string,
): Promise<SendRegistrationResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    console.info(
      "[email] Rodičovský odkaz (bez Resend) — zkopírujte v dev:",
      magicUrl,
    );
    return { ok: true, provider: "skipped", reason: "no_api_key" };
  }

  const safeUrl = escapeHtml(magicUrl);
  const html = `
<!DOCTYPE html>
<html lang="cs">
<body style="font-family: system-ui, sans-serif; line-height: 1.5; color: #334155;">
  <p>Dobrý den,</p>
  <p>požádali jste o přístup do <strong>přehledu pro rodiče</strong> u kurzu <strong>${escapeHtml(site.name)}</strong>.</p>
  <p><a href="${safeUrl}" style="display:inline-block;margin:12px 0;padding:12px 20px;background:#7c3aed;color:#fff;text-decoration:none;border-radius:12px;font-weight:bold;">Otevřít přehled</a></p>
  <p style="font-size:14px;color:#64748b;">Odkaz je jednorázový a brzy vyprší. Pokud jste o nic nežádali, e-mail ignorujte.</p>
  <p style="font-size:13px;word-break:break-all;color:#475569;">${safeUrl}</p>
  <p>S pozdravem,<br/>${escapeHtml(site.shortName)}</p>
</body>
</html>`.trim();

  const sent = await sendResendEmail({
    apiKey,
    from,
    to: [toEmail],
    subject: `Přehled pro rodiče — odkaz (${site.shortName})`,
    html,
  });
  if (!sent.ok) return sent;
  return { ok: true, provider: "resend" };
}
