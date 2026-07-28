/**
 * GET /api/gaf/admin/notifications
 *   Returns all notifications across all members (paginated).
 *   Query: ?type=referral_status&memberId=...&cursor=...&take=20
 *   Also returns aggregate stats (total, unread, by-type breakdown).
 *   Admin/Pastor only.
 *
 * POST /api/gaf/admin/notifications
 *   Broadcasts a notification to all active members or a specific subset.
 *   Body: { title, message, type?, targetMemberIds? (optional, for targeted) }
 *   If targetMemberIds is omitted, broadcasts to ALL active members.
 *   Writes audit log.
 *   Admin/Pastor only.
 *
 * DELETE /api/gaf/admin/notifications?id=...
 *   Deletes a notification by ID.
 *   Admin/Pastor only.
 *
 * Stage 10 of Go-A-Fishing.
 */
import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { isAdminOrPastor, getCurrentMemberId } from "@/lib/gaf/auth";
import {
  NOTIFICATION_TYPES,
  type NotificationType,
  broadcastToAllMembers,
  createBulkNotifications,
} from "@/lib/gaf/notification-engine";

const MAX_TAKE = 50;
const DEFAULT_TAKE = 20;

export async function GET(req: NextRequest) {
  try {
    if (!(await isAdminOrPastor())) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || undefined;
    const memberId = searchParams.get("memberId") || undefined;
    const cursor = searchParams.get("cursor");
    const takeRaw = Number(searchParams.get("take"));
    const take = Math.min(Math.max(1, takeRaw || DEFAULT_TAKE), MAX_TAKE);

    const where: Record<string, unknown> = {};
    if (type && NOTIFICATION_TYPES.includes(type as NotificationType)) {
      where.type = type;
    }
    if (memberId) {
      where.memberId = memberId;
    }

    const [notifications, typeGroups, totalUnread] = await Promise.all([
      db.notification.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: take + 1,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
        include: {
          member: {
            select: { id: true, fullName: true, email: true },
          },
        },
      }),
      db.notification.groupBy({
        by: ["type"],
        _count: { id: true },
      }),
      db.notification.count({ where: { read: false } }),
    ]);

    const total = await db.notification.count({ where });

    // Per-type breakdown.
    const typeBreakdown: Record<string, number> = {};
    for (const g of typeGroups) {
      typeBreakdown[g.type] = g._count.id;
    }

    const hasMore = notifications.length > take;
    const items = hasMore ? notifications.slice(0, take) : notifications;
    const nextCursor = hasMore ? items[items.length - 1].id : null;

    return NextResponse.json({
      notifications: items,
      stats: {
        total,
        totalUnread,
        typeBreakdown,
      },
      nextCursor,
      hasMore,
    });
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("[gaf/admin/notifications GET] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!(await isAdminOrPastor())) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const actorId = await getCurrentMemberId();
    const headers = req.headers;
    const ipAddress = headers.get("x-forwarded-for") || headers.get("x-real-ip") || null;

    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const title = body.title as string;
    const message = body.message as string;
    const type = (body.type as string) || "admin_broadcast";
    const targetMemberIds = body.targetMemberIds as string[] | undefined;

    // Validation.
    if (!title || typeof title !== "string" || title.trim().length < 1 || title.trim().length > 200) {
      return NextResponse.json({ error: "title is required (1-200 characters)" }, { status: 400 });
    }
    if (!message || typeof message !== "string" || message.trim().length < 1 || message.trim().length > 2000) {
      return NextResponse.json({ error: "message is required (1-2000 characters)" }, { status: 400 });
    }
    if (!NOTIFICATION_TYPES.includes(type as NotificationType)) {
      return NextResponse.json(
        { error: `type must be one of: ${NOTIFICATION_TYPES.join(", ")}` },
        { status: 400 }
      );
    }

    let recipientCount: number;

    if (targetMemberIds && Array.isArray(targetMemberIds) && targetMemberIds.length > 0) {
      // Targeted notification to specific members.
      if (targetMemberIds.length > 500) {
        return NextResponse.json(
          { error: "Cannot send to more than 500 members at once" },
          { status: 400 }
        );
      }
      // Validate all member IDs exist and are active.
      const validMembers = await db.member.findMany({
        where: { id: { in: targetMemberIds }, status: "active" },
        select: { id: true },
      });
      await createBulkNotifications(
        validMembers.map((m) => ({
          memberId: m.id,
          type: type as NotificationType,
          title: title.trim(),
          message: message.trim(),
        }))
      );
      recipientCount = validMembers.length;
    } else {
      // Broadcast to all active members.
      recipientCount = await broadcastToAllMembers(title.trim(), message.trim());
    }

    // Write audit log.
    await db.auditLog.create({
      data: {
        actorMemberId: actorId,
        action: "notification.broadcast",
        entityType: "notification",
        metadata: JSON.stringify({
          title: title.trim(),
          type,
          recipientCount,
          targeted: !!targetMemberIds,
        }),
        ipAddress,
      },
    });

    return NextResponse.json(
      {
        success: true,
        recipientCount,
        type,
        title: title.trim(),
      },
      { status: 201 }
    );
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("[gaf/admin/notifications POST] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    if (!(await isAdminOrPastor())) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const actorId = await getCurrentMemberId();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const existing = await db.notification.findUnique({
      where: { id },
      select: { id: true, memberId: true, title: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await db.notification.delete({ where: { id } });

    // Write audit log.
    await db.auditLog.create({
      data: {
        actorMemberId: actorId,
        action: "notification.delete",
        entityType: "notification",
        entityId: id,
        metadata: JSON.stringify({ title: existing.title, memberId: existing.memberId }),
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("[gaf/admin/notifications DELETE] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
