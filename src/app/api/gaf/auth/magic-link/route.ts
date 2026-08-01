/**
 * POST /api/gaf/auth/magic-link
 *
 * Sends a Supabase magic-link email to the requested address. The user clicks
 * the link in their email, which redirects to /api/gaf/auth/callback where
 * the OTP is verified and the session is established.
 *
 * Stage 4 of Go-A-Fishing.
 */
import { type NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/gaf/supabase-server";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  // If Supabase env vars aren't set, return a friendly error.
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return NextResponse.json(
      {
        error:
          "Supabase is not yet configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
      },
      { status: 503 }
    );
  }

  let email: string;
  try {
    const body = await req.json();
    email = (body?.email || "").toString().trim().toLowerCase();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!email || !EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  }

  const supabase = await getSupabaseServer();

  // Determine the redirect URL for after the user clicks the magic link.
  // E.g. https://mfm-youthchurch.app/api/gaf/auth/callback
  const origin = req.nextUrl.origin;
  const redirectUrl = `${origin}/api/gaf/auth/callback`;

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: redirectUrl,
      shouldCreateUser: true, // auto-register new members
    },
  });

  if (error) {
    return NextResponse.json(
      { error: "Could not send magic link. Please try again." },
      { status: 400 }
    );
  }

  return NextResponse.json({
    ok: true,
    message: "Check your email for a sign-in link.",
  });
}
