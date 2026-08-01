"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  User,
  Mail,
  Phone,
  Shield,
  CheckCircle2,
  MessageSquare,
  Clock,
  Globe,
  BookOpen,
  Flame,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function PrayerRequestForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    prayerCategory: "",
    request: "",
    isAnonymous: false,
    isUrgent: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const prayerCategories = [
    { value: "salvation", label: "Salvation", icon: Flame, desc: "For those who want to give their life to Christ" },
    { value: "healing", label: "Healing", icon: Heart, desc: "Physical, emotional, or spiritual healing" },
    { value: "family", label: "Family & Home", icon: User, desc: "Marriage, children, relationships, family unity" },
    { value: "finances", label: "Financial Breakthrough", icon: Globe, desc: "Employment, business, provision, debt cancellation" },
    { value: "spiritual", label: "Spiritual Growth", icon: BookOpen, desc: "Wisdom, discernment, strength, faith" },
    { value: "guidance", label: "Divine Guidance", icon: Clock, desc: "Life direction, decisions, open doors" },
    { value: "deliverance", label: "Deliverance", icon: Shield, desc: "Freedom from bondage, habits, oppression" },
    { value: "other", label: "Other", icon: MessageSquare, desc: "Any other prayer need not listed above" },
  ];

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.prayerCategory) errs.prayerCategory = "Please select a category";
    if (!formData.request.trim()) errs.request = "Please share your prayer request";
    else if (formData.request.trim().length < 10) errs.request = "Please provide more detail";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg mx-auto text-center py-12"
      >
        <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="size-10 text-[#2E7D32]" />
        </div>
        <h2 className="text-2xl font-bold text-[#4A148C] mb-2">Prayer Request Received</h2>
        <p className="text-gray-500 mb-2">
          Thank you for sharing your prayer need with us. Be assured that our prayer team is standing in agreement with you.
        </p>
        <p className="text-sm text-gray-400 italic mb-8">
          &ldquo;The earnest prayer of a righteous person has great power and produces wonderful results.&rdquo; — James 5:16
        </p>
        {formData.email && !formData.isAnonymous && (
          <p className="text-sm text-gray-500 mb-6">
            A confirmation has been sent to <span className="font-medium text-gray-700">{formData.email}</span>.
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            asChild
            className="bg-[#4A148C] hover:bg-[#1A0033] text-white rounded-xl px-6"
          >
            <Link href="/">Back to Home</Link>
          </Button>
          <Button
            variant="outline"
            className="border-gray-200 text-gray-600 rounded-xl px-6"
            onClick={() => {
              setSubmitted(false);
              setFormData({ fullName: "", email: "", phone: "", prayerCategory: "", request: "", isAnonymous: false, isUrgent: false });
            }}
          >
            Submit Another Request
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Form */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-[#D32F2F] to-[#E53935] px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                  <Heart className="size-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Share Your Prayer Request</h2>
                  <p className="text-sm text-red-100/80">We believe God answers prayer. Tell us how we can pray with you.</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Category selector */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 block">
                  Prayer Category <span className="text-[#D32F2F]">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {prayerCategories.map((cat) => {
                    const IconComp = cat.icon;
                    const isSelected = formData.prayerCategory === cat.value;
                    return (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => {
                          handleChange("prayerCategory", cat.value);
                        }}
                        className={`flex items-start gap-3 p-3.5 rounded-xl border-2 text-left transition-all ${
                          isSelected
                            ? "border-[#4A148C] bg-[#F3E5F5]"
                            : "border-gray-100 hover:border-gray-200"
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected ? "bg-[#4A148C]" : "bg-gray-100"
                        }`}>
                          <IconComp className={`size-4 ${isSelected ? "text-white" : "text-gray-400"}`} />
                        </div>
                        <div className="min-w-0">
                          <p className={`text-sm font-semibold leading-snug ${isSelected ? "text-[#4A148C]" : "text-gray-700"}`}>
                            {cat.label}
                          </p>
                          <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">{cat.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {errors.prayerCategory && <p className="text-xs text-[#D32F2F] mt-1.5">{errors.prayerCategory}</p>}
              </div>

              {/* Divider */}
              <div className="border-t border-gray-100" />

              {/* Prayer request */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <MessageSquare className="size-3.5" />
                  Your Prayer Request <span className="text-[#D32F2F]">*</span>
                </label>
                <Textarea
                  value={formData.request}
                  onChange={(e) => handleChange("request", e.target.value)}
                  placeholder="Share your prayer need in detail. Be as specific as you are comfortable with. Our prayer team will stand in agreement with you."
                  rows={6}
                  className="rounded-xl border-gray-200 focus:border-[#4A148C]/30 resize-none"
                />
                {errors.request && <p className="text-xs text-[#D32F2F] mt-1">{errors.request}</p>}
              </div>

              {/* Name + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className={!formData.isAnonymous ? "" : "opacity-40 pointer-events-none"}>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <User className="size-3.5" />
                    Full Name
                  </label>
                  <Input
                    value={formData.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                    placeholder="Your name (optional)"
                    className="rounded-xl border-gray-200 h-11 focus:border-[#4A148C]/30"
                  />
                </div>
                <div className={!formData.isAnonymous ? "" : "opacity-40 pointer-events-none"}>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Mail className="size-3.5" />
                    Email (optional)
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="your@email.com"
                    className="rounded-xl border-gray-200 h-11 focus:border-[#4A148C]/30"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className={!formData.isAnonymous ? "" : "opacity-40 pointer-events-none"}>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Phone className="size-3.5" />
                  Phone Number (optional)
                </label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="+234 800 000 0000"
                  className="rounded-xl border-gray-200 h-11 focus:border-[#4A148C]/30 max-w-sm"
                />
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-5">
                <button
                  type="button"
                  onClick={() => handleChange("isAnonymous", !formData.isAnonymous)}
                  className="flex items-center gap-2 text-xs text-gray-500 hover:text-[#4A148C] transition-colors"
                >
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                    formData.isAnonymous ? "bg-[#4A148C] border-[#4A148C]" : "border-gray-300"
                  }`}>
                    {formData.isAnonymous && <CheckCircle2 className="size-2.5 text-white" />}
                  </div>
                  Submit anonymously
                </button>
                <button
                  type="button"
                  onClick={() => handleChange("isUrgent", !formData.isUrgent)}
                  className="flex items-center gap-2 text-xs text-gray-500 hover:text-[#D32F2F] transition-colors"
                >
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                    formData.isUrgent ? "bg-[#D32F2F] border-[#D32F2F]" : "border-gray-300"
                  }`}>
                    {formData.isUrgent && <CheckCircle2 className="size-2.5 text-white" />}
                  </div>
                  Mark as urgent
                </button>
              </div>

              {/* Privacy */}
              <div className="flex items-start gap-2 text-[11px] text-gray-400">
                <Shield className="size-3.5 mt-0.5 shrink-0" />
                <p>Your prayer request is confidential. It will only be seen by our designated prayer team. We pray over every request received. You may submit anonymously if you prefer.</p>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#4A148C] hover:bg-[#1A0033] text-white rounded-xl h-12 text-base font-semibold"
              >
                {submitting ? "Sending..." : "Submit Prayer Request"}
              </Button>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-2 space-y-6">
          {/* Scripture */}
          <div className="bg-gradient-to-br from-[#1A0033] to-[#4A148C] rounded-2xl p-6 text-white">
            <BookOpen className="size-6 text-white/60 mb-3" />
            <p className="text-lg font-semibold leading-relaxed mb-2 italic">
              &ldquo;Therefore I tell you, whatever you ask in prayer, believe that you have received it, and it will be yours.&rdquo;
            </p>
            <p className="text-sm text-purple-200/70 font-medium">— Mark 11:24 (NKJV)</p>
          </div>

          {/* How it works */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-sm font-bold text-[#4A148C] mb-4">How It Works</h3>
            <div className="space-y-4">
              {[
                { step: "1", title: "Submit Your Request", desc: "Fill in the form with your prayer need. You can submit anonymously." },
                { step: "2", title: "Prayer Team Reviews", desc: "Our dedicated prayer team receives and prays over every single request." },
                { step: "3", title: "We Stand in Agreement", desc: "Your request is prayed for during our daily prayer sessions and prayer meetings." },
                { step: "4", title: "God Answers", desc: "We believe God hears and answers prayer. Trust Him for the outcome." },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#F3E5F5] flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold text-[#4A148C]">{item.step}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{item.title}</p>
                    <p className="text-xs text-gray-500 leading-relaxed mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Join prayer */}
          <div className="bg-[#FFF8F0] rounded-xl p-5 border border-amber-100">
            <p className="text-sm font-bold text-gray-800 mb-1">Join Our Prayer Meeting</p>
            <p className="text-xs text-gray-500 leading-relaxed mb-3">
              We have dedicated prayer sessions during our services. You can also join us live online.
            </p>
            <Button asChild size="sm" className="bg-[#D32F2F] hover:bg-[#B71C1C] text-white rounded-lg text-xs">
              <Link href="/live">Watch Live</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}