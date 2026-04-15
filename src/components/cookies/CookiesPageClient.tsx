"use client";

import { CookieSettingsButton } from "@/components/cookies/CookieSettingsButton";

export function CookiesPageClient() {
  return (
    <p className="not-prose mt-8 rounded-2xl border-2 border-violet-200 bg-violet-50/60 px-4 py-4 text-sm text-slate-800">
      Chcete změnit souhlas s volitelnými cookies?{" "}
      <CookieSettingsButton className="font-display font-extrabold text-violet-800 underline decoration-2 underline-offset-2 hover:text-violet-950" />
    </p>
  );
}
