"use client";

import { motion } from "framer-motion";
import {
  Users,
  BookOpen,
  Calendar,
  MessageSquare,
  Star,
  Megaphone,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  recentActivities,
  type ActivityType,
  type ActivityStatus,
} from "./admin-data";

const typeIconMap: Record<ActivityType, React.ElementType> = {
  member: Users,
  sermon: BookOpen,
  event: Calendar,
  prayer: MessageSquare,
  testimony: Star,
  announcement: Megaphone,
};

const typeColorMap: Record<ActivityType, string> = {
  member: "bg-[#4A148C]/10 text-[#4A148C]",
  sermon: "bg-[#2E7D32]/10 text-[#2E7D32]",
  event: "bg-[#C62828]/10 text-[#C62828]",
  prayer: "bg-[#6A1B9A]/10 text-[#6A1B9A]",
  testimony: "bg-[#AD1457]/10 text-[#AD1457]",
  announcement: "bg-[#00695C]/10 text-[#00695C]",
};

const statusColorMap: Record<ActivityStatus, string> = {
  new: "bg-[#4A148C] text-white",
  pending: "bg-[#C62828]/10 text-[#C62828] border-[#C62828]/20",
  approved: "bg-[#2E7D32]/10 text-[#2E7D32] border-[#2E7D32]/20",
  published: "bg-[#00695C]/10 text-[#00695C] border-[#00695C]/20",
};

function getRelativeTime(timestamp: string): string {
  const now = new Date("2025-01-15T12:00:00Z");
  const then = new Date(timestamp);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return then.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const displayedActivities = recentActivities.slice(0, 10);

export function RecentActivity() {
  return (
    <Card className="border-[#EBF0FA] bg-white shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold text-[#4A148C]">
          Recent Activity
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-[#4A148C]/60 hover:text-[#4A148C]"
        >
          View All
          <ArrowRight className="ml-1 size-3.5" />
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="max-h-[440px] px-6">
          <div className="flex flex-col gap-0">
            {displayedActivities.map((activity, index) => {
              const IconComponent = typeIconMap[activity.type];
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04, duration: 0.3 }}
                  className="group flex gap-3 border-b border-[#EBF0FA] py-3.5 last:border-b-0"
                >
                  {/* Icon */}
                  <div
                    className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg ${typeColorMap[activity.type]}`}
                  >
                    <IconComponent className="size-4" />
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium leading-snug text-[#4A148C]">
                        {activity.title}
                      </p>
                      <Badge
                        variant="outline"
                        className={`shrink-0 rounded-full border px-2 py-0 text-[10px] font-semibold ${statusColorMap[activity.status]}`}
                      >
                        {activity.status.charAt(0).toUpperCase() +
                          activity.status.slice(1)}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-[#4A148C]/50">
                      {activity.description}
                    </p>
                    <div className="mt-1.5 flex items-center gap-1 text-[10px] text-[#4A148C]/40">
                      <Clock className="size-3" />
                      {getRelativeTime(activity.timestamp)}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}