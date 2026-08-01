"use client";

/**
 * GafOnboardingGuide — step-by-step onboarding card shown to new members.
 *
 * Appears on the dashboard when the member has no referrals yet (first visit).
 * Walks through 4 key steps: Share Your Link, Track Referrals, Log Outreach,
 * Earn Awards. Dismissible with localStorage persistence.
 *
 * Stage 12 of Go-A-Fishing.
 */
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Fish,
  Share2,
  Users,
  MapPin,
  Trophy,
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface GafOnboardingGuideProps {
  memberName: string;
  referralCode: string;
  /** Show only if member has zero referrals. */
  hasReferrals: boolean;
}

const STEPS = [
  {
    icon: Share2,
    title: "Share Your Link",
    description:
      "Your personal referral link is ready! Share it via WhatsApp, email, social media, or as a QR code. Every visitor who taps your link is automatically tracked to your account.",
    color: "from-purple-500 to-purple-700",
    action: { label: "Go to Dashboard", href: "/go-a-fishing/dashboard" },
  },
  {
    icon: Fish,
    title: "Track Your Referrals",
    description:
      "When someone visits via your link and attends a service, they appear in your referral list. Update their status as they progress: invited → attended → saved → baptized → member.",
    color: "from-rose-500 to-rose-700",
    action: { label: "My Referrals", href: "/go-a-fishing/my-referrals" },
  },
  {
    icon: MapPin,
    title: "Log Outreach Activities",
    description:
      "Record your evangelism activities: door-to-door, street preaching, hospital visits, phone calls, and more. Every outreach counts toward your gospel-labor score.",
    color: "from-emerald-500 to-emerald-700",
    action: { label: "My Outreach", href: "/go-a-fishing/my-outreach" },
  },
  {
    icon: Trophy,
    title: "Earn Awards & Recognition",
    description:
      "Top performers in quarterly cycles earn awards and pastoral commendations. Check the leaderboard to see your ranking and aim higher each quarter!",
    color: "from-amber-500 to-amber-700",
    action: { label: "Leaderboard", href: "/go-a-fishing/leaderboard" },
  },
];

const STORAGE_KEY = "gaf_onboarding_dismissed";

export function GafOnboardingGuide({
  memberName,
  hasReferrals,
}: GafOnboardingGuideProps) {
  const [dismissed, setDismissed] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Only show if not previously dismissed and member has no referrals.
    if (hasReferrals) return;
    try {
      const wasDismissed = localStorage.getItem(STORAGE_KEY);
      if (!wasDismissed) {
        setDismissed(false);
      }
    } catch {
      // localStorage not available — don't show.
    }
  }, [hasReferrals]);

  if (dismissed || hasReferrals) return null;

  const handleDismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // Ignore.
    }
    setDismissed(true);
  };

  const step = STEPS[currentStep];
  const Icon = step.icon;
  const isLast = currentStep === STEPS.length - 1;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <Card className="border-0 shadow-lg overflow-hidden">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-[#4A148C] to-[#1A0033] px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-10 rounded-xl bg-white/15">
                <Sparkles className="size-5 text-amber-300" />
              </div>
              <div>
                <h3 className="text-white font-semibold">
                  Welcome to Go-A-Fishing, {memberName.split(" ")[0]}!
                </h3>
                <p className="text-purple-200 text-xs">
                  Quick start guide — {currentStep + 1} of {STEPS.length}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDismiss}
              className="text-white/60 hover:text-white hover:bg-white/10"
            >
              <X className="size-4" />
            </Button>
          </div>

          {/* Progress dots */}
          <div className="px-6 py-2 bg-gray-50 flex items-center gap-2">
            {STEPS.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 flex-1 rounded-full transition-all ${
                  idx <= currentStep
                    ? "bg-[#4A148C]"
                    : "bg-gray-200"
                }`}
              />
            ))}
          </div>

          {/* Step content */}
          <div className="p-6 text-center">
            <div
              className={`inline-flex items-center justify-center size-16 rounded-2xl bg-gradient-to-br ${step.color} text-white mb-4`}
            >
              <Icon className="size-8" />
            </div>
            <h4 className="text-xl font-bold text-[#4A148C] mb-2">
              {step.title}
            </h4>
            <p className="text-sm text-gray-600 leading-relaxed max-w-md mx-auto">
              {step.description}
            </p>
          </div>

          {/* Actions */}
          <div className="px-6 pb-6 flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="gap-1"
            >
              <ChevronLeft className="size-4" />
              Back
            </Button>

            <div className="flex items-center gap-2">
              {isLast ? (
                <Button
                  onClick={handleDismiss}
                  className="gap-2 bg-[#4A148C] hover:bg-[#1A0033] text-white rounded-xl"
                >
                  <CheckCircle className="size-4" />
                  Get Started!
                </Button>
              ) : (
                <>
                  <Button
                    asChild
                    variant="outline"
                    className="rounded-xl"
                  >
                    <Link href={step.action.href}>
                      {step.action.label}
                    </Link>
                  </Button>
                  <Button
                    onClick={() =>
                      setCurrentStep(Math.min(STEPS.length - 1, currentStep + 1))
                    }
                    className="gap-1 bg-[#4A148C] hover:bg-[#1A0033] text-white rounded-xl"
                  >
                    Next
                    <ChevronRight className="size-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
