"use client";

import dynamic from "next/dynamic";
import { LazyWhenVisible } from "@/components/playful/LazyWhenVisible";

function BlockPlaceholder({ label }: { label: string }) {
  return (
    <div className="card-playful mt-16 flex min-h-[14rem] flex-col items-center justify-center gap-2 p-8 text-center sm:min-h-[16rem]">
      <div className="h-10 w-10 animate-pulse rounded-full bg-violet-200" />
      <p className="text-sm font-medium text-slate-500">{label}</p>
    </div>
  );
}

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

const SchoolStudyDemoClient = dynamic(
  () => import("@/components/playful/SchoolStudyDemo").then((m) => m.SchoolStudyDemo),
  {
    ssr: false,
    loading: () => (
      <div className="card-playful mt-16 flex min-h-[18rem] items-center justify-center p-6 text-center text-sm font-medium text-slate-600 sm:min-h-[20rem]">
        Načítám ukázku AI a školy…
      </div>
    ),
  },
);

export function HomeInteractiveDemos() {
  return (
    <>
      <LazyWhenVisible
        placeholder={<BlockPlaceholder label="Mini-hra se načte při posunu sem ↓" />}
      >
        <SnakePlaygroundClient />
      </LazyWhenVisible>
      <LazyWhenVisible
        placeholder={<BlockPlaceholder label="Ukázka pro školu se načte při posunu sem ↓" />}
      >
        <SchoolStudyDemoClient />
      </LazyWhenVisible>
    </>
  );
}
