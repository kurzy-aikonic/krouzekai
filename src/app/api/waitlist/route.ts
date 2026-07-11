import { randomUUID } from "crypto";
import { z } from "zod";
import { apiJson } from "@/lib/api-response";
import { getClientIp } from "@/lib/client-ip";
import { getCourseRunById } from "@/lib/course-runs-store";
import { sendWaitlistConfirmation } from "@/lib/email";
import { rejectOversizedJsonBody } from "@/lib/json-body-limit";
import { createWaitlistEntry } from "@/lib/waitlist-store";
import { rateLimitResponse } from "@/lib/rate-limit";
import {
  turnstileVerificationRequired,
  verifyTurnstileToken,
} from "@/lib/turnstile-verify";
import type { WaitlistEntry } from "@/types/waitlist";

const bodySchema = z.object({
  format: z.enum(["skupina", "individual"]),
  runId: z.string().min(1).max(120).optional().nullable(),
  childName: z.string().max(200).optional().default(""),
  childAge: z.coerce
    .number()
    .int()
    .min(0)
    .max(120)
    .optional()
    .nullable(),
  parentName: z.string().min(1).max(200),
  parentEmail: z.string().email().max(320),
  parentPhone: z.string().max(40).optional().default(""),
  note: z.string().max(1000).optional().default(""),
  consentPrivacy: z.literal(true),
  /** Honeypot — musí zůstat prázdné. */
  formHoney: z.preprocess(
    (raw) => (raw === null || raw === undefined ? "" : raw),
    z.string().max(0),
  ),
  turnstileToken: z.string().max(4000).optional().default(""),
});

export async function POST(request: Request) {
  const tooLarge = rejectOversizedJsonBody(request);
  if (tooLarge) return tooLarge;

  const limited = await rateLimitResponse(request, "waitlist");
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

  const run = data.runId ? await getCourseRunById(data.runId) : undefined;

  const entry: WaitlistEntry = {
    id: randomUUID(),
    format: data.format,
    runId: data.runId ?? null,
    runLabel: run?.label,
    childName: data.childName.trim() || undefined,
    childAge:
      typeof data.childAge === "number" && Number.isFinite(data.childAge)
        ? data.childAge
        : undefined,
    parentName: data.parentName,
    parentEmail: data.parentEmail,
    parentPhone: data.parentPhone.trim() || undefined,
    note: data.note.trim() || undefined,
    consentPrivacy: data.consentPrivacy,
    status: "nova",
  };

  try {
    await createWaitlistEntry(entry);
  } catch (e) {
    console.error(e);
    return apiJson(
      { error: "Nepodařilo se uložit záznam. Zkuste to znovu, nebo nám napište." },
      { status: 500 },
    );
  }

  const sent = await sendWaitlistConfirmation(entry);
  if (!sent.ok) {
    console.error("[email][waitlist]", sent.error);
  }

  return apiJson(
    {
      ok: true,
      message:
        "Zapsali jsme vás do čekací listiny. Ozveme se, jakmile se uvolní místo nebo otevřeme nový termín.",
    },
    { status: 201 },
  );
}

export function GET() {
  return apiJson({ error: "Metoda nepodporována." }, { status: 405 });
}
