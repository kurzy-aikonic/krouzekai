import { readFile, writeFile } from "fs/promises";
import path from "path";
import { cache } from "react";
import { Redis } from "@upstash/redis";
import { z } from "zod";
import { defaultCourseRuns, type CourseRun } from "@/data/course-runs";
import { prepareRunsForSave } from "@/lib/course-runs-admin-utils";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const REDIS_KEY = "krouzek:course-runs:v1";
const COURSE_RUNS_ROW_ID = "default";

const courseRunSchema = z.object({
  id: z.string().min(1).max(120),
  label: z.string().min(1).max(300),
  description: z.string().min(1).max(800),
  format: z.preprocess(
    (v) => (v === "individual" ? "individual" : "skupina"),
    z.enum(["skupina", "individual"]),
  ),
  capacity: z.coerce.number().int().min(1).max(500),
  filled: z.coerce.number().int().min(0).max(5000),
  startsOn: z.string().min(4).max(40),
  weekday: z.coerce.number().int().min(1).max(7).optional(),
  lessonTime: z.preprocess(
    (v) =>
      typeof v === "string" && /^\d{2}:\d{2}$/.test(v) ? v : undefined,
    z.string().regex(/^\d{2}:\d{2}$/).optional(),
  ),
  recurrence: z.enum(["weekly", "biweekly", "none"]).optional(),
  topic: z.preprocess(
    (v) => (typeof v === "string" ? v.trim() : ""),
    z.string().max(500).optional(),
  ),
  difficulty: z
    .enum(["beginner", "advanced", "professional"])
    .optional()
    .nullable()
    .transform((v) => v ?? undefined),
  priceCzk: z
    .union([z.coerce.number().int().min(100).max(500_000), z.null()])
    .optional()
    .transform((v) => (v == null ? undefined : v)),
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

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export type CourseRunsPersistence = "supabase" | "redis" | "file";

/** Kam se při zápisu ukládá (Supabase má přednost, pak Redis, pak soubor). */
export function courseRunsPersistenceMode(): CourseRunsPersistence {
  if (getSupabaseAdmin()) return "supabase";
  if (getRedis()) return "redis";
  return "file";
}

function normalizeRun(r: CourseRun): CourseRun {
  const filled = Math.min(Math.max(0, r.filled), r.capacity);
  const active = r.active !== false;
  return { ...r, filled, active };
}

function sanitizeRunRaw(item: unknown): unknown {
  if (!item || typeof item !== "object") return item;
  const o = { ...(item as Record<string, unknown>) };
  if (typeof o.lessonTime === "string" && !/^\d{2}:\d{2}$/.test(o.lessonTime)) {
    delete o.lessonTime;
  }
  if (typeof o.weekday === "number" && (o.weekday < 1 || o.weekday > 7)) {
    delete o.weekday;
  }
  if (
    o.recurrence !== "weekly" &&
    o.recurrence !== "biweekly" &&
    o.recurrence !== "none"
  ) {
    delete o.recurrence;
  }
  return o;
}

function parseRunsArray(runs: unknown): CourseRun[] {
  if (!Array.isArray(runs)) return [];
  const out: CourseRun[] = [];
  for (const item of runs) {
    const p = courseRunSchema.safeParse(sanitizeRunRaw(item));
    if (p.success) {
      out.push(normalizeRun(p.data));
      continue;
    }
    const raw = sanitizeRunRaw(item);
    if (!raw || typeof raw !== "object") continue;
    const o = raw as Record<string, unknown>;
    const fallback = courseRunSchema.safeParse({
      id: typeof o.id === "string" ? o.id : `run-${out.length + 1}`,
      label:
        typeof o.label === "string" && o.label.trim()
          ? o.label
          : "Termín kroužku",
      description:
        typeof o.description === "string" && o.description.trim()
          ? o.description
          : "Online kroužek umělé inteligence.",
      format: o.format === "individual" ? "individual" : "skupina",
      capacity: o.capacity ?? 6,
      filled: o.filled ?? 0,
      startsOn:
        typeof o.startsOn === "string" && o.startsOn.length >= 8
          ? o.startsOn.slice(0, 10)
          : new Date().toISOString().slice(0, 10),
      weekday: o.weekday,
      lessonTime: o.lessonTime,
      recurrence: o.recurrence,
      active: o.active !== false,
    });
    if (fallback.success) out.push(normalizeRun(fallback.data));
  }
  return out;
}

function parseRunsFromJsonBody(obj: unknown): CourseRun[] {
  if (!obj || typeof obj !== "object" || !("runs" in obj)) {
    return [];
  }
  return parseRunsArray((obj as { runs: unknown }).runs);
}

async function loadFromSupabase(): Promise<CourseRun[] | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("web_course_runs")
    .select("runs")
    .eq("id", COURSE_RUNS_ROW_ID)
    .maybeSingle();

  if (error) {
    console.error("[course-runs] Supabase read:", error.message);
    return null;
  }
  if (!data) return null;
  return parseRunsArray(data.runs);
}

async function loadFromRedis(redis: Redis): Promise<CourseRun[] | null> {
  const raw = await redis.get(REDIS_KEY);
  if (raw == null || raw === "") return null;
  try {
    const obj = typeof raw === "string" ? JSON.parse(raw) : raw;
    return parseRunsFromJsonBody(obj);
  } catch {
    return null;
  }
}

async function loadFromFile(): Promise<CourseRun[] | null> {
  try {
    const raw = await readFile(courseRunsPath(), "utf-8");
    const json: unknown = JSON.parse(raw);
    if (!json || typeof json !== "object" || !("runs" in json)) {
      return null;
    }
    const runs = (json as { runs: unknown }).runs;
    if (!Array.isArray(runs)) return null;
    return parseRunsArray(runs);
  } catch (e) {
    const err = e as NodeJS.ErrnoException;
    if (err.code === "ENOENT") return null;
    return null;
  }
}

/**
 * Pořadí: Supabase → Redis → soubor → výchozí z kódu.
 * Prázdné pole = žádné termíny na přihlášce.
 */
export type CourseRunsDataSource = "supabase" | "redis" | "file" | "defaults";

type ResolvedCourseRuns = {
  runs: CourseRun[];
  source: CourseRunsDataSource;
};

/**
 * Sloučí zdroje termínů. Prázdné Supabase/Redis neblokuje fallback na soubor —
 * typický problém na Vercelu, kde tabulka existuje s `runs: []`, ale admin ukládá
 * jinde nebo data ještě nejsou v DB.
 */
/** `cache()` memoizuje výsledek po dobu jednoho requestu — bez toho se termíny čtou opakovaně. */
const resolveCourseRuns = cache(async (): Promise<ResolvedCourseRuns> => {
  const fromDb = await loadFromSupabase();
  if (fromDb !== null && fromDb.length > 0) {
    return { runs: fromDb, source: "supabase" };
  }

  const redis = getRedis();
  let fromRedis: CourseRun[] | null = null;
  if (redis) {
    fromRedis = await loadFromRedis(redis);
    if (fromRedis !== null && fromRedis.length > 0) {
      return { runs: fromRedis, source: "redis" };
    }
  }

  const fromFile = await loadFromFile();
  if (fromFile !== null && fromFile.length > 0) {
    return { runs: fromFile, source: "file" };
  }

  if (fromDb !== null) {
    return { runs: fromDb, source: "supabase" };
  }
  if (fromRedis !== null) {
    return { runs: fromRedis, source: "redis" };
  }
  if (fromFile !== null) {
    return { runs: fromFile, source: "file" };
  }

  return { runs: defaultCourseRuns, source: "defaults" };
});

export async function getCourseRunsDataSource(): Promise<CourseRunsDataSource> {
  return (await resolveCourseRuns()).source;
}

export async function listCourseRuns(): Promise<CourseRun[]> {
  return (await resolveCourseRuns()).runs;
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
  const prepared = prepareRunsForSave(runs);
  const parsed = courseRunsPutSchema.parse({ runs: prepared });
  const normalized = parsed.runs.map(normalizeRun);
  const payload = JSON.stringify({ runs: normalized }, null, 2);

  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { error } = await supabase.from("web_course_runs").upsert(
      {
        id: COURSE_RUNS_ROW_ID,
        runs: normalized,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    );
    if (error) throw new Error(error.message);
    return;
  }

  const redis = getRedis();
  if (redis) {
    await redis.set(REDIS_KEY, payload);
    return;
  }

  await writeFile(courseRunsPath(), `${payload}\n`, "utf-8");
}
