"use client";

import dynamic from "next/dynamic";
import { LazyWhenVisible } from "@/components/playful/LazyWhenVisible";

const SnakePlaygroundClient = dynamic(
  () => import("@/components/playful/SnakePlayground").then((m) => m.SnakePlayground),
  {
    ssr: false,
    loading: () => (
      <div className="card-playful mt-16 flex min-h-[14rem] items-center justify-center p-6 text-center text-sm font-medium text-slate-600 sm:min-h-[16rem]">
        Načítám mini-hru…
      </div>
    ),
  },
);

/** Ukázka mini-hry naprogramované s AI přístupem — samostatná stránka „Co děti tvoří“. */
export function SnakeShowcase() {
  return (
    <LazyWhenVisible
      placeholder={
        <div className="card-playful mt-16 flex min-h-[14rem] flex-col items-center justify-center gap-2 p-8 text-center sm:min-h-[16rem]">
          <div className="h-10 w-10 animate-pulse rounded-full bg-violet-200" />
          <p className="text-sm font-medium text-slate-500">
            Mini-hra se načte, jakmile se zobrazí.
          </p>
        </div>
      }
    >
      <SnakePlaygroundClient />
    </LazyWhenVisible>
  );
}
