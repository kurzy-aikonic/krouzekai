"use client";

import dynamic from "next/dynamic";

const ClickSparklesClient = dynamic(
  () => import("@/components/playful/ClickSparkles").then((m) => m.ClickSparkles),
  { ssr: false },
);

export function LazyClickSparkles() {
  return <ClickSparklesClient />;
}
