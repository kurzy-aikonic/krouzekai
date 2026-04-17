import { apiJson } from "@/lib/api-response";
import { PARENT_SESSION_COOKIE } from "@/lib/parent-auth";

export const dynamic = "force-dynamic";

export async function POST() {
  const res = apiJson({ ok: true });
  res.cookies.set(PARENT_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
    priority: "high",
  });
  return res;
}
