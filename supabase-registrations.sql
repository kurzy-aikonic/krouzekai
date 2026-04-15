-- Přihlášky z veřejného formuláře (Vercel — lokální data/registrations.jsonl nelze spolehlivě zapisovat).
-- Spusť v Supabase → SQL Editor (stejný projekt jako rate limit a web_course_runs).
-- Vyžaduje SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY na serveru.

create table if not exists public.web_registrations (
  id text primary key,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

create index if not exists web_registrations_updated_at_idx
  on public.web_registrations (updated_at desc);

alter table public.web_registrations enable row level security;

-- Bez politik — přístup jen přes service_role z Next.js API.

comment on table public.web_registrations is 'Přihlášky; payload = kompletní záznam vč. receivedAt / updatedAt.';
