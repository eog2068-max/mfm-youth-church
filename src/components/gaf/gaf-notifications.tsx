"use client";

/**
 * GafNotifications — member notifications & activity feed page.
 *
 * Shows: filter pills by notification type, notification list with
 * mark-as-read (single + bulk), load-more pagination, empty state.
 *
 * Stage 10 of Go-A-Fishing.
 */
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Bell,
  Fish,
  Award,
  Trophy,
  CheckCircle,
  AlertTriangle,
  Clock,
  BarChart3,
  Megaphone,
  CheckCheck,
  Filter,
  Inbox,
  Heart,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  NOTIFICATION_TYPE_LABELS,
  type NotificationType,
} from "@/lib/gaf/notification-engine";

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  data: string | null;
  read: boolean;
  readAt: string | null;
  createdAt: string;
}

const ALL_TYPES = NOTIFICATION_TYPE_LABELS as unknown as Record<
  string,
  string
>;

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

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function GafNotifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);

  const fetchNotifications = useCallback(
    async (cursor?: string) => {
      try {
        setLoading(cursor === undefined);
        setError(null);
        const params = new URLSearchParams({ take: "20" });
        if (typeFilter !== "all") params.set("type", typeFilter);
        if (cursor) params.set("cursor", cursor);

        const res = await fetch(`/api/gaf/notifications?${params}`);
        if (!res.ok) throw new Error("Failed to load");

        const data = await res.json();
        if (cursor) {
          setNotifications((prev) => [...prev, ...data.notifications]);
        } else {
          setNotifications(data.notifications);
        }
        setUnreadCount(data.unreadCount);
        setNextCursor(data.nextCursor);
        setHasMore(data.hasMore);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [typeFilter]
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

  const markRead = async (id: string) => {
    try {
      await fetch("/api/gaf/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, read: true, readAt: new Date().toISOString() } : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      // Silent.
    }
  };

  const markAllRead = async () => {
    setMarkingAll(true);
    try {
      await fetch("/api/gaf/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAll: true }),
      });
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read: true, readAt: new Date().toISOString() }))
      );
      setUnreadCount(0);
    } catch {
      // Silent.
    } finally {
      setMarkingAll(false);
    }
  };

  // Group notifications by date for activity feed style.
  const groupedByDate: { label: string; items: NotificationItem[] }[] = [];
  let currentDate = "";
  for (const n of notifications) {
    const dateLabel = new Date(n.createdAt).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
    if (dateLabel !== currentDate) {
      currentDate = dateLabel;
      groupedByDate.push({ label: dateLabel, items: [] });
    }
    groupedByDate[groupedByDate.length - 1].items.push(n);
  }

  return (
    <section className="py-12 md:py-16 bg-[#F3E5F5] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#4A148C] flex items-center gap-3">
              <div className="flex items-center justify-center size-10 rounded-xl bg-[#4A148C] text-white">
                <Bell className="size-5" />
              </div>
              Notifications
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Stay updated with your Go-A-Fishing journey
            </p>
          </div>
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <Badge
                variant="secondary"
                className="bg-[#D32F2F] text-white rounded-full px-3"
              >
                {unreadCount} unread
              </Badge>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={markAllRead}
              disabled={markingAll || unreadCount === 0}
              className="gap-2 rounded-xl"
            >
              <CheckCheck className="size-4" />
              {markingAll ? "Marking..." : "Mark all read"}
            </Button>
          </div>
        </div>

        {/* Filter pills */}
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
            All
          </Button>
          {Object.entries(ALL_TYPES).map(([type, label]) => {
            const Icon = TYPE_ICONS[type] || Bell;
            return (
              <Button
                key={type}
                variant={typeFilter === type ? "default" : "outline"}
                size="sm"
                onClick={() => setTypeFilter(type)}
                className={`rounded-full shrink-0 gap-1.5 ${
                  typeFilter === type
                    ? "bg-[#4A148C] text-white hover:bg-[#1A0033]"
                    : ""
                }`}
              >
                <Icon className="size-3" />
                {label}
              </Button>
            );
          })}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin size-8 border-3 border-[#4A148C] border-t-transparent rounded-full mb-4" />
            <p className="text-sm text-gray-500">Loading notifications...</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <Card className="border-0 shadow-md p-8 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button
              variant="outline"
              onClick={() => fetchNotifications()}
              className="rounded-xl"
            >
              Try again
            </Button>
          </Card>
        )}

        {/* Empty */}
        {!loading && !error && notifications.length === 0 && (
          <Card className="border-0 shadow-md p-12 text-center">
            <Inbox className="size-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-[#4A148C] mb-2">
              No notifications yet
            </h3>
            <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
              {typeFilter !== "all"
                ? `You have no ${ALL_TYPES[typeFilter]?.toLowerCase() || ""} notifications.`
                : "As you participate in Go-A-Fishing — referrals, outreach, and more — you'll receive updates here."}
            </p>
            {typeFilter !== "all" && (
              <Button
                variant="outline"
                onClick={() => setTypeFilter("all")}
                className="rounded-xl"
              >
                View all notifications
              </Button>
            )}
            {typeFilter === "all" && (
              <Button
                asChild
                className="bg-[#4A148C] hover:bg-[#1A0033] text-white rounded-xl"
              >
                <Link href="/go-a-fishing/dashboard">Go to Dashboard</Link>
              </Button>
            )}
          </Card>
        )}

        {/* Notification feed grouped by date */}
        {!loading && !error && notifications.length > 0 && (
          <div className="space-y-8">
            {groupedByDate.map((group) => (
              <div key={group.label}>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  {group.label}
                </h3>
                <div className="space-y-2">
                  {group.items.map((n) => {
                    const Icon = TYPE_ICONS[n.type] || Bell;
                    const colorClass =
                      TYPE_COLORS[n.type] || "bg-gray-100 text-gray-600";
                    return (
                      <motion.div
                        key={n.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card
                          className={`border-0 shadow-sm transition-all hover:shadow-md cursor-pointer ${
                            !n.read
                              ? "bg-white border-l-4 border-l-[#4A148C]"
                              : "bg-gray-50/50"
                          }`}
                          onClick={() => !n.read && markRead(n.id)}
                        >
                          <div className="flex items-start gap-4 p-4">
                            <div
                              className={`flex items-center justify-center w-10 h-10 rounded-xl shrink-0 ${colorClass}`}
                            >
                              <Icon className="size-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <p
                                    className={`text-sm leading-snug ${
                                      n.read
                                        ? "text-gray-600"
                                        : "font-semibold text-[#4A148C]"
                                    }`}
                                  >
                                    {n.title}
                                  </p>
                                  <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                                    {n.message}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  {!n.read && (
                                    <span className="size-2.5 rounded-full bg-[#4A148C]" />
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-[10px] text-gray-400">
                                  {formatDate(n.createdAt)}
                                </span>
                                <Badge
                                  variant="secondary"
                                  className="text-[10px] rounded-full"
                                >
                                  {ALL_TYPES[n.type] || n.type}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load more */}
        {hasMore && (
          <div className="text-center pt-4">
            <Button
              variant="outline"
              onClick={loadMore}
              disabled={loadingMore}
              className="rounded-xl gap-2"
            >
              {loadingMore ? (
                <div className="animate-spin size-4 border-2 border-gray-300 border-t-gray-600 rounded-full" />
              ) : null}
              {loadingMore ? "Loading..." : "Load more notifications"}
            </Button>
          </div>
        )}

        {/* Scripture footer */}
        <div className="text-center py-8">
          <Heart className="size-8 mx-auto text-[#D32F2F] mb-3" />
          <p className="text-sm text-gray-600 italic max-w-md mx-auto leading-relaxed">
            &ldquo;And let us consider how we may spur one another on toward
            love and good deeds.&rdquo;
            <br />
            <span className="text-[#D32F2F] font-medium">
              — Hebrews 10:24
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
