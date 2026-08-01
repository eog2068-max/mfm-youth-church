"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Church,
  Calendar,
  MapPin,
  Clock,
  Users,
  CheckCircle2,
  ArrowLeft,
  Shield,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  mockEvents,
  categoryColors,
  type ChurchEvent,
} from "@/components/events/events-data";

export function EventRegistrationForm() {
  const registrableEvents = mockEvents.filter((e) => e.registrationRequired);

  const [selectedEvent, setSelectedEvent] = useState<ChurchEvent | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    church: "",
    additionalGuests: "0",
    specialNeeds: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatTime = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    const hour = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!selectedEvent) errs.event = "Please select an event";
    if (!formData.fullName.trim()) errs.fullName = "Full name is required";
    if (!formData.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = "Enter a valid email";
    if (!formData.phone.trim()) errs.phone = "Phone number is required";
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

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  if (submitted && selectedEvent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg mx-auto text-center py-12"
      >
        <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="size-10 text-[#2E7D32]" />
        </div>
        <h2 className="text-2xl font-bold text-[#4A148C] mb-2">Registration Successful!</h2>
        <p className="text-gray-500 mb-6">
          You have been registered for <span className="font-semibold text-gray-700">{selectedEvent.title}</span>.
          A confirmation has been sent to <span className="font-medium text-gray-700">{formData.email}</span>.
        </p>
        <div className="bg-[#F8FAFF] rounded-xl p-5 text-left mb-6">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Name</span>
              <span className="font-medium text-gray-800">{formData.fullName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Event</span>
              <span className="font-medium text-gray-800">{selectedEvent.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Date</span>
              <span className="font-medium text-gray-800">
                {new Date(selectedEvent.date + "T00:00:00").toLocaleDateString("en-NG", {
                  weekday: "short", month: "short", day: "numeric", year: "numeric",
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Venue</span>
              <span className="font-medium text-gray-800">{selectedEvent.venue}</span>
            </div>
            {parseInt(formData.additionalGuests) > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-500">Total (incl. guests)</span>
                <span className="font-medium text-gray-800">{parseInt(formData.additionalGuests) + 1} person(s)</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            asChild
            className="bg-[#4A148C] hover:bg-[#1A0033] text-white rounded-xl px-6"
          >
            <Link href="/events">
              <ArrowLeft className="size-4 mr-1" />
              Back to Events
            </Link>
          </Button>
          <Button
            variant="outline"
            className="border-gray-200 text-gray-600 rounded-xl px-6"
            onClick={() => {
              setSubmitted(false);
              setSelectedEvent(null);
              setFormData({ fullName: "", email: "", phone: "", church: "", additionalGuests: "0", specialNeeds: "" });
            }}
          >
            Register Another
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Form column */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#4A148C] to-[#6A1B9A] px-6 py-5">
              <h2 className="text-lg font-bold text-white">Event Registration</h2>
              <p className="text-sm text-purple-200/70 mt-1">Fill in your details to register for an upcoming event</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Event selector */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Calendar className="size-3.5" />
                  Select Event <span className="text-[#D32F2F]">*</span>
                </label>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {registrableEvents.map((event) => {
                    const colors = categoryColors[event.category];
                    const isSelected = selectedEvent?.id === event.id;
                    return (
                      <button
                        key={event.id}
                        type="button"
                        onClick={() => {
                          setSelectedEvent(event);
                          if (errors.event) setErrors((p) => { const n = { ...p }; delete n.event; return n; });
                        }}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                          isSelected
                            ? "border-[#4A148C] bg-[#F3E5F5]"
                            : "border-gray-100 bg-white hover:border-gray-200"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className={`${colors.bg} ${colors.text} border-0 text-[9px] px-1.5 py-0`}>
                                {event.category}
                              </Badge>
                              {isSelected && (
                                <CheckCircle2 className="size-4 text-[#2E7D32]" />
                              )}
                            </div>
                            <p className={`text-sm font-bold leading-snug ${isSelected ? "text-[#4A148C]" : "text-gray-800"}`}>
                              {event.title}
                            </p>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-gray-400">
                              <span className="flex items-center gap-1">
                                <Calendar className="size-3" />
                                {new Date(event.date + "T00:00:00").toLocaleDateString("en-NG", { month: "short", day: "numeric", year: "numeric" })}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="size-3" />
                                {formatTime(event.time)}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="size-3" />
                                {event.venue.length > 30 ? event.venue.slice(0, 30) + "..." : event.venue}
                              </span>
                            </div>
                            {event.capacity && (
                              <div className="mt-2">
                                <div className="flex items-center justify-between text-[10px] text-gray-400 mb-0.5">
                                  <span>{event.registeredCount || 0} / {event.capacity} spots</span>
                                  <span>{event.capacity - (event.registeredCount || 0)} remaining</span>
                                </div>
                                <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-[#4A148C] rounded-full"
                                    style={{ width: `${Math.min(((event.registeredCount || 0) / event.capacity) * 100, 100)}%` }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {errors.event && <p className="text-xs text-[#D32F2F] mt-1">{errors.event}</p>}
              </div>

              {/* Divider */}
              {selectedEvent && (
                <div className="border-t border-gray-100 pt-5">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Your Details</p>
                </div>
              )}

              {/* Name */}
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
                {errors.fullName && <p className="text-xs text-[#D32F2F] mt-1">{errors.fullName}</p>}
              </div>

              {/* Email + Phone row */}
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
                  {errors.email && <p className="text-xs text-[#D32F2F] mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Phone className="size-3.5" />
                    Phone <span className="text-[#D32F2F]">*</span>
                  </label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="+234 800 000 0000"
                    className="rounded-xl border-gray-200 h-11 focus:border-[#4A148C]/30"
                  />
                  {errors.phone && <p className="text-xs text-[#D32F2F] mt-1">{errors.phone}</p>}
                </div>
              </div>

              {/* Church + Guests row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Church className="size-3.5" />
                    Home Church (optional)
                  </label>
                  <Input
                    value={formData.church}
                    onChange={(e) => handleChange("church", e.target.value)}
                    placeholder="Your parish name"
                    className="rounded-xl border-gray-200 h-11 focus:border-[#4A148C]/30"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Users className="size-3.5" />
                    Additional Guests
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="10"
                    value={formData.additionalGuests}
                    onChange={(e) => handleChange("additionalGuests", e.target.value)}
                    className="rounded-xl border-gray-200 h-11 focus:border-[#4A148C]/30"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">Max 10 additional guests</p>
                </div>
              </div>

              {/* Special needs */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Special Needs / Dietary Requirements
                </label>
                <Textarea
                  value={formData.specialNeeds}
                  onChange={(e) => handleChange("specialNeeds", e.target.value)}
                  placeholder="E.g., wheelchair access, vegetarian meals, hearing impairment..."
                  rows={3}
                  className="rounded-xl border-gray-200 focus:border-[#4A148C]/30 resize-none"
                />
              </div>

              {/* Privacy */}
              <div className="flex items-start gap-2 text-[11px] text-gray-400">
                <Shield className="size-3.5 mt-0.5 shrink-0" />
                <p>Your information is confidential and will only be used for event registration and communication. We do not share your data with third parties.</p>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#D32F2F] hover:bg-[#B71C1C] text-white rounded-xl h-12 text-base font-semibold"
              >
                {submitting ? "Registering..." : "Register Now"}
              </Button>
            </form>
          </div>
        </div>

        {/* Sidebar info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Selected event details */}
          {selectedEvent ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-28">
              <h3 className="text-sm font-bold text-[#4A148C] mb-4">Event Details</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-bold text-gray-800 text-base mb-1">{selectedEvent.title}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{selectedEvent.description}</p>
                </div>
                <div className="pt-3 border-t border-gray-50 space-y-2.5">
                  <div className="flex items-start gap-2.5 text-xs">
                    <Calendar className="size-4 text-[#D32F2F] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-gray-400">Date</p>
                      <p className="text-gray-700 font-medium">
                        {new Date(selectedEvent.date + "T00:00:00").toLocaleDateString("en-NG", {
                          weekday: "long", month: "long", day: "numeric", year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs">
                    <Clock className="size-4 text-[#D32F2F] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-gray-400">Time</p>
                      <p className="text-gray-700 font-medium">
                        {formatTime(selectedEvent.time)}
                        {selectedEvent.endTime ? ` — ${formatTime(selectedEvent.endTime)}` : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs">
                    <MapPin className="size-4 text-[#D32F2F] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-gray-400">Venue</p>
                      <p className="text-gray-700 font-medium">{selectedEvent.venue}</p>
                    </div>
                  </div>
                  {selectedEvent.capacity && (
                    <div className="flex items-start gap-2.5 text-xs">
                      <Users className="size-4 text-[#D32F2F] shrink-0 mt-0.5" />
                      <div>
                        <p className="text-gray-400">Capacity</p>
                        <p className="text-gray-700 font-medium">
                          {selectedEvent.registeredCount || 0} / {selectedEvent.capacity} registered
                        </p>
                        <p className="text-[#2E7D32] font-medium mt-0.5">
                          {selectedEvent.capacity - (selectedEvent.registeredCount || 0)} spots remaining
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center sticky top-28">
              <div className="w-16 h-16 rounded-2xl bg-[#F3E5F5] flex items-center justify-center mx-auto mb-4">
                <Calendar className="size-7 text-[#4A148C]/40" />
              </div>
              <h3 className="text-sm font-bold text-gray-700 mb-1">Select an Event</h3>
              <p className="text-xs text-gray-400">Choose an event from the list on the left to see its details here and complete your registration.</p>
            </div>
          )}

          {/* Need help? */}
          <div className="bg-[#F8FAFF] rounded-xl p-5">
            <h4 className="text-sm font-bold text-[#4A148C] mb-2">Need Help?</h4>
            <p className="text-xs text-gray-500 leading-relaxed mb-3">
              If you have any questions about an event or need assistance with registration, please contact us.
            </p>
            <Button asChild variant="outline" size="sm" className="w-full border-[#4A148C]/20 text-[#4A148C] hover:bg-[#F3E5F5] rounded-lg text-xs">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}