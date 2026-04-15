import { readFile, writeFile } from "fs/promises";
import path from "path";
import { z } from "zod";
import { defaultCourseRuns, type CourseRun } from "@/data/course-runs";

const courseRunSchema = z.object({
  id: z.string().min(1).max(120),
  label: z.string().min(1).max(300),
  description: z.string().min(1).max(800),
  format: z.literal("skupina"),
  capacity: z.coerce.number().int().min(1).max(500),
  filled: z.coerce.number().int().min(0).max(5000),
  startsOn: z.string().min(4).max(40),
  active: z.boolean().optional().default(true),
});

export const courseRunsPutSchema = z.object({
  runs: z
    .array(courseRunSchema)
    .max(80)
    .refine(
      (runs) => new Set(runs.map((r) => r.id)).size === runs.length,
      "Každý termín musí mít unikátní id.",
    ),
});

export type CourseRunsPutBody = z.infer<typeof courseRunsPutSchema>;

function courseRunsPath(): string {
  return path.join(process.cwd(), "data", "course-runs.json");
}

function normalizeRun(r: CourseRun): CourseRun {
  const filled = Math.min(Math.max(0, r.filled), r.capacity);
  const active = r.active !== false;
  return { ...r, filled, active };
}

/**
 * Načte termíny z `data/course-runs.json`. Chybějící soubor → výchozí pole z kódu.
 * Existující soubor s `runs: []` → prázdné (žádné termíny na webu).
 */
export async function listCourseRuns(): Promise<CourseRun[]> {
  try {
    const raw = await readFile(courseRunsPath(), "utf-8");
    const json: unknown = JSON.parse(raw);
    if (!json || typeof json !== "object" || !("runs" in json)) {
      return defaultCourseRuns;
    }
    const runs = (json as { runs: unknown }).runs;
    if (!Array.isArray(runs)) return defaultCourseRuns;
    const out: CourseRun[] = [];
    for (const item of runs) {
      const p = courseRunSchema.safeParse(item);
      if (p.success) out.push(normalizeRun(p.data));
    }
    return out;
  } catch (e) {
    const err = e as NodeJS.ErrnoException;
    if (err.code === "ENOENT") return defaultCourseRuns;
    return defaultCourseRuns;
  }
}

export async function getCourseRunById(id: string): Promise<CourseRun | undefined> {
  const t = id.trim();
  if (!t) return undefined;
  return (await listCourseRuns()).find((r) => r.id === t);
}

/** Termíny zobrazené na webu (registrace, veřejné API). */
export async function listOfferedCourseRuns(): Promise<CourseRun[]> {
  const all = await listCourseRuns();
  return all.filter((r) => r.active !== false);
}

export async function replaceCourseRuns(runs: CourseRun[]): Promise<void> {
  const parsed = courseRunsPutSchema.parse({ runs });
  const normalized = parsed.runs.map(normalizeRun);
  const body = `${JSON.stringify({ runs: normalized }, null, 2)}\n`;
  await writeFile(courseRunsPath(), body, "utf-8");
}
