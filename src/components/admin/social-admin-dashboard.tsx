"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users, MessageCircle, Heart, Flame, Radio, CalendarCheck,
  ShieldCheck, Eye, EyeOff, CheckSquare, ArrowLeft,
  Activity, TrendingUp, Clock, AlertTriangle,
} from "lucide-react";

interface OverviewStats {
  presenceCount: number;
  currentQuestion: { question: string; totalResponses: number } | null;
  totalPublicPrayers: number;
  totalPrivatePrayers: number;
  pendingPrivatePrayers: number;
  totalAmenPosts: number;
  totalQuestionResponses: number;
  currentChallenge: { title: string; participationCount: number } | null;
  liveSession: { title: string; status: string; viewerCount: number };
  moderationQueueSize: number;
  totalAttendanceIntentions: number;
}

interface PrivatePrayer {
  id: string;
  request: string;
  fullName?: string;
  email?: string;
  phone?: string;
  category: string;
  isUrgent: boolean;
  status: string;
  createdAt: string;
}

export function SocialAdminDashboard() {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [privatePrayers, setPrivatePrayers] = useState<PrivatePrayer[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "prayers" | "moderation">("overview");
  const [loading, setLoading] = useState(true);

  const fetchWithAuth = async (url: string, options?: RequestInit) => {
    return fetch(url, {
      ...options,
      headers: {
        ...options?.headers,
        "Content-Type": "application/json",
      },
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetchWithAuth("/api/social/admin?section=overview");
        if (res.ok) setStats(await res.json());
      } catch (e) {
        console.error("Failed to fetch stats");
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleReviewPrayer = async (prayerId: string) => {
    try {
      const res = await fetchWithAuth("/api/social/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "review-prayer", targetId: prayerId }),
      });
      if (res.ok) {
        setPrivatePrayers((prev) =>
          prev.map((p) => (p.id === prayerId ? { ...p, status: "reviewed" } : p))
        );
      }
    } catch (e) {
      console.error("Failed to review prayer");
    }
  };

  const loadPrivatePrayers = async () => {
    try {
      const res = await fetchWithAuth("/api/social/admin?section=private-prayers");
      if (res.ok) {
        const data = await res.json();
        setPrivatePrayers(data.prayers || []);
      }
    } catch (e) {
      console.error("Failed to fetch private prayers");
    }
  };

  const tabs = [
    { id: "overview" as const, label: "Overview", icon: TrendingUp },
    { id: "prayers" as const, label: "Private Prayers", icon: ShieldCheck },
    { id: "moderation" as const, label: "Moderation", icon: Eye },
  ];

  const statCards = [
    { label: "Current Presence", value: stats?.presenceCount || 0, icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Public Prayers", value: stats?.totalPublicPrayers || 0, icon: Heart, color: "text-red-600", bg: "bg-red-50" },
    { label: "Private Prayers", value: stats?.totalPrivatePrayers || 0, icon: ShieldCheck, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Amen Wall Posts", value: stats?.totalAmenPosts || 0, icon: Flame, color: "text-red-600", bg: "bg-red-50" },
    { label: "Question Responses", value: stats?.totalQuestionResponses || 0, icon: MessageCircle, color: "text-green-600", bg: "bg-green-50" },
    { label: "Attendance Intents", value: stats?.totalAttendanceIntentions || 0, icon: CalendarCheck, color: "text-teal-600", bg: "bg-teal-50" },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#4A148C] to-[#6A1B9A] text-white px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="hover:bg-white/10 rounded-lg p-2 transition-colors">
                <ArrowLeft className="size-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  ❤️ YouthConnect Admin
                </h1>
                <p className="text-purple-200/70 text-sm mt-1">Manage social features, moderation, and community content</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {stats?.liveSession?.status === "live" && (
                <span className="inline-flex items-center gap-1.5 bg-red-500 px-3 py-1 rounded-full text-sm font-semibold">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  LIVE
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full text-sm">
                <Activity className="size-3.5" />
                {stats?.presenceCount || 0} online
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id === "prayers") loadPrivatePrayers();
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-white text-[#4A148C] shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <tab.icon className="size-4" />
              {tab.label}
              {tab.id === "prayers" && stats?.pendingPrivatePrayers ? (
                <span className="bg-red-100 text-red-600 px-1.5 py-0.5 rounded-md text-xs font-bold">
                  {stats.pendingPrivatePrayers}
                </span>
              ) : null}
              {tab.id === "moderation" && stats?.moderationQueueSize ? (
                <span className="bg-yellow-100 text-yellow-600 px-1.5 py-0.5 rounded-md text-xs font-bold">
                  {stats.moderationQueueSize}
                </span>
              ) : null}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              {statCards.map((card, i) => (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-xl border border-gray-100 p-4"
                >
                  <div className={`w-10 h-10 rounded-lg ${card.bg} flex items-center justify-center mb-3`}>
                    <card.icon className={`size-5 ${card.color}`} />
                  </div>
                  <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{card.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Live Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Live Together Status */}
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
                  <Radio className="size-5 text-red-500" />
                  Live Together
                </h3>
                {stats?.liveSession ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${stats.liveSession.status === "live" ? "bg-red-500 animate-pulse" : "bg-gray-300"}`} />
                      <span className="font-medium capitalize">{stats.liveSession.status}</span>
                    </div>
                    <p className="text-gray-600">{stats.liveSession.title}</p>
                    {stats.liveSession.status === "live" && (
                      <p className="text-sm text-gray-500">
                        {stats.liveSession.viewerCount} people watching
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">No session data available</p>
                )}
              </div>

              {/* Current Challenge */}
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
                  <Flame className="size-5 text-purple-500" />
                  Weekly Challenge
                </h3>
                {stats?.currentChallenge ? (
                  <div className="space-y-2">
                    <p className="font-medium text-gray-800">{stats.currentChallenge.title}</p>
                    <p className="text-sm text-gray-500">
                      {stats.currentChallenge.participationCount} participants
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">No active challenge</p>
                )}
              </div>

              {/* Today's Question */}
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
                  <MessageCircle className="size-5 text-green-500" />
                  Today&apos;s Question
                </h3>
                {stats?.currentQuestion ? (
                  <div className="space-y-2">
                    <p className="font-medium text-gray-800">&ldquo;{stats.currentQuestion.question}&rdquo;</p>
                    <p className="text-sm text-gray-500">
                      {stats.currentQuestion.totalResponses} responses
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">No active question</p>
                )}
              </div>

              {/* Quick Links */}
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
                  <Eye className="size-5 text-purple-500" />
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  {[
                    { href: "/social", label: "View Social Hub" },
                    { href: "/social/im-here", label: "I'm Here" },
                    { href: "/social/prayer-circle", label: "Prayer Circle" },
                    { href: "/social/amen-wall", label: "Amen Wall" },
                  ].map((link) => (
                    <Link key={link.href} href={link.href} className="block text-sm text-[#4A148C] hover:underline">
                      → {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Private Prayers Tab */}
        {activeTab === "prayers" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">
                  Private Prayer Requests
                </h3>
                <button
                  onClick={loadPrivatePrayers}
                  className="text-sm text-[#4A148C] hover:underline"
                >
                  Refresh
                </button>
              </div>

              {privatePrayers.length === 0 ? (
                <div className="text-center py-12">
                  <ShieldCheck className="size-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-400">No private prayer requests</p>
                  <p className="text-gray-400 text-sm mt-1">Private requests submitted by users will appear here</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {privatePrayers.map((prayer) => (
                    <div
                      key={prayer.id}
                      className={`border rounded-xl p-4 ${
                        prayer.status === "new"
                          ? "border-yellow-200 bg-yellow-50/50"
                          : "border-gray-100 bg-gray-50/50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="text-gray-800 text-sm leading-relaxed">{prayer.request}</p>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-md capitalize">
                              {prayer.category}
                            </span>
                            {prayer.isUrgent && (
                              <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-md flex items-center gap-1">
                                <AlertTriangle className="size-3" />
                                Urgent
                              </span>
                            )}
                            {prayer.fullName && (
                              <span className="text-xs text-gray-400">{prayer.fullName}</span>
                            )}
                            {prayer.email && (
                              <span className="text-xs text-gray-400">{prayer.email}</span>
                            )}
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <Clock className="size-3" />
                              {new Date(prayer.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        {prayer.status === "new" && (
                          <button
                            onClick={() => handleReviewPrayer(prayer.id)}
                            className="shrink-0 inline-flex items-center gap-1.5 bg-green-50 text-green-700 hover:bg-green-100 px-3 py-2 rounded-lg text-xs font-semibold transition-colors"
                          >
                            <CheckSquare className="size-3.5" />
                            Mark Reviewed
                          </button>
                        )}
                        {prayer.status === "reviewed" && (
                          <span className="shrink-0 text-xs text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                            Reviewed ✓
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Moderation Tab */}
        {activeTab === "moderation" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Moderation Queue</h3>
              <div className="text-center py-12">
                <EyeOff className="size-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-400">Moderation queue is empty</p>
                <p className="text-gray-400 text-sm mt-1">
                  Content flagged for review will appear here. Currently, all user-submitted content is auto-approved.
                  Enable manual approval mode when Supabase is connected.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
