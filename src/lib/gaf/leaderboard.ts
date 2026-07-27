/**
 * Leaderboard ranking engine for Go-A-Fishing.
 *
 * Computes per-member scores for a given time window (default: current quarter).
 * Used by /api/gaf/leaderboard and admin cycle-close logic (Stage 6+).
 *
 * Scoring rules (per Stage 2 design):
 *   - Each referral event has a status with a point weight (configurable via AdminConfig)
 *   - A referral counts toward a cycle IF its updatedAt falls within the cycle window
 *     (so a referral that progressed during the cycle counts at its latest status)
 *   - "lost_contact" referrals retain historical points (they don't go negative)
 *     but no forward progression is credited
 *   - Ties broken by: (1) count of "member" status referrals, (2) count of "baptized",
 *     (3) count of "saved", (4) count of "attended", (5) oldest member joinDate
 *
 * Stage 5 of Go-A-Fishing.
 */

import { db } from "@/lib/db";
import {
  computeMemberScore,
  parseScoringWeights,
  type ReferralStatus,
} from "./scoring";

export interface LeaderboardEntry {
  memberId: string;
  fullName: string;
  avatarUrl: string | null;
  referralCode: string;
  totalScore: number;
  rank: number;
  counts: Record<ReferralStatus, number>;
  breakdown: Record<ReferralStatus, number>;
  joinDate: Date;
}

export interface LeaderboardResult {
  entries: LeaderboardEntry[];
  totalParticipants: number;
  cycle: {
    id: string | null;
    name: string;
    year: number;
    quarter: number;
    startDate: Date;
    endDate: Date;
    status: string;
  } | null;
  scoringWeights: Record<ReferralStatus, number>;
  generatedAt: Date;
}

export type LeaderboardPeriod = "current" | "previous" | "ytd" | "all";

/**
 * Returns the current calendar quarter for a given date (defaults to now).
 * Quarters: Q1 = Jan-Mar, Q2 = Apr-Jun, Q3 = Jul-Sep, Q4 = Oct-Dec.
 */
export function getQuarter(date: Date = new Date()): { year: number; quarter: number } {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-11
  const quarter = Math.floor(month / 3) + 1;
  return { year, quarter };
}

/**
 * Returns the start and end dates for a given year/quarter.
 * End date is exclusive (i.e. the moment the next quarter begins).
 */
export function getQuarterRange(year: number, quarter: 1 | 2 | 3 | 4 | number): {
  startDate: Date;
  endDate: Date;
} {
  const startMonth = (quarter - 1) * 3; // 0, 3, 6, 9
  const startDate = new Date(year, startMonth, 1, 0, 0, 0, 0);
  const endDate = new Date(year, startMonth + 3, 1, 0, 0, 0, 0); // exclusive
  return { startDate, endDate };
}

/**
 * Returns the previous quarter for a given date.
 */
export function getPreviousQuarter(date: Date = new Date()): { year: number; quarter: number } {
  const { year, quarter } = getQuarter(date);
  if (quarter === 1) return { year: year - 1, quarter: 4 };
  return { year, quarter: quarter - 1 };
}

/**
 * Returns the year-to-date range (Jan 1 of current year → now).
 */
export function getYtdRange(date: Date = new Date()): { startDate: Date; endDate: Date } {
  return {
    startDate: new Date(date.getFullYear(), 0, 1, 0, 0, 0, 0),
    endDate: date,
  };
}

/**
 * Returns the "all-time" range (earliest possible date → now).
 */
export function getAllTimeRange(date: Date = new Date()): { startDate: Date; endDate: Date } {
  return {
    startDate: new Date(2000, 0, 1, 0, 0, 0, 0),
    endDate: date,
  };
}

/**
 * Computes the leaderboard for a given period.
 *
 * @param period "current" (default) | "previous" | "ytd" | "all"
 * @param limit  Max entries to return (default 10, max 100)
 * @param offset Pagination offset (default 0)
 */
export async function computeLeaderboard(
  period: LeaderboardPeriod = "current",
  limit: number = 10,
  offset: number = 0
): Promise<LeaderboardResult> {
  // Clamp limit.
  const safeLimit = Math.min(Math.max(1, limit), 100);
  const safeOffset = Math.max(0, offset);

  // Determine date window + look for a matching RewardCycle.
  const now = new Date();
  let startDate: Date;
  let endDate: Date;
  let cycleName: string;
  let year: number;
  let quarter: number;

  if (period === "current") {
    const q = getQuarter(now);
    ({ startDate, endDate } = getQuarterRange(q.year, q.quarter));
    cycleName = `Q${q.quarter} ${q.year}`;
    year = q.year;
    quarter = q.quarter;
  } else if (period === "previous") {
    const q = getPreviousQuarter(now);
    ({ startDate, endDate } = getQuarterRange(q.year, q.quarter));
    cycleName = `Q${q.quarter} ${q.year}`;
    year = q.year;
    quarter = q.quarter;
  } else if (period === "ytd") {
    ({ startDate, endDate } = getYtdRange(now));
    cycleName = `Year-to-Date ${now.getFullYear()}`;
    year = now.getFullYear();
    quarter = 0; // sentinel: not a specific quarter
  } else {
    // all-time
    ({ startDate, endDate } = getAllTimeRange(now));
    cycleName = "All Time";
    year = 0;
    quarter = 0;
  }

  // Look up matching cycle (only for quarterly periods).
  let cycleRow: {
    id: string;
    name: string;
    status: string;
    startDate: Date;
    endDate: Date;
  } | null = null;

  if (quarter >= 1 && quarter <= 4) {
    const found = await db.rewardCycle.findFirst({
      where: { year, quarter },
      select: {
        id: true,
        name: true,
        status: true,
        startDate: true,
        endDate: true,
        categoryId: true,
      },
    });
    if (found) {
      cycleRow = found;
      cycleName = found.name;
    }
  }

  // Load scoring weights from AdminConfig (singleton).
  const config = await db.adminConfig.findUnique({
    where: { id: "singleton" },
    select: { scoringWeights: true },
  });
  const weights = parseScoringWeights(config?.scoringWeights);

  // Load all active members.
  const members = await db.member.findMany({
    where: { status: "active" },
    select: {
      id: true,
      fullName: true,
      avatarUrl: true,
      referralCode: true,
      joinDate: true,
      referralsMade: {
        where: {
          // Referral counts toward this cycle if its latest update (status
          // progression) fell within the window. We include referrals CREATED
          // before the window too, so long as they UPDATED within it.
          updatedAt: {
            gte: startDate,
            lt: endDate,
          },
        },
        select: { status: true },
      },
    },
  });

  // Compute per-member entry.
  const entries: LeaderboardEntry[] = members
    .map((m) => {
      const { total, breakdown, counts } = computeMemberScore(m.referralsMade, weights);
      return {
        memberId: m.id,
        fullName: m.fullName,
        avatarUrl: m.avatarUrl,
        referralCode: m.referralCode,
        totalScore: total,
        counts,
        breakdown,
        joinDate: m.joinDate,
        rank: 0, // assigned below
      };
    })
    // Filter out members with zero referrals in this window (no point listing them).
    .filter((e) => {
      const totalReferrals = Object.values(e.counts).reduce((a, b) => a + b, 0);
      return totalReferrals > 0;
    });

  // Sort:
  // 1. Highest score first
  // 2. More "member" status referrals
  // 3. More "baptized"
  // 4. More "saved"
  // 5. More "attended"
  // 6. Oldest member joinDate (longer-tenured member wins tie)
  entries.sort((a, b) => {
    if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
    if (b.counts.member !== a.counts.member) return b.counts.member - a.counts.member;
    if (b.counts.baptized !== a.counts.baptized) return b.counts.baptized - a.counts.baptized;
    if (b.counts.saved !== a.counts.saved) return b.counts.saved - a.counts.saved;
    if (b.counts.attended !== a.counts.attended) return b.counts.attended - a.counts.attended;
    return a.joinDate.getTime() - b.joinDate.getTime();
  });

  // Assign ranks (1-indexed). Ties get the same rank; next rank skips.
  let currentRank = 0;
  let prevScore: number | null = null;
  let prevTiebreakKey: string | null = null;
  for (let i = 0; i < entries.length; i++) {
    const e = entries[i];
    const tiebreakKey = [
      e.counts.member,
      e.counts.baptized,
      e.counts.saved,
      e.counts.attended,
    ].join("-");
    if (prevScore === e.totalScore && prevTiebreakKey === tiebreakKey) {
      // Same rank as previous entry (tie).
      e.rank = currentRank;
    } else {
      currentRank = i + 1;
      e.rank = currentRank;
      prevScore = e.totalScore;
      prevTiebreakKey = tiebreakKey;
    }
  }

  // Paginate.
  const paged = entries.slice(safeOffset, safeOffset + safeLimit);

  return {
    entries: paged,
    totalParticipants: entries.length,
    cycle: cycleRow
      ? {
          id: cycleRow.id,
          name: cycleRow.name,
          year,
          quarter,
          startDate: cycleRow.startDate,
          endDate: cycleRow.endDate,
          status: cycleRow.status,
        }
      : {
          id: null,
          name: cycleName,
          year,
          quarter,
          startDate,
          endDate,
          status: period === "current" ? "open" : "closed",
        },
    scoringWeights: weights,
    generatedAt: now,
  };
}

/**
 * Returns the rank of a specific member in a given period.
 * Useful for "Your rank: #5" badges on the dashboard.
 *
 * Returns null if the member is not ranked (no referrals in window).
 */
export async function getMemberRank(
  memberId: string,
  period: LeaderboardPeriod = "current"
): Promise<{ rank: number; totalParticipants: number; score: number } | null> {
  // Compute full leaderboard (limit 1000 — enough for any church scale),
  // then find the member.
  const result = await computeLeaderboard(period, 1000, 0);
  const entry = result.entries.find((e) => e.memberId === memberId);
  if (!entry) return null;
  return {
    rank: entry.rank,
    totalParticipants: result.totalParticipants,
    score: entry.totalScore,
  };
}
