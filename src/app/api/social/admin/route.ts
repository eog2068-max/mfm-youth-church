import { NextRequest, NextResponse } from "next/server";
import {
  getSocialOverviewStats,
  getPrivatePrayerRequests,
  markPrivatePrayerReviewed,
  getModerationQueue,
  approveModerationItem,
  hideModerationItem,
} from "@/lib/supabase/social-store";
import { isAdminOrPastor } from "@/lib/gaf/auth";

async function verifyAdmin(): Promise<boolean> {
  return isAdminOrPastor();
}

// GET /api/social/admin — Overview stats
export async function GET(request: NextRequest) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section");

    switch (section) {
      case "overview":
        return NextResponse.json(getSocialOverviewStats());

      case "private-prayers":
        return NextResponse.json({ prayers: getPrivatePrayerRequests() });

      case "moderation":
        return NextResponse.json({ queue: getModerationQueue() });

      default:
        return NextResponse.json(getSocialOverviewStats());
    }
  } catch (error) {
    console.error("[Social Admin GET] Error:", error);
    return NextResponse.json({ error: "Failed to retrieve admin data." }, { status: 500 });
  }
}

// POST /api/social/admin — Moderation actions
export async function POST(request: NextRequest) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { action, targetId, targetCollection } = body as {
      action: "approve" | "hide" | "review-prayer";
      targetId?: string;
      targetCollection?: "publicPrayers" | "amenPosts" | "questionResponses";
    };

    switch (action) {
      case "approve":
        if (!targetId || !targetCollection) {
          return NextResponse.json({ error: "Missing targetId or targetCollection." }, { status: 400 });
        }
        const approved = approveModerationItem(targetId, targetCollection);
        return NextResponse.json({ success: approved });

      case "hide":
        if (!targetId || !targetCollection) {
          return NextResponse.json({ error: "Missing targetId or targetCollection." }, { status: 400 });
        }
        const hidden = hideModerationItem(targetId, targetCollection);
        return NextResponse.json({ success: hidden });

      case "review-prayer":
        if (!targetId) {
          return NextResponse.json({ error: "Missing targetId." }, { status: 400 });
        }
        const reviewed = markPrivatePrayerReviewed(targetId);
        return NextResponse.json({ success: reviewed });

      default:
        return NextResponse.json({ error: "Unknown action." }, { status: 400 });
    }
  } catch (error) {
    console.error("[Social Admin POST] Error:", error);
    return NextResponse.json({ error: "Failed to perform admin action." }, { status: 500 });
  }
}
