"use client";

/**
 * GafAdminReferrals — all-referrals admin view with status update buttons.
 *
 * Stage 6 of Go-A-Fishing.
 */
import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Fish,
  Loader2,
  AlertCircle,
  ChevronDown,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const STATUSES = ["all", "invited", "attended", "saved", "baptized", "member", "lost_contact"];
const STATUS_COLORS: Record<string, string> = {
  invited: "bg-purple-100 text-purple-700",
  attended: "bg-amber-100 text-amber-700",
  saved: "bg-emerald-100 text-emerald-700",
  baptized: "bg-purple-100 text-purple-700",
  member: "bg-[#4A148C] text-white",
  lost_contact: "bg-gray-100 text-gray-600",
};

const NEXT_STATUS: Record<string, string> = {
  invited: "attended",
  attended: "saved",
  saved: "baptized",
  baptized: "member",
};

interface Referral {
  id: string;
  inviteeName: string;
  inviteePhone: string | null;
  inviteeEmail: string | null;
  channel: string;
  status: string;
  firstVisitDate: string | null;
  prayerPoint: string | null;
  notes: string | null;
  createdAt: string;
  referrer: { fullName: string; referralCode: string };
}

export function GafAdminReferrals() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchReferrals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ take: "50" });
      if (filter !== "all") params.set("status", filter);
      const res = await fetch(`/api/gaf/admin/referrals?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed");
      setReferrals(data.referrals);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { fetchReferrals(); }, [fetchReferrals]);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/gaf/admin/referrals/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Failed");
      }
      setReferrals((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="p-4 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-[#4A148C]">
          All Referrals
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {total} {total === 1 ? "referral" : "referrals"} across all members
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors capitalize ${
              filter === s
                ? "bg-[#4A148C] text-white"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            {s === "all" ? "All" : s.replace("_", " ")}
          </button>
        ))}
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          <AlertCircle className="size-4 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <Card className="border-0 shadow-md">
          <CardContent className="py-16 flex justify-center">
            <Loader2 className="size-8 text-[#4A148C] animate-spin" />
          </CardContent>
        </Card>
      ) : referrals.length === 0 ? (
        <Card className="border-0 shadow-md">
          <CardContent className="py-12 text-center text-gray-500">
            <Fish className="size-10 mx-auto mb-2 opacity-40" />
            No referrals in this category.
          </CardContent>
        </Card>
      ) : (
        <Card className="border-0 shadow-md">
          <CardContent className="p-0">
            <ul className="divide-y divide-gray-100">
              <AnimatePresence initial={false}>
                {referrals.map((ref) => (
                  <motion.li
                    key={ref.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-4 hover:bg-gray-50"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-[#4A148C]">
                            {ref.inviteeName}
                          </p>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              STATUS_COLORS[ref.status] || STATUS_COLORS.invited
                            }`}
                          >
                            {ref.status.replace("_", " ")}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          by{" "}
                          <span className="font-medium">{ref.referrer.fullName}</span>{" "}
                          ({ref.referrer.referralCode}) · via {ref.channel}
                        </p>
                        <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-gray-400 mt-1">
                          {ref.inviteePhone && <span>{ref.inviteePhone}</span>}
                          {ref.inviteeEmail && <span>{ref.inviteeEmail}</span>}
                          <span>{new Date(ref.createdAt).toLocaleDateString()}</span>
                        </div>
                        {ref.prayerPoint && (
                          <p className="text-xs text-[#D32F2F] mt-1">
                            🙏 {ref.prayerPoint}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {NEXT_STATUS[ref.status] && (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={actionLoading === ref.id}
                            onClick={() =>
                              handleStatusUpdate(ref.id, NEXT_STATUS[ref.status])
                            }
                            className="text-xs rounded-lg gap-1"
                          >
                            {actionLoading === ref.id ? (
                              <Loader2 className="size-3 animate-spin" />
                            ) : (
                              <CheckCircle2 className="size-3" />
                            )}
                            → {NEXT_STATUS[ref.status]}
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
