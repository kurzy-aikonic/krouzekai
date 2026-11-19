"use client";

import { useEffect, useRef, useState } from "react";

const panels = [
  { src: "/projects/reference-panel-0.webp", className: "ref-panel ref-panel-a" },
  { src: "/projects/reference-panel-1.webp", className: "ref-panel ref-panel-b" },
  { src: "/projects/reference-panel-2.webp", className: "ref-panel ref-panel-c" },
] as const;

/** Plovoucí panely na referenční fotce. Spustí se až ve viewportu, pod ohybem, mimo LCP. */
export function ReferenceScene() {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setOn(true);
      },
      { threshold: 0.2 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`ref-scene ${on ? "is-on" : ""}`}>
      <img
        src="/projects/reference-portfolio.jpg"
        alt="Tmavý notebook s webem v portfoliu a vznášejícími se panely"
        width={1152}
        height={864}
        loading="lazy"
        decoding="async"
        className="ref-base"
      />
      {panels.map((panel) => (
        <img
          key={panel.src}
          src={panel.src}
          alt=""
          aria-hidden
          width={1152}
          height={864}
          loading="lazy"
          decoding="async"
          className={panel.className}
        />
      ))}
      <span className="ref-scan" aria-hidden />
    </div>
  );
}
