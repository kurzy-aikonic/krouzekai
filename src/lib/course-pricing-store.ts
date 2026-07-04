import { readFile, writeFile } from "fs/promises";
import path from "path";
import { Redis } from "@upstash/redis";
import { z } from "zod";
import {
  defaultCoursePricingValues,
  perLessonCzk,
} from "@/lib/course-pricing-utils";
import type { PaymentProduct } from "@/lib/payment";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const REDIS_KEY = "krouzek:course-pricing:v1";
const PRICING_ROW_ID = "default";

export type CoursePricing = {
  /** Celková cena skupinového kurzu za jedno dítě (Kč). */
  skupinaCourseCzk: number;
  /** Celková cena individuálního 1:1 kurzu (Kč). */
  individualCourseCzk: number;
  updatedAt?: string;
};

export const coursePricingPutSchema = z.object({
  skupinaCourseCzk: z.coerce.number().int().min(100).max(500_000),
  individualCourseCzk: z.coerce.number().int().min(100).max(500_000),
});

export type CoursePricingPutBody = z.infer<typeof coursePricingPutSchema>;

export type CoursePricingDataSource = "supabase" | "redis" | "file" | "defaults";

function pricingPath(): string {
  return path.join(process.cwd(), "data", "course-pricing.json");
}

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export function defaultCoursePricing(): CoursePricing {
  return defaultCoursePricingValues();
}

function normalizePricing(raw: unknown): CoursePricing | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const parsed = coursePricingPutSchema.safeParse({
    skupinaCourseCzk: o.skupinaCourseCzk,
    individualCourseCzk: o.individualCourseCzk,
  });
  if (!parsed.success) return null;
  const updatedAt =
    typeof o.updatedAt === "string" ? o.updatedAt : undefined;
  return { ...parsed.data, updatedAt };
}

async function loadFromSupabase(): Promise<CoursePricing | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("web_course_pricing")
    .select("payload, updated_at")
    .eq("id", PRICING_ROW_ID)
    .maybeSingle();

  if (error) {
    console.error("[course-pricing] Supabase read:", error.message);
    return null;
  }
  if (!data?.payload) return null;

  const normalized = normalizePricing(data.payload);
  if (!normalized) return null;
  return {
    ...normalized,
    updatedAt:
      typeof data.updated_at === "string"
        ? data.updated_at
        : normalized.updatedAt,
  };
}

async function loadFromRedis(redis: Redis): Promise<CoursePricing | null> {
  const raw = await redis.get(REDIS_KEY);
  if (raw == null || raw === "") return null;
  try {
    const obj = typeof raw === "string" ? JSON.parse(raw) : raw;
    return normalizePricing(obj);
  } catch {
    return null;
  }
}

async function loadFromFile(): Promise<CoursePricing | null> {
  try {
    const raw = await readFile(pricingPath(), "utf-8");
    return normalizePricing(JSON.parse(raw));
  } catch (e) {
    const err = e as NodeJS.ErrnoException;
    if (err.code === "ENOENT") return null;
    return null;
  }
}

async function resolveCoursePricing(): Promise<{
  pricing: CoursePricing;
  source: CoursePricingDataSource;
}> {
  const fromDb = await loadFromSupabase();
  if (fromDb !== null) {
    return { pricing: fromDb, source: "supabase" };
  }

  const redis = getRedis();
  if (redis) {
    const fromRedis = await loadFromRedis(redis);
    if (fromRedis !== null) {
      return { pricing: fromRedis, source: "redis" };
    }
  }

  const fromFile = await loadFromFile();
  if (fromFile !== null) {
    return { pricing: fromFile, source: "file" };
  }

  return { pricing: defaultCoursePricing(), source: "defaults" };
}

export async function getCoursePricingDataSource(): Promise<CoursePricingDataSource> {
  return (await resolveCoursePricing()).source;
}

export async function getCoursePricing(): Promise<CoursePricing> {
  return (await resolveCoursePricing()).pricing;
}

export function coursePricingPersistenceMode(): "supabase" | "redis" | "file" {
  if (getSupabaseAdmin()) return "supabase";
  if (getRedis()) return "redis";
  return "file";
}

export async function replaceCoursePricing(
  input: CoursePricingPutBody,
): Promise<CoursePricing> {
  const parsed = coursePricingPutSchema.parse(input);
  const next: CoursePricing = {
    ...parsed,
    updatedAt: new Date().toISOString(),
  };
  const payload = JSON.stringify(next, null, 2);

  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { error } = await supabase.from("web_course_pricing").upsert(
      {
        id: PRICING_ROW_ID,
        payload: next,
        updated_at: next.updatedAt,
      },
      { onConflict: "id" },
    );
    if (error) throw new Error(error.message);
    return next;
  }

  const redis = getRedis();
  if (redis) {
    await redis.set(REDIS_KEY, payload);
    return next;
  }

  await writeFile(pricingPath(), `${payload}\n`, "utf-8");
  return next;
}

export async function coursePriceCzk(product: PaymentProduct): Promise<number> {
  const pricing = await getCoursePricing();
  switch (product) {
    case "skupina-course":
      return pricing.skupinaCourseCzk;
    case "individual-course":
      return pricing.individualCourseCzk;
    default: {
      const _exhaustive: never = product;
      return _exhaustive;
    }
  }
}

export async function getPublicCoursePricing(): Promise<{
  skupinaCourseCzk: number;
  individualCourseCzk: number;
  skupinaPerLessonCzk: number;
  individualPerLessonCzk: number;
}> {
  const p = await getCoursePricing();
  return {
    skupinaCourseCzk: p.skupinaCourseCzk,
    individualCourseCzk: p.individualCourseCzk,
    skupinaPerLessonCzk: perLessonCzk(p.skupinaCourseCzk),
    individualPerLessonCzk: perLessonCzk(p.individualCourseCzk),
  };
}

