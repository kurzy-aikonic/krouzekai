import { NextResponse } from "next/server";

/** Jednotné hlavičky pro API — bez cache ve sdílených proxy/CDN. */
const NO_STORE = {
  "Cache-Control": "no-store, max-age=0, must-revalidate",
  Pragma: "no-cache",
} as const;

export type ApiJsonInit = {
  status?: number;
  headers?: HeadersInit;
};

/**
 * JSON odpověď z Route Handleru s `Cache-Control: no-store`.
 * Používej pro všechny `/api/*` výstupy (včetně chyb).
 */
export function apiJson(data: unknown, init?: ApiJsonInit): NextResponse {
  const headers = new Headers(init?.headers);
  headers.set("Cache-Control", NO_STORE["Cache-Control"]);
  headers.set("Pragma", NO_STORE["Pragma"]);
  return NextResponse.json(data, {
    status: init?.status ?? 200,
    headers,
  });
}

type ApiRedirectInit = {
  status?: number;
};

/** Přesměrování z API s `no-store` (magic odkazy, odhlášení). */
export function apiRedirect(
  url: string | URL,
  init?: ApiRedirectInit,
): NextResponse {
  const res = NextResponse.redirect(url, init?.status ?? 302);
  res.headers.set("Cache-Control", NO_STORE["Cache-Control"]);
  res.headers.set("Pragma", NO_STORE["Pragma"]);
  return res;
}
