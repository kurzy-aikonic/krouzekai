"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { hasCookieDecision } from "@/lib/cookie-consent";
import { COOKIE_SETTINGS_OPEN_EVENT } from "@/lib/cookie-consent";

const TOAST_DISMISSED_KEY = "krouzekai.signupToastDismissed";

function scrolledFarEnough(): boolean {
  if (window.scrollY < 80) return false;
  const doc = document.documentElement.scrollHeight;
  return window.scrollY > doc / 2 || window.scrollY > window.innerHeight * 0.85;
}

export function CourseSignupToast() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  const hiddenOnPath =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/rodic") ||
    pathname.startsWith("/registrace") ||
    pathname.startsWith("/cekaci-listina");

  useEffect(() => {
    if (hiddenOnPath) return;

    try {
      if (localStorage.getItem(TOAST_DISMISSED_KEY) === "1") return;
    } catch {
      /* private mode */
    }

    let cancelled = false;
    let timer = 0;

    const show = () => {
      if (cancelled || !hasCookieDecision()) return;
      setVisible(true);
    };

    const arm = () => {
      if (!hasCookieDecision()) return;
      if (scrolledFarEnough()) show();
      window.clearTimeout(timer);
      timer = window.setTimeout(show, 30_000);
    };

    const onScroll = () => {
      if (scrolledFarEnough()) show();
    };

    const onConsent = () => arm();
    const onSettings = () => setVisible(false);

    arm();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("krouzek-cookie-consent", onConsent);
    window.addEventListener(COOKIE_SETTINGS_OPEN_EVENT, onSettings);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("krouzek-cookie-consent", onConsent);
      window.removeEventListener(COOKIE_SETTINGS_OPEN_EVENT, onSettings);
    };
  }, [hiddenOnPath]);

  if (!visible || hiddenOnPath) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-[70] sm:inset-x-auto sm:right-4 sm:max-w-sm">
      <div className="rounded-2xl border border-violet-200 bg-white p-3 shadow-xl sm:p-4">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <p className="font-display text-sm font-extrabold text-violet-950 sm:text-base">
              Chcete místo v kroužku?
            </p>
            <p className="mt-1 hidden text-sm leading-relaxed text-slate-600 sm:block">
              Můžete nám nechat kontakt, nebo vyplnit přihlášku. Zabere to asi minutu.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setVisible(false);
              try {
                localStorage.setItem(TOAST_DISMISSED_KEY, "1");
              } catch {
                /* private mode */
              }
            }}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100"
            aria-label="Zavřít upozornění"
          >
            ✕
          </button>
        </div>
        <Link href="/registrace" className="btn-magic mt-3 w-full text-sm">
          Přihlásit na kroužek
        </Link>
      </div>
    </div>
  );
}
