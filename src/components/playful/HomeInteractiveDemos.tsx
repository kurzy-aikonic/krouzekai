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

/** Na homepage necháváme jen ukázku, která prodává hodnotu rodičům — mini-hra Snake je na /co-deti-tvori. */
export function HomeInteractiveDemos() {
  return (
    <LazyWhenVisible
      placeholder={<BlockPlaceholder label="Ukázka se načte, jakmile se zobrazí." />}
    >
      <SchoolStudyDemoClient />
    </LazyWhenVisible>
  );
}
