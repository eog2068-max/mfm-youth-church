"use client";

/**
 * GafProfile — member profile page.
 *
 * Shows: avatar + name + join info, full GAF stats (referrals, outreach,
 * awards, notifications), profile editor (name, phone, WhatsApp), e-invite
 * card preview, and consolidated activity timeline.
 *
 * Uses Tabs for the different sections.
 *
 * Stage 11 of Go-A-Fishing.
 */
import { useState, useCallback } from "react";
import Link from "next/link";
import {
  User,
  Phone,
  MessageCircle,
  Award,
  Fish,
  MapPin,
  Trophy,
  Bell,
  Edit3,
  Save,
  Camera,
  Heart,
  Users,
  Sparkles,
  CheckCircle,
  Star,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { computeMemberScore, type ReferralStatus } from "@/lib/gaf/scoring";
import { EnhancedShareDialog } from "./enhanced-share-dialog";
import { EInviteCard } from "./e-invite-card";
import type { Prisma } from "@prisma/client";

type MemberWithRelations = Prisma.MemberGetPayload<{
  include: {
    referralsMade: true;
    rewardWinners: { include: { cycle: { include: { category: true } } } };
    commendations: { where: { visibility: { in: ["public", "members_only"] } } };
    outreachActivities: true;
    notifications: { take: 5, orderBy: { createdAt: "desc" } };
  };
}>;

interface GafProfileProps {
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

type TimelineEvent = {
  id: string;
  type: "referral" | "outreach" | "commendation" | "award" | "notification";
  title: string;
  description: string;
  date: Date;
  color: string;
  icon: React.ElementType;
};

function buildTimeline(member: MemberWithRelations): TimelineEvent[] {
  const events: TimelineEvent[] = [];

  // Referrals (last 20).
  for (const ref of member.referralsMade.slice(0, 20)) {
    events.push({
      id: ref.id,
      type: "referral",
      title: `Referral: ${ref.inviteeName}`,
      description: `Status: ${STATUS_LABELS[ref.status as ReferralStatus] || ref.status}`,
      date: new Date(ref.updatedAt),
      color: STATUS_COLORS[ref.status as ReferralStatus] || "bg-gray-100 text-gray-600",
      icon: Fish,
    });
  }

  // Outreach (last 10).
  for (const oa of member.outreachActivities.slice(0, 10)) {
    events.push({
      id: oa.id,
      type: "outreach",
      title: oa.title,
      description: `${oa.type.replace(/_/g, " ")} · ${oa.contacts} contacts · ${oa.decisions} decisions`,
      date: new Date(oa.activityDate),
      color: oa.status === "confirmed" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700",
      icon: oa.status === "confirmed" ? CheckCircle : AlertTriangle,
    });
  }

  // Commendations.
  for (const c of member.commendations) {
    events.push({
      id: c.id,
      type: "commendation",
      title: c.title,
      description: `From ${c.givenBy}${c.scriptureReference ? ` · ${c.scriptureReference}` : ""}`,
      date: new Date(c.awardedAt),
      color: "bg-amber-100 text-amber-700",
      icon: Star,
    });
  }

  // Awards.
  for (const w of member.rewardWinners) {
    events.push({
      id: w.id,
      type: "award",
      title: `${w.cycle.category.name} — Rank #${w.rank}`,
      description: w.cycle.name,
      date: new Date(w.awardedAt),
      color: "bg-yellow-100 text-yellow-800",
      icon: Trophy,
    });
  }

  // Sort by date descending.
  events.sort((a, b) => b.date.getTime() - a.date.getTime());

  return events;
}

function timeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
}

export function GafProfile({ member, baseUrl }: GafProfileProps) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveResult, setSaveResult] = useState<string | null>(null);

  // Editable fields.
  const [fullName, setFullName] = useState(member.fullName);
  const [phone, setPhone] = useState(member.phone || "");
  const [whatsapp, setWhatsapp] = useState(member.whatsapp || "");

  const { total, counts } = computeMemberScore(member.referralsMade);
  const timeline = buildTimeline(member);

  const outreachStats = member.outreachActivities.reduce(
    (acc, oa) => ({
      total: acc.total + 1,
      contacts: acc.contacts + oa.contacts,
      decisions: acc.decisions + oa.decisions,
    }),
    { total: 0, contacts: 0, decisions: 0 }
  );

  const handleSave = useCallback(async () => {
    setSaving(true);
    setSaveResult(null);
    try {
      const res = await fetch("/api/gaf/members/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          phone: phone.trim() || null,
          whatsapp: whatsapp.trim() || null,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update profile");
      }
      setSaveResult("Profile updated successfully!");
      setEditing(false);
      // Refresh page data.
      window.location.reload();
    } catch (err) {
      setSaveResult(err instanceof Error ? err.message : "Failed to update");
    } finally {
      setSaving(false);
    }
  }, [fullName, phone, whatsapp]);

  const initials = member.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <section className="py-12 md:py-16 bg-[#F3E5F5] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Profile Header Card */}
        <Card className="border-0 shadow-md overflow-hidden">
          <div className="bg-gradient-to-br from-[#4A148C] to-[#1A0033] px-6 py-8 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              {/* Avatar */}
              <div className="flex items-center justify-center size-20 rounded-2xl bg-white/15 text-3xl font-bold shrink-0">
                {member.avatarUrl ? (
                  <img
                    src={member.avatarUrl}
                    alt={member.fullName}
                    className="size-20 rounded-2xl object-cover"
                  />
                ) : (
                  initials
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold">{member.fullName}</h2>
                <p className="text-purple-200 text-sm mt-0.5">
                  Member since{" "}
                  {new Date(member.joinDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <div className="flex flex-wrap items-center gap-3 mt-3">
                  <Badge
                    variant="secondary"
                    className="bg-white/15 text-white text-xs rounded-full"
                  >
                    <Fish className="size-3 mr-1" />
                    Code: {member.referralCode}
                  </Badge>
                  {member.assembly && (
                    <Badge
                      variant="secondary"
                      className="bg-white/15 text-white text-xs rounded-full"
                    >
                      <MapPin className="size-3 mr-1" />
                      {member.assembly}
                    </Badge>
                  )}
                  {member.phone && (
                    <Badge
                      variant="secondary"
                      className="bg-white/15 text-white text-xs rounded-full"
                    >
                      <Phone className="size-3 mr-1" />
                      {member.phone}
                    </Badge>
                  )}
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditing(!editing)}
                className="border-white/20 text-white hover:bg-white/10 rounded-xl gap-2"
              >
                {editing ? (
                  <span>Cancel</span>
                ) : (
                  <>
                    <Edit3 className="size-4" />
                    Edit Profile
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-5 divide-x divide-y sm:divide-y-0">
            {[
              { label: "Total Score", value: total, icon: Trophy, color: "text-amber-600" },
              { label: "Referrals", value: member.referralsMade.length, icon: Users, color: "text-purple-600" },
              { label: "Outreach", value: outreachStats.total, icon: MapPin, color: "text-emerald-600" },
              { label: "Awards", value: member.rewardWinners.length, icon: Award, color: "text-yellow-600" },
              { label: "Commendations", value: member.commendations.length, icon: Star, color: "text-rose-600" },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="p-4 text-center">
                  <Icon className={`size-5 mx-auto mb-1 ${stat.color}`} />
                  <p className="text-xl font-bold text-[#4A148C]">{stat.value}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wide">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Edit Form (shown inline when editing) */}
        {editing && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-0 shadow-md p-6">
              <h3 className="text-lg font-semibold text-[#4A148C] mb-4 flex items-center gap-2">
                <Edit3 className="size-5" />
                Edit Profile
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="mb-1.5 block">Full Name</Label>
                  <Input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    maxLength={120}
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <Label className="mb-1.5 block">Phone Number</Label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+234..."
                    maxLength={18}
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <Label className="mb-1.5 block">WhatsApp Number</Label>
                  <Input
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="+234..."
                    maxLength={18}
                    className="rounded-xl"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between mt-4">
                {saveResult && (
                  <p
                    className={`text-sm ${
                      saveResult.includes("success")
                        ? "text-emerald-600"
                        : "text-red-600"
                    }`}
                  >
                    {saveResult}
                  </p>
                )}
                <div className="ml-auto flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setEditing(false)}
                    className="rounded-xl"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="gap-2 bg-[#4A148C] hover:bg-[#1A0033] text-white rounded-xl"
                  >
                    {saving ? (
                      <div className="animate-spin size-4 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <Save className="size-4" />
                    )}
                    Save Changes
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Tabbed content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white rounded-xl shadow-sm p-1 h-auto flex-wrap">
            <TabsTrigger
              value="overview"
              className="rounded-lg data-[state=active]:bg-[#4A148C] data-[state=active]:text-white"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="sharing"
              className="rounded-lg data-[state=active]:bg-[#4A148C] data-[state=active]:text-white"
            >
              Share & Invite
            </TabsTrigger>
            <TabsTrigger
              value="timeline"
              className="rounded-lg data-[state=active]:bg-[#4A148C] data-[state=active]:text-white"
            >
              Activity
            </TabsTrigger>
          </TabsList>

          {/* ─── Overview Tab ─── */}
          <TabsContent value="overview" className="space-y-6">
            {/* Referral Score Breakdown */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg text-[#4A148C] flex items-center gap-2">
                  <Trophy className="size-5 text-amber-600" />
                  Gospel-Labor Score Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.entries(counts).map(([status, count]) => {
                    const weight = { invited: 1, attended: 5, saved: 10, baptized: 25, member: 50, lost_contact: 0 }[status] || 0;
                    return (
                      <div
                        key={status}
                        className="bg-[#F3E5F5] rounded-xl p-3 border border-[#4A148C]/10"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500 capitalize">
                            {STATUS_LABELS[status as ReferralStatus] || status}
                          </span>
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${STATUS_COLORS[status as ReferralStatus] || ""}`}>
                            ×{weight}
                          </span>
                        </div>
                        <p className="text-xl font-bold text-[#4A148C] mt-1">
                          {count}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          {count * weight} pts
                        </p>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 p-3 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-200/50">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#4A148C]">
                      Total Score
                    </span>
                    <span className="text-2xl font-bold text-amber-700">
                      {total}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Outreach Stats */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg text-[#4A148C] flex items-center gap-2">
                  <MapPin className="size-5 text-emerald-600" />
                  Outreach Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-emerald-50 rounded-xl p-4 text-center border border-emerald-200/50">
                    <p className="text-2xl font-bold text-emerald-700">
                      {outreachStats.total}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Activities</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4 text-center border border-purple-200/50">
                    <p className="text-2xl font-bold text-purple-700">
                      {outreachStats.contacts}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Contacts</p>
                  </div>
                  <div className="bg-amber-50 rounded-xl p-4 text-center border border-amber-200/50">
                    <p className="text-2xl font-bold text-amber-700">
                      {outreachStats.decisions}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Decisions</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Awards Summary */}
            {member.rewardWinners.length > 0 && (
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg text-[#4A148C] flex items-center gap-2">
                    <Award className="size-5 text-yellow-600" />
                    Awards & Recognition
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {member.rewardWinners.map((w) => (
                      <div
                        key={w.id}
                        className="flex items-center justify-between bg-yellow-50/50 rounded-xl p-3 border border-yellow-200/30"
                      >
                        <div>
                          <p className="font-semibold text-[#4A148C] text-sm">
                            {w.cycle.category.name}
                          </p>
                          <p className="text-xs text-gray-500">{w.cycle.name}</p>
                        </div>
                        <Badge
                          className={
                            w.rank === 1
                              ? "bg-yellow-400 text-yellow-900"
                              : w.rank === 2
                              ? "bg-gray-300 text-gray-700"
                              : "bg-amber-600 text-white"
                          }
                        >
                          #{w.rank} · {w.score} pts
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick links */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Button asChild variant="outline" className="h-auto py-5 flex-col gap-2 rounded-xl border-[#4A148C]/20 hover:bg-[#4A148C]/5">
                <Link href="/go-a-fishing/my-referrals">
                  <Fish className="size-5 text-purple-600" />
                  <span className="text-xs text-[#4A148C]">My Referrals</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto py-5 flex-col gap-2 rounded-xl border-[#4A148C]/20 hover:bg-[#4A148C]/5">
                <Link href="/go-a-fishing/my-outreach">
                  <MapPin className="size-5 text-emerald-600" />
                  <span className="text-xs text-[#4A148C]">My Outreach</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto py-5 flex-col gap-2 rounded-xl border-[#4A148C]/20 hover:bg-[#4A148C]/5">
                <Link href="/go-a-fishing/awards">
                  <Award className="size-5 text-amber-600" />
                  <span className="text-xs text-[#4A148C]">Awards</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto py-5 flex-col gap-2 rounded-xl border-[#4A148C]/20 hover:bg-[#4A148C]/5">
                <Link href="/go-a-fishing/notifications">
                  <Bell className="size-5 text-purple-600" />
                  <span className="text-xs text-[#4A148C]">Notifications</span>
                </Link>
              </Button>
            </div>
          </TabsContent>

          {/* ─── Share & Invite Tab ─── */}
          <TabsContent value="sharing" className="space-y-6">
            {/* Enhanced Share Dialog trigger */}
            <Card className="border-0 shadow-md p-6">
              <h3 className="text-lg font-semibold text-[#4A148C] mb-2 flex items-center gap-2">
                <Sparkles className="size-5 text-amber-600" />
                Share Your Referral Link
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Choose a channel to share your personal referral link with
                someone you&apos;re fishing for Christ. Each channel has a
                pre-formatted message you can customize.
              </p>
              <div className="flex justify-center">
                <EnhancedShareDialog
                  referralCode={member.referralCode}
                  baseUrl={baseUrl}
                  memberName={member.fullName}
                />
              </div>
            </Card>

            <Separator />

            {/* E-Invite Card */}
            <Card className="border-0 shadow-md p-6">
              <h3 className="text-lg font-semibold text-[#4A148C] mb-2 flex items-center gap-2">
                <Heart className="size-5 text-[#D32F2F]" />
                E-Invitation Card
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Generate a beautiful e-invite card. Share it as an image or send
                directly to your contacts. The card includes your referral QR
                code and service times.
              </p>
              <EInviteCard
                memberName={member.fullName}
                referralCode={member.referralCode}
                baseUrl={baseUrl}
              />
            </Card>
          </TabsContent>

          {/* ─── Activity Timeline Tab ─── */}
          <TabsContent value="timeline" className="space-y-6">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg text-[#4A148C] flex items-center gap-2">
                  <Clock className="size-5 text-purple-600" />
                  Your Activity Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                {timeline.length === 0 ? (
                  <div className="text-center py-12">
                    <Clock className="size-12 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-500">No activity recorded yet.</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Start by adding referrals or logging outreach activities.
                    </p>
                  </div>
                ) : (
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200" />

                    <div className="space-y-4">
                      {timeline.map((event, idx) => {
                        const Icon = event.icon;
                        return (
                          <motion.div
                            key={event.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="relative pl-12"
                          >
                            {/* Timeline dot */}
                            <div
                              className={`absolute left-3 top-1 w-5 h-5 rounded-full border-2 border-white shadow-sm flex items-center justify-center ${event.color}`}
                            >
                              <Icon className="size-3" />
                            </div>

                            <div className="bg-gray-50 rounded-xl p-4 hover:shadow-sm transition-shadow">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <p className="font-semibold text-[#4A148C] text-sm">
                                    {event.title}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-0.5">
                                    {event.description}
                                  </p>
                                </div>
                                <span className="text-[10px] text-gray-400 whitespace-nowrap shrink-0">
                                  {timeAgo(event.date)}
                                </span>
                              </div>
                              <div className="mt-1.5">
                                <Badge
                                  variant="secondary"
                                  className="text-[10px] rounded-full"
                                >
                                  {event.type}
                                </Badge>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Scripture footer */}
        <div className="text-center py-8">
          <Heart className="size-8 mx-auto text-[#D32F2F] mb-3" />
          <p className="text-sm text-gray-600 italic max-w-md mx-auto leading-relaxed">
            &ldquo;But the fruit of the Spirit is love, joy, peace, forbearance,
            kindness, goodness, faithfulness, gentleness and self-control.&rdquo;
            <br />
            <span className="text-[#D32F2F] font-medium">
              — Galatians 5:22-23
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
