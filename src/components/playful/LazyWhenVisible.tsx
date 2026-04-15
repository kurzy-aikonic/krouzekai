"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";

type Props = {
  /** Viditelný „box“ před aktivací — drž rozumnou min. výšku kvůli CLS. */
  placeholder: ReactNode;
  children: ReactNode;
  /** Za kolik px před vstupem do viewportu začít načítat (výchozí ~1–2 obrazovky). */
  rootMargin?: string;
};

/**
 * Obsah vykreslí až těsně před tím, než se blok dostane do viewportu.
 * Šetří stahovaný JS u sekcí pod ohybem (např. hra / demo).
 */
export function LazyWhenVisible({
  placeholder,
  children,
  rootMargin = "320px 0px 200px 0px",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || active) return;

    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      queueMicrotask(() => setActive(true));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setActive(true);
            io.disconnect();
            return;
          }
        }
      },
      { root: null, rootMargin, threshold: 0.01 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [active, rootMargin]);

  return (
    <div ref={ref}>
      {active ? children : placeholder}
    </div>
  );
}
