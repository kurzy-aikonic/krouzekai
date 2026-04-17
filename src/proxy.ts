import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { apiJson } from "@/lib/api-response";

const STATE_CHANGING = new Set(["POST", "PUT", "PATCH", "DELETE"]);

function sameOrigin(request: NextRequest, originHeader: string): boolean {
  try {
    const origin = new URL(originHeader);
    return origin.host === request.nextUrl.host;
  } catch {
    return false;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith("/api/")) return NextResponse.next();
  if (!STATE_CHANGING.has(request.method)) return NextResponse.next();

  const origin = request.headers.get("origin");
  if (origin && !sameOrigin(request, origin)) {
    return apiJson({ error: "Cross-site request blocked." }, { status: 403 });
  }

  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite === "cross-site") {
    return apiJson({ error: "Cross-site request blocked." }, { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
