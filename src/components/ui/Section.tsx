import type { ReactNode } from "react";

type SectionProps = {
  id?: string;
  title?: string;
  intro?: string;
  children: ReactNode;
  className?: string;
};

export function Section({
  id,
  title,
  intro,
  children,
  className = "",
}: SectionProps) {
  return (
    <section id={id} className={`scroll-mt-24 ${className}`}>
      {title ? (
        <h2 className="font-display text-2xl font-extrabold tracking-tight text-[var(--magic-ink)] sm:text-3xl">
          <span className="relative inline-block">
            {title}
            <span
              className="absolute -bottom-1 left-0 h-2 w-full rounded-full bg-gradient-to-r from-[var(--magic-grape)] via-[var(--magic-pink)] to-[var(--magic-sun)] opacity-70"
              aria-hidden
            />
          </span>
        </h2>
      ) : null}
      {intro ? (
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-700 sm:text-lg">
          {intro}
        </p>
      ) : null}
      <div className={title || intro ? "mt-8" : ""}>{children}</div>
    </section>
  );
}
