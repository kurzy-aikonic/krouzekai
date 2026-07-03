import type { CourseFormat, CourseRun } from "@/data/course-runs";
import { site } from "@/lib/site-config";

/** 1 = pondělí … 7 = neděle (ISO) */
export type WeekdayIso = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type CourseRecurrence = "weekly" | "biweekly" | "none";

export const WEEKDAYS_CS: { value: WeekdayIso; short: string; label: string }[] =
  [
    { value: 1, short: "Po", label: "Pondělí" },
    { value: 2, short: "Út", label: "Úterý" },
    { value: 3, short: "St", label: "Středa" },
    { value: 4, short: "Čt", label: "Čtvrtek" },
    { value: 5, short: "Pá", label: "Pátek" },
    { value: 6, short: "So", label: "Sobota" },
    { value: 7, short: "Ne", label: "Neděle" },
  ];

export const RECURRENCE_OPTIONS: {
  value: CourseRecurrence;
  label: string;
  hint: string;
}[] = [
  {
    value: "biweekly",
    label: "Jednou za 14 dní",
    hint: "Standard u kroužku — 10 lekcí v cca 20 týdnech",
  },
  {
    value: "weekly",
    label: "Každý týden",
    hint: "Lekce v každém kalendářním týdnu",
  },
  {
    value: "none",
    label: "Bez pravidelného opakování",
    hint: "Jen informativní start — termín bez týdenního cyklu",
  },
];

export function weekdayFromIsoDate(iso: string): WeekdayIso | undefined {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return undefined;
  const d = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return undefined;
  const js = d.getDay();
  return (js === 0 ? 7 : js) as WeekdayIso;
}

export function weekdayLabel(weekday: number | undefined): string {
  return WEEKDAYS_CS.find((d) => d.value === weekday)?.label ?? "";
}

export function weekdayShort(weekday: number | undefined): string {
  return WEEKDAYS_CS.find((d) => d.value === weekday)?.short ?? "";
}

export function defaultRecurrenceForFormat(format: CourseFormat): CourseRecurrence {
  return format === "skupina" ? "biweekly" : "biweekly";
}

/** Doplní chybějící pole rozvrhu z data startu (starší záznamy). */
export function withScheduleDefaults(run: CourseRun): Required<
  Pick<CourseRun, "weekday" | "lessonTime" | "recurrence">
> &
  CourseRun {
  const weekday = run.weekday ?? weekdayFromIsoDate(run.startsOn) ?? 2;
  const lessonTime = run.lessonTime?.match(/^\d{2}:\d{2}$/)
    ? run.lessonTime
    : "16:00";
  const recurrence = run.recurrence ?? defaultRecurrenceForFormat(run.format);
  return { ...run, weekday, lessonTime, recurrence };
}

export function formatStartDateCs(iso: string): string {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("cs-CZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatStartMonthCs(iso: string): string {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("cs-CZ", {
    month: "long",
    year: "numeric",
  });
}

export function recurrencePhrase(recurrence: CourseRecurrence): string {
  switch (recurrence) {
    case "weekly":
      return "každý týden";
    case "biweekly":
      return "jednou za 14 dní";
    default:
      return "";
  }
}

export function recurrencePhraseAccusative(recurrence: CourseRecurrence): string {
  switch (recurrence) {
    case "weekly":
      return "každý týden";
    case "biweekly":
      return "jednou za 14 dní";
    default:
      return "";
  }
}

/** Nadpis pro rodiče — např. „Pondělí 16:00 — start duben 2026“. */
export function formatScheduleLabel(run: CourseRun): string {
  const s = withScheduleDefaults(run);
  const day = weekdayLabel(s.weekday);
  const time = s.lessonTime;
  const month = formatStartMonthCs(s.startsOn);
  if (!day) {
    return `Start ${month}`;
  }
  return `${day} ${time} — start ${month}`;
}

/** Krátký řádek rozvrhu pro veřejný web. */
export function formatScheduleSummary(run: CourseRun): string {
  const s = withScheduleDefaults(run);
  const day = weekdayLabel(s.weekday);
  const parts: string[] = [];
  if (day && s.lessonTime) {
    parts.push(`${day} ${s.lessonTime}`);
  }
  const rep = recurrencePhrase(s.recurrence);
  if (rep) parts.push(rep);
  parts.push(
    `start ${formatStartDateCs(s.startsOn)}`,
  );
  return parts.join(" · ");
}

export function formatScheduleDescription(run: CourseRun): string {
  const s = withScheduleDefaults(run);
  const rep = recurrencePhraseAccusative(s.recurrence);
  const repPart = rep ? `, ${rep}` : "";
  if (s.format === "individual") {
    return `Individuální lekce online, ${site.pricing.lessonMinutes} minut, ${site.pricing.lessons} lekcí${repPart}.`;
  }
  return `Online, ${site.pricing.lessonMinutes} minut, ${site.pricing.lessons} lekcí${repPart}. Skupina max. ${site.pricing.groupMaxStudents} dětí.`;
}

export function slugFromSchedule(run: CourseRun): string {
  const s = withScheduleDefaults(run);
  const day = weekdayShort(s.weekday).toLowerCase();
  const [hh, mm] = s.lessonTime.split(":");
  const ym = s.startsOn.slice(0, 7).replace("-", "");
  const fmt = s.format === "individual" ? "1v1" : "sk";
  return `${fmt}-${day}-${hh}${mm}-${ym}`;
}

/** První výskyt zvoleného dne v týdnu (dnes nebo později). */
export function suggestStartsOn(
  weekday: WeekdayIso,
  from = new Date(),
): string {
  const base = new Date(from);
  base.setHours(12, 0, 0, 0);
  const current = base.getDay() === 0 ? 7 : base.getDay();
  let delta = weekday - current;
  if (delta < 0) delta += 7;
  base.setDate(base.getDate() + delta);
  return base.toISOString().slice(0, 10);
}

/** Je uložený text shodný s automatickým návrhem? */
export function labelMatchesAuto(run: CourseRun): boolean {
  const auto = formatScheduleLabel(run).trim();
  return run.label.trim() === auto;
}

export function descriptionMatchesAuto(run: CourseRun): boolean {
  return run.description.trim() === formatScheduleDescription(run).trim();
}

export function idMatchesAuto(run: CourseRun): boolean {
  const auto = slugFromSchedule(run);
  return run.id.trim() === auto || run.id.startsWith("run-");
}

export function buildAutoCopyFromSchedule(run: CourseRun): Partial<CourseRun> {
  const normalized = withScheduleDefaults(run);
  return {
    weekday: normalized.weekday,
    lessonTime: normalized.lessonTime,
    recurrence: normalized.recurrence,
    label: formatScheduleLabel(normalized),
    description: formatScheduleDescription(normalized),
    id: slugFromSchedule(normalized),
  };
}
