"use client";

import dynamic from "next/dynamic";

const HeroFx = dynamic(
  () => import("@/components/home/HeroFx").then((m) => m.HeroFx),
  { ssr: false },
);

/** Mřížka a parallax až po prvním vykreslení. Nadpis a obrázek na to nečekají. */
export function HeroClient() {
  return <HeroFx />;
}
