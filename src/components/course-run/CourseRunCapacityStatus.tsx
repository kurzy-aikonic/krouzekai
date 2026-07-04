import type { CourseRun } from "@/data/course-runs";
import { courseRunPublicStatus } from "@/lib/course-run-public-status";

type Props = {
  run: CourseRun;
  registrationCount: number;
  /** Kompaktní varianta v seznamu registrace. */
  compact?: boolean;
};

export function CourseRunCapacityStatus({
  run,
  registrationCount,
  compact = false,
}: Props) {
  const s = courseRunPublicStatus(run, registrationCount);

  if (compact) {
    return (
      <span className="mt-1 block space-y-0.5">
        <span
          className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide ${s.badgeClassName}`}
        >
          {s.badgeLabel}
        </span>
        <span className="block text-[11px] font-bold text-violet-800">
          {s.occupied}/{s.capacity} míst
          {run.format === "skupina" && !s.isGroupLaunchReady
            ? ` · chybí ${s.free}`
            : null}
        </span>
      </span>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex rounded-full border-2 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide ${s.badgeClassName}`}
        >
          {s.badgeLabel}
        </span>
        <span className="text-xs font-bold text-slate-700">
          {s.occupied}/{s.capacity} míst
        </span>
      </div>
      {run.format === "skupina" ? (
        <div
          className="h-2 overflow-hidden rounded-full border border-violet-200 bg-white"
          role="progressbar"
          aria-valuenow={s.progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Obsazenost termínu ${s.progressPercent} procent`}
        >
          <div
            className={`h-full rounded-full transition-all ${
              s.isGroupLaunchReady
                ? "bg-emerald-500"
                : s.isGroupGathering
                  ? "bg-amber-400"
                  : "bg-violet-300"
            }`}
            style={{ width: `${s.progressPercent}%` }}
          />
        </div>
      ) : null}
      <p className="text-xs font-semibold leading-relaxed text-slate-800">
        {s.statusLine}
      </p>
      <p className="text-xs leading-relaxed text-slate-600">{s.detailLine}</p>
    </div>
  );
}
