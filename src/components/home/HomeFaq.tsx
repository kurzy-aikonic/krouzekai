type Item = { q: string; a: string };

export function HomeFaq({ items }: { items: Item[] }) {
  return (
    <section className="mt-16" aria-labelledby="home-faq-heading">
      <h2
        id="home-faq-heading"
        className="font-display text-2xl font-extrabold text-[var(--magic-ink)] sm:text-3xl"
      >
        Časté otázky
      </h2>
      <div className="mt-6 divide-y divide-violet-100 overflow-hidden rounded-3xl border border-violet-200 bg-white shadow-sm">
        {items.map((item) => (
          <details key={item.q} className="group px-5 py-1 sm:px-6">
            <summary className="faq-summary flex min-h-12 cursor-pointer items-center justify-between gap-4 py-3 font-display text-lg font-extrabold text-[var(--magic-ink)]">
              {item.q}
              <span aria-hidden className="text-xl font-bold text-violet-700 group-open:hidden">
                +
              </span>
              <span aria-hidden className="hidden text-xl font-bold text-violet-700 group-open:inline">
                –
              </span>
            </summary>
            <p className="pb-4 text-base leading-relaxed text-slate-700">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
