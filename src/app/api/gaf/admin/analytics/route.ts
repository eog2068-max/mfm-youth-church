/**
 * GET /api/gaf/admin/analytics
 *
 * Admin/pastor endpoint. Returns comprehensive analytics for the GAF program:
 *   - Summary KPIs (members, referrals, growth)
 *   - Referral funnel breakdown
 *   - Monthly trends (last 12 months)
 *   - Top performers (by score)
 *   - Channel distribution
 *   - Conversion rates
 *
 * Query params:
 *   section = "overview" (default) | "funnel" | "trends" | "performers" | "all"
 *     Allows fetching individual sections for faster partial loads.
 *
 * Stage 8 of Go-A-Fishing.
 */
import { NextResponse, type NextRequest } from "next/server";
import { isAdminOrPastor } from "@/lib/gaf/auth";
import { computeAnalytics } from "@/lib/gaf/analytics";

export async function GET(req: NextRequest) {
  try {
    if (!(await isAdminOrPastor())) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const section = searchParams.get("section") || "all";

    if (section === "all") {
      // Full analytics — expensive, but this is admin-only and not called frequently.
      const data = await computeAnalytics();
      return NextResponse.json(data);
    }

    // Partial load — still computes full analytics since queries are shared,
    // but could be optimized later with separate query paths.
    const data = await computeAnalytics();

    switch (section) {
      case "overview":
        return NextResponse.json({
          totalMembers: data.totalMembers,
          activeMembers: data.activeMembers,
          totalReferrals: data.totalReferrals,
          thisQuarterReferrals: data.thisQuarterReferrals,
          lastQuarterReferrals: data.lastQuarterReferrals,
          quarterGrowthPercent: data.quarterGrowthPercent,
          totalScoreAllTime: data.totalScoreAllTime,
          overallConversionRate: data.overallConversionRate,
          lostContactCount: data.lostContactCount,
          inactiveMemberCount: data.inactiveMemberCount,
          currentQuarter: data.currentQuarter,
        });
      case "funnel":
        return NextResponse.json({ funnel: data.funnel });
      case "trends":
        return NextResponse.json({ monthlyTrend: data.monthlyTrend });
      case "performers":
        return NextResponse.json({
          topPerformers: data.topPerformers,
          channelBreakdown: data.channelBreakdown,
        });
      default:
        return NextResponse.json(
          { error: "Invalid section. Use: overview, funnel, trends, performers, or all" },
          { status: 400 }
        );
    }
  } catch (err) {
    console.error("[gaf/admin/analytics GET] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
