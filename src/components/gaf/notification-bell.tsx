"use client";

/**
 * NotificationBell — dropdown bell icon showing unread notifications.
 *
 * Fetches unread count on mount and polls every 60 seconds.
 * On click, fetches the latest 10 notifications and shows them in a dropdown.
 * Supports "mark as read" and "mark all as read".
 *
 * Stage 10 of Go-A-Fishing.
 */
import { useState, useEffect, useCallback, useRef } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  NOTIFICATION_TYPE_LABELS,
  type NotificationType,
} from "@/lib/gaf/notification-engine";

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
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

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Poll unread count.
  const fetchCount = useCallback(async () => {
    try {
      const res = await fetch("/api/gaf/notifications/unread-count");
      if (res.ok) {
        const data = await res.json();
        setUnreadCount(data.count);
      }
    } catch {
      // Silent fail — show 0.
    }
  }, []);

  useEffect(() => {
    fetchCount();
    const interval = setInterval(fetchCount, 60_000);
    return () => clearInterval(interval);
  }, [fetchCount]);

  // Close dropdown on outside click.
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Fetch notifications when dropdown opens.
  const handleToggle = async () => {
    if (open) {
      setOpen(false);
      return;
    }
    setOpen(true);
    setLoading(true);
    try {
      const res = await fetch("/api/gaf/notifications?take=10");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch {
      // Silent.
    } finally {
      setLoading(false);
    }
  };

  // Mark single notification as read.
  const markRead = async (id: string) => {
    try {
      await fetch("/api/gaf/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      // Silent.
    }
  };

  // Mark all as read.
  const markAllRead = async () => {
    setMarkingAll(true);
    try {
      await fetch("/api/gaf/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAll: true }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch {
      // Silent.
    } finally {
      setMarkingAll(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleToggle}
        className="relative rounded-xl"
      >
        <Bell className="size-5 text-[#4A148C]" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center size-5 rounded-full bg-[#D32F2F] text-white text-[10px] font-bold">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </Button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
            <h3 className="font-semibold text-[#4A148C] text-sm">Notifications</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllRead}
                  disabled={markingAll}
                  className="text-xs text-[#4A148C] hover:bg-[#4A148C]/5 gap-1"
                >
                  <CheckCheck className="size-3" />
                  {markingAll ? "Marking..." : "Mark all read"}
                </Button>
              )}
              <Link
                href="/go-a-fishing/notifications"
                className="text-xs text-purple-600 hover:underline"
                onClick={() => setOpen(false)}
              >
                View all
              </Link>
            </div>
          </div>

          {/* Notification list */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin size-5 border-2 border-[#4A148C] border-t-transparent rounded-full" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-6">
                <Bell className="size-10 text-gray-200 mb-3" />
                <p className="text-sm text-gray-500">No notifications yet</p>
                <p className="text-xs text-gray-400 mt-1">
                  Stay active — updates will appear here
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-50">
                {notifications.map((n) => {
                  const Icon = TYPE_ICONS[n.type] || Bell;
                  const colorClass =
                    TYPE_COLORS[n.type] || "bg-gray-100 text-gray-600";
                  return (
                    <li
                      key={n.id}
                      className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50/50 transition-colors cursor-pointer ${
                        !n.read ? "bg-purple-50/30" : ""
                      }`}
                      onClick={() => !n.read && markRead(n.id)}
                    >
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-lg shrink-0 ${colorClass}`}
                      >
                        <Icon className="size-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p
                            className={`text-sm leading-snug ${
                              n.read
                                ? "text-gray-600"
                                : "font-semibold text-[#4A148C]"
                            }`}
                          >
                            {n.title}
                          </p>
                          {!n.read && (
                            <span className="shrink-0 size-2 rounded-full bg-[#4A148C] mt-1.5" />
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                          {n.message}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1">
                          {timeAgo(n.createdAt)}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
