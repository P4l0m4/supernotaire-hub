import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const supabaseUrl =
    config.public.SUPABASE_URL ||
    config.SUPABASE_URL ||
    process.env.NUXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL;
  const supabaseAnonKey =
    config.public.SUPABASE_ANON_KEY ||
    config.SUPABASE_ANON_KEY ||
    process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
      "[supabase] Missing SUPABASE_URL or SUPABASE_ANON_KEY. Supabase client not initialised."
    );

    return {
      provide: {
        supabase: null as SupabaseClient | null,
      },
    };
  }

  const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
  });

  return {
    provide: {
      supabase,
    },
  };
});

declare module "#app" {
  interface NuxtApp {
    $supabase: SupabaseClient | null;
  }
}

declare module "vue" {
  interface ComponentCustomProperties {
    $supabase: SupabaseClient | null;
  }
}
