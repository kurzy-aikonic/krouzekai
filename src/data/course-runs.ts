export type CourseFormat = "skupina" | "individual";

export type CourseRun = {
  id: string;
  label: string;
  /** Krátký popis termínu pro rodiče */
  description: string;
  format: "skupina";
  capacity: number;
  /** Obsazeno — upravuj ručně nebo napoj admin/sync */
  filled: number;
  /** ISO datum začátku (informativně) */
  startsOn: string;
};

/** Pilotní běhy — uprav podle reálných termínů. */
export const courseRuns: CourseRun[] = [
  {
    id: "run-2026-04-ut",
    label: "Úterý 16:00 — start duben 2026",
    description: "Online, 60 minut, 12 lekcí. Skupina max. 6 dětí.",
    format: "skupina",
    capacity: 6,
    filled: 0,
    startsOn: "2026-04-07",
  },
  {
    id: "run-2026-04-ct",
    label: "Čtvrtek 16:00 — start duben 2026",
    description: "Online, 60 minut, 12 lekcí. Skupina max. 6 dětí.",
    format: "skupina",
    capacity: 6,
    filled: 0,
    startsOn: "2026-04-09",
  },
];

export function getRunById(id: string): CourseRun | undefined {
  return courseRuns.find((r) => r.id === id);
}

export function spotsLeft(run: CourseRun): number {
  return Math.max(0, run.capacity - run.filled);
}
