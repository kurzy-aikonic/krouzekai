import { z } from "zod";
import { apiJson } from "@/lib/api-response";
import { getAdminActorFromRequest, getAdminSecret, verifyAdminRequest } from "@/lib/admin-auth";
import {
  appendRegistrationEmailLog,
  bulkUpdateRegistrationStatus,
} from "@/lib/registrations-store";
import { getPublicRegistrationCode } from "@/lib/registration-code";
import { sendRegistrationStatusChangeNotice } from "@/lib/email";
import { rateLimitResponse } from "@/lib/rate-limit";
import { registrationStatuses, registrationStatusLabelsCs } from "@/types/registration";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  /** Veřejné kódy přihlášek a/nebo technická UUID. */
  lookups: z.array(z.string().min(1).max(120)).min(1).max(150),
  status: z.enum(registrationStatuses),
  /** Volitelně poslat rodičům e-mail o změně stavu (u každé změněné přihlášky). */
  sendEmails: z.boolean().optional().default(false),
});

export async function POST(request: Request) {
  const limited = await rateLimitResponse(request, "adminApi");
  if (limited) return limited;

  if (!getAdminSecret()) {
    return apiJson({ error: "ADMIN_SECRET není nastaven." }, { status: 503 });
  }
  if (!verifyAdminRequest(request)) {
    return apiJson({ error: "Neautorizováno." }, { status: 401 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return apiJson({ error: "Neplatný JSON." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return apiJson(
      { error: "Neplatná data.", details: parsed.error.flatten() },
      { status: 422 },
    );
  }

  try {
    const actor = getAdminActorFromRequest(request);
    const result = await bulkUpdateRegistrationStatus(
      parsed.data.lookups,
      parsed.data.status,
      { actor },
    );

    let emailsSent = 0;
    let emailsFailed = 0;
    if (parsed.data.sendEmails && result.changed.length > 0) {
      for (const { record, previousStatus } of result.changed) {
        const mail = await sendRegistrationStatusChangeNotice(
          record,
          previousStatus,
        );
        if (mail.ok) emailsSent += 1;
        else emailsFailed += 1;
        await appendRegistrationEmailLog(getPublicRegistrationCode(record), {
          kind: "bulk_status_change",
          to: record.parentEmail,
          ok: mail.ok,
          actor,
          note: mail.ok
            ? registrationStatusLabelsCs[record.status]
            : "error" in mail
              ? mail.error
              : "chyba",
        });
      }
    }

    return apiJson({
      ok: true,
      ...result,
      emailsSent: parsed.data.sendEmails ? emailsSent : undefined,
      emailsFailed: parsed.data.sendEmails ? emailsFailed : undefined,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Chyba úložiště.";
    if (msg.includes("REGISTRATIONS_WEBHOOK_URL")) {
      return apiJson(
        {
          error:
            "Hromadná úprava není v tomto režimu dostupná.",
        },
        { status: 409 },
      );
    }
    console.error(e);
    return apiJson({ error: "Nepodařilo se uložit." }, { status: 500 });
  }
}
