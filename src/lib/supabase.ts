import { createClient, SupabaseClient } from "@supabase/supabase-js";
import ws from "ws";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

/**
 * Client Supabase universel compatible Browser et Node.js (App Router, Server Actions, Scripts)
 */
export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: typeof window !== "undefined",
        },
        realtime: {
          transport: typeof window === "undefined" ? (ws as any) : undefined,
        },
      })
    : null;

/**
 * Fonction d'accès sécurisée garantissant la présence du client
 */
export function getSupabaseClient(): SupabaseClient {
  if (!supabase) {
    throw new Error(
      "Supabase n'est pas encore configuré. Veuillez renseigner NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY dans votre fichier .env"
    );
  }
  return supabase;
}
