"use client";

/**
 * GafAwards — public awards & commendations showcase page.
 *
 * Features:
 *   - Hero section with scripture
 *   - Active cycles banner (if any open/tallying)
 *   - Closed cycle winners — podium display per cycle
 *   - Pastoral commendations wall — cards with scripture references
 *   - Load more pagination for both sections
 *
 * Stage 7 of Go-A-Fishing.
 */
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Crown,
  Medal,
  Award,
  Heart,
  Star,
  BookOpen,
  Loader2,
  AlertCircle,
  Fish,
  ChevronDown,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SectionWrapper } from "@/components/home/section-wrapper";
import { cn } from "@/lib/utils";

// ── Types ──

interface WinnerMember {
  id: string;
  fullName: string;
  avatarUrl: string | null;
  referralCode: string;
}

interface Winner {
  id: string;
  rank: number;
  score: number;
  scoreBreakdown: string;
  awardedAt: string;
  awardNotes: string | null;
  member: WinnerMember;
}

interface Category {
  name: string;
  icon: string;
  color: string;
  slug: string;
}

interface CycleWithWinners {
  id: string;
  name: string;
  year: number;
  quarter: number;
  startDate: string;
  endDate: string;
  status: string;
  category: Category;
  winners: Winner[];
}

interface CommendationMember {
  id: string;
  fullName: string;
  avatarUrl: string | null;
  referralCode: string;
}

interface Commendation {
  id: string;
  title: string;
  message: string;
  givenBy: string;
  scriptureReference: string | null;
  awardedAt: string;
  member: CommendationMember;
}

interface ActiveCycle {
  id: string;
  name: string;
  year: number;
  quarter: number;
  status: string;
  endDate: string;
  category: Pick<Category, "name" | "icon" | "color">;
}

interface AwardsResponse {
  cycles: CycleWithWinners[];
  commendations: Commendation[];
  activeCycles: ActiveCycle[];
}

// ── Helpers ──

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function parseBreakdown(json: string): Record<string, number> | null {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
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
    badge: string;
  }
> = {
  1: {
    icon: Crown,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    barColor: "bg-gradient-to-r from-amber-400 to-yellow-300",
    textColor: "text-amber-600",
    scoreBg: "bg-gradient-to-br from-amber-500 to-amber-700",
    badge: "bg-amber-100 text-amber-800 border-amber-200",
  },
  2: {
    icon: Medal,
    iconBg: "bg-gray-100",
    iconColor: "text-gray-600",
    barColor: "bg-gradient-to-r from-gray-300 to-gray-400",
    textColor: "text-gray-600",
    scoreBg: "bg-gradient-to-br from-gray-500 to-gray-700",
    badge: "bg-gray-100 text-gray-700 border-gray-200",
  },
  3: {
    icon: Medal,
    iconBg: "bg-red-100",
    iconColor: "text-red-700",
    barColor: "bg-gradient-to-r from-red-400 to-red-500",
    textColor: "text-red-700",
    scoreBg: "bg-gradient-to-br from-red-600 to-red-800",
    badge: "bg-red-100 text-red-800 border-red-200",
  },
};

// ── Component ──

export function GafAwards() {
  const [data, setData] = useState<AwardsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAllCycles, setShowAllCycles] = useState(false);
  const [showAllCommendations, setShowAllCommendations] = useState(false);

  const fetchAwards = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/gaf/awards?limit=12&commendLimit=20", {
        cache: "no-store",
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || `Failed to load (status ${res.status})`);
      }
      const json: AwardsResponse = await res.json();
      setData(json);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAwards();
  }, [fetchAwards]);

  const visibleCycles = showAllCycles
    ? data?.cycles || []
    : (data?.cycles || []).slice(0, 3);
  const visibleCommendations = showAllCommendations
    ? data?.commendations || []
    : (data?.commendations || []).slice(0, 6);

  return (
    <section className="py-12 md:py-16 bg-[#F3E5F5] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* ── Hero ── */}
        <SectionWrapper className="text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 rounded-full text-sm font-medium mb-4"
          >
            <Trophy className="size-4" />
            Hall of Faith
          </motion.div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#4A148C] mb-3">
            Awards &amp; Commendations
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
            Celebrating those who faithfully labor in the harvest field.
            &ldquo;Well done, good and faithful servant!&rdquo; — Matthew 25:21
          </p>
        </SectionWrapper>

        {/* ── Loading ── */}
        {loading && (
          <SectionWrapper>
            <Card className="border-0 shadow-md">
              <CardContent className="py-20 flex flex-col items-center gap-3">
                <Loader2 className="size-10 text-[#4A148C] animate-spin" />
                <p className="text-gray-500 text-sm">Loading awards...</p>
              </CardContent>
            </Card>
          </SectionWrapper>
        )}

        {/* ── Error ── */}
        {!loading && error && (
          <SectionWrapper>
            <Card className="border-0 shadow-md">
              <CardContent className="py-16 flex flex-col items-center gap-3 text-center">
                <AlertCircle className="size-10 text-red-500" />
                <p className="text-gray-700">{error}</p>
                <Button
                  onClick={fetchAwards}
                  className="bg-[#4A148C] hover:bg-[#1A0033] text-white rounded-xl"
                >
                  Try again
                </Button>
              </CardContent>
            </Card>
          </SectionWrapper>
        )}

        {/* ── Content ── */}
        {!loading && !error && data && (
          <>
            {/* Active cycles banner */}
            {data.activeCycles.length > 0 && (
              <SectionWrapper>
                <div className="bg-gradient-to-r from-[#4A148C] to-[#1A0033] rounded-xl p-5 text-white">
                  <div className="flex items-center gap-2 mb-3">
                    <Fish className="size-5 text-purple-300" />
                    <p className="font-semibold text-lg">Active Competitions</p>
                  </div>
                  <div className="space-y-3">
                    {data.activeCycles.map((cycle) => (
                      <div
                        key={cycle.id}
                        className="bg-white/10 rounded-lg px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                      >
                        <div>
                          <p className="font-medium">{cycle.name}</p>
                          <p className="text-sm text-purple-200">
                            Ends {formatDate(cycle.endDate)}
                          </p>
                        </div>
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold w-fit",
                            cycle.status === "open"
                              ? "bg-emerald-400 text-emerald-950"
                              : "bg-amber-400 text-amber-950"
                          )}
                        >
                          {cycle.status === "open" ? (
                            <span className="size-1.5 rounded-full bg-emerald-600 animate-pulse" />
                          ) : null}
                          {cycle.status.toUpperCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </SectionWrapper>
            )}

            {/* ── Cycle Winners ── */}
            {data.cycles.length > 0 && (
              <div className="space-y-8">
                <SectionWrapper className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Crown className="size-5 text-amber-600" />
                    <h3 className="text-2xl font-bold text-[#4A148C]">
                      Cycle Champions
                    </h3>
                  </div>
                  <p className="text-gray-500 text-sm">
                    Top soul winners from completed quarterly cycles
                  </p>
                </SectionWrapper>

                {visibleCycles.map((cycle, cycleIdx) => (
                  <SectionWrapper key={cycle.id}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: cycleIdx * 0.08 }}
                    >
                      <Card className="border-0 shadow-lg overflow-hidden">
                        {/* Cycle header */}
                        <div className="bg-gradient-to-r from-[#4A148C] to-[#1A0033] px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <Star className="size-4 text-amber-300" />
                              <h4 className="font-bold text-white text-lg">
                                {cycle.name}
                              </h4>
                            </div>
                            <p className="text-purple-200 text-sm mt-0.5">
                              {formatDate(cycle.startDate)} — {formatDate(cycle.endDate)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-purple-200 bg-white/10 px-2.5 py-1 rounded-full">
                              {cycle.category.icon && <span className="mr-1">{cycle.category.icon}</span>}
                              {cycle.category.name}
                            </span>
                          </div>
                        </div>

                        {/* Winners grid */}
                        {cycle.winners.length > 0 ? (
                          <div className="p-5">
                            {cycle.winners.length <= 3 ? (
                              /* Standard podium for up to 3 winners */
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {/* Show in rank order: 1st center, 2nd left, 3rd right for desktop */}
                                {[...cycle.winners]
                                  .sort((a, b) => a.rank - b.rank)
                                  .map((winner, idx) => {
                                    const style =
                                      PODIUM_STYLES[winner.rank] || PODIUM_STYLES[3];
                                    const Icon = style.icon;
                                    const breakdown = parseBreakdown(
                                      winner.scoreBreakdown
                                    );
                                    return (
                                      <motion.div
                                        key={winner.id}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                          delay: cycleIdx * 0.08 + idx * 0.12,
                                        }}
                                        className={cn(
                                          winner.rank === 1 && "sm:-translate-y-3"
                                        )}
                                      >
                                        <div
                                          className={cn(
                                            "relative bg-white rounded-xl border border-gray-100 shadow-md overflow-hidden h-full"
                                          )}
                                        >
                                          <div className={cn("h-2", style.barColor)} />
                                          <div className="p-5 text-center">
                                            {/* Rank badge */}
                                            <div
                                              className={cn(
                                                "inline-flex items-center justify-center w-14 h-14 rounded-full mb-3",
                                                style.iconBg
                                              )}
                                            >
                                              <Icon
                                                className={cn(
                                                  "size-7",
                                                  style.iconColor
                                                )}
                                              />
                                            </div>
                                            <div
                                              className={cn(
                                                "text-3xl font-extrabold mb-1",
                                                style.textColor
                                              )}
                                            >
                                              #{winner.rank}
                                            </div>
                                            <p className="font-bold text-[#4A148C] text-lg truncate">
                                              {winner.member.fullName}
                                            </p>
                                            <p className="text-xs text-gray-400 font-mono mt-0.5">
                                              {winner.member.referralCode}
                                            </p>
                                            {/* Score */}
                                            <div
                                              className={cn(
                                                "mt-4 py-3 rounded-lg",
                                                style.scoreBg
                                              )}
                                            >
                                              <div className="text-2xl font-bold text-white">
                                                {Math.round(winner.score)}
                                              </div>
                                              <div className="text-xs text-white/80">
                                                points
                                              </div>
                                            </div>
                                            {/* Breakdown */}
                                            {breakdown && (
                                              <div className="mt-3 flex flex-wrap gap-1 justify-center">
                                                {Object.entries(breakdown)
                                                  .filter(
                                                    ([key]) =>
                                                      key !== "total" &&
                                                      key !== "weights"
                                                  )
                                                  .map(([key, val]) => {
                                                    const numVal = Number(val);
                                                    if (isNaN(numVal) || numVal <= 0)
                                                      return null;
                                                    return (
                                                      <span
                                                        key={key}
                                                        className={cn(
                                                          "px-2 py-0.5 rounded-full text-xs font-medium",
                                                          style.badge
                                                        )}
                                                      >
                                                        {key}: {numVal}
                                                      </span>
                                                    );
                                                  })}
                                              </div>
                                            )}
                                            {/* Award notes */}
                                            {winner.awardNotes && (
                                              <p className="mt-3 text-sm text-gray-500 italic">
                                                &ldquo;{winner.awardNotes}&rdquo;
                                              </p>
                                            )}
                                          </div>
                                        </div>
                                      </motion.div>
                                    );
                                  })}
                              </div>
                            ) : (
                              /* Extended list for more than 3 winners */
                              <div className="space-y-3">
                                {[...cycle.winners]
                                  .sort((a, b) => a.rank - b.rank)
                                  .map((winner, idx) => {
                                    const style =
                                      PODIUM_STYLES[winner.rank] || PODIUM_STYLES[3];
                                    const Icon = style.icon;
                                    return (
                                      <motion.div
                                        key={winner.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{
                                          delay: cycleIdx * 0.08 + idx * 0.06,
                                        }}
                                        className="flex items-center gap-4 bg-white rounded-xl border border-gray-100 p-4 shadow-sm"
                                      >
                                        <div
                                          className={cn(
                                            "shrink-0 w-12 h-12 rounded-full flex items-center justify-center",
                                            style.iconBg
                                          )}
                                        >
                                          <Icon
                                            className={cn(
                                              "size-6",
                                              style.iconColor
                                            )}
                                          />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                          <div className="flex items-center gap-2">
                                            <span
                                              className={cn(
                                                "text-sm font-bold",
                                                style.textColor
                                              )}
                                            >
                                              #{winner.rank}
                                            </span>
                                            <p className="font-bold text-[#4A148C] truncate">
                                              {winner.member.fullName}
                                            </p>
                                          </div>
                                          <p className="text-xs text-gray-400">
                                            {winner.member.referralCode}
                                          </p>
                                        </div>
                                        <div
                                          className={cn(
                                            "shrink-0 text-center py-2 px-4 rounded-lg",
                                            style.scoreBg
                                          )}
                                        >
                                          <div className="text-lg font-bold text-white">
                                            {Math.round(winner.score)}
                                          </div>
                                          <div className="text-xs text-white/70">
                                            pts
                                          </div>
                                        </div>
                                      </motion.div>
                                    );
                                  })}
                              </div>
                            )}
                          </div>
                        ) : (
                          <CardContent className="py-10 text-center">
                            <Trophy className="size-10 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">
                              No winners recorded for this cycle yet.
                            </p>
                          </CardContent>
                        )}
                      </Card>
                    </motion.div>
                  </SectionWrapper>
                ))}

                {/* Load more cycles */}
                {data.cycles.length > 3 && !showAllCycles && (
                  <SectionWrapper className="text-center">
                    <Button
                      variant="outline"
                      onClick={() => setShowAllCycles(true)}
                      className="gap-2 rounded-xl border-[#4A148C]/20 text-[#4A148C] hover:bg-[#4A148C]/5"
                    >
                      <ChevronDown className="size-4" />
                      Show all {data.cycles.length} cycles
                    </Button>
                  </SectionWrapper>
                )}
              </div>
            )}

            {/* ── No cycles yet ── */}
            {data.cycles.length === 0 && data.activeCycles.length === 0 && (
              <SectionWrapper>
                <Card className="border-0 shadow-md">
                  <CardContent className="py-16 flex flex-col items-center gap-3 text-center">
                    <Trophy className="size-12 text-gray-300" />
                    <p className="text-gray-700 font-medium">No cycles completed yet</p>
                    <p className="text-gray-500 text-sm max-w-md">
                      Quarterly award cycles are managed by the admin team. Winners
                      will appear here once the first cycle is closed.
                    </p>
                  </CardContent>
                </Card>
              </SectionWrapper>
            )}

            {/* ── Pastoral Commendations ── */}
            {data.commendations.length > 0 && (
              <div className="space-y-8">
                <SectionWrapper className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Heart className="size-5 text-[#D32F2F]" />
                    <h3 className="text-2xl font-bold text-[#4A148C]">
                      Pastoral Commendations
                    </h3>
                  </div>
                  <p className="text-gray-500 text-sm">
                    Words of encouragement and appreciation from our pastoral team
                  </p>
                </SectionWrapper>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {visibleCommendations.map((c, idx) => (
                    <motion.div
                      key={c.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.06 }}
                    >
                      <Card className="border-0 shadow-md bg-gradient-to-br from-amber-50 to-yellow-50 h-full">
                        <div className="h-1.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400" />
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between gap-2">
                            <CardTitle className="text-base text-[#4A148C] leading-snug">
                              {c.title}
                            </CardTitle>
                            <Award className="size-5 text-amber-500 shrink-0 mt-0.5" />
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <p className="text-sm text-gray-700 leading-relaxed">
                            &ldquo;{c.message}&rdquo;
                          </p>
                          <div className="flex items-center justify-between pt-2 border-t border-amber-200/50">
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-[#4A148C] truncate">
                                {c.member.fullName}
                              </p>
                              <p className="text-xs text-gray-500">
                                Commended by {c.givenBy}
                              </p>
                            </div>
                            <div className="text-right shrink-0">
                              {c.scriptureReference && (
                                <p className="text-xs font-medium text-[#D32F2F] flex items-center gap-1 justify-end">
                                  <BookOpen className="size-3" />
                                  {c.scriptureReference}
                                </p>
                              )}
                              <p className="text-xs text-gray-400 mt-0.5">
                                {formatDate(c.awardedAt)}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Load more commendations */}
                {data.commendations.length > 6 && !showAllCommendations && (
                  <SectionWrapper className="text-center">
                    <Button
                      variant="outline"
                      onClick={() => setShowAllCommendations(true)}
                      className="gap-2 rounded-xl border-[#4A148C]/20 text-[#4A148C] hover:bg-[#4A148C]/5"
                    >
                      <ChevronDown className="size-4" />
                      Show all {data.commendations.length} commendations
                    </Button>
                  </SectionWrapper>
                )}
              </div>
            )}

            {/* ── No commendations yet ── */}
            {data.commendations.length === 0 && (
              <SectionWrapper>
                <Card className="border-0 shadow-md">
                  <CardContent className="py-16 flex flex-col items-center gap-3 text-center">
                    <Heart className="size-12 text-gray-300" />
                    <p className="text-gray-700 font-medium">
                      No commendations yet
                    </p>
                    <p className="text-gray-500 text-sm max-w-md">
                      Pastoral commendations will appear here when the leadership
                      team issues words of encouragement to members.
                    </p>
                  </CardContent>
                </Card>
              </SectionWrapper>
            )}

            {/* ── Scripture Footer ── */}
            <SectionWrapper className="text-center py-8">
              <Star className="size-8 mx-auto text-amber-500 mb-3" />
              <p className="text-sm text-gray-600 italic max-w-lg mx-auto leading-relaxed">
                &ldquo;Therefore, my dear brothers and sisters, stand firm. Let nothing
                move you. Always give yourselves fully to the work of the Lord,
                because you know that your labor in the Lord is not in vain.&rdquo;
                <br />
                <span className="text-[#D32F2F] font-medium">
                  — 1 Corinthians 15:58
                </span>
              </p>
            </SectionWrapper>
          </>
        )}
      </div>
    </section>
  );
}
