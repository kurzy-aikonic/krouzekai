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
          <span className="relative inline-block pb-1">
            {title}
            <span
              className="absolute -bottom-1 left-0 h-1.5 w-full rounded-full bg-gradient-to-r from-violet-300 via-fuchsia-300 to-amber-300 opacity-70"
              aria-hidden
            />
          </span>
        </h2>
      ) : null}
      {intro ? (
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg">
          {intro}
        </p>
      ) : null}
      <div className={title || intro ? "mt-8" : ""}>{children}</div>
    </section>
  );
}
