"use client";

import { useCallback, useEffect, useId, useState } from "react";

type Burst = { id: string; x: number; y: number };

/** Hvězdičky při kliknutí do hlavního obsahu — lehké, bez RAF smyčky. */
export function ClickSparkles() {
  const uid = useId();
  const [bursts, setBursts] = useState<Burst[]>([]);

  const remove = useCallback((id: string) => {
    setBursts((b) => b.filter((x) => x.id !== id));
  }, []);

  useEffect(() => {
    const main = document.getElementById("obsah");
    if (!main) return;

    function onClick(e: MouseEvent) {
      const el = document.getElementById("obsah");
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (
        e.clientY < r.top ||
        e.clientY > r.bottom ||
        e.clientX < r.left ||
        e.clientX > r.right
      ) {
        return;
      }
      const id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random()}`;
      setBursts((b) => [...b, { id, x: e.clientX, y: e.clientY }]);
      window.setTimeout(() => remove(id), 700);
    }

    main.addEventListener("click", onClick);
    return () => main.removeEventListener("click", onClick);
  }, [remove]);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[30] overflow-hidden"
      aria-hidden
    >
      {bursts.map((b) => (
        <span key={`${uid}-${b.id}`} className="sparkle-burst" style={{ left: b.x, top: b.y }}>
          {"✦✧✦".split("").map((ch, i) => (
            <span
              key={i}
              className="sparkle-bit"
              style={{
                ["--d" as string]: `${i * 120}deg`,
                animationDelay: `${i * 40}ms`,
              }}
            >
              {ch}
            </span>
          ))}
        </span>
      ))}
    </div>
  );
}
