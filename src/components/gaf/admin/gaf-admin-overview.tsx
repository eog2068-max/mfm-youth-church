"use client";

/**
 * GafAdminOverview — admin dashboard overview client component.
 *
 * Stage 6 of Go-A-Fishing.
 */
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  Fish,
  Trophy,
  Award,
  Settings,
  Shield,
  ArrowRight,
  Activity,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Stats {
  memberCount: number;
  referralCount: number;
  activeCycleCount: number;
  commendationCount: number;
}

interface LogEntry {
  action: string;
  entityType: string;
  createdAt: string;
  actorName: string;
}

interface GafAdminOverviewProps {
  stats: Stats;
  recentLogs: LogEntry[];
}

const STAT_CARDS = [
  {
    key: "memberCount" as const,
    label: "Registered Members",
    icon: Users,
    color: "from-purple-500 to-purple-700",
  },
  {
    key: "referralCount" as const,
    label: "Total Referrals",
    icon: Fish,
    color: "from-rose-500 to-rose-700",
  },
  {
    key: "activeCycleCount" as const,
    label: "Active Cycles",
    icon: Trophy,
    color: "from-amber-500 to-amber-700",
  },
  {
    key: "commendationCount" as const,
    label: "Commendations",
    icon: Award,
    color: "from-emerald-500 to-emerald-700",
  },
];

const QUICK_ACTIONS = [
  { label: "Manage Members", href: "/admin/gaf/members", icon: Users },
  { label: "Review Referrals", href: "/admin/gaf/referrals", icon: Fish },
  { label: "Manage Cycles", href: "/admin/gaf/cycles", icon: Trophy },
  { label: "Edit Configuration", href: "/admin/gaf/config", icon: Settings },
  { label: "View Audit Log", href: "/admin/gaf/audit-log", icon: Shield },
];

export function GafAdminOverview({ stats, recentLogs }: GafAdminOverviewProps) {
  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-[#4A148C]">
          Go-A-Fishing Admin
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage the evangelism program — members, referrals, cycles, and settings.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="border-0 shadow-md">
                <CardContent className="p-5">
                  <div
                    className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} text-white mb-3`}
                  >
                    <Icon className="size-5" />
                  </div>
                  <div className="text-2xl font-bold text-[#4A148C]">
                    {stats[stat.key]}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Quick actions */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-[#4A148C] flex items-center gap-2">
            <Activity className="size-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.href}
                asChild
                variant="outline"
                className="h-auto py-4 flex-col gap-2 rounded-xl border-[#4A148C]/20 hover:bg-[#4A148C]/5"
              >
                <Link href={action.href}>
                  <Icon className="size-5 text-[#4A148C]" />
                  <span className="text-sm text-[#4A148C]">{action.label}</span>
                </Link>
              </Button>
            );
          })}
        </CardContent>
      </Card>

      {/* Recent activity */}
      {recentLogs.length > 0 && (
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-[#4A148C]">Recent Activity</CardTitle>
              <Button asChild variant="ghost" size="sm" className="text-[#4A148C]">
                <Link href="/admin/gaf/audit-log">
                  View all
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-gray-100">
              {recentLogs.map((log, idx) => (
                <li key={idx} className="flex items-center justify-between py-3">
                  <div className="min-w-0">
                    <p className="text-sm text-[#4A148C] font-medium truncate">
                      {formatAction(log.action)}
                    </p>
                    <p className="text-xs text-gray-500">
                      by {log.actorName} · {log.entityType}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 shrink-0 ml-4">
                    {new Date(log.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function formatAction(action: string): string {
  const labels: Record<string, string> = {
    "member.update": "Member updated",
    "member.suspend": "Member suspended",
    "referral.create": "Referral created",
    "referral.update_status": "Referral status updated",
    "cycle.create": "Cycle created",
    "cycle.close": "Cycle closed",
    "config.update": "Configuration updated",
    "commendation.create": "Commendation issued",
  };
  return labels[action] || action.replace(/\./g, " ");
}
