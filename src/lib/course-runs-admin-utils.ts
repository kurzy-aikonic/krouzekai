import type { CourseRun } from "@/data/course-runs";
import {
  buildAutoCopyFromSchedule,
  slugFromSchedule,
  withScheduleDefaults,
} from "@/lib/course-run-schedule";

export function uniqueRunId(
  run: CourseRun,
  usedIds: Set<string>,
): string {
  const base = slugFromSchedule(run);
  if (!usedIds.has(base)) return base;
  let n = 2;
  while (usedIds.has(`${base}-${n}`)) n += 1;
  return `${base}-${n}`;
}

/** Doplní povinná pole a unikátní id před uložením. */
export function prepareRunsForSave(runs: CourseRun[]): CourseRun[] {
  const usedIds = new Set<string>();
  return runs.map((run) => {
    const normalized = withScheduleDefaults(run);
    const withCopy =
      normalized.label.trim() && normalized.description.trim()
        ? normalized
        : { ...normalized, ...buildAutoCopyFromSchedule(normalized) };
    const id =
      withCopy.id.trim() && !usedIds.has(withCopy.id.trim())
        ? withCopy.id.trim()
        : uniqueRunId(withCopy, usedIds);
    usedIds.add(id);
    return {
      ...withCopy,
      id,
      label: withCopy.label.trim(),
      description: withCopy.description.trim(),
      filled: Math.min(Math.max(0, withCopy.filled), withCopy.capacity),
      active: withCopy.active !== false,
    };
  });
}

export function validateRunsForSave(runs: CourseRun[]): string | null {
  if (runs.length === 0) return null;
  const ids = new Set<string>();
  for (let i = 0; i < runs.length; i += 1) {
    const run = runs[i];
    const n = i + 1;
    if (!run.label.trim()) {
      return `Termín ${n}: chybí nadpis pro rodiče.`;
    }
    if (!run.description.trim()) {
      return `Termín ${n}: chybí popis.`;
    }
    if (!run.startsOn.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return `Termín ${n}: neplatné datum startu.`;
    }
    if (ids.has(run.id)) {
      return `Termín ${n}: duplicitní technické id „${run.id}".`;
    }
    ids.add(run.id);
  }
  return null;
}
