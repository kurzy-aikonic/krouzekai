"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { analyticsConsentGranted } from "@/lib/cookie-consent";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ?? "";

function analyticsAllowed(): boolean {
  return analyticsConsentGranted();
}

/**
 * GA4 (gtag) — jen když je v env ID a uživatel zvolil „Všechno ano!“ u cookies.
 */
export function GoogleAnalytics() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const sync = () => {
      if (!GA_ID) return;
      setEnabled(analyticsAllowed());
    };
    queueMicrotask(sync);
    window.addEventListener("krouzek-cookie-consent", sync);
    return () => window.removeEventListener("krouzek-cookie-consent", sync);
  }, []);

  if (!GA_ID || !enabled) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`}
        strategy="lazyOnload"
      />
      <Script id="google-analytics-gtag" strategy="lazyOnload">
        {`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', ${JSON.stringify(GA_ID)});
        `.trim()}
      </Script>
    </>
  );
}
