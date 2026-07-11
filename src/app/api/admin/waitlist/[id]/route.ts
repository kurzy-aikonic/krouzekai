import { z } from "zod";
import { apiJson } from "@/lib/api-response";
import { getAdminSecret, verifyAdminRequest } from "@/lib/admin-auth";
import { rateLimitResponse } from "@/lib/rate-limit";
import { updateWaitlistEntryStatus } from "@/lib/waitlist-store";
import { waitlistStatuses } from "@/types/waitlist";

export const dynamic = "force-dynamic";

const patchSchema = z.object({
  status: z.enum(waitlistStatuses).optional(),
  internalNotes: z.string().max(4000).optional(),
});

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
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

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return apiJson({ error: "Neplatný JSON." }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(json);
  if (!parsed.success) {
    return apiJson(
      { error: "Neplatná data.", details: parsed.error.flatten() },
      { status: 422 },
    );
  }
  if (Object.keys(parsed.data).length === 0) {
    return apiJson({ error: "Prázdná úprava." }, { status: 422 });
  }

  try {
    const updated = await updateWaitlistEntryStatus(
      id,
      parsed.data.status,
      parsed.data.internalNotes,
    );
    if (!updated) {
      return apiJson({ error: "Záznam nenalezen." }, { status: 404 });
    }
    return apiJson({ ok: true, item: updated });
  } catch (e) {
    console.error(e);
    return apiJson({ error: "Nepodařilo se uložit." }, { status: 500 });
  }
}
