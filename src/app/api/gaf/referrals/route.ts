/**
 * GET /api/gaf/referrals
 *   Returns the current Member's referrals (newest first), paginated.
 *   Query: ?status=attended&cursor=...&take=20
 *
 * POST /api/gaf/referrals
 *   Creates a new manual referral entry on behalf of the current Member.
 *   Body: { inviteeName, inviteePhone?, inviteeEmail?, prayerPoint?, notes?, channel? }
 *
 * Stage 4 of Go-A-Fishing.
 */
import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getCurrentMemberId } from "@/lib/gaf/auth";

const VALID_CHANNELS = ["link", "qr", "whatsapp", "manual", "flyer", "other"] as const;
type Channel = (typeof VALID_CHANNELS)[number];

const VALID_STATUSES = [
  "invited",
  "attended",
  "saved",
  "baptized",
  "member",
  "lost_contact",
] as const;

const MAX_TAKE = 100;
const DEFAULT_TAKE = 20;

export async function GET(req: NextRequest) {
  try {
    const memberId = await getCurrentMemberId();
    if (!memberId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const cursor = searchParams.get("cursor");
    const takeRaw = Number(searchParams.get("take")) || DEFAULT_TAKE;
    const take = Math.min(Math.max(1, takeRaw), MAX_TAKE);

    const where: Record<string, unknown> = { referrerId: memberId };
    if (status && (VALID_STATUSES as readonly string[]).includes(status)) {
      where.status = status;
    }

    const referrals = await db.referralEvent.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: take + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      select: {
        id: true,
        inviteeName: true,
        inviteePhone: true,
        inviteeEmail: true,
        channel: true,
        status: true,
        firstVisitDate: true,
        prayerPoint: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const hasMore = referrals.length > take;
    const items = hasMore ? referrals.slice(0, take) : referrals;
    const nextCursor = hasMore ? items[items.length - 1].id : null;

    return NextResponse.json({
      referrals: items,
      nextCursor,
      hasMore,
    });
  } catch (err) {
    console.error("[gaf/referrals GET] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const memberId = await getCurrentMemberId();
    if (!memberId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const member = await db.member.findUnique({
      where: { id: memberId },
      select: { id: true, referralCode: true, status: true },
    });
    if (!member || member.status !== "active") {
      return NextResponse.json({ error: "Member not active" }, { status: 403 });
    }

    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    // Validate inviteeName.
    const inviteeName = (body.inviteeName as string)?.trim();
    if (!inviteeName || inviteeName.length < 2) {
      return NextResponse.json({ error: "Invitee name is required (min 2 chars)" }, { status: 400 });
    }
    if (inviteeName.length > 200) {
      return NextResponse.json({ error: "Invitee name too long" }, { status: 400 });
    }

    const inviteePhone = (body.inviteePhone as string | undefined)?.trim() || null;
    const inviteeEmail = (body.inviteeEmail as string | undefined)?.trim().toLowerCase() || null;
    const prayerPoint = (body.prayerPoint as string | undefined)?.trim() || null;
    const notes = (body.notes as string | undefined)?.trim() || null;

    if (inviteeEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(inviteeEmail)) {
        return NextResponse.json({ error: "Invalid invitee email" }, { status: 400 });
      }
    }

    const channel = ((body.channel as string) || "manual") as Channel;
    if (!(VALID_CHANNELS as readonly string[]).includes(channel)) {
      return NextResponse.json(
        { error: `Invalid channel. Must be one of: ${VALID_CHANNELS.join(", ")}` },
        { status: 400 }
      );
    }

    const referral = await db.referralEvent.create({
      data: {
        referrerId: memberId,
        referralCode: member.referralCode, // snapshot for audit
        inviteeName,
        inviteePhone,
        inviteeEmail,
        channel,
        status: "invited",
        prayerPoint,
        notes,
      },
    });

    return NextResponse.json({ referral }, { status: 201 });
  } catch (err) {
    console.error("[gaf/referrals POST] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
