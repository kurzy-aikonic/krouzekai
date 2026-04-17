import { apiJson } from "@/lib/api-response";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function POST() {
  const res = apiJson({ ok: true });
  res.cookies.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
    path: "/",
    priority: "high",
  });
  return res;
}
