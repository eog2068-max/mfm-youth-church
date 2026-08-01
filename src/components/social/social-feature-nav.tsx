"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { socialFeatures } from "./social-data";
import { cn } from "@/lib/utils";

interface SocialFeatureNavProps {
  /** The feature ID of the current page (e.g. "family-chat") */
  currentFeatureId: string;
}

/**
 * Bottom navigation bar shown on every YouthConnect feature page.
 * Lets users jump between the 5 social features without going back to /social.
 *
 * Design notes:
 *  - 4 items fit in one row on mobile (375px+) using tight padding + small font.
 *  - Solid bright white vertical bars (bg-white, w-px) separate items.
 *  - Each item is a flex row (emoji + label) that can shrink (min-w-0) so the
 *    first item's emoji is never pushed off-screen.
 */
export function SocialFeatureNav({ currentFeatureId }: SocialFeatureNavProps) {
  const pathname = usePathname();
  const otherFeatures = socialFeatures.filter((f) => f.id !== currentFeatureId);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-[#0B0F3A]/95 backdrop-blur-md border-t border-white/10 safe-area-bottom">
      <div className="max-w-3xl mx-auto py-1">
        <div className="flex items-stretch justify-center">
          {otherFeatures.map((feature, idx) => {
            const isActive = pathname === feature.href;
            return (
              <div
                key={feature.id}
                className="flex items-stretch min-w-0"
              >
                {/* Solid bright white vertical bar between items */}
                {idx > 0 && (
                  <div
                    className="w-px self-stretch bg-white"
                    aria-hidden="true"
                  />
                )}
                <Link
                  href={feature.href}
                  className={cn(
                    "flex items-center gap-0.5 sm:gap-1 px-1 sm:px-2 py-1.5 transition-all duration-200 text-center min-w-0",
                    isActive
                      ? "text-white bg-white/10"
                      : "text-purple-200/70 hover:text-white hover:bg-white/5"
                  )}
                >
                  <span className="text-sm sm:text-base leading-none shrink-0">
                    {feature.emoji}
                  </span>
                  <span className="text-[9px] sm:text-[11px] font-semibold leading-tight whitespace-nowrap truncate">
                    {feature.title}
                  </span>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
