/**
 * Minimal Database type stub for Supabase clients.
 *
 * Stage 3 uses a permissive `Database` interface so that Prisma remains the
 * source of truth for relational types. When Supabase is fully wired
 * (post-Stage-3), run `supabase gen types typescript` to replace this file
 * with a fully-typed map of every table / view / function.
 *
 * For now we keep it loose — Supabase JS clients accept `Database` as a
 * generic parameter and fall back to `any` when types are absent.
 */
export type Database = {
  public: {
    Tables: {
      // Prisma-managed tables. Types come from @prisma/client.
      // Supabase Auth uses the `auth.users` table (not in `public` schema).
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
