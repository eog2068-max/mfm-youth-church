"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Music, DoorOpen, Baby, Flame, MonitorSpeaker, Globe, Heart,
  Phone, Shield, Award, Users, Clock, CheckCircle2,
  ArrowRight, X, Send, Mail,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionWrapper, SectionTitle } from "@/components/home/section-wrapper";
import { ministries, type Ministry } from "./ministry-data";

const iconMap: Record<string, typeof Music> = {
  Music, DoorOpen, Baby, Flame, MonitorSpeaker, Globe, Heart, Phone, Shield, Award,
};

export function JoinMinistryMain() {
  const [selectedMinistry, setSelectedMinistry] = useState<Ministry | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ fullName: "", email: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleJoin = (ministry: Ministry) => {
    setSelectedMinistry(ministry);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.phone.trim()) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  const handleClose = () => {
    setShowForm(false);
    setSelectedMinistry(null);
    setSubmitted(false);
    setFormData({ fullName: "", email: "", phone: "", message: "" });
  };

  return (
    <section className="py-12 md:py-16 bg-[#F8FAFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionWrapper>
          <SectionTitle
            title="Join a Ministry"
            subtitle="Find your place of service in the body of Christ. Every member has a gift, and every gift is needed. Discover where you belong and serve with purpose."
          />
        </SectionWrapper>

        {/* Form overlay */}
        <AnimatePresence>
          {showForm && selectedMinistry && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mb-10"
            >
              {submitted ? (
                <div className="max-w-lg mx-auto bg-white rounded-2xl border border-gray-100 shadow-lg p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="size-8 text-[#2E7D32]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#4A148C] mb-2">Application Submitted!</h3>
                  <p className="text-sm text-gray-500 mb-1">
                    Thank you for your interest in the <span className="font-semibold text-gray-700">{selectedMinistry.name}</span>.
                  </p>
                  <p className="text-sm text-gray-500 mb-6">
                    A ministry coordinator will contact you shortly.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button onClick={handleClose} variant="outline" className="border-gray-200 text-gray-600 rounded-xl">
                      Browse More Ministries
                    </Button>
                    <Button onClick={() => {
                      setSubmitted(false);
                      setFormData({ fullName: "", email: "", phone: "", message: "" });
                    }} className="bg-[#4A148C] hover:bg-[#1A0033] text-white rounded-xl">
                      Join Another Ministry
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
                  <div className={`bg-gradient-to-r ${selectedMinistry.color} px-6 py-5 flex items-center justify-between`}>
                    <div className="flex items-center gap-3">
                      {(() => {
                        const IconComp = iconMap[selectedMinistry.icon] || Users;
                        return <IconComp className="size-6 text-white/80" />;
                      })()}
                      <div>
                        <h3 className="text-base font-bold text-white">Join {selectedMinistry.name}</h3>
                        <p className="text-xs text-white/60">{selectedMinistry.meetingDay} &middot; {selectedMinistry.meetingTime}</p>
                      </div>
                    </div>
                    <button onClick={handleClose} className="p-2 text-white/60 hover:text-white rounded-lg hover:bg-white/10 transition-colors">
                      <X className="size-5" />
                    </button>
                  </div>
                  <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <Users className="size-3.5" />
                        Full Name <span className="text-[#D32F2F]">*</span>
                      </label>
                      <Input
                        value={formData.fullName}
                        onChange={(e) => setFormData((p) => ({ ...p, fullName: e.target.value }))}
                        placeholder="Your full name"
                        required
                        className="rounded-xl border-gray-200 h-11 focus:border-[#4A148C]/30"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                          <Mail className="size-3.5" />
                          Email
                        </label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                          placeholder="your@email.com"
                          className="rounded-xl border-gray-200 h-11 focus:border-[#4A148C]/30"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                          <Phone className="size-3.5" />
                          Phone <span className="text-[#D32F2F]">*</span>
                        </label>
                        <Input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                          placeholder="+234 800 000 0000"
                          required
                          className="rounded-xl border-gray-200 h-11 focus:border-[#4A148C]/30"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                        Why do you want to join? (optional)
                      </label>
                      <Textarea
                        value={formData.message}
                        onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
                        placeholder="Share any relevant experience, skills, or your motivation for joining this ministry..."
                        rows={3}
                        className="rounded-xl border-gray-200 focus:border-[#4A148C]/30 resize-none"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <Button type="submit" disabled={submitting} className="bg-[#D32F2F] hover:bg-[#B71C1C] text-white rounded-xl h-11 px-8 font-semibold">
                        {submitting ? "Submitting..." : "Submit Application"}
                        <Send className="size-4 ml-2" />
                      </Button>
                      <Button type="button" variant="ghost" onClick={handleClose} className="text-gray-500 rounded-xl h-11">
                        Cancel
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ministry grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {ministries.map((ministry, i) => {
            const IconComp = iconMap[ministry.icon] || Users;
            return (
              <motion.div
                key={ministry.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all group"
              >
                {/* Gradient header */}
                <div className={`h-2 bg-gradient-to-r ${ministry.color}`} />
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${ministry.color} flex items-center justify-center shrink-0 shadow-md`}>
                      <IconComp className="size-5.5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base font-bold text-gray-800 group-hover:text-[#4A148C] transition-colors">
                          {ministry.name}
                        </h3>
                        <Badge className="bg-green-50 text-green-700 border-0 text-[9px] px-1.5 py-0">Open</Badge>
                      </div>
                      <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">
                        {ministry.description}
                      </p>
                    </div>
                  </div>

                  {/* Meeting info */}
                  <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" />
                      {ministry.meetingDay}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="size-3" />
                      {ministry.members} members
                    </span>
                  </div>

                  {/* Requirements preview */}
                  <div className="bg-gray-50 rounded-xl p-3.5 mb-4">
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Requirements</p>
                    <ul className="space-y-1">
                      {ministry.requirements.slice(0, 3).map((req, j) => (
                        <li key={j} className="text-xs text-gray-600 flex items-start gap-1.5">
                          <CheckCircle2 className="size-3 text-[#2E7D32] shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{req}</span>
                        </li>
                      ))}
                      {ministry.requirements.length > 3 && (
                        <li className="text-xs text-gray-400 pl-4.5">
                          +{ministry.requirements.length - 3} more requirements
                        </li>
                      )}
                    </ul>
                  </div>

                  <Button
                    onClick={() => handleJoin(ministry)}
                    className="w-full bg-[#4A148C] hover:bg-[#1A0033] text-white rounded-xl h-10 text-sm font-semibold"
                  >
                    Join This Ministry
                    <ArrowRight className="size-4 ml-1" />
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}