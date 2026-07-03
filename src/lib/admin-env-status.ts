import { adminEmailsConfigured, adminSecretConfigured } from "@/lib/admin-auth";
import { getCourseRunsDataSource } from "@/lib/course-runs-store";
import { isRegistrationsJsonlWritable } from "@/lib/registrations-store";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export type AdminEnvCheck = {
  id: string;
  label: string;
  ok: boolean;
  detail: string;
};

export async function getAdminEnvChecks(): Promise<AdminEnvCheck[]> {
  const checks: AdminEnvCheck[] = [];

  checks.push({
    id: "admin_secret",
    label: "Admin přihlášení",
    ok: adminSecretConfigured(),
    detail: adminSecretConfigured()
      ? adminEmailsConfigured()
        ? "Tajný klíč + magic link pro ADMIN_EMAILS"
        : "Tajný klíč (bez magic linku)"
      : "ADMIN_SECRET chybí nebo je krátký",
  });

  const resendOk =
    Boolean(process.env.RESEND_API_KEY?.trim()) &&
    Boolean(process.env.RESEND_FROM_EMAIL?.trim());
  checks.push({
    id: "resend",
    label: "E-maily (Resend)",
    ok: resendOk,
    detail: resendOk
      ? `Odesílatel ${process.env.RESEND_FROM_EMAIL?.trim()}`
      : "RESEND_API_KEY nebo RESEND_FROM_EMAIL chybí",
  });

  checks.push({
    id: "site_url",
    label: "Odkazy v e-mailech",
    ok: Boolean(process.env.NEXT_PUBLIC_SITE_URL?.trim()),
    detail: process.env.NEXT_PUBLIC_SITE_URL?.trim() || "NEXT_PUBLIC_SITE_URL chybí",
  });

  const supabase = getSupabaseAdmin();
  checks.push({
    id: "supabase",
    label: "Supabase",
    ok: Boolean(supabase),
    detail: supabase
      ? "Service role klient aktivní"
      : "SUPABASE_URL nebo klíč chybí",
  });

  const runsSource = await getCourseRunsDataSource();
  checks.push({
    id: "course_runs",
    label: "Zdroj termínů",
    ok: runsSource !== "defaults",
    detail:
      runsSource === "defaults"
        ? "Demo termíny z kódu — uložte vlastní v adminu"
        : runsSource === "supabase"
          ? "Supabase"
          : runsSource === "redis"
            ? "Redis"
            : "Soubor data/course-runs.json",
  });

  const regWritable = isRegistrationsJsonlWritable();
  const webhook = Boolean(process.env.REGISTRATIONS_WEBHOOK_URL?.trim());
  checks.push({
    id: "registrations",
    label: "Úpravy přihlášek",
    ok: regWritable || Boolean(supabase),
    detail: webhook
      ? "Webhook režim — admin úpravy vypnuté"
      : supabase
        ? "Supabase + zápis z adminu"
        : regWritable
          ? "JSONL soubor (lokální)"
          : "Nelze ukládat změny",
  });

  if (process.env.VERCEL === "1") {
    checks.push({
      id: "hosting",
      label: "Hosting",
      ok: true,
      detail: "Vercel produkce",
    });
  }

  return checks;
}
