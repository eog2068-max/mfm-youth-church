"use client";

/**
 * GafMyOutreach — member outreach activity self-reporting page.
 *
 * Features:
 *   - Outreach stats cards (total activities, contacts, decisions, streak)
 *   - Activity log with type badges + contacts/decisions counts
 *   - Create new activity dialog with type picker, date, location, contacts, decisions
 *   - Type filter pills
 *   - Load-more pagination
 *
 * Stage 9 of Go-A-Fishing.
 */
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Plus,
  Flame,
  Users,
  Heart,
  Loader2,
  AlertCircle,
  Fish,
  ChevronDown,
  X,
  Phone,
  Megaphone,
  Church,
  GraduationCap,
  ShoppingBag,
  Wifi,
  Home,
  UserCheck,
  HelpCircle,
  BookOpen,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SectionWrapper } from "@/components/home/section-wrapper";
import { cn } from "@/lib/utils";

// ── Types ──

interface ActivityItem {
  id: string;
  type: string;
  title: string;
  description: string | null;
  activityDate: string;
  location: string | null;
  contacts: number;
  decisions: number;
  notes: string | null;
  status: string;
  createdAt: string;
}

interface OutreachStats {
  totalActivities: number;
  totalContacts: number;
  totalDecisions: number;
  currentStreak: number;
}

interface OutreachResponse {
  activities: ActivityItem[];
  total: number;
  nextCursor: string | null;
  hasMore: boolean;
  stats: OutreachStats;
}

// ── Config ──

const OUTREACH_TYPES: Array<{
  key: string;
  label: string;
  icon: typeof Fish;
  color: string;
}> = [
  { key: "door_to_door", label: "Door-to-Door", icon: Home, color: "bg-purple-100 text-purple-700" },
  { key: "street_preaching", label: "Street Preaching", icon: Megaphone, color: "bg-amber-100 text-amber-700" },
  { key: "hospital_visit", label: "Hospital Visit", icon: Heart, color: "bg-rose-100 text-rose-700" },
  { key: "prison_ministry", label: "Prison Ministry", icon: BookOpen, color: "bg-purple-100 text-purple-700" },
  { key: "school_outreach", label: "School Outreach", icon: GraduationCap, color: "bg-teal-100 text-teal-700" },
  { key: "market_evangelism", label: "Market Evangelism", icon: ShoppingBag, color: "bg-red-100 text-red-700" },
  { key: "phone_call", label: "Phone Call", icon: Phone, color: "bg-green-100 text-green-700" },
  { key: "social_media", label: "Social Media", icon: Wifi, color: "bg-purple-100 text-purple-700" },
  { key: "personal_visit", label: "Personal Visit", icon: UserCheck, color: "bg-cyan-100 text-cyan-700" },
  { key: "other", label: "Other", icon: HelpCircle, color: "bg-gray-100 text-gray-600" },
];

function getTypeConfig(type: string) {
  return OUTREACH_TYPES.find((t) => t.key === type) || OUTREACH_TYPES[OUTREACH_TYPES.length - 1];
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ── Component ──

export function GafMyOutreach() {
  const [data, setData] = useState<OutreachResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState("");

  // Create dialog state
  const [showCreate, setShowCreate] = useState(false);
  const [formType, setFormType] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formContacts, setFormContacts] = useState("0");
  const [formDecisions, setFormDecisions] = useState("0");
  const [formNotes, setFormNotes] = useState("");
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchOutreach = useCallback(async (cursor?: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (cursor) params.set("cursor", cursor);
      if (filterType) params.set("type", filterType);

      const res = await fetch(`/api/gaf/outreach?${params}`, {
        cache: "no-store",
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || `Failed to load (status ${res.status})`);
      }
      const json: OutreachResponse = await res.json();
      if (cursor) {
        setData((prev) =>
          prev
            ? {
                ...json,
                activities: [...prev.activities, ...json.activities],
                stats: prev.stats, // keep the stats from first load
              }
            : json
        );
      } else {
        setData(json);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [filterType]);

  useEffect(() => {
    fetchOutreach();
  }, [fetchOutreach]);

  const handleCreate = async () => {
    if (!formType) {
      setFormError("Please select an outreach type");
      return;
    }
    if (!formTitle.trim()) {
      setFormError("Title is required");
      return;
    }
    if (!formDate) {
      setFormError("Date is required");
      return;
    }

    setCreating(true);
    setFormError(null);
    try {
      const res = await fetch("/api/gaf/outreach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: formType,
          title: formTitle.trim(),
          description: formDescription.trim() || undefined,
          activityDate: new Date(formDate).toISOString(),
          location: formLocation.trim() || undefined,
          contacts: Number(formContacts) || 0,
          decisions: Number(formDecisions) || 0,
          notes: formNotes.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || "Failed to create");
      }
      // Reset and refresh
      setShowCreate(false);
      resetForm();
      fetchOutreach();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to create");
    } finally {
      setCreating(false);
    }
  };

  const resetForm = () => {
    setFormType("");
    setFormTitle("");
    setFormDescription("");
    setFormDate(new Date().toISOString().split("T")[0]);
    setFormLocation("");
    setFormContacts("0");
    setFormDecisions("0");
    setFormNotes("");
    setFormError(null);
  };

  return (
    <section className="py-12 md:py-16 bg-[#F3E5F5] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <SectionWrapper className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#4A148C]">
              My Outreach Log
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Track your evangelism activities and see how God is using you.
            </p>
          </div>
          <Button
            onClick={() => {
              resetForm();
              setShowCreate(true);
            }}
            className="gap-2 bg-[#4A148C] hover:bg-[#1A0033] text-white rounded-xl"
          >
            <Plus className="size-4" />
            Log Activity
          </Button>
        </SectionWrapper>

        {/* Stats */}
        {data && (
          <SectionWrapper>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-0 shadow-md">
                <CardContent className="p-5">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 text-white mb-3">
                    <Fish className="size-5" />
                  </div>
                  <div className="text-2xl font-bold text-[#4A148C]">
                    {data.stats.totalActivities}
                  </div>
                  <div className="text-xs text-gray-500">Activities Logged</div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-md">
                <CardContent className="p-5">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-white mb-3">
                    <Users className="size-5" />
                  </div>
                  <div className="text-2xl font-bold text-[#4A148C]">
                    {data.stats.totalContacts}
                  </div>
                  <div className="text-xs text-gray-500">People Reached</div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-md">
                <CardContent className="p-5">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white mb-3">
                    <Heart className="size-5" />
                  </div>
                  <div className="text-2xl font-bold text-[#4A148C]">
                    {data.stats.totalDecisions}
                  </div>
                  <div className="text-xs text-gray-500">Decisions for Christ</div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-md">
                <CardContent className="p-5">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-700 text-white mb-3">
                    <Flame className="size-5" />
                  </div>
                  <div className="text-2xl font-bold text-[#4A148C]">
                    {data.stats.currentStreak}
                  </div>
                  <div className="text-xs text-gray-500">
                    {data.stats.currentStreak === 1 ? "Week Streak" : "Week Streak"}
                  </div>
                </CardContent>
              </Card>
            </div>
          </SectionWrapper>
        )}

        {/* Type filter */}
        <SectionWrapper>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setFilterType("")}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                !filterType
                  ? "bg-[#4A148C] text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              )}
            >
              All Types
            </button>
            {OUTREACH_TYPES.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setFilterType(t.key)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                  filterType === t.key
                    ? "bg-[#4A148C] text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </SectionWrapper>

        {/* Activity list */}
        <SectionWrapper>
          <Card className="border-0 shadow-md">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-lg text-[#4A148C]">
                Activity Log
                {data && (
                  <span className="text-sm font-normal text-gray-400 ml-2">
                    ({data.total})
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {loading && !data ? (
                <div className="py-16 flex flex-col items-center gap-3">
                  <Loader2 className="size-8 text-[#4A148C] animate-spin" />
                  <p className="text-sm text-gray-500">Loading activities...</p>
                </div>
              ) : error ? (
                <div className="py-16 flex flex-col items-center gap-3 text-center">
                  <AlertCircle className="size-8 text-red-500" />
                  <p className="text-gray-700">{error}</p>
                  <Button onClick={() => fetchOutreach()} className="bg-[#4A148C] hover:bg-[#1A0033] text-white rounded-xl">
                    Try again
                  </Button>
                </div>
              ) : data && data.activities.length === 0 ? (
                <div className="text-center py-16 px-6">
                  <Fish className="size-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 mb-2">
                    {filterType
                      ? `No ${getTypeConfig(filterType).label} activities logged yet.`
                      : "You haven't logged any outreach activities yet."}
                  </p>
                  <p className="text-sm text-gray-400 mb-4 max-w-md">
                    Every soul matters. Start logging your evangelism efforts to track
                    how God is working through you.
                  </p>
                  <Button
                    onClick={() => {
                      resetForm();
                      setShowCreate(true);
                    }}
                    className="bg-[#4A148C] hover:bg-[#1A0033] text-white rounded-xl gap-2"
                  >
                    <Plus className="size-4" />
                    Log your first activity
                  </Button>
                </div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  <AnimatePresence initial={false}>
                    {data.activities.map((act, idx) => {
                      const typeConfig = getTypeConfig(act.type);
                      const Icon = typeConfig.icon;
                      return (
                        <motion.li
                          key={act.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.03 }}
                          className="p-4 hover:bg-gray-50"
                        >
                          <div className="flex items-start gap-4">
                            <div
                              className={cn(
                                "shrink-0 w-10 h-10 rounded-xl flex items-center justify-center",
                                typeConfig.color
                              )}
                            >
                              <Icon className="size-5" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <p className="font-semibold text-[#4A148C]">
                                    {act.title}
                                  </p>
                                  <div className="flex flex-wrap items-center gap-2 mt-1">
                                    <span
                                      className={cn(
                                        "px-2 py-0.5 rounded-full text-xs font-medium",
                                        typeConfig.color
                                      )}
                                    >
                                      {typeConfig.label}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                      {formatDate(act.activityDate)}
                                    </span>
                                    {act.location && (
                                      <span className="text-xs text-gray-500 flex items-center gap-0.5">
                                        <MapPin className="size-3" />
                                        {act.location}
                                      </span>
                                    )}
                                  </div>
                                  {act.description && (
                                    <p className="text-sm text-gray-600 mt-1.5 line-clamp-2">
                                      {act.description}
                                    </p>
                                  )}
                                </div>
                                <div className="shrink-0 flex gap-3">
                                  {act.contacts > 0 && (
                                    <div className="text-center">
                                      <p className="text-lg font-bold text-[#4A148C]">
                                        {act.contacts}
                                      </p>
                                      <p className="text-xs text-gray-400">reached</p>
                                    </div>
                                  )}
                                  {act.decisions > 0 && (
                                    <div className="text-center">
                                      <p className="text-lg font-bold text-emerald-600">
                                        {act.decisions}
                                      </p>
                                      <p className="text-xs text-gray-400">saved</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                              {act.status === "flagged" && (
                                <div className="mt-2 text-xs text-amber-600 bg-amber-50 rounded-lg px-2.5 py-1 inline-flex items-center gap-1">
                                  <AlertCircle className="size-3" />
                                  Flagged for review
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.li>
                      );
                    })}
                  </AnimatePresence>
                </ul>
              )}
            </CardContent>
          </Card>
        </SectionWrapper>

        {/* Load more */}
        {data && data.hasMore && (
          <SectionWrapper className="text-center">
            <Button
              variant="outline"
              onClick={() => data.nextCursor && fetchOutreach(data.nextCursor)}
              disabled={loading}
              className="gap-2 rounded-xl border-[#4A148C]/20 text-[#4A148C] hover:bg-[#4A148C]/5"
            >
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <ChevronDown className="size-4" />
              )}
              Load more
            </Button>
          </SectionWrapper>
        )}

        {/* Scripture footer */}
        <SectionWrapper className="text-center py-8">
          <MapPin className="size-8 mx-auto text-[#4A148C] mb-3" />
          <p className="text-sm text-gray-600 italic max-w-md mx-auto leading-relaxed">
            &ldquo;Go therefore and make disciples of all nations, baptizing them in
            the name of the Father and of the Son and of the Holy Spirit.&rdquo;
            <br />
            <span className="text-[#D32F2F] font-medium">— Matthew 28:19</span>
          </p>
        </SectionWrapper>
      </div>

      {/* ── Create Dialog ── */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setShowCreate(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <h2 className="text-lg font-bold text-[#4A148C] flex items-center gap-2">
                  <MapPin className="size-5 text-purple-500" />
                  Log Outreach Activity
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCreate(false)}
                  className="text-gray-400 h-8 w-8 p-0"
                >
                  <X className="size-5" />
                </Button>
              </div>

              <div className="p-5 space-y-4">
                {formError && (
                  <div className="bg-red-50 text-red-700 text-sm rounded-xl p-3 flex items-start gap-2">
                    <AlertCircle className="size-4 shrink-0 mt-0.5" />
                    {formError}
                  </div>
                )}

                {/* Type picker */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Outreach Type *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {OUTREACH_TYPES.map((t) => {
                      const Icon = t.icon;
                      return (
                        <button
                          key={t.key}
                          type="button"
                          onClick={() => setFormType(t.key)}
                          className={cn(
                            "flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium transition-all border text-left",
                            formType === t.key
                              ? "bg-[#4A148C] text-white border-[#4A148C]"
                              : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                          )}
                        >
                          <Icon className="size-4 shrink-0" />
                          {t.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Door-to-door in Gwarinpa Estate"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    maxLength={200}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A148C]/20 focus:border-[#4A148C]"
                  />
                </div>

                {/* Date + Location row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date *
                    </label>
                    <input
                      type="date"
                      value={formDate}
                      max={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setFormDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A148C]/20 focus:border-[#4A148C]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Gwarinpa, Abuja"
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A148C]/20 focus:border-[#4A148C]"
                    />
                  </div>
                </div>

                {/* Contacts + Decisions row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      People Reached
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="999"
                      value={formContacts}
                      onChange={(e) => setFormContacts(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A148C]/20 focus:border-[#4A148C]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Decisions for Christ
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="999"
                      value={formDecisions}
                      onChange={(e) => setFormDecisions(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A148C]/20 focus:border-[#4A148C]"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description (optional)
                  </label>
                  <textarea
                    placeholder="Brief description of the outreach..."
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    maxLength={500}
                    rows={2}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A148C]/20 focus:border-[#4A148C] resize-none"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prayer Points / Follow-up Notes (optional)
                  </label>
                  <textarea
                    placeholder="Any prayer requests or follow-up needs..."
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    maxLength={500}
                    rows={2}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A148C]/20 focus:border-[#4A148C] resize-none"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-100">
                <Button
                  variant="outline"
                  onClick={() => setShowCreate(false)}
                  className="rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreate}
                  disabled={creating}
                  className="bg-[#4A148C] hover:bg-[#1A0033] text-white rounded-xl gap-2"
                >
                  {creating && <Loader2 className="size-4 animate-spin" />}
                  {creating ? "Saving..." : "Log Activity"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
