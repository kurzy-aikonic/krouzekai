import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSecret, verifyAdminRequest } from "@/lib/admin-auth";
import { bulkUpdateRegistrationStatus } from "@/lib/registrations-store";
import { registrationStatuses } from "@/types/registration";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  /** Veřejné kódy přihlášek a/nebo technická UUID. */
  lookups: z.array(z.string().min(1).max(120)).min(1).max(150),
  status: z.enum(registrationStatuses),
});

export async function POST(request: Request) {
  if (!getAdminSecret()) {
    return NextResponse.json(
      { error: "ADMIN_SECRET není nastaven." },
      { status: 503 },
    );
  }
  if (!verifyAdminRequest(request)) {
    return NextResponse.json({ error: "Neautorizováno." }, { status: 401 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Neplatný JSON." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Neplatná data.", details: parsed.error.flatten() },
      { status: 422 },
    );
  }

  try {
    const result = await bulkUpdateRegistrationStatus(
      parsed.data.lookups,
      parsed.data.status,
    );
    return NextResponse.json({
      ok: true,
      ...result,
      /** Hromadná změna neposílá e-maily rodičům (jinak než úprava jednoho záznamu). */
      emailsSkipped: true,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Chyba úložiště.";
    if (msg.includes("REGISTRATIONS_WEBHOOK_URL")) {
      return NextResponse.json(
        {
          error:
            "Hromadná úprava není k dispozici: přihlášky jdou jen na webhook (bez lokálního JSONL).",
        },
        { status: 409 },
      );
    }
    console.error(e);
    return NextResponse.json({ error: "Nepodařilo se uložit." }, { status: 500 });
  }
}
