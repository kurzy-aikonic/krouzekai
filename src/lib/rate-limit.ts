import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { getClientIp } from "@/lib/client-ip";

const ONE_HOUR_MS = 60 * 60 * 1000;

const scopes = {
  registrace: { limit: 10, windowLabel: "1 h" as const, windowMs: ONE_HOUR_MS },
  checkout: { limit: 30, windowLabel: "1 h" as const, windowMs: ONE_HOUR_MS },
  rodicMagic: { limit: 6, windowLabel: "1 h" as const, windowMs: ONE_HOUR_MS },
  rodicPrihlaseni: {
    limit: 30,
    windowLabel: "1 h" as const,
    windowMs: ONE_HOUR_MS,
  },
} as const;

export type RateLimitScope = keyof typeof scopes;

let supabaseAdmin: SupabaseClient | null | undefined;

function getSupabaseAdmin(): SupabaseClient | null {
  if (supabaseAdmin !== undefined) return supabaseAdmin;
  const url = process.env.SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) {
    supabaseAdmin = null;
    return null;
  }
  supabaseAdmin = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return supabaseAdmin;
}

type RpcResult = { allowed: boolean; retry_after?: number };

async function rateLimitViaSupabase(
  scope: RateLimitScope,
  ip: string,
  limit: number,
): Promise<RpcResult | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const { data, error } = await supabase.rpc("web_check_rate_limit", {
    p_scope: scope,
    p_ip_key: ip,
    p_limit: limit,
  });

  if (error) {
    console.error("[rate-limit] Supabase:", error.message);
    return null;
  }

  const row = data as RpcResult | null;
  if (!row || typeof row.allowed !== "boolean") {
    console.error("[rate-limit] Supabase: neočekávaná odpověď", data);
    return null;
  }

  return row;
}

function createRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

const redis = createRedis();

let warnedMemory = false;

const memory = new Map<string, { count: number; windowEnd: number }>();

function memoryAllow(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const row = memory.get(key);
  if (!row || now >= row.windowEnd) {
    memory.set(key, { count: 1, windowEnd: now + windowMs });
    if (memory.size > 25_000) {
      for (const [k, v] of memory) {
        if (now >= v.windowEnd) memory.delete(k);
      }
    }
    return true;
  }
  if (row.count >= limit) return false;
  row.count += 1;
  return true;
}

const redisLimiters = new Map<RateLimitScope, Ratelimit>();

function ratelimiter(scope: RateLimitScope): Ratelimit | null {
  if (!redis) return null;
  let r = redisLimiters.get(scope);
  if (!r) {
    const cfg = scopes[scope];
    r = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(cfg.limit, cfg.windowLabel),
      prefix: `krouzek-ai:${scope}`,
      analytics: false,
    });
    redisLimiters.set(scope, r);
  }
  return r;
}

function tooManyResponse(retryAfterSec: number) {
  return NextResponse.json(
    { error: "Příliš mnoho požadavků. Zkuste to za chvíli znovu." },
    {
      status: 429,
      headers: { "Retry-After": String(retryAfterSec) },
    },
  );
}

/**
 * Pořadí: Supabase (Postgres RPC) → Upstash Redis → paměť instance.
 * Supabase: soubor `supabase-rate-limit.sql` + SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY.
 */
export async function rateLimitResponse(
  request: Request,
  scope: RateLimitScope,
): Promise<NextResponse | null> {
  const ip = getClientIp(request);
  const cfg = scopes[scope];

  const sb = await rateLimitViaSupabase(scope, ip, cfg.limit);
  if (sb !== null) {
    if (!sb.allowed) {
      const retry = Math.max(1, Math.floor(sb.retry_after ?? 3600));
      return tooManyResponse(retry);
    }
    return null;
  }

  const limiter = ratelimiter(scope);
  if (limiter) {
    const result = await limiter.limit(ip);
    if (result.success) return null;
    const retryAfter = Math.max(
      1,
      Math.ceil((result.reset - Date.now()) / 1000),
    );
    return tooManyResponse(retryAfter);
  }

  if (process.env.NODE_ENV === "production" && !warnedMemory) {
    warnedMemory = true;
    console.warn(
      "[security] Rate limit běží v paměti (per instance). Pro produkci nastavte Supabase (viz web/supabase-rate-limit.sql) nebo UPSTASH_REDIS_*.",
    );
  }

  if (memoryAllow(`${scope}:${ip}`, cfg.limit, cfg.windowMs)) return null;

  return tooManyResponse(Math.ceil(cfg.windowMs / 1000));
}
