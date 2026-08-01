"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, CheckCircle2, Shield, AlertTriangle, User, Mail, Phone } from "lucide-react";
import { BackToSocial } from "./back-to-social";
import { SocialFeatureNav } from "./social-feature-nav";

interface PrayerRequest {
  id: string;
  request: string;
  displayName: string;
  category: string;
  prayerCount: number;
  createdAt: string;
}

const categories = [
  { value: "healing", label: "Healing", emoji: "🏥" },
  { value: "family", label: "Family", emoji: "👨‍👩‍👧" },
  { value: "finances", label: "Finances", emoji: "💰" },
  { value: "guidance", label: "Guidance", emoji: "🧭" },
  { value: "spiritual", label: "Spiritual Growth", emoji: "🕊️" },
  { value: "deliverance", label: "Deliverance", emoji: "⚡" },
  { value: "salvation", label: "Salvation", emoji: "✝️" },
  { value: "other", label: "Other", emoji: "🙏" },
];

export function PrayerCircle() {
  const [prayers, setPrayers] = useState<PrayerRequest[]>([]);
  const [newRequest, setNewRequest] = useState("");
  const [category, setCategory] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [showContactFields, setShowContactFields] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).slice(2)}`);
  const [prayedFor, setPrayedFor] = useState<Set<string>>(new Set());

  const fetchPrayers = async () => {
    try {
      const res = await fetch("/api/social/prayer");
      if (res.ok) {
        const data = await res.json();
        setPrayers(data.prayers || []);
      }
    } catch { /* silent */ }
  };

  useEffect(() => { fetchPrayers(); }, []);

  const handleSubmit = async () => {
    if (!newRequest.trim() || !category) return;
    setSubmitting(true);
    setError("");

    try {
      const body: Record<string, unknown> = {
        request: newRequest.trim(),
        category,
        isPublic,
      };

      if (!isPublic) {
        if (showContactFields && contactName.trim()) body.fullName = contactName.trim();
        if (showContactFields && contactEmail.trim()) body.email = contactEmail.trim();
        if (showContactFields && contactPhone.trim()) body.phone = contactPhone.trim();
        body.isUrgent = isUrgent;
      }

      const res = await fetch("/api/social/prayer", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-session-id": sessionId },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        setSubmitted(true);
        if (isPublic) fetchPrayers();
      } else {
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    }
    setSubmitting(false);
  };

  const handlePray = async (prayerId: string) => {
    if (prayedFor.has(prayerId)) return;
    try {
      const res = await fetch(`/api/social/prayer/${prayerId}/pray`, {
        method: "POST",
        headers: { "x-session-id": sessionId },
      });
      if (res.ok) {
        const updated = await res.json();
        setPrayers((prev) => prev.map((p) => (p.id === prayerId ? updated : p)));
        setPrayedFor((prev) => new Set(prev).add(prayerId));
      }
    } catch { /* silent */ }
  };

  // Private prayer submitted success screen
  if (submitted && !isPublic) {
    return (
      <div className="min-h-screen bg-[#F8FAFF]">
        <div className="max-w-3xl mx-auto px-4 pt-28 pb-16">
          <BackToSocial />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
              className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle2 className="size-10 text-[#2E7D32]" />
            </motion.div>
            <h2 className="text-2xl font-bold text-[#4A148C] mb-2">Private Prayer Request Received</h2>
            <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
              Your prayer request has been received. It will only be seen by our pastoral team.
              We are standing with you in prayer.
            </p>
            <p className="text-gray-400 text-sm mt-4 max-w-sm mx-auto">
              &ldquo;The prayer of a righteous person is powerful and effective.&rdquo; — James 5:16
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setNewRequest("");
                setCategory("");
                setContactName("");
                setContactEmail("");
                setContactPhone("");
                setIsUrgent(false);
                setShowContactFields(false);
              }}
              className="mt-8 bg-[#4A148C] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#1A0033] transition-colors"
            >
              Submit Another Request
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Public prayer submitted success message
  if (submitted && isPublic) {
    return (
      <div className="min-h-screen bg-[#F8FAFF]">
        <div className="max-w-3xl mx-auto px-4 pt-28 pb-16">
          <BackToSocial />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
              className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle2 className="size-10 text-[#2E7D32]" />
            </motion.div>
            <h2 className="text-2xl font-bold text-[#4A148C] mb-2">Prayer Request Shared!</h2>
            <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
              Your prayer request has been shared with the community. The church family will stand in agreement with you.
            </p>
            <button
              onClick={() => { setSubmitted(false); setNewRequest(""); setCategory(""); }}
              className="mt-8 bg-[#D32F2F] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#B71C1C] transition-colors"
            >
              Share Another Prayer Request
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFF]">
      <div className="max-w-3xl mx-auto px-4 pt-28 pb-24">
        <BackToSocial />

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="text-4xl"
            >
              🙏
            </motion.span>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#4A148C]">Prayer Circle</h1>
              <p className="text-gray-500 text-sm">Share your prayer needs and stand in agreement with others.</p>
            </div>
          </div>
        </motion.div>

        {/* Submit Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-8"
        >
          {/* Privacy toggle */}
          <div className="flex gap-3 mb-4">
            <button
              onClick={() => setIsPublic(true)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isPublic
                  ? "bg-[#4A148C] text-white shadow-md shadow-[#4A148C]/20"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              🌐 Public
            </button>
            <button
              onClick={() => setIsPublic(false)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                !isPublic
                  ? "bg-[#4A148C] text-white shadow-md shadow-[#4A148C]/20"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              🔒 Private
            </button>
          </div>

          <AnimatePresence>
            {!isPublic && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4"
              >
                <div className="flex items-start gap-2 text-xs text-gray-500 bg-purple-50 rounded-xl p-3 mb-3">
                  <Shield className="size-3.5 mt-0.5 shrink-0 text-[#4A148C]" />
                  <p>Private requests are only visible to our pastoral team. They will never be shown publicly.</p>
                </div>

                {/* Optional contact info toggle */}
                <button
                  onClick={() => setShowContactFields(!showContactFields)}
                  className="text-xs text-[#4A148C] hover:underline mb-2"
                >
                  {showContactFields ? "- Hide contact info" : "+ Add optional contact info"}
                </button>

                <AnimatePresence>
                  {showContactFields && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2 mb-2"
                    >
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-gray-400" />
                        <input
                          type="text"
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value.slice(0, 100))}
                          placeholder="Full Name (optional)"
                          className="w-full rounded-lg border border-gray-200 pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-[#4A148C]/30 focus:ring-2 focus:ring-[#4A148C]/10"
                        />
                      </div>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-gray-400" />
                        <input
                          type="email"
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value.slice(0, 100))}
                          placeholder="Email (optional)"
                          className="w-full rounded-lg border border-gray-200 pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-[#4A148C]/30 focus:ring-2 focus:ring-[#4A148C]/10"
                        />
                      </div>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-gray-400" />
                        <input
                          type="tel"
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value.slice(0, 20))}
                          placeholder="Phone (optional)"
                          className="w-full rounded-lg border border-gray-200 pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-[#4A148C]/30 focus:ring-2 focus:ring-[#4A148C]/10"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Urgent toggle */}
                <button
                  onClick={() => setIsUrgent(!isUrgent)}
                  className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors ${
                    isUrgent ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  <AlertTriangle className="size-3" />
                  Mark as urgent
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <textarea
            value={newRequest}
            onChange={(e) => { setNewRequest(e.target.value.slice(0, isPublic ? 500 : 1000)); setError(""); }}
            placeholder={isPublic ? "Share your prayer request with the community..." : "Share your prayer request privately with our pastoral team..."}
            rows={4}
            className="w-full rounded-xl border border-gray-200 p-4 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#D32F2F]/30 focus:ring-2 focus:ring-[#D32F2F]/10 resize-none"
          />

          {/* Category chips */}
          <div className="flex flex-wrap gap-2 mt-3 mb-3">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  category === cat.value
                    ? "bg-[#D32F2F] text-white shadow-sm"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {cat.emoji} {cat.label}
              </button>
            ))}
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-xs text-red-500 mb-2"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-400">{newRequest.length}/{isPublic ? 500 : 1000}</p>
            <button
              onClick={handleSubmit}
              disabled={!newRequest.trim() || !category || submitting}
              className="inline-flex items-center gap-2 bg-[#D32F2F] hover:bg-[#B71C1C] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Heart className="size-4" />
              {submitting ? "Sending..." : "Submit Prayer Request"}
            </button>
          </div>
        </motion.div>

        {/* Public Prayer Requests */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[#4A148C]">Community Prayers</h2>
          <button onClick={fetchPrayers} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
            Refresh
          </button>
        </div>
        <div className="space-y-4">
          {prayers.map((prayer, i) => (
            <motion.div
              key={prayer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow"
            >
              <p className="text-gray-800 text-sm leading-relaxed mb-4">{prayer.request}</p>
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-gray-50 text-gray-500 px-2.5 py-1 rounded-lg capitalize">
                    {prayer.category}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(prayer.createdAt).toLocaleDateString("en-NG", { month: "short", day: "numeric" })}
                  </span>
                </div>
                <button
                  onClick={() => handlePray(prayer.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    prayedFor.has(prayer.id)
                      ? "bg-green-50 text-green-600"
                      : "bg-[#FEF2F2] hover:bg-[#FEE2E2] text-[#D32F2F]"
                  }`}
                >
                  🙏 {prayedFor.has(prayer.id) ? "Praying!" : "I'm Praying With You"}
                  <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${
                    prayedFor.has(prayer.id) ? "bg-green-100 text-green-700" : "bg-[#D32F2F]/10"
                  }`}>
                    {prayer.prayerCount}
                  </span>
                </button>
              </div>
            </motion.div>
          ))}
          {prayers.length === 0 && (
            <div className="text-center py-8">
              <span className="text-3xl mb-2 block">🙏</span>
              <p className="text-gray-400 text-sm">No prayer requests yet. Be the first to share!</p>
            </div>
          )}
        </div>
      </div>

      <SocialFeatureNav currentFeatureId="prayer-circle" />
    </div>
  );
}
