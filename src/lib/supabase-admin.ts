import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let supabaseAdmin: SupabaseClient | null | undefined;

/** Service role klient — jen na serveru, nikdy do prohlížeče. */
export function getSupabaseAdmin(): SupabaseClient | null {
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
