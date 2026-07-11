import type { CourseDifficulty, CourseRun } from "@/data/course-runs";

export type { CourseDifficulty };

export const COURSE_DIFFICULTY_LEVELS = [
  "beginner",
  "advanced",
  "professional",
] as const satisfies readonly CourseDifficulty[];

export const COURSE_DIFFICULTY_OPTIONS: {
  value: CourseDifficulty;
  label: string;
  hint: string;
  badgeClass: string;
}[] = [
  {
    value: "beginner",
    label: "Začátečník",
    hint: "První kroky s AI, bez předchozích zkušeností",
    badgeClass: "border-emerald-200 bg-emerald-50 text-emerald-900",
  },
  {
    value: "advanced",
    label: "Pokročilý",
    hint: "Děti, které už něco tvořily nebo mají delší praxi s PC",
    badgeClass: "border-amber-200 bg-amber-50 text-amber-950",
  },
  {
    value: "professional",
    label: "AI tvůrce",
    hint: "Ambiciózní projekty, větší samostatnost",
    badgeClass: "border-violet-300 bg-violet-100 text-violet-950",
  },
];

export function isCourseDifficulty(value: unknown): value is CourseDifficulty {
  return (
    typeof value === "string" &&
    (COURSE_DIFFICULTY_LEVELS as readonly string[]).includes(value)
  );
}

export function courseDifficultyLabel(
  difficulty: CourseDifficulty | undefined,
): string | null {
  if (!difficulty) return null;
  return (
    COURSE_DIFFICULTY_OPTIONS.find((o) => o.value === difficulty)?.label ?? null
  );
}

export function courseDifficultyBadgeClass(
  difficulty: CourseDifficulty | undefined,
): string {
  if (!difficulty) return "border-slate-200 bg-slate-50 text-slate-700";
  return (
    COURSE_DIFFICULTY_OPTIONS.find((o) => o.value === difficulty)?.badgeClass ??
    "border-slate-200 bg-slate-50 text-slate-700"
  );
}

export function courseRunTopicLine(run: CourseRun): string | null {
  const topic = run.topic?.trim();
  return topic ? topic : null;
}

export function hasCourseRunContentMeta(run: CourseRun): boolean {
  return Boolean(run.topic?.trim() || run.difficulty);
}
