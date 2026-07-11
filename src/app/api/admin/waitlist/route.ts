import { apiJson } from "@/lib/api-response";
import { getAdminSecret, verifyAdminRequest } from "@/lib/admin-auth";
import { listWaitlistEntries } from "@/lib/waitlist-store";
import { rateLimitResponse } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const limited = await rateLimitResponse(request, "adminApi");
  if (limited) return limited;

  if (!getAdminSecret()) {
    return apiJson({ error: "ADMIN_SECRET není nastaven." }, { status: 503 });
  }
  if (!verifyAdminRequest(request)) {
    return apiJson({ error: "Neautorizováno." }, { status: 401 });
  }

  const items = await listWaitlistEntries();
  return apiJson({ ok: true, items });
}
