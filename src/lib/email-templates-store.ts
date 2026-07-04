import { readFile, writeFile } from "fs/promises";
import path from "path";
import { Redis } from "@upstash/redis";
import { z } from "zod";
import {
  defaultEmailTemplatesRecord,
  isEmailTemplateId,
} from "@/lib/email-templates-defaults";
import type { EmailTemplateContent, EmailTemplateId } from "@/lib/email-template-types";
import { EMAIL_TEMPLATE_IDS } from "@/lib/email-template-types";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const REDIS_KEY = "krouzek:email-templates:v1";
const ROW_ID = "default";

const templateContentSchema = z.object({
  subject: z.string().min(1).max(300),
  htmlBody: z.string().min(1).max(100_000),
});

const storedTemplatesSchema = z.record(
  z.enum(EMAIL_TEMPLATE_IDS),
  templateContentSchema,
);

export type EmailTemplatesConfig = {
  templates: Record<EmailTemplateId, EmailTemplateContent>;
  updatedAt?: string;
};

export type EmailTemplatesDataSource = "supabase" | "redis" | "file" | "defaults";

function templatesPath(): string {
  return path.join(process.cwd(), "data", "email-templates.json");
}

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) return null;
  return new Redis({ url, token });
}

function mergeWithDefaults(
  partial: Partial<Record<EmailTemplateId, EmailTemplateContent>>,
): EmailTemplatesConfig {
  const defaults = defaultEmailTemplatesRecord();
  const templates = { ...defaults };
  for (const id of EMAIL_TEMPLATE_IDS) {
    const override = partial[id];
    if (override) {
      templates[id] = { ...override };
    }
  }
  return { templates };
}

function normalizeStored(raw: unknown): Partial<Record<EmailTemplateId, EmailTemplateContent>> | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const candidate =
    o.templates && typeof o.templates === "object"
      ? o.templates
      : o;
  const parsed = storedTemplatesSchema.safeParse(candidate);
  if (!parsed.success) return null;
  return parsed.data;
}

async function loadFromSupabase(): Promise<EmailTemplatesConfig | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("web_email_templates")
    .select("payload, updated_at")
    .eq("id", ROW_ID)
    .maybeSingle();

  if (error) {
    console.error("[email-templates] Supabase read:", error.message);
    return null;
  }
  if (!data?.payload) return null;

  const partial = normalizeStored(data.payload);
  if (!partial) return null;
  const merged = mergeWithDefaults(partial);
  return {
    ...merged,
    updatedAt:
      typeof data.updated_at === "string" ? data.updated_at : undefined,
  };
}

async function loadFromRedis(redis: Redis): Promise<EmailTemplatesConfig | null> {
  const raw = await redis.get(REDIS_KEY);
  if (raw == null || raw === "") return null;
  try {
    const obj = typeof raw === "string" ? JSON.parse(raw) : raw;
    const partial = normalizeStored(obj);
    if (!partial) return null;
    return mergeWithDefaults(partial);
  } catch {
    return null;
  }
}

async function loadFromFile(): Promise<EmailTemplatesConfig | null> {
  try {
    const raw = await readFile(templatesPath(), "utf-8");
    const partial = normalizeStored(JSON.parse(raw));
    if (!partial) return null;
    return mergeWithDefaults(partial);
  } catch (e) {
    const err = e as NodeJS.ErrnoException;
    if (err.code === "ENOENT") return null;
    return null;
  }
}

async function resolveEmailTemplates(): Promise<{
  config: EmailTemplatesConfig;
  source: EmailTemplatesDataSource;
}> {
  const fromDb = await loadFromSupabase();
  if (fromDb !== null) {
    return { config: fromDb, source: "supabase" };
  }

  const redis = getRedis();
  if (redis) {
    const fromRedis = await loadFromRedis(redis);
    if (fromRedis !== null) {
      return { config: fromRedis, source: "redis" };
    }
  }

  const fromFile = await loadFromFile();
  if (fromFile !== null) {
    return { config: fromFile, source: "file" };
  }

  return {
    config: { templates: defaultEmailTemplatesRecord() },
    source: "defaults",
  };
}

export async function getEmailTemplatesDataSource(): Promise<EmailTemplatesDataSource> {
  return (await resolveEmailTemplates()).source;
}

export async function getEmailTemplatesConfig(): Promise<EmailTemplatesConfig> {
  return (await resolveEmailTemplates()).config;
}

export async function getEmailTemplate(
  id: EmailTemplateId,
): Promise<EmailTemplateContent> {
  const config = await getEmailTemplatesConfig();
  return config.templates[id];
}

export function emailTemplatesPersistenceMode(): "supabase" | "redis" | "file" {
  if (getSupabaseAdmin()) return "supabase";
  if (getRedis()) return "redis";
  return "file";
}

export type EmailTemplatesPutBody = {
  templates: Partial<Record<EmailTemplateId, EmailTemplateContent>>;
};

export async function replaceEmailTemplates(
  input: EmailTemplatesPutBody,
): Promise<EmailTemplatesConfig> {
  const current = await getEmailTemplatesConfig();
  const nextTemplates = { ...current.templates };

  for (const [rawId, content] of Object.entries(input.templates)) {
    if (!isEmailTemplateId(rawId) || !content) continue;
    const parsed = templateContentSchema.parse(content);
    nextTemplates[rawId] = parsed;
  }

  return persistEmailTemplateOverrides(nextTemplates);
}

function overridesFromTemplates(
  templates: Record<EmailTemplateId, EmailTemplateContent>,
): Partial<Record<EmailTemplateId, EmailTemplateContent>> {
  const defaults = defaultEmailTemplatesRecord();
  const payloadToStore: Partial<Record<EmailTemplateId, EmailTemplateContent>> =
    {};
  for (const id of EMAIL_TEMPLATE_IDS) {
    const cur = templates[id];
    const def = defaults[id];
    if (cur.subject !== def.subject || cur.htmlBody !== def.htmlBody) {
      payloadToStore[id] = cur;
    }
  }
  return payloadToStore;
}

async function persistEmailTemplateOverrides(
  nextTemplates: Record<EmailTemplateId, EmailTemplateContent>,
): Promise<EmailTemplatesConfig> {
  const updatedAt = new Date().toISOString();
  const payloadToStore = overridesFromTemplates(nextTemplates);
  const storedPayload = {
    templates: payloadToStore,
    updatedAt,
  };
  const serialized = JSON.stringify(storedPayload, null, 2);

  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { error } = await supabase.from("web_email_templates").upsert(
      {
        id: ROW_ID,
        payload: storedPayload,
        updated_at: updatedAt,
      },
      { onConflict: "id" },
    );
    if (error) throw new Error(error.message);
    return { templates: nextTemplates, updatedAt };
  }

  const redis = getRedis();
  if (redis) {
    await redis.set(REDIS_KEY, serialized);
    return { templates: nextTemplates, updatedAt };
  }

  await writeFile(templatesPath(), `${serialized}\n`, "utf-8");
  return { templates: nextTemplates, updatedAt };
}

export async function resetEmailTemplate(
  id: EmailTemplateId,
): Promise<EmailTemplatesConfig> {
  const current = await getEmailTemplatesConfig();
  const defaults = defaultEmailTemplatesRecord();
  const nextTemplates = { ...current.templates, [id]: defaults[id] };
  return persistEmailTemplateOverrides(nextTemplates);
}

export async function resetAllEmailTemplates(): Promise<EmailTemplatesConfig> {
  return persistEmailTemplateOverrides(defaultEmailTemplatesRecord());
}
