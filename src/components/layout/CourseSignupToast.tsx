"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const TOAST_DISMISSED_KEY = "krouzekai.signupToastDismissed";

export function CourseSignupToast() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  const hiddenOnPath =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/rodic") ||
    pathname.startsWith("/registrace");

  useEffect(() => {
    if (hiddenOnPath) return;

    try {
      const dismissed = localStorage.getItem(TOAST_DISMISSED_KEY);
      if (dismissed === "1") return;
    } catch {
      // Ignore localStorage restrictions (private mode, etc.)
    }

    const t = window.setTimeout(() => setVisible(true), 2500);
    return () => window.clearTimeout(t);
  }, [hiddenOnPath]);

  if (!visible || hiddenOnPath) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[70] max-w-sm rounded-2xl border border-violet-200 bg-white/95 p-4 shadow-xl backdrop-blur">
      <button
        type="button"
        onClick={() => {
          setVisible(false);
          try {
            localStorage.setItem(TOAST_DISMISSED_KEY, "1");
          } catch {
            // Ignore localStorage restrictions (private mode, etc.)
          }
        }}
        className="absolute right-2 top-2 rounded-md px-2 py-1 text-xs font-bold text-slate-500 hover:bg-slate-100 hover:text-slate-700"
        aria-label="Zavřít upozornění"
      >
        ✕
      </button>

      <p className="pr-8 font-display text-sm font-extrabold text-violet-900">
        Chcete dítě přihlásit na kurz AI?
      </p>
      <p className="mt-1 text-xs leading-relaxed text-slate-600">
        Místa se průběžně plní. Přihlášení zabere přibližně 1 minutu.
      </p>

      <div className="mt-3">
        <Link href="/registrace" className="btn-magic w-full text-sm">
          Přihlásit na kurz 🚀
        </Link>
      </div>
    </div>
  );
}
