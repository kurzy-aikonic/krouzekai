"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { analyticsConsentGranted } from "@/lib/cookie-consent";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ?? "";

function getGtag(): ((...args: unknown[]) => void) | undefined {
  return (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
}

function sendPageView() {
  const gtag = getGtag();
  if (typeof gtag !== "function") return;
  gtag("event", "page_view", {
    page_path: window.location.pathname + window.location.search,
    page_location: window.location.href,
  });
}

/**
 * GA4 (gtag) — jen při `NEXT_PUBLIC_GA_MEASUREMENT_ID` a souhlasu s analytikou (cookies).
 * `afterInteractive` kvůli spolehlivějšímu načtení; při navigaci v App Router doplňujeme page_view.
 */
export function GoogleAnalytics() {
  const [enabled, setEnabled] = useState(false);
  const pathname = usePathname();
  const lastReportedPath = useRef<string | null>(null);

  useEffect(() => {
    const sync = () => {
      if (!GA_ID) return;
      setEnabled((prev) => {
        const next = analyticsConsentGranted();
        return prev === next ? prev : next;
      });
    };
    queueMicrotask(sync);
    window.addEventListener("krouzek-cookie-consent", sync);
    return () => window.removeEventListener("krouzek-cookie-consent", sync);
  }, []);

  useEffect(() => {
    if (!GA_ID || !enabled) return;
    if (typeof getGtag() !== "function") return;
    if (lastReportedPath.current === null) return;
    if (lastReportedPath.current === pathname) return;
    lastReportedPath.current = pathname;
    sendPageView();
  }, [enabled, pathname]);

  if (!GA_ID || !enabled) return null;

  return (
    <Script
      src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`}
      strategy="afterInteractive"
      onLoad={() => {
        const gtag = getGtag();
        if (typeof gtag !== "function") return;
        // `config` with `send_page_view: true` logs the first pageview for initial load.
        gtag("config", GA_ID, { send_page_view: true });
        lastReportedPath.current = pathname;
      }}
    />
  );
}
