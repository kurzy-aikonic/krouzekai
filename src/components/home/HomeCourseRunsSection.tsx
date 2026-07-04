import Link from "next/link";
import type { CourseRun } from "@/data/course-runs";
import { CourseRunCapacityStatus } from "@/components/course-run/CourseRunCapacityStatus";
import { CourseRunPriceLabel } from "@/components/course-run/CourseRunPriceLabel";
import { CourseRunPublicMeta } from "@/components/course-run/CourseRunPublicMeta";
import { formatScheduleSummary } from "@/lib/course-run-schedule";
import { courseRunPublicStatus } from "@/lib/course-run-public-status";
import type { DefaultCoursePrices } from "@/lib/course-run-pricing";
import { site } from "@/lib/site-config";

type Props = {
  runs: CourseRun[];
  occupancyByRunId: Record<string, number>;
  priceDefaults: DefaultCoursePrices;
};

export function HomeCourseRunsSection({
  runs,
  occupancyByRunId,
  priceDefaults,
}: Props) {
  if (runs.length === 0) return null;

  return (
    <section
      id="aktualni-terminy"
      className="mt-14 scroll-mt-24 rounded-[2rem] border border-violet-200 bg-gradient-to-br from-violet-50/60 via-white to-amber-50/60 p-6 shadow-sm sm:p-8"
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
            Skupinový kurz spouštíme až po naplnění kapacity termínu (100 %
            míst). Do té doby sbíráme nezávazné přihlášky — u každého termínu
            vidíte, kolik míst už je obsazeno.
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
          const occ = occupancyByRunId[run.id] ?? 0;
          const status = courseRunPublicStatus(run, occ);
          return (
            <li
              key={run.id}
              className={`card-playful relative overflow-hidden border-2 p-5 sm:p-6 ${
                status.isGroupLaunchReady
                  ? "border-emerald-200 bg-emerald-50/40"
                  : "border-violet-200 bg-white"
              }`}
            >
              <span
                className={`absolute right-4 top-4 rounded-full border-2 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide ${status.badgeClassName}`}
              >
                {status.badgeLabel}
              </span>
              <h3 className="font-display pr-28 text-lg font-extrabold leading-snug text-[var(--magic-ink)]">
                {run.label}
              </h3>
              <p className="mt-1 text-[10px] font-extrabold uppercase tracking-wide text-violet-700">
                {run.format === "skupina" ? "Skupinový kurz" : "Individuální 1:1"}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                {run.description}
              </p>
              <CourseRunPublicMeta run={run} />
              <CourseRunPriceLabel run={run} defaults={priceDefaults} compact />
              <p className="mt-3 text-xs font-semibold text-violet-800">
                {formatScheduleSummary(run)}
              </p>
              <div className="mt-4">
                <CourseRunCapacityStatus run={run} registrationCount={occ} />
              </div>
              {status.acceptsRegistration ? (
                <Link
                  href={`/registrace?run=${encodeURIComponent(run.id)}`}
                  className="mt-5 inline-flex w-full justify-center rounded-xl border border-violet-300 bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2.5 text-sm font-extrabold text-white shadow-sm transition hover:-translate-y-0.5"
                >
                  Přihlásit na tento termín →
                </Link>
              ) : (
                <Link
                  href="/registrace"
                  className="mt-5 inline-flex w-full justify-center rounded-xl border-2 border-slate-200 bg-slate-100 px-4 py-2.5 text-sm font-extrabold text-slate-600"
                >
                  {run.format === "skupina"
                    ? "Kapacita naplněna — jiný termín"
                    : "Termín obsazen"}
                </Link>
              )}
            </li>
          );
        })}
      </ul>

      <div className="mt-6 rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/80 px-4 py-3">
        <p className="text-xs font-semibold leading-relaxed text-amber-950">
          <strong>Jak to funguje:</strong> Přihláška je nezávazná, dokud není
          skupina plná. Kurz fakturujeme a startujeme až po obsazení všech{" "}
          {site.pricing.groupMaxStudents} míst daného termínu (nebo kapacity,
          kterou u termínu nastavíte v administraci).
        </p>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Link href="/registrace" className="btn-magic w-full text-center sm:w-auto">
          Nezávazně přihlásit dítě 🚀
        </Link>
      </div>
    </section>
  );
}
