export type CourseFormat = "skupina" | "individual";

export type CourseRun = {
  id: string;
  label: string;
  /** Krátký popis termínu pro rodiče */
  description: string;
  format: "skupina";
  capacity: number;
  /** Obsazeno — ruční override; skutečný počet z přihlášek bere větší z obou. */
  filled: number;
  /** ISO datum začátku (informativně) */
  startsOn: string;
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
  },
  {
    id: "run-2026-04-ct",
    label: "Čtvrtek 16:00 — start duben 2026",
    description: "Online, 60 minut, 10 lekcí. Skupina max. 6 dětí.",
    format: "skupina",
    capacity: 6,
    filled: 0,
    startsOn: "2026-04-09",
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
