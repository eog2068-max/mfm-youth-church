"use client";

import { useState, useEffect } from "react";
import { FeatureLandingPage } from "@/components/social/feature-landing-page";
import { TodaysQuestion } from "@/components/social/todays-question";
import { socialFeatures } from "@/components/social/social-data";

export default function TodaysQuestionPage() {
  const [entered, setEntered] = useState(false);

  // PERMANENT scroll-to-top — use behavior:'instant' to bypass
  // globals.css `html { scroll-behavior: smooth }` which was animating
  // window.scrollTo(0,0) and landing mid-page.
  useEffect(() => {
    if (!entered) return;
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    const scrollToTop = () => {
      try {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
      } catch {
        window.scrollTo(0, 0);
      }
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };
    scrollToTop();
    const raf = requestAnimationFrame(scrollToTop);
    const t1 = setTimeout(scrollToTop, 50);
    const t2 = setTimeout(scrollToTop, 200);
    const t3 = setTimeout(scrollToTop, 500);
    const t4 = setTimeout(scrollToTop, 1000);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [entered]);

  if (entered) return <TodaysQuestion />;

  const feature = socialFeatures.find((f) => f.id === "todays-question")!;

  return (
    <FeatureLandingPage feature={feature} onEnter={() => setEntered(true)}>
      {/* Sample question types preview */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mb-2">
        <p className="text-xs font-semibold text-[#4A148C] mb-3">
          Example Questions You Might See:
        </p>
        <div className="space-y-2">
          {[
            '"What Scripture has been speaking to you this week?"',
            '"How did you experience God\'s faithfulness today?"',
            '"What\'s one thing you\'re grateful for right now?"',
            '"How can we be praying for you this week?"',
          ].map((q, i) => (
            <div
              key={i}
              className="flex items-start gap-2 text-xs text-gray-600"
            >
              <span className="text-sm mt-0.5 text-[#2E7D32] font-bold">Q</span>
              <p className="italic leading-relaxed">{q}</p>
            </div>
          ))}
        </div>
      </div>
    </FeatureLandingPage>
  );
}
