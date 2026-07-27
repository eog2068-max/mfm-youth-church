/**
 * POST /api/gaf/auth/signout
 *
 * Clears the Supabase Auth session and redirects to the Go-A-Fishing landing
 * page.
 *
 * Stage 4 of Go-A-Fishing.
 */
import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/gaf/supabase-server";

export async function POST() {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return NextResponse.json({ ok: true });
  }

  const supabase = await getSupabaseServer();
  await supabase.auth.signOut();
  return NextResponse.json({ ok: true });
}
