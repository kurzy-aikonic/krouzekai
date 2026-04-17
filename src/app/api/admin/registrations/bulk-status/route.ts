import { z } from "zod";
import { apiJson } from "@/lib/api-response";
import { getAdminSecret, verifyAdminRequest } from "@/lib/admin-auth";
import { bulkUpdateRegistrationStatus } from "@/lib/registrations-store";
import { rateLimitResponse } from "@/lib/rate-limit";
import { registrationStatuses } from "@/types/registration";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  /** Veřejné kódy přihlášek a/nebo technická UUID. */
  lookups: z.array(z.string().min(1).max(120)).min(1).max(150),
  status: z.enum(registrationStatuses),
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
    const result = await bulkUpdateRegistrationStatus(
      parsed.data.lookups,
      parsed.data.status,
    );
    return apiJson({
      ok: true,
      ...result,
      /** Hromadná změna neposílá e-maily rodičům (jinak než úprava jednoho záznamu). */
      emailsSkipped: true,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Chyba úložiště.";
    if (msg.includes("REGISTRATIONS_WEBHOOK_URL")) {
      return apiJson(
        {
          error:
            "Hromadná úprava není k dispozici: přihlášky jdou jen na webhook (bez lokálního JSONL).",
        },
        { status: 409 },
      );
    }
    console.error(e);
    return apiJson({ error: "Nepodařilo se uložit." }, { status: 500 });
  }
}
