"use client";

import dynamic from "next/dynamic";
import { LazyWhenVisible } from "@/components/playful/LazyWhenVisible";

const SnakePlaygroundClient = dynamic(
  () => import("@/components/playful/SnakePlayground").then((m) => m.SnakePlayground),
  {
    ssr: false,
    loading: () => (
      <div className="mt-16 min-h-[14rem] sm:min-h-[16rem]" aria-hidden />
    ),
  },
);

/** Ukázka mini-hry naprogramované s AI přístupem — samostatná stránka „Co děti tvoří“. */
export function SnakeShowcase() {
  return (
    <LazyWhenVisible
      placeholder={
        <div className="mt-16 min-h-[14rem] sm:min-h-[16rem]" aria-hidden />
      }
    >
      <SnakePlaygroundClient />
    </LazyWhenVisible>
  );
}
