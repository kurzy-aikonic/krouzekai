import {
  ADMIN_SESSION_COOKIE,
  adminSecretConfigured,
  signAdminSession,
  verifyAdminMagicToken,
} from "@/lib/admin-auth";
import { apiRedirect } from "@/lib/api-response";
import { rateLimitResponse } from "@/lib/rate-limit";
import { site } from "@/lib/site-config";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const limited = await rateLimitResponse(request, "adminMagicConsume");
  if (limited) return limited;

  if (!adminSecretConfigured()) {
    return apiRedirect(new URL("/admin/login", site.baseUrl));
  }

  const url = new URL(request.url);
  const token = url.searchParams.get("token")?.trim() ?? "";
  const email = verifyAdminMagicToken(token);

  const failRedirect = apiRedirect(
    new URL("/admin/login?chyba=odkaz", site.baseUrl),
  );

  if (!email) {
    return failRedirect;
  }

  const session = signAdminSession(email);
  if (!session) {
    return failRedirect;
  }

  const ok = apiRedirect(new URL("/admin", site.baseUrl));
  ok.cookies.set(ADMIN_SESSION_COOKIE, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
    priority: "high",
  });
  return ok;
}
