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
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const onOpenSettings = () => setReady(true);
    window.addEventListener(COOKIE_SETTINGS_OPEN_EVENT, onOpenSettings);

    if (hasCookieDecision()) {
      return () => {
        window.removeEventListener(COOKIE_SETTINGS_OPEN_EVENT, onOpenSettings);
      };
    }

    // Při první návštěvě chceme lištu zobrazit rychle, ale neblokovat první paint.
    const timeoutId = window.setTimeout(() => setReady(true), 1000);
    return () => {
      window.removeEventListener(COOKIE_SETTINGS_OPEN_EVENT, onOpenSettings);
      window.clearTimeout(timeoutId);
    };
  }, []);

  return ready ? <CookieBannerClient /> : null;
}
