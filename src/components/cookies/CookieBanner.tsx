"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "krouzek-cookie-consent";

export type CookieConsent = "essential" | "all";

export function readCookieConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;
  const v = localStorage.getItem(STORAGE_KEY);
  if (v === "essential" || v === "all") return v;
  return null;
}

export function CookieBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setOpen(readCookieConsent() === null);
    });
  }, []);

  function save(choice: CookieConsent) {
    localStorage.setItem(STORAGE_KEY, choice);
    setOpen(false);
    window.dispatchEvent(new Event("krouzek-cookie-consent"));
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-banner-title"
      aria-live="polite"
      className="fixed inset-x-0 bottom-0 z-50 border-t-[3px] border-[var(--magic-ink)] bg-gradient-to-r from-[#fef3c7] via-white to-[#e9d5ff] p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-[0_-8px_0_#312e81] sm:p-6 sm:pb-[max(1.5rem,env(safe-area-inset-bottom))]"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-slate-800">
          <p
            id="cookie-banner-title"
            className="font-display text-lg font-extrabold text-[var(--magic-ink)]"
          >
            🍪 Kouzelné cookies
          </p>
          <p className="mt-1 leading-relaxed">
            Potřebujeme ty základní, aby web fungoval. Analytiku zapneme jen když
            chceš — detaily na stránce{" "}
            <Link
              href="/cookies"
              className="font-bold text-violet-600 underline decoration-2 underline-offset-2"
            >
              Cookies
            </Link>
            .
          </p>
        </div>
        <div className="flex w-full flex-shrink-0 flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap">
          <button
            type="button"
            onClick={() => save("essential")}
            className="font-display min-h-11 flex-1 rounded-xl border-[3px] border-[var(--magic-ink)] bg-white px-4 py-2.5 text-sm font-bold text-[var(--magic-ink)] shadow-[3px_3px_0_#312e81] transition-transform hover:-translate-y-0.5 sm:min-h-0 sm:flex-initial"
          >
            Jen nutné
          </button>
          <button
            type="button"
            onClick={() => save("all")}
            className="font-display min-h-11 flex-1 rounded-xl border-[3px] border-[var(--magic-ink)] bg-gradient-to-r from-[var(--magic-grape)] to-[var(--magic-pink)] px-4 py-2.5 text-sm font-bold text-white shadow-[3px_3px_0_#312e81] transition-transform hover:-translate-y-0.5 sm:min-h-0 sm:flex-initial"
          >
            Všechno ano!
          </button>
        </div>
      </div>
    </div>
  );
}
