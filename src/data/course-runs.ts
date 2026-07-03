export type CourseFormat = "skupina" | "individual";

/** Opakování lekcí v rámci termínu */
export type CourseRecurrence = "weekly" | "biweekly" | "none";

export type CourseRun = {
  id: string;
  label: string;
  /** Krátký popis termínu pro rodiče */
  description: string;
  format: CourseFormat;
  capacity: number;
  /** Obsazeno — ruční override; skutečný počet z přihlášek bere větší z obou. */
  filled: number;
  /** ISO datum začátku (informativně) */
  startsOn: string;
  /** Den v týdnu první / pravidelné lekce: 1 = pondělí … 7 = neděle */
  weekday?: number;
  /** Čas lekce HH:mm */
  lessonTime?: string;
  /** Jak často se lekce opakuje */
  recurrence?: CourseRecurrence;
  /**
   * false = termín zrušený v nabídce (registrace ho neuvidí; stávající přihlášky zůstávají).
   * U záznamů bez pole se bere true.
   */
  active?: boolean;
};

/**
 * Výchozí běhy, pokud soubor `data/course-runs.json` ještě neexistuje.
 * Po uložení termínů v adminu se používá jen JSON (může být i prázdné pole).
 */
export const defaultCourseRuns: CourseRun[] = [
  {
    id: "run-2026-04-ut",
    label: "Úterý 16:00 — start duben 2026",
    description: "Online, 60 minut, 10 lekcí. Skupina max. 6 dětí.",
    format: "skupina",
    capacity: 6,
    filled: 0,
    startsOn: "2026-04-07",
    weekday: 2,
    lessonTime: "16:00",
    recurrence: "biweekly",
  },
  {
    id: "run-2026-04-ct",
    label: "Čtvrtek 16:00 — start duben 2026",
    description: "Online, 60 minut, 10 lekcí. Skupina max. 6 dětí.",
    format: "skupina",
    capacity: 6,
    filled: 0,
    startsOn: "2026-04-09",
    weekday: 4,
    lessonTime: "16:00",
    recurrence: "biweekly",
  },
];

export function spotsLeft(run: CourseRun): number {
  return Math.max(0, run.capacity - run.filled);
}

/** Volná místa s ohledem na ruční `filled` i počet přihlášek. */
export function spotsLeftEffective(run: CourseRun, registrationCount: number): number {
  const occupied = Math.max(run.filled, registrationCount);
  return Math.max(0, run.capacity - occupied);
}
