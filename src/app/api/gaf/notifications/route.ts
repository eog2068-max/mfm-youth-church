/**
 * GET /api/gaf/notifications
 *   Returns the current member's notifications (paginated).
 *   Query: ?type=referral_status&unread=true&cursor=...&take=20
 *   Also returns unreadCount.
 *
 * PATCH /api/gaf/notifications
 *   Body: { id? }                    → mark single notification as read
 *   Body: { markAll: true }          → mark all notifications as read
 *
 * Stage 10 of Go-A-Fishing.
 */
import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { requireMember } from "@/lib/gaf/auth";
import { NOTIFICATION_TYPES, type NotificationType } from "@/lib/gaf/notification-engine";

const MAX_TAKE = 50;
const DEFAULT_TAKE = 20;

export async function GET(req: NextRequest) {
  try {
    const member = await requireMember();

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || undefined;
    const unreadOnly = searchParams.get("unread") === "true";
    const cursor = searchParams.get("cursor");
    const takeRaw = Number(searchParams.get("take"));
    const take = Math.min(Math.max(1, takeRaw || DEFAULT_TAKE), MAX_TAKE);

    const where: Record<string, unknown> = { memberId: member.id };
    if (type && NOTIFICATION_TYPES.includes(type as NotificationType)) {
      where.type = type;
    }
    if (unreadOnly) {
      where.read = false;
    }

    const [notifications, unreadCount] = await Promise.all([
      db.notification.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: take + 1,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      }),
      db.notification.count({
        where: { memberId: member.id, read: false },
      }),
    ]);

    const hasMore = notifications.length > take;
    const items = hasMore ? notifications.slice(0, take) : notifications;
    const nextCursor = hasMore ? items[items.length - 1].id : null;

    return NextResponse.json({
      notifications: items,
      unreadCount,
      nextCursor,
      hasMore,
    });
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("[gaf/notifications GET] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const member = await requireMember();

    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    // Mark all as read.
    if (body.markAll === true) {
      const result = await db.notification.updateMany({
        where: { memberId: member.id, read: false },
        data: { read: true, readAt: new Date() },
      });
      return NextResponse.json({ updated: result.count });
    }

    // Mark single notification as read.
    const id = body.id as string;
    if (!id) {
      return NextResponse.json(
        { error: "id or markAll is required" },
        { status: 400 }
      );
    }

    const notification = await db.notification.findUnique({
      where: { id },
      select: { memberId: true },
    });

    if (!notification || notification.memberId !== member.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await db.notification.update({
      where: { id },
      data: { read: true, readAt: new Date() },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("[gaf/notifications PATCH] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
