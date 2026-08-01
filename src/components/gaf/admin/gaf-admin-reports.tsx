"use client";

/**
 * GafAdminReports — pastoral analytics and reports dashboard.
 *
 * Uses recharts for data visualization:
 *   - KPI summary cards (growth, conversion rate, etc.)
 *   - Referral funnel bar chart
 *   - Monthly trend line chart (referrals + conversions)
 *   - Channel distribution horizontal bar chart
 *   - Top performers table
 *
 * All data fetched from /api/gaf/admin/analytics.
 *
 * Stage 8 of Go-A-Fishing.
 */
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Fish,
  Target,
  AlertTriangle,
  Loader2,
  RefreshCw,
  Award,
  Activity,
  PieChart as PieChartIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ── Types ──

interface KpiData {
  totalMembers: number;
  activeMembers: number;
  totalReferrals: number;
  thisQuarterReferrals: number;
  lastQuarterReferrals: number;
  quarterGrowthPercent: number;
  totalScoreAllTime: number;
  overallConversionRate: number;
  lostContactCount: number;
  inactiveMemberCount: number;
  currentQuarter: { year: number; quarter: number; label: string };
}

interface FunnelItem {
  status: string;
  label: string;
  count: number;
  percentage: number;
}

interface TrendItem {
  month: string;
  label: string;
  referrals: number;
  conversions: number;
  newMembers: number;
}

interface Performer {
  memberId: string;
  fullName: string;
  referralCode: string;
  totalReferrals: number;
  totalScore: number;
  conversionRate: number;
  avgDaysToConvert: number | null;
  active: boolean;
}

interface ChannelItem {
  channel: string;
  label: string;
  count: number;
  percentage: number;
}

interface AnalyticsData {
  totalMembers: number;
  activeMembers: number;
  totalReferrals: number;
  thisQuarterReferrals: number;
  lastQuarterReferrals: number;
  quarterGrowthPercent: number;
  totalScoreAllTime: number;
  funnel: FunnelItem[];
  monthlyTrend: TrendItem[];
  topPerformers: Performer[];
  overallConversionRate: number;
  channelBreakdown: ChannelItem[];
  lostContactCount: number;
  inactiveMemberCount: number;
  currentQuarter: { year: number; quarter: number; label: string };
}

// ── Funnel Colors ──
const FUNNEL_COLORS: Record<string, string> = {
  invited: "#3B82F6",      // blue
  attended: "#F59E0B",     // amber
  saved: "#10B981",        // emerald
  baptized: "#8B5CF6",     // purple
  member: "#4A148C",       // navy (brand)
  lost_contact: "#9CA3AF", // gray
};

// ── Component ──

export function GafAdminReports() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/gaf/admin/analytics?section=all", {
        cache: "no-store",
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || `Failed to load (status ${res.status})`);
      }
      const json: AnalyticsData = await res.json();
      setData(json);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(msg);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics(false);
  }, [fetchAnalytics]);

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#4A148C]">
            Outreach Reports
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Pastoral insights — referral funnel, trends, and member performance
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => fetchAnalytics(true)}
          disabled={refreshing}
          className="gap-2 rounded-xl"
        >
          <RefreshCw className={cn("size-4", refreshing && "animate-spin")} />
          {refreshing ? "Refreshing..." : "Refresh Data"}
        </Button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="py-20 flex flex-col items-center gap-3">
          <Loader2 className="size-10 text-[#4A148C] animate-spin" />
          <p className="text-gray-500 text-sm">Loading analytics...</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <Card className="border-0 shadow-md border-red-200">
          <CardContent className="py-10 flex flex-col items-center gap-3 text-center">
            <AlertTriangle className="size-10 text-red-500" />
            <p className="text-gray-700">{error}</p>
            <Button onClick={() => fetchAnalytics(false)} className="bg-[#4A148C] hover:bg-[#1A0033] text-white rounded-xl">
              Try again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Content */}
      {data && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {/* ── KPI Cards ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard
              label="Total Members"
              value={data.totalMembers}
              icon={Users}
              color="from-purple-500 to-purple-700"
              sublabel={`${data.activeMembers} active`}
            />
            <KpiCard
              label="Total Referrals"
              value={data.totalReferrals}
              icon={Fish}
              color="from-rose-500 to-rose-700"
              sublabel={`${data.thisQuarterReferrals} this quarter`}
            />
            <KpiCard
              label="Conversion Rate"
              value={`${data.overallConversionRate}%`}
              icon={Target}
              color="from-emerald-500 to-emerald-700"
              sublabel="attended+ rate"
            />
            <div className="space-y-3">
              <Card className="border-0 shadow-md">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Quarter Growth</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-2xl font-bold text-[#4A148C]">
                          {data.quarterGrowthPercent > 0 ? "+" : ""}
                          {data.quarterGrowthPercent}%
                        </span>
                        {data.quarterGrowthPercent > 0 ? (
                          <TrendingUp className="size-5 text-emerald-500" />
                        ) : data.quarterGrowthPercent < 0 ? (
                          <TrendingDown className="size-5 text-red-500" />
                        ) : (
                          <Activity className="size-5 text-gray-400" />
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {data.lastQuarterReferrals} → {data.thisQuarterReferrals}
                      </p>
                    </div>
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-white">
                      <TrendingUp className="size-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              {/* Small alerts */}
              {(data.lostContactCount > 0 || data.inactiveMemberCount > 0) && (
                <div className="space-y-1">
                  {data.lostContactCount > 0 && (
                    <div className="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 rounded-lg px-2.5 py-1.5">
                      <AlertTriangle className="size-3" />
                      {data.lostContactCount} lost contact
                    </div>
                  )}
                  {data.inactiveMemberCount > 0 && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 rounded-lg px-2.5 py-1.5">
                      <Users className="size-3" />
                      {data.inactiveMemberCount} members with no referrals
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ── Charts Row 1: Funnel + Channel ── */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Referral Funnel */}
            <Card className="border-0 shadow-md lg:col-span-3">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-[#4A148C] flex items-center gap-2">
                  <BarChart3 className="size-5 text-purple-500" />
                  Referral Funnel
                </CardTitle>
                <p className="text-xs text-gray-400">
                  Distribution of all referrals by status
                </p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={data.funnel} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 11, fill: "#6B7280" }}
                      angle={-15}
                      textAnchor="end"
                      height={50}
                    />
                    <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "12px",
                        border: "none",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        fontSize: "12px",
                      }}
                      formatter={(value: number, name: string) => [
                        value,
                        name === "count" ? "Count" : "Percentage",
                      ]}
                    />
                    <Bar dataKey="count" name="count" radius={[6, 6, 0, 0]}>
                      {data.funnel.map((entry, index) => (
                        <Bar
                          key={`bar-${index}`}
                          dataKey="count"
                          fill={FUNNEL_COLORS[entry.status] || "#6B7280"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                {/* Funnel summary pills */}
                <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
                  {data.funnel.map((item) => (
                    <div
                      key={item.status}
                      className="flex items-center gap-1.5 text-xs"
                    >
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: FUNNEL_COLORS[item.status] || "#6B7280" }}
                      />
                      <span className="text-gray-600">
                        {item.label}: <strong className="text-[#4A148C]">{item.count}</strong>
                        <span className="text-gray-400"> ({item.percentage}%)</span>
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Channel Distribution */}
            <Card className="border-0 shadow-md lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-[#4A148C] flex items-center gap-2">
                  <PieChartIcon className="size-5 text-purple-500" />
                  Channel Distribution
                </CardTitle>
                <p className="text-xs text-gray-400">
                  How referrals were generated
                </p>
              </CardHeader>
              <CardContent>
                {data.channelBreakdown.length > 0 ? (
                  <div className="space-y-3">
                    {data.channelBreakdown.map((ch) => (
                      <div key={ch.channel}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-700">{ch.label || ch.channel}</span>
                          <span className="text-sm font-medium text-[#4A148C]">
                            {ch.count} ({ch.percentage}%)
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.max(ch.percentage, 2)}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="h-full rounded-full"
                            style={{
                              backgroundColor:
                                ch.channel === "link" ? "#3B82F6"
                                : ch.channel === "qr" ? "#8B5CF6"
                                : ch.channel === "whatsapp" ? "#25D366"
                                : ch.channel === "manual" ? "#F59E0B"
                                : ch.channel === "flyer" ? "#EF4444"
                                : "#6B7280",
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-400 text-sm">
                    No referral data yet
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* ── Monthly Trend ── */}
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-[#4A148C] flex items-center gap-2">
                <TrendingUp className="size-5 text-emerald-500" />
                Monthly Trend (Last 12 Months)
              </CardTitle>
              <p className="text-xs text-gray-400">
                New referrals and conversions per month — {data.currentQuarter.label}
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={data.monthlyTrend}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 11, fill: "#6B7280" }}
                    angle={-30}
                    textAnchor="end"
                    height={55}
                  />
                  <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      fontSize: "12px",
                    }}
                  />
                  <Legend
                    verticalAlign="top"
                    height={36}
                    iconType="circle"
                    wrapperStyle={{ fontSize: "12px" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="referrals"
                    name="New Referrals"
                    stroke="#3B82F6"
                    strokeWidth={2.5}
                    dot={{ fill: "#3B82F6", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="conversions"
                    name="Conversions"
                    stroke="#10B981"
                    strokeWidth={2.5}
                    dot={{ fill: "#10B981", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="newMembers"
                    name="New Members"
                    stroke="#4A148C"
                    strokeWidth={2.5}
                    dot={{ fill: "#4A148C", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* ── Top Performers Table ── */}
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-[#4A148C] flex items-center gap-2">
                <Award className="size-5 text-amber-500" />
                Top Performers
              </CardTitle>
              <p className="text-xs text-gray-400">
                Ranked by total gospel-labor points (all-time)
              </p>
            </CardHeader>
            <CardContent>
              {data.topPerformers.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 text-left">
                        <th className="pb-2 font-medium text-gray-500 text-xs">#</th>
                        <th className="pb-2 font-medium text-gray-500 text-xs">Member</th>
                        <th className="pb-2 font-medium text-gray-500 text-xs text-center">Referrals</th>
                        <th className="pb-2 font-medium text-gray-500 text-xs text-center">Score</th>
                        <th className="pb-2 font-medium text-gray-500 text-xs text-center">Conv. Rate</th>
                        <th className="pb-2 font-medium text-gray-500 text-xs text-center">Avg. Days</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.topPerformers.slice(0, 15).map((p, idx) => (
                        <motion.tr
                          key={p.memberId}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.03 }}
                          className="border-b border-gray-50 hover:bg-gray-50/50"
                        >
                          <td className="py-3">
                            <span
                              className={cn(
                                "inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold",
                                idx === 0 && "bg-amber-100 text-amber-700",
                                idx === 1 && "bg-gray-100 text-gray-600",
                                idx === 2 && "bg-red-100 text-red-700",
                                idx > 2 && "bg-purple-50 text-purple-600"
                              )}
                            >
                              {idx + 1}
                            </span>
                          </td>
                          <td className="py-3">
                            <p className="font-medium text-[#4A148C]">{p.fullName}</p>
                            <p className="text-xs text-gray-400 font-mono">{p.referralCode}</p>
                          </td>
                          <td className="py-3 text-center font-medium">{p.totalReferrals}</td>
                          <td className="py-3 text-center">
                            <span className="font-bold text-[#4A148C]">{Math.round(p.totalScore)}</span>
                          </td>
                          <td className="py-3 text-center">
                            <span
                              className={cn(
                                "inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium",
                                p.conversionRate >= 70
                                  ? "bg-emerald-100 text-emerald-700"
                                  : p.conversionRate >= 40
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-red-100 text-red-700"
                              )}
                            >
                              {p.conversionRate}%
                            </span>
                          </td>
                          <td className="py-3 text-center text-gray-500">
                            {p.avgDaysToConvert !== null ? `${p.avgDaysToConvert}d` : "—"}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400 text-sm">
                  <Fish className="size-10 mx-auto mb-3 text-gray-300" />
                  No performance data yet — members need to log referrals first.
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

// ── KPI Card Sub-component ──

function KpiCard({
  label,
  value,
  icon: Icon,
  color,
  sublabel,
}: {
  label: string;
  value: string | number;
  icon: typeof Users;
  color: string;
  sublabel?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-0 shadow-md">
        <CardContent className="p-5">
          <div
            className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${color} text-white mb-3`}
          >
            <Icon className="size-5" />
          </div>
          <div className="text-2xl font-bold text-[#4A148C]">{value}</div>
          <div className="text-xs text-gray-500 mt-1">{label}</div>
          {sublabel && (
            <div className="text-xs text-gray-400 mt-0.5">{sublabel}</div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
