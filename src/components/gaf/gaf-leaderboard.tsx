"use client";

/**
 * GafLeaderboard — public leaderboard display.
 *
 * Features:
 *   - Period toggle (Current Quarter / Previous Quarter / Year-to-Date / All Time)
 *   - Top-N display (rank, member, score, breakdown chips)
 *   - Auto-refresh polling (per AdminConfig.leaderboardRefreshIntervalSec, default 300s)
 *   - Loading + empty + error states
 *   - Top 3 podium styling (gold/silver/bronze)
 *
 * Stage 5 of Go-A-Fishing.
 */
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Crown,
  Medal,
  RefreshCw,
  Users,
  Fish,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SectionWrapper } from "@/components/home/section-wrapper";
import { cn } from "@/lib/utils";

type Period = "current" | "previous" | "ytd" | "all";

interface Entry {
  rank: number;
  memberId: string;
  fullName: string;
  avatarUrl: string | null;
  referralCode: string;
  totalScore: number;
  counts: Record<string, number>;
}

interface CycleInfo {
  id: string | null;
  name: string;
  year: number;
  quarter: number;
  startDate: string;
  endDate: string;
  status: string;
}

interface LeaderboardResponse {
  entries: Entry[];
  totalParticipants: number;
  cycle: CycleInfo;
  scoringWeights: Record<string, number>;
  generatedAt: string;
}

const PERIOD_LABELS: Record<Period, string> = {
  current: "Current Quarter",
  previous: "Previous Quarter",
  ytd: "Year-to-Date",
  all: "All Time",
};

const STATUS_CHIPS: Array<{
  key: string;
  label: string;
  color: string;
}> = [
  { key: "invited", label: "Invited", color: "bg-purple-100 text-purple-700" },
  { key: "attended", label: "Attended", color: "bg-amber-100 text-amber-700" },
  { key: "saved", label: "Saved", color: "bg-emerald-100 text-emerald-700" },
  { key: "baptized", label: "Baptized", color: "bg-purple-100 text-purple-700" },
  { key: "member", label: "Members", color: "bg-[#4A148C] text-white" },
];

const REFRESH_INTERVAL_SEC = 300; // 5 min default; matches AdminConfig default

export function GafLeaderboard({ currentMemberId }: { currentMemberId?: string | null }) {
  const [period, setPeriod] = useState<Period>("current");
  const [data, setData] = useState<LeaderboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const refreshTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchData = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      try {
        const res = await fetch(
          `/api/gaf/leaderboard?period=${period}&limit=50`,
          { cache: "no-store" }
        );
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body?.error || `Failed to load (status ${res.status})`);
        }
        const json: LeaderboardResponse = await res.json();
        setData(json);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        setError(msg);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [period]
  );

  // Initial load + reload on period change.
  useEffect(() => {
    fetchData(false);
  }, [fetchData]);

  // Auto-refresh polling.
  useEffect(() => {
    if (refreshTimer.current) clearInterval(refreshTimer.current);
    refreshTimer.current = setInterval(() => {
      fetchData(true);
    }, REFRESH_INTERVAL_SEC * 1000);
    return () => {
      if (refreshTimer.current) clearInterval(refreshTimer.current);
    };
  }, [fetchData]);

  return (
    <section className="py-12 md:py-16 bg-[#F3E5F5] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <SectionWrapper className="text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-100 text-amber-800 rounded-full text-sm font-medium mb-3"
          >
            <Trophy className="size-4" />
            Gospel-Labor Leaderboard
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#4A148C] mb-2">
            Fishers of Men
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Celebrating those who labor to win souls for Christ. &ldquo;And whoever
            wins souls is wise.&rdquo; — Proverbs 11:30
          </p>
        </SectionWrapper>

        {/* Period toggle + refresh */}
        <SectionWrapper>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {(Object.keys(PERIOD_LABELS) as Period[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPeriod(p)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                    period === p
                      ? "bg-[#4A148C] text-white"
                      : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                  )}
                >
                  {PERIOD_LABELS[p]}
                </button>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fetchData(true)}
              disabled={refreshing}
              className="gap-2 rounded-xl shrink-0"
            >
              <RefreshCw className={cn("size-4", refreshing && "animate-spin")} />
              {refreshing ? "Refreshing..." : "Refresh"}
            </Button>
          </div>
        </SectionWrapper>

        {/* Cycle info banner */}
        {data?.cycle && (
          <SectionWrapper>
            <div className="bg-gradient-to-r from-[#4A148C] to-[#1A0033] text-white rounded-xl p-4 flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-sm text-purple-200">Period</p>
                <p className="font-bold text-lg">{data.cycle.name}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-purple-200">Participants</p>
                <p className="font-bold text-lg flex items-center gap-1.5 justify-end">
                  <Users className="size-4" />
                  {data.totalParticipants}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-purple-200">Status</p>
                <span
                  className={cn(
                    "inline-block px-2 py-0.5 rounded-full text-xs font-semibold",
                    data.cycle.status === "open" && "bg-emerald-400 text-emerald-950",
                    data.cycle.status === "tallying" && "bg-amber-400 text-amber-950",
                    data.cycle.status === "closed" && "bg-gray-400 text-gray-950"
                  )}
                >
                  {data.cycle.status.toUpperCase()}
                </span>
              </div>
            </div>
          </SectionWrapper>
        )}

        {/* Loading */}
        {loading && (
          <SectionWrapper>
            <Card className="border-0 shadow-md">
              <CardContent className="py-16 flex flex-col items-center gap-3">
                <Loader2 className="size-10 text-[#4A148C] animate-spin" />
                <p className="text-gray-500 text-sm">Loading leaderboard...</p>
              </CardContent>
            </Card>
          </SectionWrapper>
        )}

        {/* Error */}
        {!loading && error && (
          <SectionWrapper>
            <Card className="border-0 shadow-md border-red-200">
              <CardContent className="py-10 flex flex-col items-center gap-3 text-center">
                <AlertCircle className="size-10 text-red-500" />
                <p className="text-gray-700">{error}</p>
                <Button
                  onClick={() => fetchData(false)}
                  className="bg-[#4A148C] hover:bg-[#1A0033] text-white rounded-xl"
                >
                  Try again
                </Button>
              </CardContent>
            </Card>
          </SectionWrapper>
        )}

        {/* Empty */}
        {!loading && !error && data && data.entries.length === 0 && (
          <SectionWrapper>
            <Card className="border-0 shadow-md">
              <CardContent className="py-16 flex flex-col items-center gap-3 text-center">
                <Fish className="size-12 text-gray-300" />
                <p className="text-gray-700 font-medium">No activity yet this period</p>
                <p className="text-gray-500 text-sm max-w-md">
                  Be the first to log a referral and top the leaderboard! Share
                  your personal link with someone today.
                </p>
              </CardContent>
            </Card>
          </SectionWrapper>
        )}

        {/* Top 3 podium */}
        {!loading && !error && data && data.entries.length > 0 && (
          <SectionWrapper>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {data.entries.slice(0, 3).map((entry, idx) => {
                const podiumStyle = PODIUM_STYLES[entry.rank] || PODIUM_STYLES[1];
                const Icon = podiumStyle.icon;
                return (
                  <motion.div
                    key={entry.memberId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={cn("relative", entry.rank === 1 && "sm:-translate-y-4")}
                  >
                    <Card
                      className={cn(
                        "border-0 shadow-lg overflow-hidden h-full",
                        entry.rank === 1 && "sm:shadow-xl"
                      )}
                    >
                      <div className={cn("h-2", podiumStyle.barColor)} />
                      <CardContent className="p-5 text-center">
                        <div
                          className={cn(
                            "inline-flex items-center justify-center w-12 h-12 rounded-full mb-2",
                            podiumStyle.iconBg
                          )}
                        >
                          <Icon className={cn("size-6", podiumStyle.iconColor)} />
                        </div>
                        <div
                          className={cn(
                            "text-3xl font-bold mb-1",
                            podiumStyle.textColor
                          )}
                        >
                          #{entry.rank}
                        </div>
                        <p className="font-semibold text-[#4A148C] truncate">
                          {entry.fullName}
                        </p>
                        <p className="text-xs text-gray-400 font-mono mt-0.5">
                          {entry.referralCode}
                        </p>
                        <div
                          className={cn(
                            "mt-3 py-2 rounded-lg",
                            podiumStyle.scoreBg
                          )}
                        >
                          <div className="text-2xl font-bold text-white">
                            {entry.totalScore}
                          </div>
                          <div className="text-xs text-white/80">points</div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </SectionWrapper>
        )}

        {/* Remaining ranks (4+) */}
        {!loading && !error && data && data.entries.length > 3 && (
          <SectionWrapper>
            <Card className="border-0 shadow-md">
              <CardContent className="p-0">
                <ul className="divide-y divide-gray-100">
                  <AnimatePresence initial={false}>
                    {data.entries.slice(3).map((entry, idx) => {
                      const isMe = currentMemberId === entry.memberId;
                      return (
                        <motion.li
                          key={entry.memberId}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          transition={{ delay: idx * 0.04 }}
                          className={cn(
                            "flex items-center gap-4 p-4 hover:bg-gray-50",
                            isMe && "bg-amber-50 hover:bg-amber-100/70"
                          )}
                        >
                          <div
                            className={cn(
                              "shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm",
                              isMe
                                ? "bg-amber-500 text-white"
                                : "bg-gray-100 text-gray-600"
                            )}
                          >
                            {entry.rank}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-[#4A148C] truncate">
                                {entry.fullName}
                              </p>
                              {isMe && (
                                <span className="px-1.5 py-0.5 rounded-full text-xs font-medium bg-amber-200 text-amber-800">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {STATUS_CHIPS.filter(
                                (c) => (entry.counts[c.key] || 0) > 0
                              ).map((chip) => (
                                <span
                                  key={chip.key}
                                  className={cn(
                                    "px-1.5 py-0.5 rounded text-xs font-medium",
                                    chip.color
                                  )}
                                >
                                  {entry.counts[chip.key]} {chip.label}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-xl font-bold text-[#4A148C]">
                              {entry.totalScore}
                            </div>
                            <div className="text-xs text-gray-400">pts</div>
                          </div>
                        </motion.li>
                      );
                    })}
                  </AnimatePresence>
                </ul>
              </CardContent>
            </Card>
          </SectionWrapper>
        )}

        {/* Footer note */}
        {!loading && !error && data && (
          <SectionWrapper className="text-center pt-4">
            <p className="text-xs text-gray-400 leading-relaxed max-w-md mx-auto">
              Scores update every {Math.round(REFRESH_INTERVAL_SEC / 60)} minutes.
              Referrals are attributed to a quarter based on when their status last
              progressed. Click the refresh button to fetch the latest standings.
            </p>
          </SectionWrapper>
        )}
      </div>
    </section>
  );
}

const PODIUM_STYLES: Record<
  number,
  {
    icon: typeof Crown;
    iconBg: string;
    iconColor: string;
    barColor: string;
    textColor: string;
    scoreBg: string;
  }
> = {
  1: {
    icon: Crown,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    barColor: "bg-amber-400",
    textColor: "text-amber-600",
    scoreBg: "bg-gradient-to-br from-amber-500 to-amber-700",
  },
  2: {
    icon: Medal,
    iconBg: "bg-gray-100",
    iconColor: "text-gray-600",
    barColor: "bg-gray-400",
    textColor: "text-gray-600",
    scoreBg: "bg-gradient-to-br from-gray-500 to-gray-700",
  },
  3: {
    icon: Medal,
    iconBg: "bg-red-100",
    iconColor: "text-red-700",
    barColor: "bg-red-400",
    textColor: "text-red-700",
    scoreBg: "bg-gradient-to-br from-red-600 to-red-800",
  },
};
