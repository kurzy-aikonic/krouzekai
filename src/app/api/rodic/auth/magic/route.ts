import { apiRedirect } from "@/lib/api-response";
import {
  PARENT_SESSION_COOKIE,
  parentAuthSecretConfigured,
  signSessionValue,
  verifyMagicToken,
} from "@/lib/parent-auth";
import { rateLimitResponse } from "@/lib/rate-limit";
import { site } from "@/lib/site-config";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const limited = await rateLimitResponse(request, "rodicMagicConsume");
  if (limited) return limited;

  if (!parentAuthSecretConfigured()) {
    return apiRedirect(new URL("/rodic/prihlaseni", site.baseUrl));
  }

  const url = new URL(request.url);
  const token = url.searchParams.get("token")?.trim() ?? "";
  const email = verifyMagicToken(token);

  const failRedirect = apiRedirect(
    new URL("/rodic/prihlaseni?chyba=odkaz", site.baseUrl),
  );

  if (!email) {
    return failRedirect;
  }

  const session = signSessionValue(email);
  const ok = apiRedirect(new URL("/rodic", site.baseUrl));
  ok.cookies.set(PARENT_SESSION_COOKIE, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
    priority: "high",
  });
  return ok;
}
