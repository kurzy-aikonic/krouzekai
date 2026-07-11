import Link from "next/link";
import type { CourseRun } from "@/data/course-runs";
import { CourseRunCapacityStatus } from "@/components/course-run/CourseRunCapacityStatus";
import { CourseRunPriceLabel } from "@/components/course-run/CourseRunPriceLabel";
import { CourseRunPublicMeta } from "@/components/course-run/CourseRunPublicMeta";
import { formatScheduleSummary } from "@/lib/course-run-schedule";
import { courseRunPublicStatus } from "@/lib/course-run-public-status";
import type { DefaultCoursePrices } from "@/lib/course-run-pricing";

type Props = {
  run: CourseRun;
  registrationCount: number;
  priceDefaults: DefaultCoursePrices;
  compact?: boolean;
};

export function CourseRunPublicCard({
  run,
  registrationCount,
  priceDefaults,
  compact = false,
}: Props) {
  const status = courseRunPublicStatus(run, registrationCount);
  const TitleTag = compact ? "h3" : "h2";

  return (
    <article
      className={`card-playful relative overflow-hidden border-2 p-5 sm:p-6 ${
        status.isGroupLaunchReady
          ? "border-emerald-200 bg-emerald-50/40"
          : "border-violet-100 bg-white"
      }`}
    >
      <span
        className={`absolute right-4 top-4 rounded-full border-2 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide ${status.badgeClassName}`}
      >
        {status.badgeLabel}
      </span>
      <TitleTag className="font-display pr-28 text-lg font-extrabold leading-snug text-[var(--magic-ink)]">
        {run.label}
      </TitleTag>
      <p className="mt-1 text-[10px] font-extrabold uppercase tracking-wide text-violet-700">
        {run.format === "skupina" ? "Skupinový kurz" : "Individuální 1:1"}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-slate-700">{run.description}</p>
      <CourseRunPublicMeta run={run} />
      <CourseRunPriceLabel run={run} defaults={priceDefaults} compact={compact} />
      <p className="mt-3 text-xs font-medium text-slate-600">
        {formatScheduleSummary(run)}
      </p>
      <div className="mt-4">
        <CourseRunCapacityStatus run={run} registrationCount={registrationCount} />
      </div>
      {status.acceptsRegistration ? (
        <Link
          href={`/registrace?run=${encodeURIComponent(run.id)}`}
          className="mt-5 inline-flex w-full justify-center rounded-xl border border-violet-600 bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-2.5 text-sm font-extrabold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:w-auto"
        >
          Přihlásit na tento termín →
        </Link>
      ) : (
        <Link
          href="/registrace"
          className="mt-5 inline-flex w-full justify-center rounded-xl border-2 border-slate-200 bg-slate-100 px-4 py-2.5 text-sm font-extrabold text-slate-600 sm:w-auto"
        >
          {run.format === "skupina"
            ? "Kapacita naplněna — jiný termín"
            : "Termín obsazen"}
        </Link>
      )}
    </article>
  );
}
