/**
 * Supabase server-side client (service role).
 *
 * Used by server components, API routes, and server actions for privileged
 * operations that bypass Row-Level Security (RLS). NEVER import this in a
 * client component — the service-role key grants full DB access.
 *
 * Stage 3 of Go-A-Fishing.
 */
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./database-types";

/**
 * Returns a Supabase server client configured with the user's cookie session.
 * Use this in server components / route handlers where you need to act AS
 * the currently-logged-in user (RLS applies).
 *
 * Required env vars:
 *   - NEXT_PUBLIC_SUPABASE_URL
 *   - NEXT_PUBLIC_SUPABASE_ANON_KEY
 */
export async function getSupabaseServer() {
  const cookieStore = await cookies();
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component — safe to ignore since
            // middleware will refresh the session.
          }
        },
      },
    }
  );
}

/**
 * Returns a Supabase admin client using the service-role key.
 * Use this ONLY in trusted server contexts (API routes guarded by
 * admin/pastor role checks). Bypasses RLS.
 *
 * Required env vars:
 *   - NEXT_PUBLIC_SUPABASE_URL
 *   - SUPABASE_SERVICE_ROLE_KEY
 */
export function getSupabaseAdmin() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set. Admin operations are unavailable."
    );
  }
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return [];
        },
        setAll() {
          // No-op — admin client doesn't need cookie persistence.
        },
      },
    }
  );
}
