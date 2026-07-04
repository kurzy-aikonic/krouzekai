import type { CourseRun } from "@/data/course-runs";
import {
  courseDifficultyBadgeClass,
  courseDifficultyLabel,
  courseRunTopicLine,
} from "@/lib/course-run-difficulty";

type Props = {
  run: CourseRun;
  /** Kompaktní řádek pod nadpisem. */
  compact?: boolean;
};

export function CourseRunPublicMeta({ run, compact = false }: Props) {
  const topic = courseRunTopicLine(run);
  const difficulty = courseDifficultyLabel(run.difficulty);

  if (!topic && !difficulty) return null;

  if (compact) {
    return (
      <p className="mt-1 text-xs font-medium leading-relaxed text-slate-600">
        {topic ? <span className="block">{topic}</span> : null}
        {difficulty ? (
          <span
            className={`mt-1 inline-flex rounded-full border px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide ${courseDifficultyBadgeClass(run.difficulty)}`}
          >
            {difficulty}
          </span>
        ) : null}
      </p>
    );
  }

  return (
    <div className="mt-3 space-y-2">
      {difficulty ? (
        <span
          className={`inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide ${courseDifficultyBadgeClass(run.difficulty)}`}
        >
          Náročnost: {difficulty}
        </span>
      ) : null}
      {topic ? (
        <p className="text-sm leading-relaxed text-slate-700">
          <span className="font-bold text-slate-800">Téma:</span> {topic}
        </p>
      ) : null}
    </div>
  );
}
