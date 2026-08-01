"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MessageSquare,
  Send,
  CheckCircle2,
  Loader2,
  Shield,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { contactSubjects } from "./contact-data";

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface FormErrors {
  [key: string]: string;
}

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = (): boolean => {
    const errs: FormErrors = {};

    if (!formData.fullName.trim()) {
      errs.fullName = "Please enter your full name";
    } else if (formData.fullName.trim().length < 2) {
      errs.fullName = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      errs.email = "Please enter your email address";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = "Please enter a valid email address";
    }

    if (formData.phone && !/^[\d\s+()-]{7,20}$/.test(formData.phone)) {
      errs.phone = "Please enter a valid phone number";
    }

    if (!formData.subject) {
      errs.subject = "Please select a subject";
    }

    if (!formData.message.trim()) {
      errs.message = "Please enter your message";
    } else if (formData.message.trim().length < 10) {
      errs.message = "Message must be at least 10 characters";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
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

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 md:p-10 text-center"
      >
        <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="size-10 text-[#2E7D32]" />
        </div>
        <h3 className="text-2xl font-bold text-[#4A148C] mb-2">
          Message Sent Successfully!
        </h3>
        <p className="text-gray-500 leading-relaxed mb-2">
          Thank you for reaching out to us. We&apos;ve received your message
          and our team will review it shortly.
        </p>
        <p className="text-sm text-gray-400 mb-8">
          We&apos;ll get back to you within 24-48 hours.
        </p>
        <Button
          className="bg-[#4A148C] hover:bg-[#1A0033] text-white rounded-xl px-8"
          onClick={() => {
            setSubmitted(false);
            setFormData({
              fullName: "",
              email: "",
              phone: "",
              subject: "",
              message: "",
            });
          }}
        >
          Send Another Message
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Form Header */}
      <div className="bg-gradient-to-r from-[#4A148C] to-[#6A1B9A] px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
            <MessageSquare className="size-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Send Us a Message</h2>
            <p className="text-sm text-purple-200/80">
              We&apos;d love to hear from you. Fill out the form below.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {/* Full Name */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <User className="size-3.5" />
            Full Name <span className="text-[#D32F2F]">*</span>
          </label>
          <Input
            value={formData.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            placeholder="Enter your full name"
            className="rounded-xl border-gray-200 h-11 focus:border-[#4A148C]/30"
          />
          {errors.fullName && (
            <p className="text-xs text-[#D32F2F] mt-1">{errors.fullName}</p>
          )}
        </div>

        {/* Email + Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Mail className="size-3.5" />
              Email <span className="text-[#D32F2F]">*</span>
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="your@email.com"
              className="rounded-xl border-gray-200 h-11 focus:border-[#4A148C]/30"
            />
            {errors.email && (
              <p className="text-xs text-[#D32F2F] mt-1">{errors.email}</p>
            )}
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Phone className="size-3.5" />
              Phone
            </label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="+234 800 000 0000"
              className="rounded-xl border-gray-200 h-11 focus:border-[#4A148C]/30"
            />
            {errors.phone && (
              <p className="text-xs text-[#D32F2F] mt-1">{errors.phone}</p>
            )}
          </div>
        </div>

        {/* Subject */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <MessageSquare className="size-3.5" />
            Subject <span className="text-[#D32F2F]">*</span>
          </label>
          <select
            value={formData.subject}
            onChange={(e) => handleChange("subject", e.target.value)}
            className="w-full h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:border-[#4A148C]/30 focus:ring-2 focus:ring-[#4A148C]/10 transition-colors appearance-none cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: "right 0.75rem center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "1.25rem 1.25rem",
            }}
          >
            <option value="" disabled>
              Select a subject...
            </option>
            {contactSubjects.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          {errors.subject && (
            <p className="text-xs text-[#D32F2F] mt-1">{errors.subject}</p>
          )}
        </div>

        {/* Message */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <MessageSquare className="size-3.5" />
            Message <span className="text-[#D32F2F]">*</span>
          </label>
          <Textarea
            value={formData.message}
            onChange={(e) => handleChange("message", e.target.value)}
            placeholder="Tell us how we can help you..."
            rows={5}
            className="rounded-xl border-gray-200 focus:border-[#4A148C]/30 resize-none"
          />
          {errors.message && (
            <p className="text-xs text-[#D32F2F] mt-1">{errors.message}</p>
          )}
        </div>

        {/* Privacy note */}
        <div className="flex items-start gap-2 text-[11px] text-gray-400">
          <Shield className="size-3.5 mt-0.5 shrink-0" />
          <p>
            Your information is safe with us. We only use it to respond to your
            inquiry and will never share it with third parties.
          </p>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={submitting}
          className="w-full bg-[#4A148C] hover:bg-[#1A0033] text-white rounded-xl h-12 text-base font-semibold"
        >
          {submitting ? (
            <>
              <Loader2 className="size-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="size-4 mr-2" />
              Send Message
            </>
          )}
        </Button>
      </form>
    </div>
  );
}