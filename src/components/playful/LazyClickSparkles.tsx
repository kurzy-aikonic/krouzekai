"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const ClickSparklesClient = dynamic(
  () => import("@/components/playful/ClickSparkles").then((m) => m.ClickSparkles),
  { ssr: false },
);

export function LazyClickSparkles() {
  const pathname = usePathname();
  const disabled = pathname.startsWith("/admin");
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (disabled || active) return;

    let timeoutId: number | null = null;

    const activate = () => setActive(true);

    const onFirstPointerDown = () => {
      activate();
      window.removeEventListener("pointerdown", onFirstPointerDown);
      if (timeoutId != null) window.clearTimeout(timeoutId);
    };

    window.addEventListener("pointerdown", onFirstPointerDown, { once: true });
    timeoutId = window.setTimeout(activate, 2000);

    return () => {
      window.removeEventListener("pointerdown", onFirstPointerDown);
      if (timeoutId != null) window.clearTimeout(timeoutId);
    };
  }, [active, disabled]);

  if (disabled) return null;

  return active ? <ClickSparklesClient /> : null;
}
