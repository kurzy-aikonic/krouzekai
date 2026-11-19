import type { CourseRun } from "@/data/course-runs";

/** Kalendářní den v Česku, formát YYYY-MM-DD. Nezávisí na časovém pásmu serveru. */
export function pragueTodayIso(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Prague",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/**
 * Veřejně ukazujeme jen termíny, které ještě nezačaly (včetně dneška).
 * Zrušené termíny (`active: false`) a neplatné datum se nezobrazí.
 * Jakmile v administraci nebo v databázi přibude budoucí `startsOn`, termín se ukáže sám.
 */
export function isUpcomingCourseRun(
  run: Pick<CourseRun, "active" | "startsOn">,
  todayIso = pragueTodayIso(),
): boolean {
  if (run.active === false) return false;
  return /^\d{4}-\d{2}-\d{2}$/.test(run.startsOn) && run.startsOn >= todayIso;
}

export function filterUpcomingCourseRuns<
  T extends Pick<CourseRun, "active" | "startsOn">,
>(runs: T[], todayIso = pragueTodayIso()): T[] {
  return runs.filter((run) => isUpcomingCourseRun(run, todayIso));
}
