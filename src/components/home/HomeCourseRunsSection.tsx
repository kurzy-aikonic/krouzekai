import Link from "next/link";
import type { CourseRun } from "@/data/course-runs";
import { formatScheduleSummary } from "@/lib/course-run-schedule";
import { site } from "@/lib/site-config";

type Props = {
  runs: CourseRun[];
  freeByRunId: Record<string, number>;
};

export function HomeCourseRunsSection({ runs, freeByRunId }: Props) {
  if (runs.length === 0) return null;

  return (
    <section
      id="aktualni-terminy"
      className="mt-14 scroll-mt-24 rounded-[2rem] border-[3px] border-[var(--magic-ink)] bg-gradient-to-br from-violet-50 via-white to-amber-50 p-6 shadow-[8px_8px_0_rgba(49,46,129,0.15)] sm:p-8"
      aria-labelledby="home-runs-heading"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-display text-xs font-extrabold uppercase tracking-wide text-violet-700">
            Právě otevíráme
          </p>
          <h2
            id="home-runs-heading"
            className="font-display mt-1 text-2xl font-extrabold text-[var(--magic-ink)] sm:text-3xl"
          >
            Aktuální termíny kroužku 📅
          </h2>
          <p className="mt-2 max-w-2xl text-sm font-medium leading-relaxed text-slate-700 sm:text-base">
            Vyberte si termín přímo v přihlášce — nebo nám nechte domluvu na
            později. Skupiny max. {site.pricing.groupMaxStudents} dětí, lekce{" "}
            {site.pricing.lessonMinutes} min jednou za 14 dní.
          </p>
        </div>
        <Link
          href="/aktualni-behy"
          className="btn-magic-outline shrink-0 text-sm"
        >
          Všechny termíny
        </Link>
      </div>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {runs.map((run) => {
          const free = freeByRunId[run.id] ?? run.capacity;
          const full = free <= 0;
          return (
            <li
              key={run.id}
              className={`card-playful relative overflow-hidden border-2 p-5 sm:p-6 ${
                full
                  ? "border-slate-200 bg-slate-50/90 opacity-90"
                  : "border-violet-200 bg-white"
              }`}
            >
              {!full ? (
                <span className="absolute right-4 top-4 rounded-full border-2 border-emerald-300 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-emerald-900">
                  Volná místa
                </span>
              ) : (
                <span className="absolute right-4 top-4 rounded-full border-2 border-slate-300 bg-slate-100 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-slate-700">
                  Plně obsazeno
                </span>
              )}
              <h3 className="font-display pr-24 text-lg font-extrabold leading-snug text-[var(--magic-ink)]">
                {run.label}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                {run.description}
              </p>
              <p className="mt-3 text-xs font-semibold text-violet-800">
                {formatScheduleSummary(run)}
              </p>
              <p className="mt-2 text-xs font-medium text-slate-600">
                Kapacita {run.capacity} · odhad volných míst:{" "}
                <strong>{free}</strong>
              </p>
              <Link
                href={`/registrace?run=${encodeURIComponent(run.id)}`}
                className={`mt-5 inline-flex w-full justify-center rounded-xl border-2 px-4 py-2.5 text-sm font-extrabold transition ${
                  full
                    ? "pointer-events-none border-slate-200 bg-slate-100 text-slate-500"
                    : "border-[var(--magic-ink)] bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-[3px_3px_0_#312e81] hover:-translate-y-0.5"
                }`}
                aria-disabled={full}
              >
                {full ? "Termín je plný" : "Přihlásit na tento termín →"}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Link href="/registrace" className="btn-magic w-full text-center sm:w-auto">
          Nezávazně přihlásit dítě 🚀
        </Link>
        <p className="text-xs font-medium text-slate-600">
          Přihláška je nezávazná — termín můžete vybrat ve formuláři nebo
          doladit s námi později.
        </p>
      </div>
    </section>
  );
}
