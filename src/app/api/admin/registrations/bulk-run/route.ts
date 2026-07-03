import { z } from "zod";
import { apiJson } from "@/lib/api-response";
import { getAdminActorFromRequest, getAdminSecret, verifyAdminRequest } from "@/lib/admin-auth";
import { bulkUpdateRegistrationRunId } from "@/lib/registrations-store";
import { rateLimitResponse } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  lookups: z.array(z.string().min(1).max(120)).min(1).max(150),
  runId: z.union([z.string().min(1).max(120), z.null()]),
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
    const result = await bulkUpdateRegistrationRunId(
      parsed.data.lookups,
      parsed.data.runId,
      { actor },
    );
    return apiJson({ ok: true, ...result });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Chyba úložiště.";
    if (msg.includes("REGISTRATIONS_WEBHOOK_URL")) {
      return apiJson(
        { error: "Hromadná úprava není v tomto režimu dostupná." },
        { status: 409 },
      );
    }
    if (msg.includes("Neplatný") || msg.includes("Termín")) {
      return apiJson({ error: msg }, { status: 422 });
    }
    console.error(e);
    return apiJson({ error: "Nepodařilo se uložit." }, { status: 500 });
  }
}
