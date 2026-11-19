"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import {
  COOKIE_SETTINGS_OPEN_EVENT,
  hasCookieDecision,
} from "@/lib/cookie-consent";

/** Client-only wrapper — `ssr: false` musí být uvnitř Client Component (Next 16). */
const CookieBannerClient = dynamic(
  () => import("./CookieBanner").then((m) => m.CookieBanner),
  { ssr: false },
);

export function CookieBannerHost() {
  const [mode, setMode] = useState<null | "choice" | "details">(null);

  useEffect(() => {
    const onOpenSettings = () => setMode("details");
    window.addEventListener(COOKIE_SETTINGS_OPEN_EVENT, onOpenSettings);

    if (hasCookieDecision()) {
      return () => {
        window.removeEventListener(COOKIE_SETTINGS_OPEN_EVENT, onOpenSettings);
      };
    }

    const timeoutId = window.setTimeout(() => setMode("choice"), 1000);
    return () => {
      window.removeEventListener(COOKIE_SETTINGS_OPEN_EVENT, onOpenSettings);
      window.clearTimeout(timeoutId);
    };
  }, []);

  return mode ? <CookieBannerClient initialStep={mode} /> : null;
}
