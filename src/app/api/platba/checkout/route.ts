import { NextResponse } from "next/server";
import { z } from "zod";
import { rejectOversizedJsonBody } from "@/lib/json-body-limit";
import { createCheckoutSession } from "@/lib/payment";
import { rateLimitResponse } from "@/lib/rate-limit";
import {
  isRegistrationUuidLookup,
  isShortRegistrationCodeLookup,
} from "@/lib/registration-code";
import { findRegistrationById } from "@/lib/registrations-store";

const bodySchema = z.object({
  registrationId: z
    .string()
    .min(5)
    .max(36)
    .refine(
      (s) =>
        isRegistrationUuidLookup(s) || isShortRegistrationCodeLookup(s),
      "Neplatné ID přihlášky.",
    ),
});

export async function POST(request: Request) {
  const tooLarge = rejectOversizedJsonBody(request);
  if (tooLarge) return tooLarge;

  const limited = await rateLimitResponse(request, "checkout");
  if (limited) return limited;

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Neplatný JSON." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Neplatné ID přihlášky." }, { status: 422 });
  }

  const reg = await findRegistrationById(parsed.data.registrationId);
  if (!reg) {
    return NextResponse.json(
      {
        error:
          "Přihlášku se nepodařilo dohledat v tomto prostředí. Použijte platební instrukce z e-mailu nebo nás kontaktujte.",
        code: "REGISTRATION_NOT_FOUND",
      },
      { status: 404 },
    );
  }

  const session = await createCheckoutSession({
    product: reg.paymentProduct,
    registrationId: reg.id,
    customerEmail: reg.parentEmail,
    amountCzk: reg.amountCzk,
  });

  if (!session) {
    return NextResponse.json(
      {
        error:
          "Online platba zatím není aktivní. Použijte bankovní převod podle údajů na této stránce.",
        code: "CHECKOUT_NOT_CONFIGURED",
      },
      { status: 503 },
    );
  }

  return NextResponse.json({ url: session.url });
}
