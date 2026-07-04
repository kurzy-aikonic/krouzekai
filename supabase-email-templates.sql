-- E-mailové šablony z adminu.
-- Spusť v Supabase → SQL Editor (stejný projekt jako web_course_runs).

create table if not exists public.web_email_templates (
  id text primary key default 'default',
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.web_email_templates enable row level security;

comment on table public.web_email_templates is 'Šablony e-mailů: payload.templates = pouze přepsané šablony oproti výchozím z kódu.';
