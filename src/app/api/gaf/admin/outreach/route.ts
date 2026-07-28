/**
 * GET /api/gaf/admin/outreach
 *   Returns all members' outreach activities (paginated, filterable).
 *   Admin/pastor only. Query: ?type=&memberId=&status=&cursor=&take=
 *
 * PATCH /api/gaf/admin/outreach/[id]
 *   Update activity status (confirmed/flagged/disputed) or flag.
 *   Admin/pastor only. Writes audit log.
 *
 * DELETE /api/gaf/admin/outreach/[id]
 *   Delete an outreach activity. Admin/pastor only. Writes audit log.
 *
 * Stage 9 of Go-A-Fishing.
 */
import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { isAdminOrPastor, getCurrentMember } from "@/lib/gaf/auth";
import { VALID_TYPES, type OutreachType } from "@/lib/gaf/outreach-types";

const MAX_TAKE = 100;
const DEFAULT_TAKE = 20;

export async function GET(req: NextRequest) {
  try {
    if (!(await isAdminOrPastor())) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || undefined;
    const memberId = searchParams.get("memberId") || undefined;
    const status = searchParams.get("status") || undefined;
    const cursor = searchParams.get("cursor");
    const takeRaw = Number(searchParams.get("take"));
    const take = Math.min(Math.max(1, takeRaw || DEFAULT_TAKE), MAX_TAKE);

    const where: Record<string, unknown> = {};
    if (type && VALID_TYPES.includes(type as OutreachType)) where.type = type;
    if (memberId) where.memberId = memberId;
    if (status && ["confirmed", "flagged", "disputed"].includes(status)) where.status = status;

    const [activities, total] = await Promise.all([
      db.outreachActivity.findMany({
        where,
        orderBy: { activityDate: "desc" },
        take: take + 1,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
        include: {
          member: {
            select: { id: true, fullName: true, referralCode: true, avatarUrl: true },
          },
        },
      }),
      db.outreachActivity.count({ where }),
    ]);

    const hasMore = activities.length > take;
    const items = hasMore ? activities.slice(0, take) : activities;
    const nextCursor = hasMore ? items[items.length - 1].id : null;

    // Summary stats.
    const allStats = await db.outreachActivity.aggregate({
      _sum: { contacts: true, decisions: true },
      _count: true,
    });

    return NextResponse.json({
      activities: items,
      total,
      nextCursor,
      hasMore,
      summary: {
        totalActivities: allStats._count,
        totalContacts: allStats._sum.contacts || 0,
        totalDecisions: allStats._sum.decisions || 0,
      },
    });
  } catch (err) {
    console.error("[gaf/admin/outreach GET] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    if (!(await isAdminOrPastor())) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    const existing = await db.outreachActivity.findUnique({
      where: { id },
      include: { member: { select: { fullName: true } } },
    });
    if (!existing) {
      return NextResponse.json({ error: "Activity not found" }, { status: 404 });
    }

    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const updates: Record<string, unknown> = {};
    const changes: Record<string, { from: unknown; to: unknown }> = {};

    if (body.status !== undefined) {
      const s = body.status as string;
      if (!["confirmed", "flagged", "disputed"].includes(s)) {
        return NextResponse.json({ error: "status must be confirmed, flagged, or disputed" }, { status: 400 });
      }
      updates.status = s;
      if (s !== existing.status) changes.status = { from: existing.status, to: s };
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const updated = await db.outreachActivity.update({
      where: { id },
      data: updates,
      include: {
        member: { select: { id: true, fullName: true, referralCode: true } },
      },
    });

    // Audit log.
    const actorMember = await getCurrentMember().catch(() => null);
    try {
      await db.auditLog.create({
        data: {
          actorMemberId: actorMember?.id,
          action: "outreach.update_status",
          entityType: "outreach",
          entityId: id,
          metadata: JSON.stringify({
            memberName: existing.member.fullName,
            changes,
          }),
        },
      });
    } catch { /* non-fatal */ }

    return NextResponse.json({ activity: updated });
  } catch (err) {
    console.error("[gaf/admin/outreach PATCH] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    if (!(await isAdminOrPastor())) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    const existing = await db.outreachActivity.findUnique({
      where: { id },
      include: { member: { select: { fullName: true } } },
    });
    if (!existing) {
      return NextResponse.json({ error: "Activity not found" }, { status: 404 });
    }

    await db.outreachActivity.delete({ where: { id } });

    const actorMember = await getCurrentMember().catch(() => null);
    try {
      await db.auditLog.create({
        data: {
          actorMemberId: actorMember?.id,
          action: "outreach.delete",
          entityType: "outreach",
          entityId: id,
          metadata: JSON.stringify({
            memberName: existing.member.fullName,
            title: existing.title,
            type: existing.type,
          }),
        },
      });
    } catch { /* non-fatal */ }

    return NextResponse.json({ deleted: true });
  } catch (err) {
    console.error("[gaf/admin/outreach DELETE] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
