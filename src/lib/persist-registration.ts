import { appendFile, mkdir } from "fs/promises";
import path from "path";

export type RegistrationPayload = Record<string, unknown>;

/**
 * Uloží přihlášku: webhook (doporučeno v produkci) nebo append do JSONL (dev / VPS).
 */
const WEBHOOK_TIMEOUT_MS = 15_000;

export async function persistRegistration(
  payload: RegistrationPayload,
): Promise<void> {
  const webhook = process.env.REGISTRATIONS_WEBHOOK_URL;
  if (webhook) {
    const secret = process.env.REGISTRATIONS_WEBHOOK_SECRET;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (secret) {
      headers.Authorization = `Bearer ${secret}`;
    }
    const res = await fetch(webhook, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(WEBHOOK_TIMEOUT_MS),
    });
    if (!res.ok) {
      throw new Error(`Webhook odpověděl ${res.status}`);
    }
    return;
  }

  const dir = path.join(process.cwd(), "data");
  const file = path.join(dir, "registrations.jsonl");
  await mkdir(dir, { recursive: true });
  const line =
    JSON.stringify({ ...payload, receivedAt: new Date().toISOString() }) +
    "\n";
  await appendFile(file, line, "utf-8");
}
