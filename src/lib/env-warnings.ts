/**
 * Jednorázové varování při startu Node procesu (instrumentation).
 * Neblokuje běh — jen upozorní v logu hostingu.
 */
export function logProductionEnvWarnings(): void {
  if (process.env.NODE_ENV !== "production") return;

  const missing: string[] = [];

  if (!process.env.RESEND_API_KEY?.trim()) {
    missing.push("RESEND_API_KEY (potvrzovací e-maily se neodešlou)");
  }
  if (!process.env.RESEND_FROM_EMAIL?.trim()) {
    missing.push("RESEND_FROM_EMAIL");
  }
  if (!process.env.NEXT_PUBLIC_SITE_URL?.trim()) {
    missing.push(
      "NEXT_PUBLIC_SITE_URL (odkazy v e-mailech a metadata — na Vercelu často doplnit ručně)",
    );
  }

  if (missing.length > 0) {
    console.warn(
      `[krouzek-ai] Produkce: zkontrolujte proměnné prostředí: ${missing.join("; ")}`,
    );
  }
}
