/**
 * Server-side ověření Cloudflare Turnstile.
 * @see https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
 */
type SiteverifyResponse = {
  success?: boolean;
  "error-codes"?: string[];
};

export async function verifyTurnstileToken(
  token: string,
  remoteIp: string | undefined,
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  if (!secret) return true;

  const trimmed = token.trim();
  if (!trimmed) return false;

  const body = new URLSearchParams();
  body.set("secret", secret);
  body.set("response", trimmed);
  if (remoteIp && remoteIp !== "unknown") {
    body.set("remoteip", remoteIp);
  }

  const res = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
      signal: AbortSignal.timeout(10_000),
    },
  );

  const json = (await res.json()) as SiteverifyResponse;
  if (json.success === true) return true;

  if (process.env.NODE_ENV === "development" && json["error-codes"]?.length) {
    console.warn("[turnstile]", json["error-codes"].join(", "));
  }
  return false;
}

export function turnstileVerificationRequired(): boolean {
  return Boolean(process.env.TURNSTILE_SECRET_KEY?.trim());
}
