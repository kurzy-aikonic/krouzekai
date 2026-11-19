import { WaitlistForm } from "@/components/waitlist/WaitlistForm";

/** Prázdný stav, dokud v datech není žádný budoucí termín. */
export function SpringTermsPanel() {
  return (
    <div className="rounded-3xl border border-violet-200 bg-white p-5 shadow-sm sm:p-8">
      <h2 className="font-display text-2xl font-extrabold text-[var(--magic-ink)] sm:text-3xl">
        Připravujeme jarní termíny 2027
      </h2>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-800 sm:text-lg">
        Nové termíny na jaro 2027 právě připravujeme. Nechte nám kontakt a
        ozveme se vám jako prvním, ještě než termíny zveřejníme.
      </p>
      <div className="mt-6 max-w-xl">
        <WaitlistForm variant="notify" format="skupina" />
      </div>
    </div>
  );
}
