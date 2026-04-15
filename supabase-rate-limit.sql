-- Spusť celý skript v Supabase: SQL Editor → New query → vložit → Run.
-- Po spuštění nastav na hostingu (jen server, nikdy do prohlížeče):
--   SUPABASE_URL=https://xxxx.supabase.co
--   SUPABASE_SERVICE_ROLE_KEY=eyJ...  (Project Settings → API → service_role)

create table if not exists public.web_rate_limits (
  scope text not null,
  bucket_start timestamptz not null,
  ip_key text not null,
  count int not null default 0,
  primary key (scope, bucket_start, ip_key)
);

alter table public.web_rate_limits enable row level security;

-- Žádné politiky = běžný klient přes anon key k tabulce nepřečte nic.
-- service_role klíč RLS obchází (používá ho jen tvůj Next.js server).

create or replace function public.web_check_rate_limit(
  p_scope text,
  p_ip_key text,
  p_limit int
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_bucket timestamptz := date_trunc('hour', (now() at time zone 'utc'));
  v_count int;
begin
  insert into public.web_rate_limits (scope, bucket_start, ip_key, count)
  values (p_scope, v_bucket, left(p_ip_key, 128), 1)
  on conflict (scope, bucket_start, ip_key)
  do update set count = public.web_rate_limits.count + 1
  returning count into v_count;

  if v_count > p_limit then
    return jsonb_build_object('allowed', false, 'retry_after', 3600);
  end if;

  return jsonb_build_object('allowed', true);
end;
$$;

revoke all on function public.web_check_rate_limit(text, text, int) from public;
revoke all on function public.web_check_rate_limit(text, text, int) from anon, authenticated;
grant execute on function public.web_check_rate_limit(text, text, int) to service_role;

-- Volitelně později: naplánovat mazání starých řádků (starší než 2 dny), ať tabulka neroste.
