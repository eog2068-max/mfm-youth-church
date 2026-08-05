/**
 * Notification Engine for Go-A-Fishing.
 *
 * Provides `createNotification()` and `createBulkNotifications()` helpers that
 * insert Notification records. These are called by API route handlers after
 * key domain events (referral status change, commendation issued, award won,
 * outreach moderated, cycle closed, admin broadcast).
 *
 * Notification types:
 *   - referral_status:  a referral's status was updated (invitee progressed)
 *   - commendation:     a pastoral commendation was issued to this member
 *   - award:             the member won or placed in a reward cycle
 *   - outreach_approved: an outreach activity was confirmed by admin
 *   - outreach_flagged:  an outreach activity was flagged by admin
 *   - cycle_closed:     a reward cycle closed (top performers notified)
 *   - leaderboard_rank:  the member's leaderboard rank changed significantly
 *   - admin_broadcast:   a broadcast announcement from admin/pastor
 *
 * Stage 10 of Go-A-Fishing.
 */

import { db } from "@/lib/db";

// ─── Type constants ────────────────────────────────────────────────────────────

export const NOTIFICATION_TYPES = [
  "referral_status",
  "commendation",
  "award",
  "outreach_approved",
  "outreach_flagged",
  "cycle_closed",
  "leaderboard_rank",
  "admin_broadcast",
  // DailyWalk notification types (Stage 3)
  "dailywalk_streak_milestone",
  "dailywalk_streak_broken",
  "dailywalk_reminder",
  "dailywalk_encouragement",
] as const;

export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

export const NOTIFICATION_TYPE_LABELS: Record<NotificationType, string> = {
  referral_status: "Referral Update",
  commendation: "Commendation",
  award: "Award",
  outreach_approved: "Outreach Approved",
  outreach_flagged: "Outreach Flagged",
  cycle_closed: "Cycle Closed",
  leaderboard_rank: "Leaderboard",
  admin_broadcast: "Announcement",
  dailywalk_streak_milestone: "Streak Milestone",
  dailywalk_streak_broken: "Streak Broken",
  dailywalk_reminder: "Habit Reminder",
  dailywalk_encouragement: "Encouragement",
};

export const NOTIFICATION_TYPE_ICONS: Record<NotificationType, string> = {
  referral_status: "Fish",
  commendation: "Award",
  award: "Trophy",
  outreach_approved: "CheckCircle",
  outreach_flagged: "AlertTriangle",
  cycle_closed: "Clock",
  leaderboard_rank: "BarChart3",
  admin_broadcast: "Bell",
  dailywalk_streak_milestone: "Flame",
  dailywalk_streak_broken: "CloudRain",
  dailywalk_reminder: "Clock",
  dailywalk_encouragement: "Heart",
};

// ─── Status display labels for referrals ─────────────────────────────────────

const STATUS_LABELS: Record<string, string> = {
  invited: "invited",
  attended: "attended service",
  saved: "gave their life to Christ",
  baptized: "was baptized",
  member: "became a church member",
  lost_contact: "lost contact",
};

// ─── Create a single notification ─────────────────────────────────────────────

export interface CreateNotificationInput {
  memberId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
}

export async function createNotification(input: CreateNotificationInput) {
  return db.notification.create({
    data: {
      memberId: input.memberId,
      type: input.type,
      title: input.title,
      message: input.message,
      data: input.data ? JSON.stringify(input.data) : null,
    },
  });
}

// ─── Bulk create (for broadcasts, cycle closures) ────────────────────────────

export async function createBulkNotifications(
  inputs: CreateNotificationInput[]
) {
  if (inputs.length === 0) return;

  // Prisma createMany for single insert.
  await db.notification.createMany({
    data: inputs.map((input) => ({
      memberId: input.memberId,
      type: input.type,
      title: input.title,
      message: input.message,
      data: input.data ? JSON.stringify(input.data) : null,
    })),
  });
}

// ─── Convenience: notification on referral status change ──────────────────────

export async function notifyReferralStatusChange(
  referrerId: string,
  inviteeName: string,
  newStatus: string
) {
  const statusLabel = STATUS_LABELS[newStatus] || newStatus;
  await createNotification({
    memberId: referrerId,
    type: "referral_status",
    title: `Referral Update: ${inviteeName}`,
    message: `Great news! ${inviteeName} has ${statusLabel}. Keep praying and following up!`,
    data: { status: newStatus },
  });
}

// ─── Convenience: notification on commendation ─────────────────────────────────

export async function notifyCommendation(
  memberId: string,
  title: string,
  givenBy: string
) {
  await createNotification({
    memberId,
    type: "commendation",
    title: `Commendation: ${title}`,
    message: `You have received a pastoral commendation from ${givenBy}. Visit the Awards page to see the full message.`,
    data: { commendationTitle: title },
  });
}

// ─── Convenience: notification on award win ────────────────────────────────────

export async function notifyAwardWin(
  memberId: string,
  categoryName: string,
  cycleName: string,
  rank: number
) {
  const rankLabel = rank === 1 ? "1st place" : rank === 2 ? "2nd place" : "3rd place";
  await createNotification({
    memberId,
    type: "award",
    title: `Award: ${categoryName}`,
    message: `Congratulations! You placed ${rankLabel} in ${cycleName}. Visit the Awards page to see the full results.`,
    data: { categoryName, cycleName, rank },
  });
}

// ─── Convenience: notification on outreach moderation ──────────────────────────

export async function notifyOutreachModeration(
  memberId: string,
  activityTitle: string,
  newStatus: string
) {
  if (newStatus === "confirmed") {
    await createNotification({
      memberId,
      type: "outreach_approved",
      title: `Outreach Confirmed: ${activityTitle}`,
      message: `Your outreach activity "${activityTitle}" has been confirmed. Keep up the great work!`,
      data: { activityTitle, status: newStatus },
    });
  } else if (newStatus === "flagged") {
    await createNotification({
      memberId,
      type: "outreach_flagged",
      title: `Outreach Flagged: ${activityTitle}`,
      message: `Your outreach activity "${activityTitle}" has been flagged for review. A pastor will follow up with you.`,
      data: { activityTitle, status: newStatus },
    });
  } else if (newStatus === "disputed") {
    await createNotification({
      memberId,
      type: "outreach_flagged",
      title: `Outreach Disputed: ${activityTitle}`,
      message: `Your outreach activity "${activityTitle}" has been disputed. Please contact a pastor for clarification.`,
      data: { activityTitle, status: newStatus },
    });
  }
}

// ─── Convenience: notification on cycle closure (bulk) ─────────────────────────

export async function notifyCycleClosed(
  winnerMemberIds: string[],
  categoryName: string,
  cycleName: string
) {
  const inputs: CreateNotificationInput[] = winnerMemberIds.map((memberId) => ({
    memberId,
    type: "cycle_closed" as const,
    title: `Cycle Closed: ${categoryName}`,
    message: `The ${cycleName} cycle has closed. Check the Awards page to see the final rankings!`,
    data: { categoryName, cycleName },
  }));

  await createBulkNotifications(inputs);
}

// ─── Convenience: admin broadcast to all active members ───────────────────────

export async function broadcastToAllMembers(
  title: string,
  message: string
) {
  const activeMembers = await db.member.findMany({
    where: { status: "active" },
    select: { id: true },
  });

  const inputs: CreateNotificationInput[] = activeMembers.map((m) => ({
    memberId: m.id,
    type: "admin_broadcast" as const,
    title,
    message,
  }));

  await createBulkNotifications(inputs);
  return activeMembers.length;
}

// ─── Get unread count for a member ────────────────────────────────────────────

export async function getUnreadCount(memberId: string): Promise<number> {
  return db.notification.count({
    where: { memberId, read: false },
  });
}

// ─── DailyWalk Convenience Notifications (Stage 3) ─────────────────────────

/** Milestone thresholds for streak celebrations. */
const STREAK_MILESTONES = [7, 14, 21, 30, 50, 75, 100, 150, 200, 365] as const;

/**
 * Checks if a streak length is a milestone and notifies if so.
 * Call this after recalculateStreak() in the check-in flow.
 */
export async function notifyStreakMilestoneIfNeeded(
  memberId: string,
  habitName: string,
  newStreakLength: number
) {
  if (STREAK_MILESTONES.includes(newStreakLength as typeof STREAK_MILESTONES[number])) {
    const encouragement =
      newStreakLength >= 100
        ? "Incredible dedication! You are building a lifestyle of faith."
        : newStreakLength >= 30
          ? "A full month of consistency! God honors your faithfulness."
          : newStreakLength >= 7
          ? "A full week! Keep pressing on toward the goal."
          : "Amazing consistency! Keep going strong.";

    await createNotification({
      memberId,
      type: "dailywalk_streak_milestone",
      title: `${newStreakLength}-Day Streak: ${habitName}`,
      message: `You've maintained a ${newStreakLength}-day streak for "${habitName}"! ${encouragement}`,
      data: { habitName, streakLength: newStreakLength },
    });
  }
}

/**
 * Notifies a member when their streak has been broken (called by
 * a scheduled check or when they view the dashboard after missing a day).
 */
export async function notifyStreakBroken(
  memberId: string,
  habitName: string,
  lostStreakLength: number
) {
  const message =
    lostStreakLength >= 30
      ? `Your ${lostStreakLength}-day streak for "${habitName}" has ended. That was an incredible run! Don't be discouraged — start again today. "Though the righteous fall seven times, they rise again." — Proverbs 24:16`
      : lostStreakLength >= 7
        ? `Your ${lostStreakLength}-day streak for "${habitName}" has ended. Great effort! Every day with God matters. Start fresh today.`
        : `You missed a day for "${habitName}". That's okay — God's grace is new every morning. Check in today!`;

  await createNotification({
    memberId,
    type: "dailywalk_streak_broken",
    title: `Streak Ended: ${habitName}`,
    message,
    data: { habitName, lostStreakLength },
  });
}

/**
 * Creates a DailyWalk reminder notification.
 * In Stage 11, this will also trigger a Web Push notification.
 */
export async function notifyDailyWalkReminder(
  memberId: string,
  habitName: string,
  reminderTime: string
) {
  await createNotification({
    memberId,
    type: "dailywalk_reminder",
    title: `Time for: ${habitName}`,
    message: `It's ${reminderTime} — time to check in for "${habitName}". Stay faithful in your daily walk with God!`,
    data: { habitName, reminderTime },
  });
}

/**
 * Sends an encouragement notification after a period of struggle.
 * Triggered when a member's mood is consistently "struggling" or "tough".
 */
export async function notifyDailyWalkEncouragement(
  memberId: string
) {
  const encouragements = [
    {
      title: "You're Not Alone",
      message: "Even in the tough seasons, God is with you. \"Cast all your anxiety on Him because He cares for you.\" — 1 Peter 5:7",
    },
    {
      title: "Fresh Start Today",
      message: "Every day is a new opportunity to seek God. \"Because of the Lord's great love we are not consumed, for His compassions never fail. They are new every morning.\" — Lamentations 3:22-23",
    },
    {
      title: "Strength for Today",
      message: "\"I can do all things through Christ who strengthens me.\" — Philippians 4:13. You've got this — not in your own power, but His.",
    },
  ];

  const pick = encouragements[Math.floor(Math.random() * encouragements.length)];

  await createNotification({
    memberId,
    type: "dailywalk_encouragement",
    title: pick.title,
    message: pick.message,
  });
}
