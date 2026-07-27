/**
 * POST /api/gaf/admin/commendations
 *
 * Admin/pastor endpoint. Creates a new pastoral commendation.
 *
 * Body:
 *   memberId           — recipient Member ID (required)
 *   title              — commendation title (required, 1-200 chars)
 *   message            — commendation message (required, 1-2000 chars)
 *   givenBy            — pastor's display name (optional, defaults to member's name)
 *   visibility         — "public" | "members_only" | "private" (default "public")
 *   scriptureReference — optional, e.g. "Matthew 4:19"
 *
 * Stage 7 of Go-A-Fishing.
 */
import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { isAdminOrPastor, getCurrentSupabaseUser, getCurrentMember } from "@/lib/gaf/auth";

const VALID_VISIBILITIES = ["public", "members_only", "private"];

export async function POST(req: NextRequest) {
  try {
    if (!(await isAdminOrPastor())) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const memberId = body.memberId as string;
    const title = body.title as string;
    const message = body.message as string;
    const givenBy = body.givenBy as string | undefined;
    const visibility = body.visibility as string;
    const scriptureReference = body.scriptureReference as string | undefined;

    // Validation.
    if (!memberId || typeof memberId !== "string") {
      return NextResponse.json({ error: "memberId is required" }, { status: 400 });
    }
    if (!title || typeof title !== "string" || title.trim().length < 1 || title.trim().length > 200) {
      return NextResponse.json({ error: "title is required (1-200 characters)" }, { status: 400 });
    }
    if (!message || typeof message !== "string" || message.trim().length < 1 || message.trim().length > 2000) {
      return NextResponse.json({ error: "message is required (1-2000 characters)" }, { status: 400 });
    }
    if (visibility && !VALID_VISIBILITIES.includes(visibility)) {
      return NextResponse.json({ error: "visibility must be public, members_only, or private" }, { status: 400 });
    }

    // Verify target member exists.
    const targetMember = await db.member.findUnique({
      where: { id: memberId },
      select: { id: true, fullName: true, status: true },
    });
    if (!targetMember) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }
    if (targetMember.status !== "active") {
      return NextResponse.json({ error: "Cannot commend an inactive member" }, { status: 400 });
    }

    // Get current member (pastor/admin) for givenByMemberId.
    const actorMember = await getCurrentMember().catch(() => null);

    const commendation = await db.pastoralCommendation.create({
      data: {
        memberId,
        title: title.trim(),
        message: message.trim(),
        givenBy: givenBy?.trim() || actorMember?.fullName || "Pastor",
        givenByMemberId: actorMember?.id,
        visibility: visibility || "public",
        scriptureReference: scriptureReference?.trim() || null,
      },
      include: {
        member: {
          select: { id: true, fullName: true, avatarUrl: true, referralCode: true },
        },
        giver: {
          select: { id: true, fullName: true },
        },
      },
    });

    // Audit log.
    const actor = await getCurrentSupabaseUser();
    try {
      await db.auditLog.create({
        data: {
          actorMemberId: actorMember?.id,
          actorSessionId: actor?.id,
          action: "commendation.create",
          entityType: "commendation",
          entityId: commendation.id,
          metadata: JSON.stringify({
            recipientName: targetMember.fullName,
            title: commendation.title,
            visibility: commendation.visibility,
          }),
        },
      });
    } catch { /* non-fatal */ }

    return NextResponse.json({ commendation }, { status: 201 });
  } catch (err) {
    console.error("[gaf/admin/commendations POST] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/**
 * GET /api/gaf/admin/commendations
 *
 * Admin/pastor endpoint. Returns ALL commendations (including private ones).
 *
 * Query params:
 *   memberId = filter by recipient (optional)
 *   visibility = filter by visibility (optional)
 *   cursor = pagination cursor (optional)
 *   take = 1-50 (default 20)
 */
export async function GET(req: NextRequest) {
  try {
    if (!(await isAdminOrPastor())) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const memberId = searchParams.get("memberId") || undefined;
    const visibility = searchParams.get("visibility") || undefined;
    const cursor = searchParams.get("cursor");
    const takeRaw = Number(searchParams.get("take"));
    const take = Math.min(Math.max(1, takeRaw || 20), 50);

    const where: Record<string, unknown> = {};
    if (memberId) where.memberId = memberId;
    if (visibility && VALID_VISIBILITIES.includes(visibility)) where.visibility = visibility;

    const [commendations, total] = await Promise.all([
      db.pastoralCommendation.findMany({
        where,
        orderBy: { awardedAt: "desc" },
        take: take + 1,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
        select: {
          id: true,
          title: true,
          message: true,
          givenBy: true,
          scriptureReference: true,
          awardedAt: true,
          visibility: true,
          createdAt: true,
          member: {
            select: { id: true, fullName: true, avatarUrl: true, referralCode: true },
          },
          giver: {
            select: { id: true, fullName: true },
          },
        },
      }),
      db.pastoralCommendation.count({ where }),
    ]);

    const hasMore = commendations.length > take;
    const items = hasMore ? commendations.slice(0, take) : commendations;
    const nextCursor = hasMore ? items[items.length - 1].id : null;

    return NextResponse.json({
      commendations: items,
      total,
      nextCursor,
      hasMore,
    });
  } catch (err) {
    console.error("[gaf/admin/commendations GET] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
