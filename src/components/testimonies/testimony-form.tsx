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
  Sparkles,
  BookOpen,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  categoryIcons,
  categoryLabels,
  categoryColors,
  type TestimonyCategory,
} from "./testimonies-data";

const allCategories: TestimonyCategory[] = [
  "healing",
  "provision",
  "family",
  "career",
  "salvation",
  "miracle",
  "guidance",
  "protection",
  "academic",
  "other",
];

const predefinedTags = [
  "healing",
  "miracle",
  "breakthrough",
  "provision",
  "prayer",
  "family",
  "career",
  "guidance",
  "favour",
  "protection",
  "academic",
  "salvation",
];

export function TestimonyForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    title: "",
    category: "" as TestimonyCategory | "",
    body: "",
    isAnonymous: false,
    selectedTags: [] as string[],
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.title.trim()) errs.title = "Please enter a title for your testimony";
    if (!formData.category) errs.category = "Please select a category";
    if (!formData.body.trim()) errs.body = "Please share your testimony";
    else if (formData.body.trim().length < 50)
      errs.body = "Please provide at least 50 characters to share your story meaningfully";
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

  const handleChange = (field: string, value: string | boolean | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const toggleTag = (tag: string) => {
    const current = formData.selectedTags;
    if (current.includes(tag)) {
      handleChange(
        "selectedTags",
        current.filter((t) => t !== tag)
      );
    } else if (current.length < 5) {
      handleChange("selectedTags", [...current, tag]);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="size-10 text-[#2E7D32]" />
        </div>
        <h2 className="text-2xl font-bold text-[#4A148C] mb-2">
          Testimony Shared Successfully
        </h2>
        <p className="text-gray-500 mb-4 max-w-md mx-auto">
          Thank you for sharing what God has done in your life. Your testimony
          will encourage and strengthen the faith of others. God bless you
          abundantly.
        </p>
        <div className="bg-gradient-to-br from-[#1A0033] to-[#4A148C] rounded-2xl p-6 text-white max-w-lg mx-auto mb-8">
          <BookOpen className="size-6 text-white/60 mx-auto mb-3" />
          <p className="text-lg font-semibold leading-relaxed mb-2 italic">
            &ldquo;And they overcame him by the blood of the Lamb and by the
            word of their testimony, and they did not love their lives to the
            death.&rdquo;
          </p>
          <p className="text-sm text-purple-200/70 font-medium">
            — Revelation 12:11 (NKJV)
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            className="bg-[#4A148C] hover:bg-[#1A0033] text-white rounded-xl px-6"
            onClick={() => {
              setSubmitted(false);
              setFormData({
                name: "",
                email: "",
                phone: "",
                title: "",
                category: "",
                body: "",
                isAnonymous: false,
                selectedTags: [],
              });
            }}
          >
            Share Another Testimony
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-[#4A148C] to-[#6A1B9A] px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
              <Sparkles className="size-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                Share Your Testimony
              </h2>
              <p className="text-sm text-purple-200/80">
                Your story could be the key to someone else&apos;s breakthrough
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Category selector */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 block">
              Category <span className="text-[#D32F2F]">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {allCategories.map((cat) => {
                const IconComp = categoryIcons[cat];
                const isSelected = formData.category === cat;
                const cColors = categoryColors[cat];
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleChange("category", cat)}
                    className={`flex items-center gap-2 p-3 rounded-xl border-2 text-left transition-all ${
                      isSelected
                        ? "border-[#4A148C] bg-[#F3E5F5]"
                        : "border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected ? "bg-[#4A148C]" : "bg-gray-100"
                      }`}
                    >
                      <IconComp
                        className={`size-4 ${
                          isSelected ? "text-white" : "text-gray-400"
                        }`}
                      />
                    </div>
                    <span
                      className={`text-xs font-semibold leading-snug ${
                        isSelected ? "text-[#4A148C]" : "text-gray-700"
                      }`}
                    >
                      {categoryLabels[cat]}
                    </span>
                  </button>
                );
              })}
            </div>
            {errors.category && (
              <p className="text-xs text-[#D32F2F] mt-1.5">
                {errors.category}
              </p>
            )}
          </div>

          <div className="border-t border-gray-100" />

          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Sparkles className="size-3.5" />
              Testimony Title <span className="text-[#D32F2F]">*</span>
            </label>
            <Input
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="e.g., God Healed Me of Chronic Illness"
              className="rounded-xl border-gray-200 h-11 focus:border-[#4A148C]/30"
            />
            {errors.title && (
              <p className="text-xs text-[#D32F2F] mt-1">{errors.title}</p>
            )}
          </div>

          {/* Testimony body */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <MessageSquare className="size-3.5" />
              Your Testimony <span className="text-[#D32F2F]">*</span>
            </label>
            <Textarea
              value={formData.body}
              onChange={(e) => handleChange("body", e.target.value)}
              placeholder="Share your testimony in detail. What happened? How did you pray? What did God do? Be specific — your story matters and will encourage others."
              rows={6}
              className="rounded-xl border-gray-200 focus:border-[#4A148C]/30 resize-none"
            />
            <div className="flex items-center justify-between mt-1">
              {errors.body && (
                <p className="text-xs text-[#D32F2F]">{errors.body}</p>
              )}
              {!errors.body && (
                <p className="text-[11px] text-gray-400">
                  {formData.body.length} characters (minimum 50)
                </p>
              )}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
              Tags (optional)
            </label>
            <div className="flex flex-wrap gap-2">
              {predefinedTags.map((tag) => {
                const isSelected = formData.selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                      isSelected
                        ? "bg-[#4A148C] text-white border-[#4A148C]"
                        : "bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-gray-400 mt-1.5">
              Select up to 5 tags to help others find your testimony
            </p>
          </div>

          <div className="border-t border-gray-100" />

          {/* Name + Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className={formData.isAnonymous ? "opacity-40 pointer-events-none" : ""}>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <User className="size-3.5" />
                Full Name
              </label>
              <Input
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Your name (optional)"
                className="rounded-xl border-gray-200 h-11 focus:border-[#4A148C]/30"
              />
            </div>
            <div className={formData.isAnonymous ? "opacity-40 pointer-events-none" : ""}>
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
          <div className={formData.isAnonymous ? "opacity-40 pointer-events-none" : ""}>
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

          {/* Anonymous toggle */}
          <button
            type="button"
            onClick={() =>
              handleChange("isAnonymous", !formData.isAnonymous)
            }
            className="flex items-center gap-2 text-xs text-gray-500 hover:text-[#4A148C] transition-colors"
          >
            <div
              className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                formData.isAnonymous
                  ? "bg-[#4A148C] border-[#4A148C]"
                  : "border-gray-300"
              }`}
            >
              {formData.isAnonymous && (
                <CheckCircle2 className="size-2.5 text-white" />
              )}
            </div>
            Share anonymously
          </button>

          {/* Privacy note */}
          <div className="flex items-start gap-2 text-[11px] text-gray-400">
            <Shield className="size-3.5 mt-0.5 shrink-0" />
            <p>
              Your testimony may be shared publicly on our website, social
              media, or during church services to encourage others. Anonymous
              testimonies will not display your name. We reserve the right to
              edit for clarity and length.
            </p>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#4A148C] hover:bg-[#1A0033] text-white rounded-xl h-12 text-base font-semibold"
          >
            {submitting ? "Sharing..." : "Share My Testimony"}
          </Button>
        </form>
      </div>
    </div>
  );
}