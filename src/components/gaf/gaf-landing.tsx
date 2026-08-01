"use client";

/**
 * GafLanding — public landing page content for Go-A-Fishing.
 *
 * Explains the program, links to login / dashboard.
 *
 * Stage 4 of Go-A-Fishing.
 */
import Link from "next/link";
import { motion } from "framer-motion";
import { Fish, Heart, Users, Trophy, ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionWrapper, SectionTitle } from "@/components/home/section-wrapper";

const SCRIPTURE = {
  text: "And He said to them, 'Follow Me, and I will make you fishers of men.'",
  ref: "Matthew 4:19",
};

const PILLARS = [
  {
    icon: Fish,
    title: "Fish",
    description:
      "Share your personal referral link or QR code with someone who doesn't yet know Christ. Pray for them by name as you reach out.",
    color: "from-purple-500 to-purple-700",
  },
  {
    icon: Heart,
    title: "Follow Up",
    description:
      "When they attend a service for the first time, your referral is automatically credited. Continue praying and walking with them.",
    color: "from-rose-500 to-rose-700",
  },
  {
    icon: Users,
    title: "Disciple",
    description:
      "As they progress — attending, getting saved, baptized, becoming a member — you accumulate gospel-labor points toward quarterly awards.",
    color: "from-amber-500 to-amber-700",
  },
  {
    icon: Trophy,
    title: "Reward",
    description:
      "Each quarter, top soul-winners are publicly recognized. Pastoral commendations are also given year-round for faithful labor.",
    color: "from-emerald-500 to-emerald-700",
  },
];

const STATS = [
  { label: "Statuses tracked", value: "5", caption: "invited → member" },
  { label: "Quarterly cycles", value: "4", caption: "per year" },
  { label: "Award categories", value: "Multiple", caption: "configurable" },
  { label: "Point weights", value: "1-50", caption: "per progression" },
];

export function GafLanding() {
  return (
    <>
      {/* Hero / Scripture */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-[#F3E5F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionWrapper className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#4A148C]/10 text-[#4A148C] rounded-full text-sm font-medium mb-6"
            >
              <Fish className="size-4" />
              Evangelism &amp; Soul-Winning Program
            </motion.div>

            <blockquote className="mb-8">
              <p className="text-2xl md:text-3xl font-serif text-[#4A148C] leading-relaxed italic">
                &ldquo;{SCRIPTURE.text}&rdquo;
              </p>
              <footer className="mt-3 text-sm font-semibold text-[#D32F2F]">
                — {SCRIPTURE.ref}
              </footer>
            </blockquote>

            <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-8">
              Jesus called every believer to be a fisher of men. Go-A-Fishing is
              our church-wide evangelism movement that equips you with the tools,
              tracks your gospel labor, and celebrates every soul won into the
              Kingdom. Join us as we obey the Great Commission together.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Button
                asChild
                size="lg"
                className="bg-[#4A148C] hover:bg-[#1A0033] text-white rounded-xl"
              >
                <Link href="/go-a-fishing/login">
                  Get Started
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-xl border-[#4A148C]/30"
              >
                <Link href="/go-a-fishing/leaderboard">View Leaderboard</Link>
              </Button>
            </div>
          </SectionWrapper>
        </div>
      </section>

      {/* Four Pillars */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="How It Works"
            subtitle="Four simple steps from invitation to eternal reward"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PILLARS.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <SectionWrapper key={pillar.title}>
                  <Card className="h-full border-0 shadow-md hover:shadow-xl transition-shadow">
                    <CardContent className="p-6 text-center">
                      <div
                        className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${pillar.color} text-white mb-4`}
                      >
                        <Icon className="size-8" />
                      </div>
                      <div className="text-xs text-gray-400 font-mono mb-2">
                        STEP {idx + 1}
                      </div>
                      <h3 className="text-xl font-bold text-[#4A148C] mb-2">
                        {pillar.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {pillar.description}
                      </p>
                    </CardContent>
                  </Card>
                </SectionWrapper>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-[#4A148C] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white">
                  {stat.value}
                </div>
                <div className="text-sm text-purple-200 mt-1">{stat.label}</div>
                <div className="text-xs text-purple-300/70 mt-0.5">
                  {stat.caption}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-[#1A0033] via-[#4A148C] to-[#4A148C] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionWrapper>
            <BookOpen className="size-12 mx-auto mb-6 text-amber-400" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              &ldquo;The fruit of the righteous is a tree of life, and he who
              wins souls is wise.&rdquo;
            </h2>
            <p className="text-purple-200 mb-2">— Proverbs 11:30</p>
            <p className="text-purple-100/80 leading-relaxed mb-8 max-w-2xl mx-auto">
              Every soul matters to God. Every invitation matters for eternity.
              Will you join the fishing expedition?
            </p>
            <Button
              asChild
              size="lg"
              className="bg-[#D32F2F] hover:bg-[#B71C1C] text-white rounded-xl"
            >
              <Link href="/go-a-fishing/login">
                Become a Fisher
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </SectionWrapper>
        </div>
      </section>
    </>
  );
}
