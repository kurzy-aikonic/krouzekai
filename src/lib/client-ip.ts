/** Nejlepší odhad klienta za reverse proxy (Vercel, nginx). */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first.length > 0) return first.slice(0, 64);
  }
  const real = request.headers.get("x-real-ip")?.trim();
  if (real && real.length > 0) return real.slice(0, 64);
  return "unknown";
}
