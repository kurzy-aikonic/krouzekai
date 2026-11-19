import Link from "next/link";
import type { CourseRun } from "@/data/course-runs";
import { spotsLeftEffective } from "@/data/course-runs";
import {
  effectiveRunPriceCzk,
  formatRunPriceCzk,
  type DefaultCoursePrices,
} from "@/lib/course-run-pricing";
import {
  formatIsoDateLongCs,
  weekdayLabel,
  withScheduleDefaults,
} from "@/lib/course-run-schedule";
import { courseRunPublicStatus } from "@/lib/course-run-public-status";

type Props = {
  run: CourseRun;
  registrationCount: number;
  priceDefaults: DefaultCoursePrices;
};

function spotsPhrase(free: number, capacity: number): string {
  if (free <= 0) return "Termín je plný.";
  if (free === 1) return `Zbývá 1 místo z ${capacity}.`;
  if (free >= 2 && free <= 4) return `Zbývají ${free} místa z ${capacity}.`;
  return `Zbývá ${free} míst z ${capacity}.`;
}

export function CourseRunPublicCard({
  run,
  registrationCount,
  priceDefaults,
}: Props) {
  const schedule = withScheduleDefaults(run);
  const day = weekdayLabel(schedule.weekday);
  const when = day ? `${day} ${schedule.lessonTime}` : schedule.lessonTime;
  const status = courseRunPublicStatus(run, registrationCount);
  const free = spotsLeftEffective(run, registrationCount);
  const price = formatRunPriceCzk(effectiveRunPriceCzk(run, priceDefaults));
  const priceNote =
    run.format === "individual" ? "za celý kurz" : "za dítě, celý kurz";

  return (
    <article className="flex h-full flex-col rounded-3xl border border-violet-200 bg-white p-5 shadow-sm sm:p-6">
      <p className="text-sm font-semibold text-violet-800">
        {run.format === "skupina" ? "Skupina" : "Individuálně 1:1"}
      </p>
      <h3 className="font-display mt-1 text-2xl font-extrabold text-[var(--magic-ink)]">
        {when}
      </h3>
      <dl className="mt-4 grid grid-cols-1 gap-3 text-base sm:grid-cols-2">
        <div>
          <dt className="text-sm font-semibold text-slate-600">Den a čas</dt>
          <dd className="font-bold text-slate-900">{when}</dd>
        </div>
        <div>
          <dt className="text-sm font-semibold text-slate-600">První lekce</dt>
          <dd className="font-bold text-slate-900">
            {formatIsoDateLongCs(run.startsOn)}
          </dd>
        </div>
        <div>
          <dt className="text-sm font-semibold text-slate-600">Cena</dt>
          <dd className="font-bold text-slate-900">
            {price}{" "}
            <span className="font-semibold text-slate-600">{priceNote}</span>
          </dd>
        </div>
        <div>
          <dt className="text-sm font-semibold text-slate-600">Volná místa</dt>
          <dd className="font-bold text-slate-900">
            {spotsPhrase(free, run.capacity)}
          </dd>
        </div>
      </dl>
      {status.acceptsRegistration ? (
        <Link
          href={`/registrace?run=${encodeURIComponent(run.id)}`}
          className="btn-magic mt-5 w-full"
        >
          Přihlásit na tento termín
        </Link>
      ) : (
        <Link
          href={`/cekaci-listina?run=${encodeURIComponent(run.id)}`}
          className="btn-magic-outline mt-5 w-full"
        >
          Termín je plný, chci vědět o dalším
        </Link>
      )}
    </article>
  );
}
