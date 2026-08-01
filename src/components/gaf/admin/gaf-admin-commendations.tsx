"use client";

/**
 * GafAdminCommendations — admin commendation management client component.
 *
 * Features:
 *   - List of all commendations (with visibility badges)
 *   - Create new commendation dialog (member search, title, message, scripture, visibility)
 *   - Edit visibility inline
 *   - Delete commendation with confirmation
 *   - Search/filter commendations
 *
 * Stage 7 of Go-A-Fishing.
 */
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  Plus,
  Search,
  Loader2,
  Trash2,
  Eye,
  EyeOff,
  Users,
  Lock,
  BookOpen,
  Heart,
  ChevronDown,
  X,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ── Types ──

interface CommendationItem {
  id: string;
  title: string;
  message: string;
  givenBy: string;
  scriptureReference: string | null;
  awardedAt: string;
  visibility: string;
  createdAt: string;
  member: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
    referralCode: string;
  };
  giver: {
    id: string | null;
    fullName: string | null;
  };
}

interface MemberSearchItem {
  id: string;
  fullName: string;
  referralCode: string;
  status: string;
}

interface CommendationsResponse {
  commendations: CommendationItem[];
  total: number;
  nextCursor: string | null;
  hasMore: boolean;
}

// ── Helpers ──

const VISIBILITY_CONFIG: Record<string, { label: string; icon: typeof Eye; color: string }> = {
  public: { label: "Public", icon: Eye, color: "bg-emerald-100 text-emerald-700" },
  members_only: { label: "Members Only", icon: Users, color: "bg-amber-100 text-amber-700" },
  private: { label: "Private", icon: Lock, color: "bg-gray-100 text-gray-600" },
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ── Component ──

export function GafAdminCommendations() {
  const [commendations, setCommendations] = useState<CommendationItem[]>([]);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterVisibility, setFilterVisibility] = useState<string>("");

  // Create dialog state
  const [showCreate, setShowCreate] = useState(false);
  const [memberSearch, setMemberSearch] = useState("");
  const [memberResults, setMemberResults] = useState<MemberSearchItem[]>([]);
  const [selectedMember, setSelectedMember] = useState<MemberSearchItem | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [formScripture, setFormScripture] = useState("");
  const [formVisibility, setFormVisibility] = useState("public");
  const [formGivenBy, setFormGivenBy] = useState("");
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const memberSearchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch commendations
  const fetchCommendations = useCallback(
    async (cursor?: string) => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (cursor) params.set("cursor", cursor);
        if (filterVisibility) params.set("visibility", filterVisibility);

        const res = await fetch(`/api/gaf/admin/commendations?${params}`);
        if (!res.ok) throw new Error("Failed to load");
        const data: CommendationsResponse = await res.json();

        if (cursor) {
          setCommendations((prev) => [...prev, ...data.commendations]);
        } else {
          setCommendations(data.commendations);
        }
        setTotal(data.total);
        setHasMore(data.hasMore);
        setNextCursor(data.nextCursor);
      } catch (err) {
        console.error("Failed to fetch commendations:", err);
      } finally {
        setLoading(false);
      }
    },
    [filterVisibility]
  );

  useEffect(() => {
    fetchCommendations();
  }, [fetchCommendations]);

  // Reset page when filter changes
  useEffect(() => {
    setCommendations([]);
    setNextCursor(null);
    fetchCommendations();
  }, [filterVisibility, fetchCommendations]);

  // Member search with debounce
  useEffect(() => {
    if (memberSearchTimer.current) clearTimeout(memberSearchTimer.current);
    if (!memberSearch.trim() || memberSearch.length < 2) {
      setMemberResults([]);
      return;
    }
    memberSearchTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/gaf/admin/members?search=${encodeURIComponent(memberSearch)}&status=active&take=10`
        );
        if (!res.ok) return;
        const data = await res.json();
        setMemberResults(data.members || []);
      } catch {
        // ignore
      }
    }, 300);
    return () => {
      if (memberSearchTimer.current) clearTimeout(memberSearchTimer.current);
    };
  }, [memberSearch]);

  // Create commendation
  const handleCreate = async () => {
    if (!selectedMember) {
      setFormError("Please select a member");
      return;
    }
    if (!formTitle.trim() || !formMessage.trim()) {
      setFormError("Title and message are required");
      return;
    }

    setCreating(true);
    setFormError(null);
    try {
      const res = await fetch("/api/gaf/admin/commendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memberId: selectedMember.id,
          title: formTitle.trim(),
          message: formMessage.trim(),
          scriptureReference: formScripture.trim() || undefined,
          visibility: formVisibility,
          givenBy: formGivenBy.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || "Failed to create");
      }
      // Reset form and refresh
      setShowCreate(false);
      setFormTitle("");
      setFormMessage("");
      setFormScripture("");
      setFormVisibility("public");
      setFormGivenBy("");
      setSelectedMember(null);
      setMemberSearch("");
      setMemberResults([]);
      fetchCommendations();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to create");
    } finally {
      setCreating(false);
    }
  };

  // Delete commendation
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/gaf/admin/commendations/${deleteTarget}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      setCommendations((prev) => prev.filter((c) => c.id !== deleteTarget));
      setTotal((prev) => Math.max(0, prev - 1));
      setDeleteTarget(null);
    } catch (err) {
      console.error("Failed to delete:", err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#4A148C]">
            Pastoral Commendations
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Issue, manage, and review words of encouragement for members.
          </p>
        </div>
        <Button
          onClick={() => setShowCreate(true)}
          className="gap-2 bg-[#4A148C] hover:bg-[#1A0033] text-white rounded-xl"
        >
          <Plus className="size-4" />
          Issue Commendation
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by member name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A148C]/20 focus:border-[#4A148C]"
            />
          </div>
        </div>
        <div className="flex gap-2">
          {["", "public", "members_only", "private"].map((v) => {
            const label = v === "" ? "All" : (VISIBILITY_CONFIG[v]?.label || v);
            return (
              <button
                key={v}
                type="button"
                onClick={() => setFilterVisibility(v)}
                className={cn(
                  "px-3 py-2 rounded-xl text-xs font-medium transition-colors border",
                  filterVisibility === v
                    ? "bg-[#4A148C] text-white border-[#4A148C]"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-[#4A148C]">{total}</div>
            <div className="text-xs text-gray-500">Total</div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-emerald-600">
              {commendations.filter((c) => c.visibility === "public").length}
            </div>
            <div className="text-xs text-gray-500">Public</div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-amber-600">
              {commendations.filter((c) => c.visibility === "members_only").length}
            </div>
            <div className="text-xs text-gray-500">Members Only</div>
          </CardContent>
        </Card>
      </div>

      {/* Commendations list */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-[#4A148C] flex items-center gap-2">
            <Award className="size-5 text-amber-500" />
            All Commendations
            <span className="text-sm font-normal text-gray-400">({total})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading && commendations.length === 0 ? (
            <div className="py-16 flex flex-col items-center gap-3">
              <Loader2 className="size-8 text-[#4A148C] animate-spin" />
              <p className="text-sm text-gray-500">Loading commendations...</p>
            </div>
          ) : commendations.length === 0 ? (
            <div className="py-16 flex flex-col items-center gap-3 text-center">
              <Heart className="size-10 text-gray-300" />
              <p className="text-gray-500">No commendations found</p>
              <Button
                onClick={() => setShowCreate(true)}
                variant="outline"
                className="gap-2 rounded-xl border-[#4A148C]/20 text-[#4A148C]"
              >
                <Plus className="size-4" />
                Issue the first one
              </Button>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              <AnimatePresence initial={false}>
                {commendations
                  .filter((c) => {
                    if (!search) return true;
                    const q = search.toLowerCase();
                    return (
                      c.member.fullName.toLowerCase().includes(q) ||
                      c.title.toLowerCase().includes(q) ||
                      c.givenBy.toLowerCase().includes(q)
                    );
                  })
                  .map((c, idx) => {
                    const visConfig =
                      VISIBILITY_CONFIG[c.visibility] || VISIBILITY_CONFIG.public;
                    const VisIcon = visConfig.icon;
                    return (
                      <motion.li
                        key={c.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ delay: idx * 0.03 }}
                        className="py-4"
                      >
                        <div className="flex items-start gap-4">
                          <div className="shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-amber-100 to-yellow-100 flex items-center justify-center">
                            <Award className="size-5 text-amber-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <p className="font-semibold text-[#4A148C] truncate">
                                  {c.title}
                                </p>
                                <p className="text-sm text-gray-600 line-clamp-2 mt-0.5">
                                  {c.message}
                                </p>
                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                  <span className="text-xs font-medium text-[#4A148C]">
                                    {c.member.fullName}
                                  </span>
                                  <span className="text-gray-300">|</span>
                                  <span className="text-xs text-gray-500">
                                    by {c.giver?.fullName || c.givenBy}
                                  </span>
                                  {c.scriptureReference && (
                                    <>
                                      <span className="text-gray-300">|</span>
                                      <span className="text-xs text-[#D32F2F] font-medium flex items-center gap-0.5">
                                        <BookOpen className="size-3" />
                                        {c.scriptureReference}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                              <div className="shrink-0 flex items-center gap-2">
                                <span
                                  className={cn(
                                    "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
                                    visConfig.color
                                  )}
                                >
                                  <VisIcon className="size-3" />
                                  {visConfig.label}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setDeleteTarget(c.id)}
                                  className="text-gray-400 hover:text-red-500 h-8 w-8 p-0"
                                >
                                  <Trash2 className="size-4" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-xs text-gray-400 mt-1.5">
                              {formatDate(c.awardedAt)}
                            </p>
                          </div>
                        </div>
                      </motion.li>
                    );
                  })}
              </AnimatePresence>
            </ul>
          )}

          {/* Load more */}
          {hasMore && (
            <div className="pt-4 text-center">
              <Button
                variant="outline"
                onClick={() => nextCursor && fetchCommendations(nextCursor)}
                disabled={loading}
                className="gap-2 rounded-xl"
              >
                {loading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <ChevronDown className="size-4" />
                )}
                Load more
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

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
                  <Award className="size-5 text-amber-500" />
                  Issue Commendation
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
                {/* Error */}
                {formError && (
                  <div className="bg-red-50 text-red-700 text-sm rounded-xl p-3 flex items-start gap-2">
                    <AlertTriangle className="size-4 shrink-0 mt-0.5" />
                    {formError}
                  </div>
                )}

                {/* Member search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Recipient Member *
                  </label>
                  <input
                    type="text"
                    placeholder="Search by name or referral code..."
                    value={selectedMember ? selectedMember.fullName : memberSearch}
                    onChange={(e) => {
                      if (selectedMember) {
                        setSelectedMember(null);
                        setMemberSearch("");
                      } else {
                        setMemberSearch(e.target.value);
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A148C]/20 focus:border-[#4A148C]"
                  />
                  {selectedMember && (
                    <div className="mt-1 flex items-center gap-2 bg-emerald-50 text-emerald-700 text-xs px-3 py-1.5 rounded-lg">
                      <span className="font-medium">{selectedMember.fullName}</span>
                      <span className="text-emerald-500">({selectedMember.referralCode})</span>
                      <button
                        type="button"
                        onClick={() => setSelectedMember(null)}
                        className="ml-auto hover:text-emerald-900"
                      >
                        <X className="size-3" />
                      </button>
                    </div>
                  )}
                  {memberResults.length > 0 && !selectedMember && (
                    <div className="mt-1 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                      {memberResults.map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => {
                            setSelectedMember(m);
                            setMemberSearch("");
                            setMemberResults([]);
                          }}
                          className="w-full text-left px-3 py-2.5 hover:bg-gray-50 flex items-center gap-3 text-sm border-b border-gray-50 last:border-0"
                        >
                          <Users className="size-4 text-gray-400 shrink-0" />
                          <span className="font-medium text-[#4A148C]">
                            {m.fullName}
                          </span>
                          <span className="text-xs text-gray-400 ml-auto">
                            {m.referralCode}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Faithful Soul Winner"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    maxLength={200}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A148C]/20 focus:border-[#4A148C]"
                  />
                  <p className="text-xs text-gray-400 mt-0.5 text-right">
                    {formTitle.length}/200
                  </p>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message *
                  </label>
                  <textarea
                    placeholder="Write an encouraging message..."
                    value={formMessage}
                    onChange={(e) => setFormMessage(e.target.value)}
                    maxLength={2000}
                    rows={4}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A148C]/20 focus:border-[#4A148C] resize-none"
                  />
                  <p className="text-xs text-gray-400 mt-0.5 text-right">
                    {formMessage.length}/2000
                  </p>
                </div>

                {/* Scripture reference */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Scripture Reference (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Matthew 4:19"
                    value={formScripture}
                    onChange={(e) => setFormScripture(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A148C]/20 focus:border-[#4A148C]"
                  />
                </div>

                {/* Given by */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Given By (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Defaults to your name"
                    value={formGivenBy}
                    onChange={(e) => setFormGivenBy(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A148C]/20 focus:border-[#4A148C]"
                  />
                </div>

                {/* Visibility */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Visibility
                  </label>
                  <div className="flex gap-2">
                    {Object.entries(VISIBILITY_CONFIG).map(([key, config]) => {
                      const Icon = config.icon;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setFormVisibility(key)}
                          className={cn(
                            "flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors border",
                            formVisibility === key
                              ? "bg-[#4A148C] text-white border-[#4A148C]"
                              : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                          )}
                        >
                          <Icon className="size-3.5" />
                          {config.label}
                        </button>
                      );
                    })}
                  </div>
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
                  {creating ? "Issuing..." : "Issue Commendation"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Delete Confirmation ── */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setDeleteTarget(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-2xl shadow-xl max-w-sm w-full p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="size-5 text-red-500" />
                </div>
                <div>
                  <h3 className="font-bold text-[#4A148C]">Delete Commendation</h3>
                  <p className="text-sm text-gray-500">This action cannot be undone.</p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setDeleteTarget(null)}
                  className="rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDelete}
                  disabled={deleting}
                  variant="destructive"
                  className="rounded-xl gap-2"
                >
                  {deleting && <Loader2 className="size-4 animate-spin" />}
                  Delete
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
