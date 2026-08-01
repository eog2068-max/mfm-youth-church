"use client";

/**
 * GafDashboard — main member dashboard.
 *
 * Shows: greeting + sign-out, referral card (link/QR/share), quick stats,
 * recent referrals preview, recent commendations.
 *
 * Stage 4 of Go-A-Fishing.
 */
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import {
  Fish,
  Trophy,
  Heart,
  Users,
  LogOut,
  ArrowRight,
  Sparkles,
  Award,
  MapPin,
  Bell,
  User,
} from "lucide-react";
import { NotificationBell } from "./notification-bell";
import { GafOnboardingGuide } from "./gaf-onboarding-guide";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionWrapper } from "@/components/home/section-wrapper";
import { ReferralCard } from "./referral-card";
import {
  computeMemberScore,
  type ReferralStatus,
} from "@/lib/gaf/scoring";
import type { Prisma } from "@prisma/client";

type MemberWithRelations = Prisma.MemberGetPayload<{
  include: {
    referralsMade: true;
    rewardWinners: { include: { cycle: { include: { category: true } } } };
    commendations: true;
  };
}>;

interface GafDashboardProps {
  member: MemberWithRelations;
  baseUrl: string;
}

const STATUS_LABELS: Record<ReferralStatus, string> = {
  invited: "Invited",
  attended: "Attended",
  saved: "Saved",
  baptized: "Baptized",
  member: "Joined as Member",
  lost_contact: "Lost Contact",
};

const STATUS_COLORS: Record<ReferralStatus, string> = {
  invited: "bg-purple-100 text-purple-700",
  attended: "bg-amber-100 text-amber-700",
  saved: "bg-emerald-100 text-emerald-700",
  baptized: "bg-purple-100 text-purple-700",
  member: "bg-[#4A148C] text-white",
  lost_contact: "bg-gray-100 text-gray-600",
};

export function GafDashboard({ member, baseUrl }: GafDashboardProps) {
  const router = useRouter();
  const [isSigningOut, startSignOut] = useTransition();

  const { total, counts } = computeMemberScore(member.referralsMade);

  const handleSignOut = async () => {
    startSignOut(async () => {
      await fetch("/api/gaf/auth/signout", { method: "POST" });
      router.push("/go-a-fishing");
      router.refresh();
    });
  };

  const stats = [
    {
      label: "Total Referrals",
      value: member.referralsMade.length,
      icon: Users,
      color: "from-purple-500 to-purple-700",
    },
    {
      label: "Gospel-Labor Points",
      value: total,
      icon: Trophy,
      color: "from-amber-500 to-amber-700",
    },
    {
      label: "Souls Attended",
      value: counts.attended,
      icon: Fish,
      color: "from-rose-500 to-rose-700",
    },
    {
      label: "Joined as Members",
      value: counts.member,
      icon: Sparkles,
      color: "from-emerald-500 to-emerald-700",
    },
  ];

  const recentReferrals = member.referralsMade.slice(0, 5);

  return (
    <section className="py-12 md:py-16 bg-[#F3E5F5] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header row */}
        <SectionWrapper className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#4A148C]">
              Hello, {member.fullName.split(" ")[0]}! 👋
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Member since{" "}
              {new Date(member.joinDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <NotificationBell />
            <Button
              variant="outline"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="gap-2 rounded-xl"
            >
              <LogOut className="size-4" />
              {isSigningOut ? "Signing out..." : "Sign out"}
            </Button>
          </div>
        </SectionWrapper>

        {/* Stats grid */}
        <SectionWrapper>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label} className="border-0 shadow-md">
                  <CardContent className="p-5">
                    <div
                      className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} text-white mb-3`}
                    >
                      <Icon className="size-5" />
                    </div>
                    <div className="text-2xl md:text-3xl font-bold text-[#4A148C]">
                      {stat.value}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </SectionWrapper>

        {/* Onboarding guide (shown to new members with no referrals) */}
        <GafOnboardingGuide
          memberName={member.fullName}
          referralCode={member.referralCode}
          hasReferrals={member.referralsMade.length > 0}
        />

        {/* Referral card */}
        <SectionWrapper>
          <ReferralCard
            referralCode={member.referralCode}
            baseUrl={baseUrl}
            memberName={member.fullName}
          />
        </SectionWrapper>

        {/* Recent referrals */}
        <SectionWrapper>
          <Card className="border-0 shadow-md">
            <CardHeader className="border-b border-gray-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-[#4A148C]">
                  Recent Referrals
                </CardTitle>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="text-[#4A148C] hover:bg-[#4A148C]/5"
                >
                  <Link href="/go-a-fishing/my-referrals">
                    View all
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {recentReferrals.length === 0 ? (
                <div className="text-center py-12 px-6">
                  <Fish className="size-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 mb-4">
                    You haven&apos;t logged any referrals yet.
                  </p>
                  <Button
                    asChild
                    className="bg-[#4A148C] hover:bg-[#1A0033] text-white rounded-xl"
                  >
                    <Link href="/go-a-fishing/my-referrals">
                      <Fish className="size-4" />
                      Add your first referral
                    </Link>
                  </Button>
                </div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {recentReferrals.map((ref) => (
                    <li
                      key={ref.id}
                      className="flex items-center justify-between p-4 hover:bg-gray-50"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-[#4A148C] truncate">
                          {ref.inviteeName}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {new Date(ref.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                          {ref.inviteePhone && ` · ${ref.inviteePhone}`}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          STATUS_COLORS[ref.status as ReferralStatus] || "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {STATUS_LABELS[ref.status as ReferralStatus] || ref.status}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </SectionWrapper>

        {/* Commendations preview (if any) */}
        {member.commendations.length > 0 && (
          <SectionWrapper>
            <Card className="border-0 shadow-md bg-gradient-to-br from-amber-50 to-yellow-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-[#4A148C]">
                  <Award className="size-5 text-amber-600" />
                  Pastoral Commendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {member.commendations.slice(0, 3).map((c) => (
                  <div
                    key={c.id}
                    className="bg-white/60 rounded-xl p-4 border border-amber-200/50"
                  >
                    <p className="font-semibold text-[#4A148C]">{c.title}</p>
                    <p className="text-sm text-gray-700 mt-1 leading-relaxed">
                      {c.message}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-xs text-gray-500">— {c.givenBy}</p>
                      {c.scriptureReference && (
                        <p className="text-xs font-medium text-[#D32F2F]">
                          {c.scriptureReference}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </SectionWrapper>
        )}

        {/* Quick links */}
        <SectionWrapper>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <Button
              asChild
              variant="outline"
              className="h-auto py-6 flex-col gap-2 rounded-xl border-[#4A148C]/20 hover:bg-[#4A148C]/5"
            >
              <Link href="/go-a-fishing/my-referrals">
                <Users className="size-6 text-[#4A148C]" />
                <span className="text-[#4A148C]">My Referrals</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-auto py-6 flex-col gap-2 rounded-xl border-[#4A148C]/20 hover:bg-[#4A148C]/5"
            >
              <Link href="/go-a-fishing/my-outreach">
                <MapPin className="size-6 text-purple-600" />
                <span className="text-[#4A148C]">My Outreach</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-auto py-6 flex-col gap-2 rounded-xl border-[#4A148C]/20 hover:bg-[#4A148C]/5"
            >
              <Link href="/go-a-fishing/leaderboard">
                <Trophy className="size-6 text-amber-600" />
                <span className="text-[#4A148C]">Leaderboard</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-auto py-6 flex-col gap-2 rounded-xl border-[#4A148C]/20 hover:bg-[#4A148C]/5"
            >
              <Link href="/go-a-fishing/awards">
                <Award className="size-6 text-rose-600" />
                <span className="text-[#4A148C]">Awards</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-auto py-6 flex-col gap-2 rounded-xl border-[#4A148C]/20 hover:bg-[#4A148C]/5"
            >
              <Link href="/go-a-fishing/notifications">
                <Bell className="size-6 text-purple-600" />
                <span className="text-[#4A148C]">Notifications</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-auto py-6 flex-col gap-2 rounded-xl border-[#4A148C]/20 hover:bg-[#4A148C]/5"
            >
              <Link href="/go-a-fishing/profile">
                <User className="size-6 text-gray-600" />
                <span className="text-[#4A148C]">Profile</span>
              </Link>
            </Button>
          </div>
        </SectionWrapper>

        {/* Scripture footer */}
        <SectionWrapper className="text-center py-8">
          <Heart className="size-8 mx-auto text-[#D32F2F] mb-3" />
          <p className="text-sm text-gray-600 italic max-w-md mx-auto leading-relaxed">
            &ldquo;Let us not become weary in doing good, for at the proper time
            we will reap a harvest if we do not give up.&rdquo;
            <br />
            <span className="text-[#D32F2F] font-medium">— Galatians 6:9</span>
          </p>
        </SectionWrapper>
      </div>
    </section>
  );
}
