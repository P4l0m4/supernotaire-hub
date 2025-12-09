import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const supabaseUrl =
    config.public.SUPABASE_URL ||
    config.SUPABASE_URL ||
    process.env.NUXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL;
  const serviceKey =
    config.SUPABASE_SERVICE_KEY ||
    process.env.SUPABASE_SERVICE_KEY ||
    process.env.NUXT_SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.warn(
      "[supabase] Missing SUPABASE_URL or SUPABASE_SERVICE_KEY on server."
    );
    return { provide: { supabaseServer: null as SupabaseClient | null } };
  }

  const supabaseServer = createClient<Database>(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });

  return { provide: { supabaseServer } };
});
