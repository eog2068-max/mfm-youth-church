import { NextRequest, NextResponse } from "next/server";
import { isAdminOrPastor } from "@/lib/gaf/auth";

async function verifyAdmin(): Promise<boolean> {
  return isAdminOrPastor();
}

// GET /api/social/admin/chat — chat overview for admin
export async function GET(req: NextRequest) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { getSocialOverviewStats, getChatReports } = await import("@/lib/supabase/social-store");
    const stats = getSocialOverviewStats();
    const reports = getChatReports();
    return NextResponse.json({
      totalChannels: stats.totalChatChannels,
      totalMessages: stats.totalChatMessages,
      pendingReports: stats.pendingChatReports,
      recentReports: reports.slice(0, 20),
    });
  } catch {
    return NextResponse.json({ error: "Failed to load admin chat data" }, { status: 500 });
  }
}

// POST /api/social/admin/chat — create a new channel
export async function POST(req: NextRequest) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    return NextResponse.json({ message: "Channel creation requires Supabase connection" }, { status: 501 });
  } catch {
    return NextResponse.json({ error: "Failed to create channel" }, { status: 500 });
  }
}
