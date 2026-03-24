"use client";

import dynamic from "next/dynamic";

/** Client-only wrapper — `ssr: false` musí být uvnitř Client Component (Next 16). */
export const CookieBannerHost = dynamic(
  () => import("./CookieBanner").then((m) => m.CookieBanner),
  { ssr: false },
);
