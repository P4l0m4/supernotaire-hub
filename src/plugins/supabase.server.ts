import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const supabaseUrl = config.public.SUPABASE_URL;
  const serviceKey = config.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.warn("[supabase] Missing SUPABASE_URL or SUPABASE_SERVICE_KEY");
    return { provide: { supabaseServer: null as SupabaseClient | null } };
  }

  const supabaseServer = createClient<Database>(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });

  return { provide: { supabaseServer } };
});
