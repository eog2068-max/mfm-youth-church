/**
 * DailyWalk Core Service Layer.
 *
 * Pure business-logic functions for the personal spiritual habit tracker.
 * All functions are server-only (import db from @/lib/db).
 * API routes (Stage 4) and UI components (Stages 5-8) consume these.
 *
 * Design decisions:
 *   - Timezone: All day-truncation uses the Africa/Lagos timezone (WAT, UTC+1).
 *     A member's "today" is determined by WAT, not UTC. This avoids the common
 *     bug where a check-in at 11:30 PM UTC (12:30 AM WAT next day) creates
 *     a gap in the streak. (R9 resolution)
 *   - Streaks are recalculated on every check-in (not cron-based) to keep
 *     the logic simple and avoid external scheduler dependencies.
 *   - Frequency check happens at query time: a habit is "due" if the current
 *     WAT day matches its frequency rule.
 *
 * Stage 3 of DailyWalk (18-stage plan).
 */

import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

// ============================================================================
// Types & Constants
// ============================================================================

/** Spiritual habit categories — shown in the UI as filter pills and icons. */
export const HABIT_CATEGORIES = [
  "prayer",
  "scripture",
  "fasting",
  "worship",
  "devotion",
  "meditation",
  "general",
] as const;

export type HabitCategory = (typeof HABIT_CATEGORIES)[number];

export const HABIT_CATEGORY_LABELS: Record<HabitCategory, string> = {
  prayer: "Prayer",
  scripture: "Scripture Reading",
  fasting: "Fasting",
  worship: "Worship",
  devotion: "Devotion",
  meditation: "Meditation",
  general: "General",
};

export const HABIT_CATEGORY_ICONS: Record<HabitCategory, string> = {
  prayer: "HandMetal",
  scripture: "BookOpen",
  fasting: "UtensilsCrossed",
  worship: "Music",
  devotion: "Flame",
  meditation: "Brain",
  general: "Heart",
};

/** Frequency options — determines which days a habit is "due". */
export const HABIT_FREQUENCIES = [
  "daily",
  "weekdays",
  "weekends",
  "custom",
] as const;

export type HabitFrequency = (typeof HABIT_FREQUENCIES)[number];

export const HABIT_FREQUENCY_LABELS: Record<HabitFrequency, string> = {
  daily: "Every Day",
  weekdays: "Weekdays (Mon-Fri)",
  weekends: "Weekends (Sat-Sun)",
  custom: "Custom Days",
};

/** Mood options for check-in reflections. */
export const CHECKIN_MOODS = [
  "great",
  "good",
  "okay",
  "struggling",
  "tough",
] as const;

export type CheckInMood = (typeof CHECKIN_MOODS)[number];

export const CHECKIN_MOOD_LABELS: Record<CheckInMood, string> = {
  great: "Feeling Great",
  good: "Good",
  okay: "Okay",
  struggling: "Struggling",
  tough: "Having a Tough Time",
};

export const CHECKIN_MOOD_EMOJIS: Record<CheckInMood, string> = {
  great: "\u{1F929}",  // star-struck
  good: "\u{1F60A}",    // smiling face with hearts
  okay: "\u{1F610}",    // neutral face
  struggling: "\u{1F614}", // pensive
  tough: "\u{1F61E}",    // disappointed
};

/** Default habit colors for personalization. */
export const HABIT_COLORS = [
  "#4A148C", // deep purple (default)
  "#1A237E", // MFM blue
  "#D32F2F", // MFM red
   "#2E7D32", // green
  "#E65100", // CONNECT orange
  "#3949AB", // REACH indigo
  "#00695C", // teal
  "#4E342E", // brown
  "#37474F", // blue-grey
  "#880E4F", // pink
] as const;

/** Max habits per member — prevents abuse and keeps UI manageable. */
export const MAX_HABITS_PER_MEMBER = 20;

/** Max active (non-archived) habits per member. */
export const MAX_ACTIVE_HABITS_PER_MEMBER = 12;

// ============================================================================
// Timezone Helpers (R9 Resolution)
// ============================================================================

/**
 * The timezone used for all day-boundary calculations.
 * All members are in Nigeria (WAT = UTC+1). Using a fixed TZ avoids
 * per-member timezone storage complexity while being correct for the
 * entire user base.
 */
const MEMBER_TIMEZONE = "Africa/Lagos";

/**
 * Returns the current date in the member's timezone, truncated to midnight.
 * This is the canonical "today" for all DailyWalk operations.
 */
export function getTodayInMemberTZ(): Date {
  const now = new Date();
  // Format in WAT, then parse back to get midnight WAT as a UTC Date
  const dateStr = now.toLocaleDateString("en-CA", {
    timeZone: MEMBER_TIMEZONE,
  }); // "YYYY-MM-DD"
  return new Date(`${dateStr}T00:00:00+01:00`);
}

/**
 * Truncates a given Date to the start of the day in WAT.
 * Used for comparing check-in dates.
 */
export function truncateToDayInTZ(date: Date): Date {
  const dateStr = date.toLocaleDateString("en-CA", {
    timeZone: MEMBER_TIMEZONE,
  });
  return new Date(`${dateStr}T00:00:00+01:00`);
}

/**
 * Returns the WAT day-of-week index (0=Sunday, 6=Saturday).
 * Uses Intl.DateTimeFormat to get the correct day in WAT.
 */
function getDayOfWeekInTZ(date: Date): number {
  // Format as full weekday name in WAT, then map to index
  const dayName = date.toLocaleDateString("en-US", {
    timeZone: MEMBER_TIMEZONE,
    weekday: "long",
  });
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const idx = dayNames.indexOf(dayName);
  return idx >= 0 ? idx : date.getDay();
}

// ============================================================================
// Frequency Helpers
// ============================================================================

/**
 * Determines if a habit is "due" on a given date based on its frequency.
 *
 * @param frequency - The habit's frequency setting
 * @param customDays - JSON array of day indices [0-6] (0=Sunday) if frequency="custom"
 * @param date - The date to check (defaults to now)
 * @returns true if the habit should be done on this date
 */
export function isHabitDueOn(
  frequency: HabitFrequency,
  customDays: string | null | undefined,
  date: Date = new Date()
): boolean {
  const dayOfWeek = getDayOfWeekInTZ(date);

  switch (frequency) {
    case "daily":
      return true;
    case "weekdays":
      return dayOfWeek >= 1 && dayOfWeek <= 5; // Mon-Fri
    case "weekends":
      return dayOfWeek === 0 || dayOfWeek === 6; // Sat-Sun
    case "custom": {
      if (!customDays) return false;
      try {
        const days = JSON.parse(customDays) as number[];
        return days.includes(dayOfWeek);
      } catch {
        return false; // malformed JSON → not due
      }
    }
    default:
      return true; // fail open
  }
}

// ============================================================================
// Habit CRUD
// ============================================================================

export interface CreateHabitInput {
  memberId: string;
  name: string;
  description?: string;
  category?: HabitCategory;
  icon?: string;
  color?: string;
  frequency?: HabitFrequency;
  customDays?: number[]; // 0-6, Sunday=0
  reminderTime?: string; // HH:MM
  reminderEnabled?: boolean;
}

/**
 * Creates a new habit for a member.
 * Enforces MAX_ACTIVE_HABITS_PER_MEMBER.
 * Auto-sets sortOrder to the end of the list.
 */
export async function createHabit(input: CreateHabitInput) {
  // Check active habit count
  const activeCount = await db.dailyWalkHabit.count({
    where: {
      memberId: input.memberId,
      isActive: true,
      isArchived: false,
    },
  });

  if (activeCount >= MAX_ACTIVE_HABITS_PER_MEMBER) {
    throw new Response(
      `You can have at most ${MAX_ACTIVE_HABITS_PER_MEMBER} active habits. Archive one first.`,
      { status: 400 }
    );
  }

  // Check total habit count (including archived)
  const totalCount = await db.dailyWalkHabit.count({
    where: { memberId: input.memberId },
  });

  if (totalCount >= MAX_HABITS_PER_MEMBER) {
    throw new Response(
      `You've reached the maximum of ${MAX_HABITS_PER_MEMBER} habits total.`,
      { status: 400 }
    );
  }

  // Determine next sortOrder
  const maxSort = await db.dailyWalkHabit.aggregate({
    where: { memberId: input.memberId },
    _max: { sortOrder: true },
  });
  const nextSort = (maxSort._max.sortOrder ?? -1) + 1;

  return db.dailyWalkHabit.create({
    data: {
      memberId: input.memberId,
      name: input.name.trim(),
      description: input.description?.trim() || null,
      category: input.category ?? "general",
      icon: input.icon ?? "heart",
      color: input.color ?? "#4A148C",
      frequency: input.frequency ?? "daily",
      customDays: input.customDays
        ? JSON.stringify(input.customDays)
        : null,
      reminderTime: input.reminderTime || null,
      reminderEnabled: input.reminderEnabled ?? false,
      sortOrder: nextSort,
    },
  });
}

export interface UpdateHabitInput {
  id: string;
  memberId: string;
  name?: string;
  description?: string | null;
  category?: HabitCategory;
  icon?: string;
  color?: string;
  frequency?: HabitFrequency;
  customDays?: number[] | null;
  reminderTime?: string | null;
  reminderEnabled?: boolean;
}

/**
 * Updates an existing habit. Only the owner can update.
 */
export async function updateHabit(input: UpdateHabitInput) {
  // Verify ownership
  const existing = await db.dailyWalkHabit.findFirst({
    where: { id: input.id, memberId: input.memberId },
  });

  if (!existing) {
    throw new Response("Habit not found", { status: 404 });
  }

  const data: Prisma.DailyWalkHabitUpdateInput = {};

  if (input.name !== undefined) data.name = input.name.trim();
  if (input.description !== undefined)
    data.description = input.description?.trim() || null;
  if (input.category !== undefined) data.category = input.category;
  if (input.icon !== undefined) data.icon = input.icon;
  if (input.color !== undefined) data.color = input.color;
  if (input.frequency !== undefined) data.frequency = input.frequency;
  if (input.customDays !== undefined)
    data.customDays = input.customDays
      ? JSON.stringify(input.customDays)
      : null;
  if (input.reminderTime !== undefined)
    data.reminderTime = input.reminderTime;
  if (input.reminderEnabled !== undefined)
    data.reminderEnabled = input.reminderEnabled;

  return db.dailyWalkHabit.update({
    where: { id: input.id },
    data,
  });
}

/**
 * Archives a habit (soft delete). The habit and its history remain in the DB
 * but it no longer appears in the active list or counts toward the limit.
 */
export async function archiveHabit(habitId: string, memberId: string) {
  const existing = await db.dailyWalkHabit.findFirst({
    where: { id: habitId, memberId },
  });

  if (!existing) {
    throw new Response("Habit not found", { status: 404 });
  }

  return db.dailyWalkHabit.update({
    where: { id: habitId },
    data: { isArchived: true, isActive: false },
  });
}

/**
 * Restores an archived habit back to active.
 */
export async function restoreHabit(habitId: string, memberId: string) {
  const existing = await db.dailyWalkHabit.findFirst({
    where: { id: habitId, memberId, isArchived: true },
  });

  if (!existing) {
    throw new Response("Archived habit not found", { status: 404 });
  }

  // Re-check active count since restoring adds one back
  const activeCount = await db.dailyWalkHabit.count({
    where: {
      memberId,
      isActive: true,
      isArchived: false,
    },
  });

  if (activeCount >= MAX_ACTIVE_HABITS_PER_MEMBER) {
    throw new Response(
      `You can have at most ${MAX_ACTIVE_HABITS_PER_MEMBER} active habits. Archive one first.`,
      { status: 400 }
    );
  }

  return db.dailyWalkHabit.update({
    where: { id: habitId },
    data: { isArchived: false, isActive: true },
  });
}

/**
 * Permanently deletes a habit and ALL associated check-ins and streak data.
 * This is irreversible. Use archiveHabit() for soft-delete instead.
 */
export async function deleteHabitPermanently(
  habitId: string,
  memberId: string
) {
  const existing = await db.dailyWalkHabit.findFirst({
    where: { id: habitId, memberId },
  });

  if (!existing) {
    throw new Response("Habit not found", { status: 404 });
  }

  // Cascade deletes handle check-ins and streaks via schema onDelete: Cascade
  return db.dailyWalkHabit.delete({
    where: { id: habitId },
  });
}

/**
 * Reorders habits. Accepts an ordered array of { id, sortOrder } pairs.
 * All IDs must belong to the member.
 */
export async function reorderHabits(
  memberId: string,
  items: { id: string; sortOrder: number }[]
) {
  // Verify all habits belong to this member
  const habitIds = items.map((i) => i.id);
  const ownedCount = await db.dailyWalkHabit.count({
    where: { id: { in: habitIds }, memberId },
  });

  if (ownedCount !== habitIds.length) {
    throw new Response("One or more habits not found", { status: 404 });
  }

  // Update each habit's sortOrder in a transaction
  await db.$transaction(
    items.map((item) =>
      db.dailyWalkHabit.update({
        where: { id: item.id },
        data: { sortOrder: item.sortOrder },
      })
    )
  );
}

/**
 * Lists all habits for a member, with optional filter for active-only.
 * Returns habits sorted by sortOrder ascending.
 */
export async function listHabits(
  memberId: string,
  options: { activeOnly?: boolean; includeArchived?: boolean } = {}
) {
  const { activeOnly = false, includeArchived = false } = options;

  const where: Prisma.DailyWalkHabitWhereInput = { memberId };

  if (activeOnly) {
    where.isActive = true;
    where.isArchived = false;
  } else if (!includeArchived) {
    where.isArchived = false;
  }

  return db.dailyWalkHabit.findMany({
    where,
    orderBy: { sortOrder: "asc" },
  });
}

/**
 * Gets a single habit by ID, ensuring it belongs to the member.
 */
export async function getHabit(habitId: string, memberId: string) {
  return db.dailyWalkHabit.findFirst({
    where: { id: habitId, memberId },
  });
}

// ============================================================================
// Check-In Logic
// ============================================================================

export interface CheckInInput {
  habitId: string;
  memberId: string;
  note?: string;
  mood?: CheckInMood;
}

/**
 * Checks in a habit for today.
 *
 * Key behaviors:
 *   - Day truncation: Uses WAT timezone to determine "today" (R9)
 *   - Duplicate prevention: Uses a unique constraint on (habitId, memberId, checkedInAt)
 *     but we also truncate to day-start to allow one check-in per habit per day.
 *   - Auto-creates a streak record if none exists.
 *   - Recalculates streak after every check-in.
 *
 * Returns the created check-in record.
 */
export async function checkIn(input: CheckInInput) {
  // Verify habit exists and belongs to member
  const habit = await db.dailyWalkHabit.findFirst({
    where: { id: input.habitId, memberId: input.memberId, isArchived: false },
  });

  if (!habit) {
    throw new Response("Habit not found or archived", { status: 404 });
  }

  // Get today in WAT (truncated to midnight WAT)
  const todayStart = getTodayInMemberTZ();
  // Tomorrow start = today + 24h
  const tomorrowStart = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

  // Check for existing check-in today (duplicate prevention)
  const existingCheckIn = await db.dailyWalkCheckIn.findFirst({
    where: {
      habitId: input.habitId,
      memberId: input.memberId,
      checkedInAt: {
        gte: todayStart,
        lt: tomorrowStart,
      },
    },
  });

  if (existingCheckIn) {
    throw new Response(
      "You have already checked in for this habit today. Keep it up!",
      { status: 409 }
    );
  }

  // Create check-in with truncated timestamp
  const checkIn = await db.dailyWalkCheckIn.create({
    data: {
      habitId: input.habitId,
      memberId: input.memberId,
      checkedInAt: todayStart,
      note: input.note?.trim() || null,
      mood: input.mood || null,
    },
  });

  // Update streak
  await recalculateStreak(input.habitId, input.memberId);

  return checkIn;
}

/**
 * Undoes today's check-in for a habit.
 * Useful if someone checked in by mistake.
 * Decrements the streak if the undone check-in was the most recent one.
 */
export async function undoCheckIn(habitId: string, memberId: string) {
  const todayStart = getTodayInMemberTZ();
  const tomorrowStart = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

  const existingCheckIn = await db.dailyWalkCheckIn.findFirst({
    where: {
      habitId,
      memberId,
      checkedInAt: {
        gte: todayStart,
        lt: tomorrowStart,
      },
    },
  });

  if (!existingCheckIn) {
    throw new Response("No check-in found for today", { status: 404 });
  }

  await db.dailyWalkCheckIn.delete({
    where: { id: existingCheckIn.id },
  });

  // Recalculate streak after undo
  await recalculateStreak(habitId, memberId);

  return { success: true, deletedId: existingCheckIn.id };
}

// ============================================================================
// Streak Calculation
// ============================================================================

/**
 * Recalculates the streak for a habit/member combination.
 *
 * Algorithm:
 *   1. Fetch all check-in dates (truncated to day) for this habit/member,
 *      ordered descending.
 *   2. Starting from the most recent check-in, count consecutive days
 *      going backwards.
 *   3. "Consecutive" means each day is exactly 1 day before the previous one.
 *   4. Update or create the DailyWalkStreak record.
 *   5. If currentLength > longestLength, update longestLength too.
 *
 * This runs on every check-in and undo. For members with years of data,
 * we only need the most recent ~100 check-ins to determine the current streak,
 * so we limit the query.
 */
export async function recalculateStreak(
  habitId: string,
  memberId: string
) {
  // Fetch recent check-ins, most recent first
  const checkIns = await db.dailyWalkCheckIn.findMany({
    where: { habitId, memberId },
    select: { checkedInAt: true },
    orderBy: { checkedInAt: "desc" },
    take: 100, // enough to determine any realistic streak
  });

  if (checkIns.length === 0) {
    // No check-ins at all — reset streak
    await upsertStreak(habitId, memberId, 0);
    return;
  }

  // Truncate all timestamps to day-start in WAT
  const days = checkIns.map((c) => truncateToDayInTZ(c.checkedInAt).getTime());

  // Remove duplicates (same day checked multiple times shouldn't happen
  // due to our constraint, but be defensive)
  const uniqueDays = [...new Set(days)].sort((a, b) => b - a); // desc

  // Count consecutive days from most recent
  const DAY_MS = 24 * 60 * 60 * 1000;
  let currentStreak = 1;

  const todayStart = getTodayInMemberTZ().getTime();
  const yesterdayStart = todayStart - DAY_MS;

  // The most recent check-in must be today or yesterday for the streak to be active
  if (uniqueDays[0] !== todayStart && uniqueDays[0] !== yesterdayStart) {
    // Streak is broken — most recent check-in is 2+ days old
    await upsertStreak(habitId, memberId, 0);
    return;
  }

  for (let i = 1; i < uniqueDays.length; i++) {
    const diff = uniqueDays[i - 1] - uniqueDays[i];
    if (Math.abs(diff - DAY_MS) < 1000) { // within 1 second tolerance
      currentStreak++;
    } else {
      break; // gap found — streak ends here
    }
  }

  await upsertStreak(habitId, memberId, currentStreak);
}

/**
 * Upserts the streak record. If currentLength exceeds longestLength,
 * longestLength is also updated.
 */
async function upsertStreak(
  habitId: string,
  memberId: string,
  currentLength: number
) {
  const existing = await db.dailyWalkStreak.findUnique({
    where: { habitId_memberId: { habitId, memberId } },
  });

  const longestLength = Math.max(
    existing?.longestLength ?? 0,
    currentLength
  );

  await db.dailyWalkStreak.upsert({
    where: { habitId_memberId: { habitId, memberId } },
    create: {
      habitId,
      memberId,
      currentLength,
      longestLength,
      lastCheckInAt: currentLength > 0 ? new Date() : null,
    },
    update: {
      currentLength,
      longestLength,
      lastCheckInAt: currentLength > 0 ? new Date() : null,
    },
  });
}

// ============================================================================
// Stats & Summary Queries
// ============================================================================

/**
 * Gets the full DailyWalk status for a member's dashboard.
 * This is the primary query for the DailyWalk overview page.
 *
 * Returns:
 *   - habits with today's check-in status
 *   - streak data per habit
 *   - overall completion rate for today
 *   - overall stats (total check-ins, best streak, active habits)
 */
export async function getDailyWalkSummary(memberId: string) {
  const todayStart = getTodayInMemberTZ();
  const tomorrowStart = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

  // Get all active habits
  const habits = await db.dailyWalkHabit.findMany({
    where: { memberId, isActive: true, isArchived: false },
    orderBy: { sortOrder: "asc" },
  });

  // Get today's check-ins for this member
  const todayCheckIns = await db.dailyWalkCheckIn.findMany({
    where: {
      memberId,
      checkedInAt: {
        gte: todayStart,
        lt: tomorrowStart,
      },
    },
    select: { habitId: true, mood: true, note: true, checkedInAt: true },
  });

  // Build a map of habitId → today's check-in
  const checkInMap = new Map(
    todayCheckIns.map((c) => [c.habitId, c])
  );

  // Get streaks for all habits
  const streaks = await db.dailyWalkStreak.findMany({
    where: {
      habitId: { in: habits.map((h) => h.id) },
      memberId,
    },
  });

  const streakMap = new Map(
    streaks.map((s) => [s.habitId, s])
  );

  // Build enriched habit list with today's status
  const today = new Date();
  const enrichedHabits = habits.map((habit) => {
    const todayCheckIn = checkInMap.get(habit.id);
    const streak = streakMap.get(habit.id);
    const isDue = isHabitDueOn(
      habit.frequency as HabitFrequency,
      habit.customDays,
      today
    );

    return {
      ...habit,
      isDue,
      isCheckedInToday: !!todayCheckIn,
      todayMood: todayCheckIn?.mood ?? null,
      todayNote: todayCheckIn?.note ?? null,
      currentStreak: streak?.currentLength ?? 0,
      longestStreak: streak?.longestLength ?? 0,
    };
  });

  // Calculate overall stats
  const dueToday = enrichedHabits.filter((h) => h.isDue);
  const checkedToday = dueToday.filter((h) => h.isCheckedInToday);
  const completionRate =
    dueToday.length > 0
      ? Math.round((checkedToday.length / dueToday.length) * 100)
      : 100; // no habits due = 100% complete

  // Total check-ins all time
  const totalCheckIns = await db.dailyWalkCheckIn.count({
    where: { memberId },
  });

  // Best streak across all habits
  const bestStreak = streaks.length > 0
    ? Math.max(...streaks.map((s) => s.longestLength))
    : 0;

  return {
    habits: enrichedHabits,
    stats: {
      totalActiveHabits: habits.length,
      dueTodayCount: dueToday.length,
      checkedTodayCount: checkedToday.length,
      completionRate,
      totalCheckInsAllTime: totalCheckIns,
      bestStreakAcrossAllHabits: bestStreak,
    },
    date: todayStart,
  };
}

/**
 * Gets check-in history for a specific habit.
 * Used for the habit detail view and calendar/heatmap.
 *
 * @param options.from - Start date (inclusive)
 * @param options.to - End date (inclusive)
 * @param options.limit - Max records (for pagination, R10)
 * @param options.offset - Offset for pagination
 */
export async function getCheckInHistory(
  habitId: string,
  memberId: string,
  options: {
    from?: Date;
    to?: Date;
    limit?: number;
    offset?: number;
  } = {}
) {
  const { from, to, limit = 30, offset = 0 } = options;

  const where: Prisma.DailyWalkCheckInWhereInput = {
    habitId,
    memberId,
  };

  if (from || to) {
    where.checkedInAt = {};
    if (from) (where.checkedInAt as Prisma.DateTimeNullableFilter).gte = from;
    if (to) {
      const toDate = new Date(to.getTime() + 24 * 60 * 60 * 1000); // include end date
      ;(where.checkedInAt as Prisma.DateTimeNullableFilter).lt = toDate;
    }
  }

  const [items, total] = await Promise.all([
    db.dailyWalkCheckIn.findMany({
      where,
      orderBy: { checkedInAt: "desc" },
      take: limit,
      skip: offset,
    }),
    db.dailyWalkCheckIn.count({ where }),
  ]);

  return { items, total, limit, offset };
}

/**
 * Gets a weekly summary for a member.
 * Returns day-by-day check-in counts for the past 7 days.
 */
export async function getWeeklySummary(memberId: string) {
  const todayStart = getTodayInMemberTZ();
  const sevenDaysAgo = new Date(
    todayStart.getTime() - 6 * 24 * 60 * 60 * 1000
  );

  const checkIns = await db.dailyWalkCheckIn.findMany({
    where: {
      memberId,
      checkedInAt: {
        gte: sevenDaysAgo,
        lt: new Date(todayStart.getTime() + 24 * 60 * 60 * 1000),
      },
    },
    select: { checkedInAt: true, habitId: true },
    orderBy: { checkedInAt: "asc" },
  });

  // Group by day
  const dayMap = new Map<string, number>(); // "YYYY-MM-DD" → count
  for (let i = 0; i < 7; i++) {
    const day = new Date(sevenDaysAgo.getTime() + i * 24 * 60 * 60 * 1000);
    const key = day.toLocaleDateString("en-CA", { timeZone: MEMBER_TIMEZONE });
    dayMap.set(key, 0);
  }

  for (const ci of checkIns) {
    const key = ci.checkedInAt.toLocaleDateString("en-CA", {
      timeZone: MEMBER_TIMEZONE,
    });
    dayMap.set(key, (dayMap.get(key) ?? 0) + 1);
  }

  // Convert to array format
  const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const daily = Array.from(dayMap.entries()).map(([dateStr, count]) => {
    const date = new Date(`${dateStr}T00:00:00+01:00`);
    return {
      date: dateStr,
      dayLabel: DAY_LABELS[date.getDay()],
      count,
    };
  });

  const totalWeekCheckIns = checkIns.length;
  const uniqueDaysChecked = new Set(
    checkIns.map((ci) =>
      ci.checkedInAt.toLocaleDateString("en-CA", {
        timeZone: MEMBER_TIMEZONE,
      })
    )
  ).size;

  return {
    daily,
    totalCheckIns: totalWeekCheckIns,
    uniqueDaysChecked,
    weekStartDate: sevenDaysAgo.toLocaleDateString("en-CA", {
      timeZone: MEMBER_TIMEZONE,
    }),
  };
}

/**
 * Gets all streaks for a member, sorted by current streak length descending.
 * Used for a "streaks leaderboard" or overview.
 */
export async function getAllStreaks(memberId: string) {
  return db.dailyWalkStreak.findMany({
    where: { memberId },
    include: {
      habit: {
        select: { id: true, name: true, icon: true, color: true, category: true },
      },
    },
    orderBy: { currentLength: "desc" },
  });
}

/**
 * Gets the count of active habits that have reminders enabled.
 * Used to determine if we need to register push subscriptions.
 */
export async function getHabitsWithReminders(memberId: string) {
  return db.dailyWalkHabit.findMany({
    where: {
      memberId,
      isActive: true,
      isArchived: false,
      reminderEnabled: true,
      reminderTime: { not: null },
    },
    select: {
      id: true,
      name: true,
      reminderTime: true,
      icon: true,
    },
  });
}
