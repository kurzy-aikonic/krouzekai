import { appendFile, mkdir } from "fs/promises";
import path from "path";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export type RegistrationPayload = Record<string, unknown>;

/**
 * Uloží přihlášku: webhook, nebo Supabase (Vercel), nebo append do JSONL (lokálně / VPS).
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

  const supabase = getSupabaseAdmin();
  if (supabase) {
    const receivedAt = new Date().toISOString();
    const withMeta: RegistrationPayload = { ...payload, receivedAt };
    const id =
      typeof withMeta.id === "string" ? String(withMeta.id).trim() : "";
    if (!id) {
      throw new Error("Chybí id přihlášky pro uložení do Supabase.");
    }
    const { error } = await supabase.from("web_registrations").insert({
      id,
      payload: withMeta,
      updated_at: receivedAt,
    });
    if (error) {
      throw new Error(error.message);
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
