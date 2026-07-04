-- Ceny kurzů z adminu (skupina + individuál).
-- Spusť v Supabase → SQL Editor (stejný projekt jako web_course_runs).

create table if not exists public.web_course_pricing (
  id text primary key default 'default',
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.web_course_pricing enable row level security;

comment on table public.web_course_pricing is 'Globální ceny kurzu: payload.skupinaCourseCzk, payload.individualCourseCzk.';
