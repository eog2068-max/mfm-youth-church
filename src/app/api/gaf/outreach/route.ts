/**
 * GET /api/gaf/outreach
 *   Returns the current member's outreach activities (paginated).
 *   Query: ?type=door_to_door&cursor=...&take=20
 *   Also returns summary stats (total activities, contacts, decisions, streak).
 *
 * POST /api/gaf/outreach
 *   Creates a new outreach activity for the current member.
 *   Body: { type, title, description?, activityDate, location?, contacts?, decisions?, notes? }
 *   Validates type is a known outreach type.
 *   Checks AdminConfig.outreachActivitySelfReportAllowed (if false, returns 403).
 *
 * Stage 9 of Go-A-Fishing.
 */
import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { requireMember } from "@/lib/gaf/auth";
import { VALID_TYPES, TYPE_LABELS, type OutreachType } from "@/lib/gaf/outreach-types";

export { TYPE_LABELS };

const MAX_TAKE = 50;
const DEFAULT_TAKE = 20;

export async function GET(req: NextRequest) {
  try {
    const member = await requireMember();

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || undefined;
    const cursor = searchParams.get("cursor");
    const takeRaw = Number(searchParams.get("take"));
    const take = Math.min(Math.max(1, takeRaw || DEFAULT_TAKE), MAX_TAKE);

    const where: Record<string, unknown> = { memberId: member.id };
    if (type && VALID_TYPES.includes(type as OutreachType)) {
      where.type = type;
    }

    const [activities, total] = await Promise.all([
      db.outreachActivity.findMany({
        where,
        orderBy: { activityDate: "desc" },
        take: take + 1,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      }),
      db.outreachActivity.count({ where }),
    ]);

    // Compute stats.
    const allActivities = await db.outreachActivity.findMany({
      where: { memberId: member.id },
      select: { contacts: true, decisions: true, activityDate: true },
    });

    const totalContacts = allActivities.reduce((s, a) => s + a.contacts, 0);
    const totalDecisions = allActivities.reduce((s, a) => s + a.decisions, 0);

    // Compute streak: consecutive weeks with at least one activity.
    const activityDates = [...new Set(
      allActivities.map((a) => {
        const d = new Date(a.activityDate);
        // Normalize to start of week (Monday).
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        const monday = new Date(d);
        monday.setDate(diff);
        monday.setHours(0, 0, 0, 0);
        return monday.toISOString();
      })
    )].sort().reverse();

    let currentStreak = 0;
    const now = new Date();
    const thisWeekStart = new Date(now);
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    thisWeekStart.setDate(diff);
    thisWeekStart.setHours(0, 0, 0, 0);

    for (const weekStart of activityDates) {
      const ws = new Date(weekStart);
      const expected = new Date(thisWeekStart);
      expected.setDate(thisWeekStart.getDate() - currentStreak * 7);
      // Check if this week matches.
      if (Math.abs(ws.getTime() - expected.getTime()) < 86400000) {
        currentStreak++;
      } else {
        break;
      }
    }

    const hasMore = activities.length > take;
    const items = hasMore ? activities.slice(0, take) : activities;
    const nextCursor = hasMore ? items[items.length - 1].id : null;

    return NextResponse.json({
      activities: items,
      total,
      nextCursor,
      hasMore,
      stats: {
        totalActivities: allActivities.length,
        totalContacts,
        totalDecisions,
        currentStreak,
      },
    });
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("[gaf/outreach GET] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const member = await requireMember();

    // Check if self-reporting is allowed.
    const config = await db.adminConfig.findUnique({
      where: { id: "singleton" },
      select: { outreachActivitySelfReportAllowed: true },
    });
    if (config && !config.outreachActivitySelfReportAllowed) {
      return NextResponse.json(
        { error: "Outreach self-reporting is currently disabled by admin" },
        { status: 403 }
      );
    }

    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const type = body.type as string;
    const title = body.title as string;
    const description = body.description as string | undefined;
    const activityDateRaw = body.activityDate as string;
    const location = body.location as string | undefined;
    const contacts = Number(body.contacts) || 0;
    const decisions = Number(body.decisions) || 0;
    const notes = body.notes as string | undefined;

    // Validation.
    if (!type || !VALID_TYPES.includes(type as OutreachType)) {
      return NextResponse.json(
        { error: `type must be one of: ${VALID_TYPES.join(", ")}` },
        { status: 400 }
      );
    }
    if (!title || typeof title !== "string" || title.trim().length < 1 || title.trim().length > 200) {
      return NextResponse.json({ error: "title is required (1-200 characters)" }, { status: 400 });
    }
    if (!activityDateRaw) {
      return NextResponse.json({ error: "activityDate is required" }, { status: 400 });
    }
    const activityDate = new Date(activityDateRaw);
    if (isNaN(activityDate.getTime())) {
      return NextResponse.json({ error: "activityDate must be a valid date" }, { status: 400 });
    }
    // Don't allow future dates beyond tomorrow.
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (activityDate > tomorrow) {
      return NextResponse.json({ error: "activityDate cannot be in the future" }, { status: 400 });
    }
    if (contacts < 0 || contacts > 999) {
      return NextResponse.json({ error: "contacts must be 0-999" }, { status: 400 });
    }
    if (decisions < 0 || decisions > 999) {
      return NextResponse.json({ error: "decisions must be 0-999" }, { status: 400 });
    }

    const activity = await db.outreachActivity.create({
      data: {
        memberId: member.id,
        type,
        title: title.trim(),
        description: description?.trim() || null,
        activityDate,
        location: location?.trim() || null,
        contacts,
        decisions,
        notes: notes?.trim() || null,
        status: "confirmed",
      },
    });

    return NextResponse.json({ activity }, { status: 201 });
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("[gaf/outreach POST] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
