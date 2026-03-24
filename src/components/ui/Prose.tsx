import type { ReactNode } from "react";

/** Jednoduchá typografie pro právní a dlouhé texty (bez typography pluginu). */
export function Prose({ children }: { children: ReactNode }) {
  return <div className="legal-prose">{children}</div>;
}
