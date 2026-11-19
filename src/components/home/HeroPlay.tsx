"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const AsteroidGame = dynamic(
  () => import("@/components/home/AsteroidGame").then((m) => m.AsteroidGame),
  { ssr: false },
);

export function HeroPlay() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className="hero-try" onClick={() => setOpen(true)}>
        Zkus to
      </button>
      {open ? <AsteroidGame onClose={() => setOpen(false)} /> : null}
    </>
  );
}
