import { springHolidayNote, type CourseRun } from "@/data/course-runs";
import { CourseRunPublicCard } from "@/components/course-run/CourseRunPublicCard";
import type { DefaultCoursePrices } from "@/lib/course-run-pricing";

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
    <div>
      <h2 className="font-display text-2xl font-extrabold text-[var(--magic-ink)] sm:text-3xl">
        Termíny, které právě nabízíme
      </h2>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-800 sm:text-lg">
        {springHolidayNote} Odesláním přihlášky vzniká návrh smlouvy, který
        lze do potvrzení objednávky zrušit. Fakturu posíláme až ve chvíli, kdy
        je skupina plná a objednávku potvrdíme.
      </p>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        {runs.map((run) => (
          <li key={run.id}>
            <CourseRunPublicCard
              run={run}
              registrationCount={occupancyByRunId[run.id] ?? 0}
              priceDefaults={priceDefaults}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
