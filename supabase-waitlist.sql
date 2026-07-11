-- Čekací listina (zájemci o plný termín). Spusť v Supabase → SQL Editor
-- (stejný projekt jako web_registrations a ostatní web_* tabulky).
-- Vyžaduje SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY na serveru.
-- Bez Supabase se ukládá lokálně do data/waitlist.jsonl (funguje jen mimo Vercel).

create table if not exists public.web_waitlist (
  id text primary key,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

create index if not exists web_waitlist_updated_at_idx
  on public.web_waitlist (updated_at desc);

alter table public.web_waitlist enable row level security;

-- Bez politik — přístup jen přes service_role z Next.js API.

comment on table public.web_waitlist is 'Čekací listina na plné termíny; payload = kompletní záznam vč. receivedAt / updatedAt.';
