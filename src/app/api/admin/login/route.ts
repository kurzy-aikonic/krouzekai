import { z } from "zod";
import { apiJson } from "@/lib/api-response";
import {
  ADMIN_SESSION_COOKIE,
  constantTimeEqual,
  getAdminSecret,
  signAdminSession,
} from "@/lib/admin-auth";
import { rateLimitResponse } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  secret: z.string().min(1).max(500),
});

export async function POST(request: Request) {
  const limited = await rateLimitResponse(request, "adminLogin");
  if (limited) return limited;

  const secret = getAdminSecret();
  if (!secret) {
    return apiJson(
      { error: "ADMIN_SECRET není nastaven (min. 16 znaků)." },
      { status: 503 },
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return apiJson({ error: "Neplatný JSON." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return apiJson({ error: "Neplatný vstup." }, { status: 422 });
  }

  if (!constantTimeEqual(parsed.data.secret, secret)) {
    return apiJson({ error: "Neplatné přihlášení." }, { status: 401 });
  }

  const session = signAdminSession();
  if (!session) {
    return apiJson(
      { error: "ADMIN_SECRET není nastaven (min. 16 znaků)." },
      { status: 503 },
    );
  }

  const res = apiJson({ ok: true });
  res.cookies.set(ADMIN_SESSION_COOKIE, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
    priority: "high",
  });
  return res;
}
