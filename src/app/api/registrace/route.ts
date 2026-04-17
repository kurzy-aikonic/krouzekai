import { randomUUID } from "crypto";
import { z } from "zod";
import { apiJson } from "@/lib/api-response";
import { getClientIp } from "@/lib/client-ip";
import { spotsLeftEffective } from "@/data/course-runs";
import { countedOccupancyForRun } from "@/lib/course-run-registrations";
import { getCourseRunById } from "@/lib/course-runs-store";
import { sendRegistrationConfirmation } from "@/lib/email";
import { rejectOversizedJsonBody } from "@/lib/json-body-limit";
import { coursePriceCzk, productFromFormat } from "@/lib/payment";
import { persistRegistration } from "@/lib/persist-registration";
import { pickUniqueRegistrationCode } from "@/lib/registration-code";
import { listRegistrationsMerged } from "@/lib/registrations-store";
import { rateLimitResponse } from "@/lib/rate-limit";
import { site } from "@/lib/site-config";
import {
  turnstileVerificationRequired,
  verifyTurnstileToken,
} from "@/lib/turnstile-verify";
import type { RegistrationRecord } from "@/types/registration";

const bodySchema = z.object({
  format: z.enum(["skupina", "individual"]),
  runId: z.string().min(1).optional().nullable(),
  childName: z.string().min(1).max(200),
  childAge: z.coerce
    .number()
    .int()
    .min(site.audience.ageMin)
    .max(site.audience.ageMax),
  parentName: z.string().min(1).max(200),
  parentEmail: z.string().email().max(320),
  parentPhone: z.string().min(9).max(40),
  consentTerms: z.literal(true),
  consentPrivacy: z.literal(true),
  /** Honeypot — musí zůstat prázdné (proti botům). Nepoužívat název „company“ / „Firma“ — autofill by ho vyplnil. */
  formHoney: z.preprocess(
    (raw) => (raw === null || raw === undefined ? "" : raw),
    z.string().max(0),
  ),
  /** Cloudflare Turnstile — povinné, pokud je nastaven TURNSTILE_SECRET_KEY. */
  turnstileToken: z.string().max(4000).optional().default(""),
});

export async function POST(request: Request) {
  const tooLarge = rejectOversizedJsonBody(request);
  if (tooLarge) return tooLarge;

  const limited = await rateLimitResponse(request, "registrace");
  if (limited) return limited;

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return apiJson({ error: "Neplatný JSON." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return apiJson(
      {
        error: "Zkontrolujte vyplněné údaje.",
        ...(process.env.NODE_ENV === "development"
          ? { details: parsed.error.flatten() }
          : {}),
      },
      { status: 422 },
    );
  }

  const { formHoney: _formHoney, turnstileToken, ...data } = parsed.data;
  void _formHoney;

  if (turnstileVerificationRequired()) {
    const ip = getClientIp(request);
    const ok = await verifyTurnstileToken(turnstileToken, ip);
    if (!ok) {
      return apiJson(
        {
          error:
            "Ověření proti robotům se nepodařilo. Obnovte stránku a zkuste to znovu.",
        },
        { status: 400 },
      );
    }
  }

  const merged = await listRegistrationsMerged();

  if (data.runId) {
    const run = await getCourseRunById(data.runId);
    if (!run || run.active === false) {
      return apiJson(
        { error: "Tento termín není v nabídce nebo byl zrušen." },
        { status: 422 },
      );
    }
    if (run.format !== data.format) {
      return apiJson(
        { error: "Vybraný termín neodpovídá zvolenému formátu kurzu." },
        { status: 422 },
      );
    }
    const occupied = countedOccupancyForRun(data.runId, data.format, merged);
    if (spotsLeftEffective(run, occupied) <= 0) {
      return apiJson({ error: "Tento termín je již plný." }, { status: 409 });
    }
  }

  const id = randomUUID();
  const registrationCode = pickUniqueRegistrationCode(merged);
  const paymentProduct = productFromFormat(data.format);
  const amountCzk = coursePriceCzk(paymentProduct);

  const record: RegistrationRecord = {
    id,
    registrationCode,
    format: data.format,
    runId: data.runId ?? null,
    childName: data.childName,
    childAge: data.childAge,
    parentName: data.parentName,
    parentEmail: data.parentEmail,
    parentPhone: data.parentPhone,
    consentTerms: data.consentTerms,
    consentPrivacy: data.consentPrivacy,
    paymentProduct,
    amountCzk,
    status: "nova",
  };

  try {
    await persistRegistration(record);
  } catch (e) {
    console.error(e);
    return apiJson(
      { error: "Nepodařilo se uložit přihlášku. Zkuste to znovu." },
      { status: 500 },
    );
  }

  sendRegistrationConfirmation(record).then((r) => {
    if (!r.ok) console.error("[email]", r.error);
  });

  const paymentPath = `/platba?registrace=${encodeURIComponent(registrationCode)}`;

  return apiJson(
    {
      ok: true,
      registrationId: id,
      registrationCode,
      paymentUrl: paymentPath,
      amountCzk,
      message:
        "Děkujeme za přihlášku. Ozveme se vám, domluvíme detaily a pak zašleme fakturu. V e-mailu najdete i odkaz na orientační přehled k platbě.",
    },
    { status: 201 },
  );
}
