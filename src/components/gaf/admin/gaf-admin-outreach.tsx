"use client";

/**
 * GafAdminOutreach — admin view of all members' outreach activities.
 *
 * Features:
 *   - Summary stats bar (total activities, contacts, decisions)
 *   - Full activity list with member name, type badge, date, location
 *   - Filter by type, status
 *   - Flag/dispute activities (status toggle)
 *   - Delete activity
 *
 * Stage 9 of Go-A-Fishing.
 */
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Loader2,
  AlertCircle,
  Fish,
  Flag,
  Trash2,
  CheckCircle,
  XCircle,
  Users,
  Heart,
  Search,
  ChevronDown,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ── Types ──

interface ActivityItem {
  id: string;
  type: string;
  title: string;
  description: string | null;
  activityDate: string;
  location: string | null;
  contacts: number;
  decisions: number;
  notes: string | null;
  status: string;
  member: {
    id: string;
    fullName: string;
    referralCode: string;
    avatarUrl: string | null;
  };
}

interface OutreachSummary {
  totalActivities: number;
  totalContacts: number;
  totalDecisions: number;
}

interface AdminOutreachResponse {
  activities: ActivityItem[];
  total: number;
  nextCursor: string | null;
  hasMore: boolean;
  summary: OutreachSummary;
}

// ── Config ──

const TYPE_LABELS: Record<string, string> = {
  door_to_door: "Door-to-Door",
  street_preaching: "Street Preaching",
  hospital_visit: "Hospital Visit",
  prison_ministry: "Prison Ministry",
  school_outreach: "School Outreach",
  market_evangelism: "Market Evangelism",
  phone_call: "Phone Call",
  social_media: "Social Media",
  personal_visit: "Personal Visit",
  other: "Other",
};

const TYPE_COLORS: Record<string, string> = {
  door_to_door: "bg-purple-100 text-purple-700",
  street_preaching: "bg-amber-100 text-amber-700",
  hospital_visit: "bg-rose-100 text-rose-700",
  prison_ministry: "bg-purple-100 text-purple-700",
  school_outreach: "bg-teal-100 text-teal-700",
  market_evangelism: "bg-red-100 text-red-700",
  phone_call: "bg-green-100 text-green-700",
  social_media: "bg-purple-100 text-purple-700",
  personal_visit: "bg-cyan-100 text-cyan-700",
  other: "bg-gray-100 text-gray-600",
};

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  confirmed: { label: "Confirmed", color: "bg-emerald-100 text-emerald-700" },
  flagged: { label: "Flagged", color: "bg-amber-100 text-amber-700" },
  disputed: { label: "Disputed", color: "bg-red-100 text-red-700" },
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ── Component ──

export function GafAdminOutreach() {
  const [data, setData] = useState<AdminOutreachResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchOutreach = useCallback(async (cursor?: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (cursor) params.set("cursor", cursor);
      if (filterType) params.set("type", filterType);
      if (filterStatus) params.set("status", filterStatus);

      const res = await fetch(`/api/gaf/admin/outreach?${params}`);
      if (!res.ok) throw new Error("Failed to load");
      const json: AdminOutreachResponse = await res.json();

      if (cursor) {
        setData((prev) =>
          prev
            ? { ...json, activities: [...prev.activities, ...json.activities], summary: prev.summary }
            : json
        );
      } else {
        setData(json);
      }
    } catch (err) {
      setError("Failed to load outreach activities");
    } finally {
      setLoading(false);
    }
  }, [filterType, filterStatus]);

  useEffect(() => {
    fetchOutreach();
  }, [fetchOutreach]);

  // Reset on filter change
  useEffect(() => {
    setData(null);
    fetchOutreach();
  }, [filterType, filterStatus]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/gaf/admin/outreach/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update");
      setData((prev) =>
        prev
          ? {
              ...prev,
              activities: prev.activities.map((a) =>
                a.id === id ? { ...a, status: newStatus } : a
              ),
            }
          : prev
      );
    } catch {
      // ignore
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/gaf/admin/outreach/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setData((prev) =>
        prev
          ? {
              ...prev,
              activities: prev.activities.filter((a) => a.id !== id),
              total: Math.max(0, prev.total - 1),
            }
          : prev
      );
    } catch {
      // ignore
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-[#4A148C]">
          Outreach Activities
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          View and moderate all members&apos; outreach activity logs.
        </p>
      </div>

      {/* Summary stats */}
      {data && (
        <div className="grid grid-cols-3 gap-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-[#4A148C]">
                {data.summary.totalActivities}
              </div>
              <div className="text-xs text-gray-500">Total Activities</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-amber-600">
                {data.summary.totalContacts}
              </div>
              <div className="text-xs text-gray-500">People Reached</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-emerald-600">
                {data.summary.totalDecisions}
              </div>
              <div className="text-xs text-gray-500">Decisions for Christ</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex flex-wrap gap-2 flex-1">
          <button
            type="button"
            onClick={() => setFilterType("")}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium transition-colors border",
              !filterType ? "bg-[#4A148C] text-white border-[#4A148C]" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
            )}
          >
            All Types
          </button>
          {Object.entries(TYPE_LABELS).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilterType(key)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-colors border",
                filterType === key ? "bg-[#4A148C] text-white border-[#4A148C]" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {["", "confirmed", "flagged", "disputed"].map((s) => {
            const label = s === "" ? "All Status" : STATUS_CONFIG[s]?.label || s;
            return (
              <button
                key={s}
                type="button"
                onClick={() => setFilterStatus(s)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium transition-colors border",
                  filterStatus === s ? "bg-[#4A148C] text-white border-[#4A148C]" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Activity list */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-[#4A148C] flex items-center gap-2">
            <MapPin className="size-5 text-purple-500" />
            All Activities
            {data && (
              <span className="text-sm font-normal text-gray-400">({data.total})</span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading && !data ? (
            <div className="py-16 flex flex-col items-center gap-3">
              <Loader2 className="size-8 text-[#4A148C] animate-spin" />
              <p className="text-sm text-gray-500">Loading...</p>
            </div>
          ) : error ? (
            <div className="py-16 text-center text-red-500">{error}</div>
          ) : data && data.activities.length === 0 ? (
            <div className="py-16 text-center">
              <Fish className="size-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No outreach activities found</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              <AnimatePresence initial={false}>
                {data.activities.map((act, idx) => {
                  const typeColor = TYPE_COLORS[act.type] || TYPE_COLORS.other;
                  const statusCfg = STATUS_CONFIG[act.status] || STATUS_CONFIG.confirmed;
                  return (
                    <motion.li
                      key={act.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ delay: idx * 0.03 }}
                      className="py-4"
                    >
                      <div className="flex items-start gap-4">
                        <div className="shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white text-sm font-bold">
                          {act.member.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="font-semibold text-[#4A148C]">{act.title}</p>
                              <div className="flex flex-wrap items-center gap-2 mt-1">
                                <span className="text-xs font-medium text-gray-500">{act.member.fullName}</span>
                                <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", typeColor)}>
                                  {TYPE_LABELS[act.type] || act.type}
                                </span>
                                <span className="text-xs text-gray-400">{formatDate(act.activityDate)}</span>
                                {act.location && (
                                  <span className="text-xs text-gray-500 flex items-center gap-0.5">
                                    <MapPin className="size-3" />{act.location}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="shrink-0 flex items-center gap-2">
                              {act.contacts > 0 && (
                                <span className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full">{act.contacts} reached</span>
                              )}
                              {act.decisions > 0 && (
                                <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full">{act.decisions} saved</span>
                              )}
                              <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", statusCfg.color)}>
                                {statusCfg.label}
                              </span>
                            </div>
                          </div>
                          {/* Action buttons */}
                          <div className="flex items-center gap-2 mt-2">
                            {act.status === "confirmed" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleStatusChange(act.id, "flagged")}
                                disabled={actionLoading === act.id}
                                className="text-amber-500 hover:text-amber-700 h-7 px-2 text-xs gap-1"
                              >
                                <Flag className="size-3" />
                                Flag
                              </Button>
                            )}
                            {act.status === "flagged" && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleStatusChange(act.id, "confirmed")}
                                  disabled={actionLoading === act.id}
                                  className="text-emerald-500 hover:text-emerald-700 h-7 px-2 text-xs gap-1"
                                >
                                  <CheckCircle className="size-3" />
                                  Confirm
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleStatusChange(act.id, "disputed")}
                                  disabled={actionLoading === act.id}
                                  className="text-red-500 hover:text-red-700 h-7 px-2 text-xs gap-1"
                                >
                                  <XCircle className="size-3" />
                                  Dispute
                                </Button>
                              </>
                            )}
                            {act.status === "disputed" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleStatusChange(act.id, "confirmed")}
                                disabled={actionLoading === act.id}
                                className="text-emerald-500 hover:text-emerald-700 h-7 px-2 text-xs gap-1"
                              >
                                <CheckCircle className="size-3" />
                                Confirm
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(act.id)}
                              disabled={actionLoading === act.id}
                              className="text-gray-400 hover:text-red-500 h-7 px-2 text-xs"
                            >
                              <Trash2 className="size-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ul>
          )}

          {/* Load more */}
          {data && data.hasMore && (
            <div className="pt-4 text-center">
              <Button
                variant="outline"
                onClick={() => data.nextCursor && fetchOutreach(data.nextCursor)}
                disabled={loading}
                className="gap-2 rounded-xl"
              >
                {loading ? <Loader2 className="size-4 animate-spin" /> : <ChevronDown className="size-4" />}
                Load more
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
