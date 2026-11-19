"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { analyticsConsentGranted } from "@/lib/cookie-consent";
import { gaMeasurementId, trackPageView } from "@/lib/ga-events";

const GA_ID = gaMeasurementId();

function GoogleAnalyticsInner() {
  const [enabled, setEnabled] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();

  useEffect(() => {
    const sync = () => {
      if (!GA_ID) return;
      setEnabled(analyticsConsentGranted());
    };
    sync();
    window.addEventListener("krouzek-cookie-consent", sync);
    return () => window.removeEventListener("krouzek-cookie-consent", sync);
  }, []);

  useEffect(() => {
    if (!GA_ID) return;
    (window as unknown as Record<string, boolean>)[`ga-disable-${GA_ID}`] = !enabled;
    if (!enabled) return;
    trackPageView();
  }, [enabled, pathname, search]);

  if (!GA_ID || !enabled) return null;

  return (
    <Script
      src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`}
      strategy="afterInteractive"
    />
  );
}

/**
 * GA4 se načte až po souhlasu s analytikou. Před souhlasem v HTML žádný skript není.
 * `useSearchParams` je v Suspense, aby nerozbilo statické vykreslení.
 */
export function GoogleAnalytics() {
  if (!GA_ID) return null;
  return (
    <Suspense fallback={null}>
      <GoogleAnalyticsInner />
    </Suspense>
  );
}
