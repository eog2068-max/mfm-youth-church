/**
 * Supabase browser client (anon key, RLS-enforced).
 *
 * Used by client components for user-facing auth flows (magic-link sign-in,
 * sign-out, session refresh). RLS applies — user can only see/modify their
 * own data.
 *
 * Stage 3 of Go-A-Fishing.
 */
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./database-types";

/**
 * Singleton Supabase browser client. Safe to import in any client component.
 *
 * Required env vars:
 *   - NEXT_PUBLIC_SUPABASE_URL
 *   - NEXT_PUBLIC_SUPABASE_ANON_KEY
 */
export function getSupabaseBrowser() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
