-- Účty rodičů (heslo) pro /rodic — na Vercelu nelze spolehlivě zapisovat data/parent-accounts.jsonl.
-- Spusť v Supabase → SQL Editor (stejný projekt jako ostatní web/supabase-*.sql).
-- Vyžaduje SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY na serveru.

create table if not exists public.web_parent_accounts (
  email_norm text primary key,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.web_parent_accounts enable row level security;

comment on table public.web_parent_accounts is 'Rodičovské účty (bcrypt hash); payload = { emailNorm, passwordHash, createdAt }.';
