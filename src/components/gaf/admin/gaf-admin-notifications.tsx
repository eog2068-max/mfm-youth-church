"use client";

/**
 * GafAdminNotifications — admin notification management.
 *
 * Features:
 *   - Broadcast notification composer (to all active members)
 *   - Notification log viewer with type/member filters
 *   - Delete notifications
 *   - Stats bar (total, unread, per-type breakdown)
 *
 * Stage 10 of Go-A-Fishing.
 */
import { useState, useEffect, useCallback } from "react";
import {
  Bell,
  Send,
  Trash2,
  Search,
  Megaphone,
  Fish,
  Award,
  Trophy,
  CheckCircle,
  AlertTriangle,
  Clock,
  BarChart3,
  Filter,
  RefreshCw,
  AlertCircle,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  NOTIFICATION_TYPE_LABELS,
  type NotificationType,
  NOTIFICATION_TYPES,
} from "@/lib/gaf/notification-engine";

interface NotificationWithMember {
  id: string;
  type: string;
  title: string;
  message: string;
  data: string | null;
  read: boolean;
  readAt: string | null;
  createdAt: string;
  memberId: string;
  member: { id: string; fullName: string; email: string };
}

interface NotificationStats {
  total: number;
  totalUnread: number;
  typeBreakdown: Record<string, number>;
}

const TYPE_ICONS: Record<string, React.ElementType> = {
  referral_status: Fish,
  commendation: Award,
  award: Trophy,
  outreach_approved: CheckCircle,
  outreach_flagged: AlertTriangle,
  cycle_closed: Clock,
  leaderboard_rank: BarChart3,
  admin_broadcast: Megaphone,
};

const TYPE_COLORS: Record<string, string> = {
  referral_status: "bg-purple-100 text-purple-600",
  commendation: "bg-amber-100 text-amber-600",
  award: "bg-yellow-100 text-yellow-700",
  outreach_approved: "bg-emerald-100 text-emerald-600",
  outreach_flagged: "bg-red-100 text-red-600",
  cycle_closed: "bg-purple-100 text-purple-600",
  leaderboard_rank: "bg-purple-100 text-purple-600",
  admin_broadcast: "bg-rose-100 text-rose-600",
};

export function GafAdminNotifications() {
  const [notifications, setNotifications] = useState<NotificationWithMember[]>([]);
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [memberSearch, setMemberSearch] = useState("");
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // Broadcast dialog state.
  const [broadcastOpen, setBroadcastOpen] = useState(false);
  const [broadcastTitle, setBroadcastTitle] = useState("");
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [broadcastType, setBroadcastType] = useState<string>("admin_broadcast");
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<string | null>(null);

  // Delete confirmation.
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchNotifications = useCallback(
    async (cursor?: string) => {
      try {
        setLoading(cursor === undefined);
        setError(null);
        const params = new URLSearchParams({ take: "25" });
        if (typeFilter !== "all") params.set("type", typeFilter);
        if (memberSearch.trim()) params.set("memberId", memberSearch.trim());

        const res = await fetch(`/api/gaf/admin/notifications?${params}`);
        if (!res.ok) throw new Error("Failed to load");

        const data = await res.json();
        if (cursor) {
          setNotifications((prev) => [...prev, ...data.notifications]);
        } else {
          setNotifications(data.notifications);
          setStats(data.stats);
        }
        setNextCursor(data.nextCursor);
        setHasMore(data.hasMore);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [typeFilter, memberSearch]
  );

  useEffect(() => {
    setNextCursor(null);
    fetchNotifications();
  }, [fetchNotifications]);

  const loadMore = () => {
    if (!nextCursor) return;
    setLoadingMore(true);
    fetchNotifications(nextCursor);
  };

  const handleBroadcast = async () => {
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) return;
    setSending(true);
    setSendResult(null);
    try {
      const res = await fetch("/api/gaf/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: broadcastTitle.trim(),
          message: broadcastMessage.trim(),
          type: broadcastType,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to send");
      }
      const data = await res.json();
      setSendResult(`Sent to ${data.recipientCount} active member(s)`);
      setBroadcastTitle("");
      setBroadcastMessage("");
      fetchNotifications();
    } catch (err) {
      setSendResult(
        err instanceof Error ? err.message : "Failed to send notification"
      );
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      const res = await fetch(
        `/api/gaf/admin/notifications?id=${encodeURIComponent(id)}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Failed to delete");
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      setDeleteTarget(null);
    } catch {
      // Silent.
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header + actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#4A148C] flex items-center gap-3">
            <div className="flex items-center justify-center size-10 rounded-xl bg-[#4A148C] text-white">
              <Bell className="size-5" />
            </div>
            Notifications
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and broadcast notifications to members
          </p>
        </div>

        <Dialog open={broadcastOpen} onOpenChange={setBroadcastOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-[#4A148C] hover:bg-[#1A0033] text-white rounded-xl">
              <Send className="size-4" />
              Broadcast
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Megaphone className="size-5 text-[#4A148C]" />
                Broadcast Notification
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {NOTIFICATION_TYPES.map((t) => (
                    <Button
                      key={t}
                      variant={broadcastType === t ? "default" : "outline"}
                      size="sm"
                      onClick={() => setBroadcastType(t)}
                      className={`rounded-full text-xs ${
                        broadcastType === t
                          ? "bg-[#4A148C] text-white"
                          : ""
                      }`}
                    >
                      {NOTIFICATION_TYPE_LABELS[t]}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Title (1-200 chars)
                </label>
                <input
                  type="text"
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  maxLength={200}
                  placeholder="e.g. Evangelism Outreach This Saturday"
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A148C]/20 focus:border-[#4A148C]"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Message (1-2000 chars)
                </label>
                <Textarea
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  maxLength={2000}
                  rows={4}
                  placeholder="Write your notification message to all active members..."
                  className="rounded-xl border-gray-200 focus:ring-2 focus:ring-[#4A148C]/20 focus:border-[#4A148C]"
                />
                <p className="text-[10px] text-gray-400 mt-1 text-right">
                  {broadcastMessage.length}/2000
                </p>
              </div>

              {sendResult && (
                <div
                  className={`text-sm p-3 rounded-xl ${
                    sendResult.startsWith("Sent")
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {sendResult}
                </div>
              )}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" className="rounded-xl">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                onClick={handleBroadcast}
                disabled={sending || !broadcastTitle.trim() || !broadcastMessage.trim()}
                className="gap-2 bg-[#4A148C] hover:bg-[#1A0033] text-white rounded-xl"
              >
                {sending ? (
                  <div className="animate-spin size-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <Send className="size-4" />
                )}
                {sending ? "Sending..." : "Send to All Members"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats bar */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card className="border-0 shadow-sm p-4">
            <p className="text-xs text-gray-500">Total Sent</p>
            <p className="text-2xl font-bold text-[#4A148C]">{stats.total}</p>
          </Card>
          <Card className="border-0 shadow-sm p-4">
            <p className="text-xs text-gray-500">Unread</p>
            <p className="text-2xl font-bold text-[#D32F2F]">
              {stats.totalUnread}
            </p>
          </Card>
          {Object.entries(stats.typeBreakdown)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 2)
            .map(([type, count]) => (
              <Card key={type} className="border-0 shadow-sm p-4">
                <p className="text-xs text-gray-500">
                  {NOTIFICATION_TYPE_LABELS[type as NotificationType] || type}
                </p>
                <p className="text-2xl font-bold text-[#4A148C]">{count}</p>
              </Card>
            ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Button
            variant={typeFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setTypeFilter("all")}
            className={`rounded-full shrink-0 gap-1.5 ${
              typeFilter === "all"
                ? "bg-[#4A148C] text-white hover:bg-[#1A0033]"
                : ""
            }`}
          >
            <Filter className="size-3" />
            All Types
          </Button>
          {NOTIFICATION_TYPES.map((t) => {
            const Icon = TYPE_ICONS[t] || Bell;
            return (
              <Button
                key={t}
                variant={typeFilter === t ? "default" : "outline"}
                size="sm"
                onClick={() => setTypeFilter(t)}
                className={`rounded-full shrink-0 gap-1.5 ${
                  typeFilter === t
                    ? "bg-[#4A148C] text-white hover:bg-[#1A0033]"
                    : ""
                }`}
              >
                <Icon className="size-3" />
                {NOTIFICATION_TYPE_LABELS[t]}
              </Button>
            );
          })}
        </div>

        <div className="relative ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <input
            type="text"
            value={memberSearch}
            onChange={(e) => setMemberSearch(e.target.value)}
            placeholder="Filter by member ID..."
            className="pl-9 pr-3 py-1.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A148C]/20 focus:border-[#4A148C] w-56"
          />
          {memberSearch && (
            <button
              onClick={() => setMemberSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="size-3 text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin size-8 border-3 border-[#4A148C] border-t-transparent rounded-full" />
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <Card className="border-0 shadow-md p-8 text-center">
          <AlertCircle className="size-8 text-red-500 mx-auto mb-3" />
          <p className="text-red-600 mb-4">{error}</p>
          <Button
            variant="outline"
            onClick={() => fetchNotifications()}
            className="rounded-xl gap-2"
          >
            <RefreshCw className="size-4" />
            Retry
          </Button>
        </Card>
      )}

      {/* Notification list */}
      {!loading && !error && (
        <div className="space-y-2">
          {notifications.length === 0 ? (
            <Card className="border-0 shadow-sm p-12 text-center">
              <Bell className="size-12 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500">No notifications found</p>
              <p className="text-xs text-gray-400 mt-1">
                {typeFilter !== "all" || memberSearch
                  ? "Try adjusting your filters"
                  : "Broadcast a notification to get started"}
              </p>
            </Card>
          ) : (
            <AnimatePresence>
              {notifications.map((n) => {
                const Icon = TYPE_ICONS[n.type] || Bell;
                const colorClass =
                  TYPE_COLORS[n.type] || "bg-gray-100 text-gray-600";
                return (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                  >
                    <Card
                      className={`border-0 shadow-sm hover:shadow-md transition-shadow ${
                        !n.read ? "bg-white" : "bg-gray-50/50"
                      }`}
                    >
                      <div className="flex items-start gap-4 p-4">
                        <div
                          className={`flex items-center justify-center w-9 h-9 rounded-lg shrink-0 ${colorClass}`}
                        >
                          <Icon className="size-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p
                              className={`text-sm ${
                                !n.read
                                  ? "font-semibold text-[#4A148C]"
                                  : "text-gray-600"
                              }`}
                            >
                              {n.title}
                            </p>
                            <div className="flex items-center gap-1.5 shrink-0">
                              {!n.read && (
                                <span className="size-2 rounded-full bg-[#4A148C]" />
                              )}
                              <Badge
                                variant="secondary"
                                className="text-[10px] rounded-full"
                              >
                                {NOTIFICATION_TYPE_LABELS[
                                  n.type as NotificationType
                                ] || n.type}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                            {n.message}
                          </p>
                          <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-400">
                            <span>
                              {n.member.fullName} ({n.member.email})
                            </span>
                            <span>
                              {new Date(n.createdAt).toLocaleString("en-US", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteTarget(n.id)}
                          className="shrink-0 text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      )}

      {/* Load more */}
      {hasMore && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={loadMore}
            disabled={loadingMore}
            className="rounded-xl gap-2"
          >
            {loadingMore ? (
              <div className="animate-spin size-4 border-2 border-gray-300 border-t-gray-600 rounded-full" />
            ) : null}
            {loadingMore ? "Loading..." : "Load more"}
          </Button>
        </div>
      )}

      {/* Delete confirmation dialog */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Notification</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            Are you sure you want to delete this notification? This action is
            logged in the audit trail.
          </p>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="rounded-xl">
                Cancel
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={() => deleteTarget && handleDelete(deleteTarget)}
              disabled={deleting}
              className="gap-2 rounded-xl"
            >
              {deleting ? (
                <div className="animate-spin size-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <Trash2 className="size-4" />
              )}
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
