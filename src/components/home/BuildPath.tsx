const steps = [
  {
    k: "Nápad",
    text: "Student přijde s tím, co chce postavit. Hra, web, nebo malý nástroj.",
  },
  {
    k: "Prompt",
    text: "Zadání pro AI musí být konkrétní. Na hodině se učí, jak ho zúžit a ověřit.",
  },
  {
    k: "Prototyp",
    text: "První verze jde spustit v prohlížeči. Chyba se opraví hned, ne až na konci kurzu.",
  },
  {
    k: "Hotový projekt",
    text: "Na konci deseti lekcí má student věc, kterou může ukázat doma i ve škole.",
  },
] as const;

/** Kroky vzniku projektu. Pohyb je v CSS a při reduced-motion zůstane statický. */
export function BuildPath() {
  return (
    <section className="build-path" aria-labelledby="build-path-heading">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[16rem_1fr] lg:py-24">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <h2 id="build-path-heading" className="font-display text-2xl font-semibold text-[var(--magic-ink)] sm:text-3xl">
            Jak projekt vzniká
          </h2>
          <ol className="mt-4 space-y-2 text-sm font-medium text-slate-600">
            {steps.map((step, index) => (
              <li key={step.k}>
                {index + 1}. {step.k}
              </li>
            ))}
          </ol>
        </div>
        <ol className="space-y-4">
          {steps.map((step, index) => (
            <li key={step.k} className="build-card rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <p className="font-geist-mono text-xs font-medium uppercase tracking-[0.16em] text-violet-700">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="font-display mt-2 text-xl font-semibold text-[var(--magic-ink)]">
                {step.k}
              </h3>
              <p className="mt-2 text-base leading-relaxed text-slate-700">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
