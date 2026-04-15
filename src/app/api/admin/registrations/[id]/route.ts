import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSecret, verifyAdminRequest } from "@/lib/admin-auth";
import {
  findRegistrationById,
  updateRegistration,
} from "@/lib/registrations-store";
import { sendRegistrationStatusChangeNotice } from "@/lib/email";
import { registrationStatuses } from "@/types/registration";

export const dynamic = "force-dynamic";

const patchSchema = z.object({
  status: z.enum(registrationStatuses).optional(),
  internalNotes: z.string().max(12_000).optional(),
  runId: z.union([z.string().min(1).max(120), z.null()]).optional(),
});

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  if (!getAdminSecret()) {
    return NextResponse.json(
      { error: "ADMIN_SECRET není nastaven." },
      { status: 503 },
    );
  }
  if (!verifyAdminRequest(request)) {
    return NextResponse.json({ error: "Neautorizováno." }, { status: 401 });
  }

  const { id } = await context.params;
  if (!id) {
    return NextResponse.json({ error: "Chybí id." }, { status: 400 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Neplatný JSON." }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Neplatná data.", details: parsed.error.flatten() },
      { status: 422 },
    );
  }

  if (Object.keys(parsed.data).length === 0) {
    return NextResponse.json({ error: "Prázdná úprava." }, { status: 422 });
  }

  const existing = await findRegistrationById(id);
  if (!existing) {
    return NextResponse.json({ error: "Přihláška nenalezena." }, { status: 404 });
  }

  try {
    const updated = await updateRegistration(id, parsed.data);
    if (!updated) {
      return NextResponse.json({ error: "Přihláška nenalezena." }, { status: 404 });
    }
    if (
      parsed.data.status !== undefined &&
      existing.status !== updated.status
    ) {
      void sendRegistrationStatusChangeNotice(updated, existing.status).then(
        (r) => {
          if (!r.ok && "error" in r) {
            console.error("[email] změna stavu přihlášky", r.error);
          }
        },
      );
    }
    return NextResponse.json({ ok: true, item: updated });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Chyba úložiště.";
    if (msg.includes("REGISTRATIONS_WEBHOOK_URL")) {
      return NextResponse.json(
        {
          error:
            "Úpravy nejsou k dispozici: přihlášky jdou jen na webhook (bez lokálního JSONL).",
        },
        { status: 409 },
      );
    }
    if (msg.includes("Neplatný") || msg.includes("Termín")) {
      return NextResponse.json({ error: msg }, { status: 422 });
    }
    console.error(e);
    return NextResponse.json({ error: "Nepodařilo se uložit." }, { status: 500 });
  }
}
