/**
 * GET /r/[code]
 *
 * Referral landing route. Looks up the Member by referral code (case-insensitive),
 * sets the attribution cookie, creates a ReferralEvent with status "invited"
 * (idempotent — only creates one per cookie session), and redirects to the
 * homepage.
 *
 * Stage 4 of Go-A-Fishing.
 */
import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { normalizeReferralCode } from "@/lib/gaf/referral-code";
import { setAttributionCookie, getCookieName } from "@/lib/gaf/attribution";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code: rawCode } = await params;
  const code = normalizeReferralCode(rawCode);

  // Look up the Member by referralCode (case-insensitive — Prisma mode
  // "insensitive" works on Postgres only).
  const member = await db.member.findFirst({
    where: { referralCode: { equals: code, mode: "insensitive" } },
    select: { id: true, referralCode: true, status: true, fullName: true },
  });

  if (!member || member.status !== "active") {
    // Invalid code — redirect to Go-A-Fishing landing page with a flag.
    const url = new URL("/go-a-fishing", req.nextUrl.origin);
    url.searchParams.set("ref", "invalid_code");
    return NextResponse.redirect(url);
  }

  // Set the attribution cookie (or refresh its 30-day window).
  const res = NextResponse.redirect(new URL("/", req.nextUrl.origin));
  setAttributionCookie(res, member.id);

  // Idempotent referral-event creation: only create if no existing cookie
  // matches this member (i.e. first visit from this browser).
  const existingCookie = req.cookies.get(getCookieName())?.value;
  if (existingCookie !== member.id) {
    try {
      await db.referralEvent.create({
        data: {
          referrerId: member.id,
          referralCode: member.referralCode,
          inviteeName: "Anonymous visitor",
          channel: "link",
          status: "invited",
          linkSlug: code,
        },
      });
    } catch (err) {
      // Referral-event creation failure is non-fatal — the cookie is still set,
      // so subsequent visits won't trigger another creation attempt.
      console.error("[/r/[code]] failed to create referral event:", err);
    }
  }

  return res;
}

/** Disable static optimization — this route is fully dynamic. */
export const dynamic = "force-dynamic";
