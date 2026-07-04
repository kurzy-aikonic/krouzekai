import { z } from "zod";
import { apiJson } from "@/lib/api-response";
import { getAdminSecret, verifyAdminRequest } from "@/lib/admin-auth";
import {
  coursePricingPersistenceMode,
  coursePricingPutSchema,
  getCoursePricing,
  replaceCoursePricing,
} from "@/lib/course-pricing-store";
import { rateLimitResponse } from "@/lib/rate-limit";
import { revalidatePath } from "next/cache";

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

  const pricing = await getCoursePricing();
  return apiJson({
    ok: true,
    pricing,
    storage: coursePricingPersistenceMode(),
  });
}

export async function PUT(request: Request) {
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

  const parsed = coursePricingPutSchema.safeParse(json);
  if (!parsed.success) {
    return apiJson(
      { error: "Neplatná data.", details: parsed.error.flatten() },
      { status: 422 },
    );
  }

  try {
    const pricing = await replaceCoursePricing(parsed.data);
    revalidatePath("/");
    revalidatePath("/registrace");
    revalidatePath("/faq");
    revalidatePath("/obchodni-podminky");
    revalidatePath("/platba");
    revalidatePath("/jak-probiha");
    return apiJson({
      ok: true,
      pricing,
      storage: coursePricingPersistenceMode(),
    });
  } catch (e) {
    console.error(e);
    return apiJson({ error: "Nepodařilo se uložit ceny." }, { status: 500 });
  }
}
