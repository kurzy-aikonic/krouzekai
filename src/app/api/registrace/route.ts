import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getRunById, spotsLeft } from "@/data/course-runs";
import { sendRegistrationConfirmation } from "@/lib/email";
import { coursePriceCzk, productFromFormat } from "@/lib/payment";
import { persistRegistration } from "@/lib/persist-registration";
import type { RegistrationRecord } from "@/types/registration";

const bodySchema = z.object({
  format: z.enum(["skupina", "individual"]),
  runId: z.string().min(1).optional().nullable(),
  childName: z.string().min(1).max(200),
  childAge: z.coerce.number().int().min(10).max(15),
  parentName: z.string().min(1).max(200),
  parentEmail: z.string().email().max(320),
  parentPhone: z.string().min(9).max(40),
  consentTerms: z.literal(true),
  consentPrivacy: z.literal(true),
});

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Neplatný JSON." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Zkontrolujte vyplněné údaje.", details: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const data = parsed.data;

  if (data.format === "skupina") {
    if (!data.runId) {
      return NextResponse.json(
        { error: "Vyberte termín skupiny." },
        { status: 422 },
      );
    }
    const run = getRunById(data.runId);
    if (!run) {
      return NextResponse.json({ error: "Neplatný termín." }, { status: 422 });
    }
    if (spotsLeft(run) <= 0) {
      return NextResponse.json(
        { error: "Tento termín je již plný." },
        { status: 409 },
      );
    }
  }

  const id = randomUUID();
  const paymentProduct = productFromFormat(data.format);
  const amountCzk = coursePriceCzk(paymentProduct);

  const record: RegistrationRecord = {
    id,
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
  };

  try {
    await persistRegistration(record);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Nepodařilo se uložit přihlášku. Zkuste to znovu." },
      { status: 500 },
    );
  }

  sendRegistrationConfirmation(record).then((r) => {
    if (!r.ok) console.error("[email]", r.error);
  });

  const paymentPath = `/platba?registrace=${encodeURIComponent(id)}`;

  return NextResponse.json(
    {
      ok: true,
      registrationId: id,
      paymentUrl: paymentPath,
      amountCzk,
      message:
        "Děkujeme za přihlášku. Pokračujte k platbě nebo vyčkejte na e-mail s instrukcemi.",
    },
    { status: 201 },
  );
}
