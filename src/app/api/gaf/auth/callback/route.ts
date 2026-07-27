/**
 * GET /api/gaf/auth/callback
 *
 * Handles the redirect from Supabase after the user clicks the magic link in
 * their email. Exchanges the OTP code for a session, then redirects to the
 * member dashboard (or to onboarding if first-time login).
 *
 * Stage 4 of Go-A-Fishing.
 */
import { type NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/gaf/supabase-server";
import { db } from "@/lib/db";
import { generateUniqueReferralCode } from "@/lib/gaf/referral-code";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const code = searchParams.get("code");
  const next = searchParams.get("next") || "/go-a-fishing/dashboard";
  const errorDescription = searchParams.get("error_description");
  const error = searchParams.get("error");

  // Supabase passed back an error (e.g. expired link).
  if (error || errorDescription) {
    const url = new URL("/go-a-fishing/login", req.nextUrl.origin);
    url.searchParams.set("error", "magic_link_failed");
    if (errorDescription) url.searchParams.set("message", errorDescription);
    return NextResponse.redirect(url);
  }

  if (!code) {
    const url = new URL("/go-a-fishing/login", req.nextUrl.origin);
    url.searchParams.set("error", "missing_code");
    return NextResponse.redirect(url);
  }

  // If Supabase env vars aren't set, fail gracefully.
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    const url = new URL("/go-a-fishing/login", req.nextUrl.origin);
    url.searchParams.set("error", "supabase_not_configured");
    return NextResponse.redirect(url);
  }

  const supabase = await getSupabaseServer();

  // Exchange the magic-link code for a session.
  const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError || !data.user) {
    const url = new URL("/go-a-fishing/login", req.nextUrl.origin);
    url.searchParams.set("error", "exchange_failed");
    if (exchangeError?.message) url.searchParams.set("message", exchangeError.message);
    return NextResponse.redirect(url);
  }

  // Auto-provision a Member record on first login (onboarding).
  const supabaseUserId = data.user.id;
  const email = data.user.email || "";

  const existing = await db.member.findUnique({
    where: { supabaseUserId },
    select: { id: true },
  });

  if (!existing) {
    // Generate a unique referral code (collision-safe retry).
    const referralCode = await generateUniqueReferralCode(async (candidate) => {
      const found = await db.member.findUnique({
        where: { referralCode: candidate },
        select: { id: true },
      });
      return found !== null;
    });

    // Derive a friendly name from email or user metadata.
    const fullName =
      (data.user.user_metadata?.full_name as string) ||
      (data.user.user_metadata?.name as string) ||
      email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

    await db.member.create({
      data: {
        supabaseUserId,
        email,
        fullName,
        referralCode,
      },
    });
  }

  // Redirect to the destination URL (defaults to dashboard).
  const redirectUrl = new URL(next, req.nextUrl.origin);
  return NextResponse.redirect(redirectUrl);
}
