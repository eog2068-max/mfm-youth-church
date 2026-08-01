"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Heart, Shield, CheckCircle2, User, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function LivePrayerRequest() {
  const [name, setName] = useState("");
  const [request, setRequest] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!request.trim()) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setName("");
        setRequest("");
      }, 3000);
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-[#4A148C] to-[#6A1B9A] px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
            <Heart className="size-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Live Prayer Request</h3>
            <p className="text-xs text-purple-200/70">Submit your request during the live service</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="size-8 text-[#2E7D32]" />
            </div>
            <h4 className="text-lg font-bold text-[#4A148C] mb-1">Prayer Request Sent</h4>
            <p className="text-sm text-gray-500">
              Your request has been received. We are praying with you right now.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name field */}
            <div className={!isAnonymous ? "" : "opacity-40 pointer-events-none"}>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <User className="size-3" />
                Your Name
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name (optional)"
                disabled={isAnonymous}
                className="rounded-xl border-gray-200 h-10 focus:border-[#4A148C]/30"
              />
            </div>

            {/* Anonymous toggle */}
            <button
              type="button"
              onClick={() => setIsAnonymous(!isAnonymous)}
              className="flex items-center gap-2 text-xs text-gray-500 hover:text-[#4A148C] transition-colors"
            >
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                isAnonymous ? "bg-[#4A148C] border-[#4A148C]" : "border-gray-300"
              }`}>
                {isAnonymous && <CheckCircle2 className="size-2.5 text-white" />}
              </div>
              Submit anonymously
            </button>

            {/* Request field */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <MessageSquare className="size-3" />
                Prayer Request
              </label>
              <Textarea
                value={request}
                onChange={(e) => setRequest(e.target.value)}
                placeholder="Share your prayer need... We believe God will answer."
                rows={4}
                required
                className="rounded-xl border-gray-200 focus:border-[#4A148C]/30 resize-none"
              />
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={!request.trim() || sending}
              className="w-full bg-[#4A148C] hover:bg-[#1A0033] text-white rounded-xl h-11 font-semibold"
            >
              {sending ? (
                "Sending..."
              ) : (
                <>
                  <Send className="size-4 mr-2" />
                  Send Prayer Request
                </>
              )}
            </Button>

            {/* Privacy note */}
            <div className="flex items-start gap-2 text-[11px] text-gray-400">
              <Shield className="size-3.5 mt-0.5 shrink-0" />
              <p>Your prayer request is confidential and will only be seen by the prayer team. You may submit anonymously.</p>
            </div>
          </form>
        )}
      </div>
    </motion.div>
  );
}