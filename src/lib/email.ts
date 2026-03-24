import { site } from "@/lib/site-config";
import { variableSymbolFromRegistrationId } from "@/lib/payment";
import type { RegistrationRecord } from "@/types/registration";

function paymentUrl(registrationId: string): string {
  const base = site.baseUrl.replace(/\/$/, "");
  return `${base}/platba?registrace=${encodeURIComponent(registrationId)}`;
}

function buildHtml(record: RegistrationRecord): string {
  const vs = variableSymbolFromRegistrationId(record.id);
  const link = paymentUrl(record.id);
  return `
<!DOCTYPE html>
<html lang="cs">
<body style="font-family: system-ui, sans-serif; line-height: 1.5; color: #334155;">
  <p>Dobrý den,</p>
  <p>děkujeme za přihlášku do kurzu <strong>${site.name}</strong>.</p>
  <p><strong>Číslo přihlášky:</strong> ${record.id}<br/>
  <strong>Částka:</strong> ${record.amountCzk} Kč (${site.pricing.vatNote})</p>
  <p>Variabilní symbol pro bankovní převod: <strong>${vs}</strong></p>
  <p>Platební údaje a případná online platba: <a href="${link}">${link}</a></p>
  <p>S pozdravem,<br/>${site.shortName}</p>
</body>
</html>`.trim();
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

  if (!apiKey || !from) {
    console.info(
      "[email] RESEND není nastaven — potvrzení by šlo na:",
      record.parentEmail,
      "přihláška:",
      record.id,
    );
    return { ok: true, provider: "skipped", reason: "no_api_key" };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [record.parentEmail],
      subject: `Potvrzení přihlášky — ${site.shortName}`,
      html: buildHtml(record),
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    return { ok: false, error: `Resend ${res.status}: ${text}` };
  }

  return { ok: true, provider: "resend" };
}
