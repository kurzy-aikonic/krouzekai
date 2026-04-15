-- Skupinové termíny z adminu (Vercel / serverless — zápis do souboru nejde).
-- Spusť v Supabase → SQL Editor (stejný projekt jako u web/supabase-rate-limit.sql).
-- Vyžaduje SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY na serveru.

create table if not exists public.web_course_runs (
  id text primary key default 'default',
  runs jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.web_course_runs enable row level security;

-- Bez politik — běžný anon/authenticated klient k tabulce nepřistoupí; service_role RLS obchází.

comment on table public.web_course_runs is 'Skupinové běhy kurzu; jeden řádek id=default, pole runs = JSON pole termínů.';
