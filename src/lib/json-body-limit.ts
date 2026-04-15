import { NextResponse } from "next/server";

const MAX_BYTES = 32 * 1024;

/** Odmítne příliš velké JSON tělo dřív, než se načte do paměti (když klient pošle Content-Length). */
export function rejectOversizedJsonBody(request: Request): NextResponse | null {
  const raw = request.headers.get("content-length");
  if (raw == null) return null;
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 0) {
    return NextResponse.json({ error: "Neplatná hlavička požadavku." }, { status: 400 });
  }
  if (n > MAX_BYTES) {
    return NextResponse.json(
      { error: "Tělo požadavku je příliš velké." },
      { status: 413 },
    );
  }
  return null;
}
