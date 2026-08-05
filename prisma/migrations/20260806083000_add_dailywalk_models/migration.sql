-- CreateTable: DailyWalkHabit
CREATE TABLE "DailyWalkHabit" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL DEFAULT 'general',
    "icon" TEXT NOT NULL DEFAULT 'heart',
    "color" TEXT NOT NULL DEFAULT '#4A148C',
    "frequency" TEXT NOT NULL DEFAULT 'daily',
    "customDays" TEXT,
    "reminderTime" TEXT,
    "reminderEnabled" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyWalkHabit_pkey" PRIMARY KEY ("id")
);

-- CreateTable: DailyWalkCheckIn
CREATE TABLE "DailyWalkCheckIn" (
    "id" TEXT NOT NULL,
    "habitId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "checkedInAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,
    "mood" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyWalkCheckIn_pkey" PRIMARY KEY ("id")
);

-- CreateTable: DailyWalkStreak
CREATE TABLE "DailyWalkStreak" (
    "id" TEXT NOT NULL,
    "habitId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "currentLength" INTEGER NOT NULL DEFAULT 0,
    "longestLength" INTEGER NOT NULL DEFAULT 0,
    "lastCheckInAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyWalkStreak_pkey" PRIMARY KEY ("id")
);

-- CreateTable: PushSubscription
CREATE TABLE "PushSubscription" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "p256dh" TEXT NOT NULL,
    "auth" TEXT NOT NULL,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PushSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DailyWalkHabit_memberId_isActive_idx" ON "DailyWalkHabit"("memberId", "isActive");

-- CreateIndex
CREATE INDEX "DailyWalkHabit_memberId_sortOrder_idx" ON "DailyWalkHabit"("memberId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "DailyWalkCheckIn_habitId_memberId_checkedInAt_key" ON "DailyWalkCheckIn"("habitId", "memberId", "checkedInAt");

-- CreateIndex
CREATE INDEX "DailyWalkCheckIn_memberId_checkedInAt_idx" ON "DailyWalkCheckIn"("memberId", "checkedInAt");

-- CreateIndex
CREATE INDEX "DailyWalkCheckIn_habitId_checkedInAt_idx" ON "DailyWalkCheckIn"("habitId", "checkedInAt");

-- CreateIndex
CREATE UNIQUE INDEX "DailyWalkStreak_habitId_memberId_key" ON "DailyWalkStreak"("habitId", "memberId");

-- CreateIndex
CREATE INDEX "DailyWalkStreak_memberId_currentLength_idx" ON "DailyWalkStreak"("memberId", "currentLength" DESC);

-- CreateIndex
CREATE INDEX "DailyWalkStreak_memberId_longestLength_idx" ON "DailyWalkStreak"("memberId", "longestLength" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "PushSubscription_memberId_key" ON "PushSubscription"("memberId");

-- AddForeignKey
ALTER TABLE "DailyWalkHabit" ADD CONSTRAINT "DailyWalkHabit_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyWalkCheckIn" ADD CONSTRAINT "DailyWalkCheckIn_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "DailyWalkHabit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyWalkCheckIn" ADD CONSTRAINT "DailyWalkCheckIn_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyWalkStreak" ADD CONSTRAINT "DailyWalkStreak_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "DailyWalkHabit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyWalkStreak" ADD CONSTRAINT "DailyWalkStreak_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PushSubscription" ADD CONSTRAINT "PushSubscription_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;