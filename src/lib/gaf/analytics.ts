/**
 * Analytics engine for Go-A-Fishing.
 *
 * Computes pastoral insights: referral funnel, monthly trends, member engagement
 * scores, top performers, and conversion rates. Used by /api/gaf/admin/analytics
 * and the admin reports page.
 *
 * All queries are server-only (Prisma).
 *
 * Stage 8 of Go-A-Fishing.
 */

import { db } from "@/lib/db";
import { computeMemberScore, parseScoringWeights, type ReferralStatus } from "./scoring";
import { getQuarter, getQuarterRange } from "./leaderboard";

// ── Types ──

export interface FunnelData {
  status: ReferralStatus;
  label: string;
  count: number;
  percentage: number; // of total referrals
}

export interface MonthlyTrend {
  month: string; // "2026-01"
  label: string; // "Jan 2026"
  referrals: number;
  conversions: number; // attended+ saved+ baptized+ member+
  newMembers: number;
}

export interface MemberEngagement {
  memberId: string;
  fullName: string;
  referralCode: string;
  totalReferrals: number;
  totalScore: number;
  conversionRate: number; // percentage of referrals that reached "attended" or beyond
  avgDaysToConvert: number | null;
  active: boolean;
}

export interface AnalyticsOverview {
  /** Summary KPIs */
  totalMembers: number;
  activeMembers: number;
  totalReferrals: number;
  thisQuarterReferrals: number;
  lastQuarterReferrals: number;
  quarterGrowthPercent: number;
  totalScoreAllTime: number;
  /** Funnel breakdown */
  funnel: FunnelData[];
  /** Monthly trend (last 12 months) */
  monthlyTrend: MonthlyTrend[];
  /** Top performers (by score, all-time) */
  topPerformers: MemberEngagement[];
  /** Conversion rate across all referrals */
  overallConversionRate: number;
  /** Channel distribution */
  channelBreakdown: Array<{ channel: string; count: number; percentage: number }>;
  /** Lost contact count */
  lostContactCount: number;
  /** Members with zero referrals */
  inactiveMemberCount: number;
  /** Current quarter info */
  currentQuarter: { year: number; quarter: number; label: string };
}

// ── Helpers ──

const STATUS_LABELS: Record<ReferralStatus, string> = {
  invited: "Invited",
  attended: "Attended Service",
  saved: "Gave Life to Christ",
  baptized: "Water Baptized",
  member: "Joined as Member",
  lost_contact: "Lost Contact",
};

const CHANNEL_LABELS: Record<string, string> = {
  link: "Referral Link",
  qr: "QR Code",
  whatsapp: "WhatsApp",
  manual: "Manual Entry",
  flyer: "Flyer",
  other: "Other",
};

function getMonthLabel(monthStr: string): string {
  const [year, month] = monthStr.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function getLast12Months(): string[] {
  const months: string[] = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    );
  }
  return months;
}

// ── Main Analytics Function ──

export async function computeAnalytics(): Promise<AnalyticsOverview> {
  // Run queries in parallel.
  const [
    totalMembers,
    activeMembers,
    totalReferrals,
    allReferrals,
    lostContactCount,
    inactiveMemberCount,
    memberScores,
  ] = await Promise.all([
    db.member.count(),
    db.member.count({ where: { status: "active" } }),
    db.referralEvent.count(),
    db.referralEvent.findMany({
      select: {
        status: true,
        channel: true,
        createdAt: true,
        updatedAt: true,
        referrerId: true,
      },
    }),
    db.referralEvent.count({ where: { status: "lost_contact" } }),
    db.member.count({
      where: {
        status: "active",
        referralsMade: { none: {} },
      },
    }),
    // Load active members with their referrals for engagement scoring.
    db.member.findMany({
      where: { status: "active" },
      select: {
        id: true,
        fullName: true,
        referralCode: true,
        referralsMade: {
          select: { status: true, createdAt: true, updatedAt: true },
        },
      },
      orderBy: { createdAt: "asc" },
      take: 500, // reasonable limit for a church
    }),
  ]);

  // ── Funnel ──
  const statusCounts: Partial<Record<ReferralStatus, number>> = {};
  for (const ref of allReferrals) {
    const s = ref.status as ReferralStatus;
    statusCounts[s] = (statusCounts[s] || 0) + 1;
  }

  const funnel: FunnelData[] = [
    "invited",
    "attended",
    "saved",
    "baptized",
    "member",
    "lost_contact",
  ].map((status) => ({
    status,
    label: STATUS_LABELS[status],
    count: statusCounts[status] || 0,
    percentage:
      totalReferrals > 0
        ? Math.round(((statusCounts[status] || 0) / totalReferrals) * 100)
        : 0,
  }));

  // ── Monthly Trends (last 12 months) ──
  const months = getLast12Months();
  const monthlyTrend: MonthlyTrend[] = months.map((month) => {
    const monthStart = new Date(
      Number(month.split("-")[0]),
      Number(month.split("-")[1]) - 1,
      1
    );
    const monthEnd = new Date(monthStart);
    monthEnd.setMonth(monthEnd.getMonth() + 1);

    const monthRefs = allReferrals.filter((r) => {
      const created = new Date(r.createdAt);
      return created >= monthStart && created < monthEnd;
    });

    const conversions = monthRefs.filter((r) => {
      const s = r.status as ReferralStatus;
      return (
        s === "attended" ||
        s === "saved" ||
        s === "baptized" ||
        s === "member"
      );
    });

    const newMembers = monthRefs.filter(
      (r) => r.status === "member"
    );

    return {
      month,
      label: getMonthLabel(month),
      referrals: monthRefs.length,
      conversions: conversions.length,
      newMembers: newMembers.length,
    };
  });

  // ── This Quarter vs Last Quarter ──
  const now = new Date();
  const cq = getQuarter(now);
  const pq = cq.quarter === 1
    ? { year: cq.year - 1, quarter: 4 }
    : { year: cq.year, quarter: cq.quarter - 1 };
  const cqRange = getQuarterRange(cq.year, cq.quarter as 1 | 2 | 3 | 4);
  const pqRange = getQuarterRange(pq.year, pq.quarter as 1 | 2 | 3 | 4);

  const thisQuarterReferrals = allReferrals.filter((r) => {
    const d = new Date(r.createdAt);
    return d >= cqRange.startDate && d < cqRange.endDate;
  }).length;

  const lastQuarterReferrals = allReferrals.filter((r) => {
    const d = new Date(r.createdAt);
    return d >= pqRange.startDate && d < pqRange.endDate;
  }).length;

  const quarterGrowthPercent =
    lastQuarterReferrals > 0
      ? Math.round(
          ((thisQuarterReferrals - lastQuarterReferrals) /
            lastQuarterReferrals) *
            100
        )
      : thisQuarterReferrals > 0
      ? 100
      : 0;

  // ── Channel Breakdown ──
  const channelCounts: Record<string, number> = {};
  for (const ref of allReferrals) {
    channelCounts[ref.channel] = (channelCounts[ref.channel] || 0) + 1;
  }

  const channelBreakdown = Object.entries(channelCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([channel, count]) => ({
      channel,
      label: CHANNEL_LABELS[channel] || channel,
      count,
      percentage:
        totalReferrals > 0 ? Math.round((count / totalReferrals) * 100) : 0,
    }));

  // ── Scoring ──
  const config = await db.adminConfig
    .findUnique({ where: { id: "singleton" }, select: { scoringWeights: true } })
    .catch(() => null);
  const weights = parseScoringWeights(config?.scoringWeights);

  // ── Top Performers ──
  const topPerformers: MemberEngagement[] = memberScores
    .map((m) => {
      const { total, counts } = computeMemberScore(m.referralsMade, weights);
      const attendedOrBetter =
        (counts.attended || 0) +
        (counts.saved || 0) +
        (counts.baptized || 0) +
        (counts.member || 0);
      const conversionRate =
        m.referralsMade.length > 0
          ? Math.round((attendedOrBetter / m.referralsMade.length) * 100)
          : 0;

      // Avg days to convert: for referrals that reached "attended" or beyond,
      // compute average time from createdAt to updatedAt.
      const convertedRefs = m.referralsMade.filter((r) => {
        const s = r.status as ReferralStatus;
        return s === "attended" || s === "saved" || s === "baptized" || s === "member";
      });
      let avgDaysToConvert: number | null = null;
      if (convertedRefs.length > 0) {
        const totalDays = convertedRefs.reduce((sum, r) => {
          const days =
            (new Date(r.updatedAt).getTime() -
              new Date(r.createdAt).getTime()) /
            (1000 * 60 * 60 * 24);
          return sum + days;
        }, 0);
        avgDaysToConvert = Math.round(totalDays / convertedRefs.length);
      }

      return {
        memberId: m.id,
        fullName: m.fullName,
        referralCode: m.referralCode,
        totalReferrals: m.referralsMade.length,
        totalScore: total,
        conversionRate,
        avgDaysToConvert,
        active: m.referralsMade.length > 0,
      };
    })
    .filter((m) => m.active)
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, 20);

  // ── Overall Conversion Rate ──
  const totalConversions = allReferrals.filter((r) => {
    const s = r.status as ReferralStatus;
    return s === "attended" || s === "saved" || s === "baptized" || s === "member";
  }).length;

  const overallConversionRate =
    totalReferrals > 0
      ? Math.round((totalConversions / totalReferrals) * 100)
      : 0;

  // ── Total Score All-Time ──
  const totalScoreAllTime = topPerformers.reduce(
    (sum, m) => sum + m.totalScore,
    0
  );

  return {
    totalMembers,
    activeMembers,
    totalReferrals,
    thisQuarterReferrals,
    lastQuarterReferrals,
    quarterGrowthPercent,
    totalScoreAllTime,
    funnel,
    monthlyTrend,
    topPerformers,
    overallConversionRate,
    channelBreakdown,
    lostContactCount,
    inactiveMemberCount,
    currentQuarter: {
      year: cq.year,
      quarter: cq.quarter,
      label: `Q${cq.quarter} ${cq.year}`,
    },
  };
}
