import { apiJson } from "@/lib/api-response";
import { getAdminActorFromRequest, getAdminSecret, verifyAdminRequest } from "@/lib/admin-auth";
import { sendRegistrationConfirmation } from "@/lib/email";
import {
  appendRegistrationAdminHistory,
  appendRegistrationEmailLog,
  findRegistrationById,
} from "@/lib/registrations-store";
import { rateLimitResponse } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: RouteContext) {
  const limited = await rateLimitResponse(request, "adminApi");
  if (limited) return limited;

  if (!getAdminSecret()) {
    return apiJson({ error: "ADMIN_SECRET není nastaven." }, { status: 503 });
  }
  if (!verifyAdminRequest(request)) {
    return apiJson({ error: "Neautorizováno." }, { status: 401 });
  }

  const { id } = await context.params;
  if (!id) {
    return apiJson({ error: "Chybí id." }, { status: 400 });
  }

  const record = await findRegistrationById(id);
  if (!record) {
    return apiJson({ error: "Přihláška nenalezena." }, { status: 404 });
  }

  const actor = getAdminActorFromRequest(request);
  const result = await sendRegistrationConfirmation(record);
  if (!result.ok) {
    await appendRegistrationEmailLog(id, {
      kind: "resend_confirmation",
      to: record.parentEmail,
      ok: false,
      actor,
      note: "error" in result ? result.error : "chyba",
    });
    return apiJson(
      { error: "error" in result ? result.error : "Odeslání se nezdařilo." },
      { status: 502 },
    );
  }
  if (result.provider === "skipped") {
    return apiJson(
      {
        error:
          "Odesílání e-mailů není nakonfigurované. Kontaktujte správce webu.",
      },
      { status: 503 },
    );
  }

  await appendRegistrationEmailLog(id, {
    kind: "resend_confirmation",
    to: record.parentEmail,
    ok: true,
    actor,
  });

  await appendRegistrationAdminHistory(id, {
    actor,
    action: "registration.resend_confirmation",
    summary: "znovu odesláno potvrzení přihlášky",
  });

  return apiJson({
    ok: true,
    message: `Potvrzení odesláno na ${record.parentEmail}.`,
  });
}
