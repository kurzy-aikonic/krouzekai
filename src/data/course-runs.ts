import { site } from "@/lib/site-config";

export type CourseFormat = "skupina" | "individual";

/** Náročnost / úroveň termínu pro rodiče. */
export type CourseDifficulty = "beginner" | "advanced" | "professional";

/** Opakování lekcí v rámci termínu */
export type CourseRecurrence = "weekly" | "biweekly" | "none";

export type CourseRun = {
  id: string;
  label: string;
  /** Krátký popis termínu pro rodiče */
  description: string;
  /** Konkrétní téma nebo zaměření běhu (volitelné). */
  topic?: string;
  /** Úroveň náročnosti — zobrazí se rodičům u termínu. */
  difficulty?: CourseDifficulty;
  /**
   * Vlastní cena tohoto termínu (Kč). Skupina = za dítě, 1:1 = celý kurz.
   * Prázdné = globální cena z adminu → Nástroje.
   */
  priceCzk?: number;
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

/** Platí pro jarní skupiny 2027. Přesný kalendář lekcí se posílá až po registraci. */
export const springHolidayNote =
  "Týdny jarních prázdnin a Velikonoc vynecháváme. Přesná data lekcí potvrdíme po registraci.";

const springGroupDescription = `Online, každý týden, ${site.pricing.lessonMinutes} minut, ${site.pricing.lessons} lekcí. Skupina nejvýš ${site.pricing.groupMaxStudents} studentů. ${springHolidayNote}`;

/**
 * Výchozí běhy, pokud v databázi ani v souboru není žádný budoucí termín.
 */
export const defaultCourseRuns: CourseRun[] = [
  {
    id: "run-2027-01-ut",
    label: "Úterý 16:00–17:00 — start 12. ledna 2027",
    description: springGroupDescription,
    format: "skupina",
    capacity: 6,
    filled: 0,
    startsOn: "2027-01-12",
    weekday: 2,
    lessonTime: "16:00",
    recurrence: "weekly",
  },
  {
    id: "run-2027-01-ct",
    label: "Čtvrtek 16:00–17:00 — start 14. ledna 2027",
    description: springGroupDescription,
    format: "skupina",
    capacity: 6,
    filled: 0,
    startsOn: "2027-01-14",
    weekday: 4,
    lessonTime: "16:00",
    recurrence: "weekly",
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
