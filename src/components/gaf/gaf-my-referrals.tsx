"use client";

/**
 * GafMyReferrals — full referral list + create-manual-referral form.
 *
 * Stage 4 of Go-A-Fishing.
 */
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Loader2,
  X,
  Fish,
  Phone,
  Mail,
  Calendar,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { SectionWrapper } from "@/components/home/section-wrapper";
import { type ReferralStatus } from "@/lib/gaf/scoring";

interface Referral {
  id: string;
  inviteeName: string;
  inviteePhone: string | null;
  inviteeEmail: string | null;
  channel: string;
  status: string;
  firstVisitDate: Date | null;
  prayerPoint: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface GafMyReferralsProps {
  referrals: Referral[];
}

const STATUS_LABELS: Record<ReferralStatus, string> = {
  invited: "Invited",
  attended: "Attended Service",
  saved: "Saved",
  baptized: "Baptized",
  member: "Joined as Member",
  lost_contact: "Lost Contact",
};

const STATUS_COLORS: Record<ReferralStatus, string> = {
  invited: "bg-purple-100 text-purple-700 border-purple-200",
  attended: "bg-amber-100 text-amber-700 border-amber-200",
  saved: "bg-emerald-100 text-emerald-700 border-emerald-200",
  baptized: "bg-purple-100 text-purple-700 border-purple-200",
  member: "bg-[#4A148C] text-white border-[#4A148C]",
  lost_contact: "bg-gray-100 text-gray-600 border-gray-200",
};

const CHANNEL_LABELS: Record<string, string> = {
  link: "Link",
  qr: "QR Code",
  whatsapp: "WhatsApp",
  manual: "Manual Entry",
  flyer: "Flyer",
  other: "Other",
};

export function GafMyReferrals({ referrals: initialReferrals }: GafMyReferralsProps) {
  const [referrals, setReferrals] = useState(initialReferrals);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filter, setFilter] = useState<string>("all");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [inviteeName, setInviteeName] = useState("");
  const [inviteePhone, setInviteePhone] = useState("");
  const [inviteeEmail, setInviteeEmail] = useState("");
  const [prayerPoint, setPrayerPoint] = useState("");
  const [notes, setNotes] = useState("");

  const filteredReferrals =
    filter === "all"
      ? referrals
      : referrals.filter((r) => r.status === filter);

  const resetForm = () => {
    setInviteeName("");
    setInviteePhone("");
    setInviteeEmail("");
    setPrayerPoint("");
    setNotes("");
    setError(null);
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/gaf/referrals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inviteeName,
          inviteePhone: inviteePhone || undefined,
          inviteeEmail: inviteeEmail || undefined,
          prayerPoint: prayerPoint || undefined,
          notes: notes || undefined,
          channel: "manual",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Failed to add referral.");
        return;
      }

      // Prepend new referral to list.
      setReferrals((prev) => [data.referral, ...prev]);
      setSuccess(`${inviteeName} added to your referrals. Keep praying for them!`);
      setTimeout(() => setSuccess(null), 5000);
      resetForm();
      setDialogOpen(false);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }, [submitting, inviteeName, inviteePhone, inviteeEmail, prayerPoint, notes]);

  const filters = [
    { value: "all", label: "All", count: referrals.length },
    { value: "invited", label: "Invited", count: referrals.filter((r) => r.status === "invited").length },
    { value: "attended", label: "Attended", count: referrals.filter((r) => r.status === "attended").length },
    { value: "saved", label: "Saved", count: referrals.filter((r) => r.status === "saved").length },
    { value: "baptized", label: "Baptized", count: referrals.filter((r) => r.status === "baptized").length },
    { value: "member", label: "Members", count: referrals.filter((r) => r.status === "member").length },
    { value: "lost_contact", label: "Lost Contact", count: referrals.filter((r) => r.status === "lost_contact").length },
  ];

  return (
    <section className="py-12 md:py-16 bg-[#F3E5F5] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header + Add button */}
        <SectionWrapper className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#4A148C]">
              My Referrals
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {referrals.length} {referrals.length === 1 ? "soul" : "souls"} in your gospel net
            </p>
          </div>

          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button className="bg-[#4A148C] hover:bg-[#1A0033] text-white rounded-xl gap-2">
                <Plus className="size-4" />
                Add Referral
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-[#4A148C]">
                  <Fish className="size-5" />
                  Log a New Referral
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="inviteeName" className="text-[#4A148C]">
                    Invitee Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="inviteeName"
                    value={inviteeName}
                    onChange={(e) => setInviteeName(e.target.value)}
                    placeholder="Full name of the person you invited"
                    required
                    maxLength={200}
                    className="rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="inviteePhone" className="text-[#4A148C]">
                      Phone (optional)
                    </Label>
                    <Input
                      id="inviteePhone"
                      type="tel"
                      value={inviteePhone}
                      onChange={(e) => setInviteePhone(e.target.value)}
                      placeholder="+234..."
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="inviteeEmail" className="text-[#4A148C]">
                      Email (optional)
                    </Label>
                    <Input
                      id="inviteeEmail"
                      type="email"
                      value={inviteeEmail}
                      onChange={(e) => setInviteeEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prayerPoint" className="text-[#4A148C]">
                    Prayer Point (optional)
                  </Label>
                  <Input
                    id="prayerPoint"
                    value={prayerPoint}
                    onChange={(e) => setPrayerPoint(e.target.value)}
                    placeholder="e.g. Salvation, healing, job, family restoration..."
                    maxLength={200}
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-[#4A148C]">
                    Notes (optional)
                  </Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any additional context..."
                    rows={3}
                    maxLength={1000}
                    className="rounded-xl resize-none"
                  />
                </div>

                {error && (
                  <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                    <AlertCircle className="size-4 shrink-0 mt-0.5" />
                    <p>{error}</p>
                  </div>
                )}

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => { setDialogOpen(false); resetForm(); }}
                    disabled={submitting}
                    className="rounded-xl"
                  >
                    <X className="size-4" />
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting || !inviteeName.trim()}
                    className="bg-[#4A148C] hover:bg-[#1A0033] text-white rounded-xl gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Fish className="size-4" />
                        Add to My Net
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </SectionWrapper>

        {/* Success toast */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex items-center gap-2 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700"
            >
              <CheckCircle2 className="size-5 shrink-0" />
              <p>{success}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filters */}
        <SectionWrapper>
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setFilter(f.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  filter === f.value
                    ? "bg-[#4A148C] text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {f.label} ({f.count})
              </button>
            ))}
          </div>
        </SectionWrapper>

        {/* Referral list */}
        {filteredReferrals.length === 0 ? (
          <SectionWrapper>
            <Card className="border-0 shadow-md">
              <CardContent className="py-12 text-center">
                <Fish className="size-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 mb-1">
                  {referrals.length === 0
                    ? "Your net is empty. Start fishing!"
                    : "No referrals in this category."}
                </p>
                <p className="text-xs text-gray-400">
                  Share your referral link or log a manual entry to begin.
                </p>
              </CardContent>
            </Card>
          </SectionWrapper>
        ) : (
          <SectionWrapper>
            <div className="space-y-3">
              <AnimatePresence initial={false}>
                {filteredReferrals.map((ref) => (
                  <motion.div
                    key={ref.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                      <CardContent className="p-5">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-[#4A148C] truncate">
                                {ref.inviteeName}
                              </h3>
                              <span
                                className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                                  STATUS_COLORS[ref.status as ReferralStatus] || "bg-gray-100 text-gray-600 border-gray-200"
                                }`}
                              >
                                {STATUS_LABELS[ref.status as ReferralStatus] || ref.status}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="size-3" />
                                {new Date(ref.createdAt).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </span>
                              {ref.inviteePhone && (
                                <span className="flex items-center gap-1">
                                  <Phone className="size-3" />
                                  {ref.inviteePhone}
                                </span>
                              )}
                              {ref.inviteeEmail && (
                                <span className="flex items-center gap-1 truncate max-w-[200px]">
                                  <Mail className="size-3" />
                                  {ref.inviteeEmail}
                                </span>
                              )}
                              <span className="text-gray-400">
                                via {CHANNEL_LABELS[ref.channel] || ref.channel}
                              </span>
                            </div>
                            {ref.prayerPoint && (
                              <p className="mt-2 text-sm text-[#D32F2F] italic">
                                🙏 {ref.prayerPoint}
                              </p>
                            )}
                            {ref.notes && (
                              <p className="mt-1 text-sm text-gray-600">{ref.notes}</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </SectionWrapper>
        )}
      </div>
    </section>
  );
}
