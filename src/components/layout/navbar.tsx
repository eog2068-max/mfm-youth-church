"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Radio,
  Footprints,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ──────────────────────────────────────────────────────────────
// Slim Navbar: Logo | DailyWalk | Donations | Watch Live
// Hamburger menu extracted to hamburger-menu.tsx
// ──────────────────────────────────────────────────────────────

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 20);
  }, []);

  useEffect(() => {
    setMounted(true);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <header
      suppressHydrationWarning
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        mounted && scrolled
          ? "bg-[#1A0033]/95 backdrop-blur-xl shadow-lg shadow-black/10 border-b border-white/10"
          : "bg-[#F3E5F5]/70 backdrop-blur-md border-b border-white/30"
      )}
    >
      <nav className="max-w-7xl mx-auto pl-3 sm:pl-4 pr-3 sm:pr-4 lg:pr-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* ── 1. Logo (extreme left, tighter padding) ── */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="relative h-10 w-10 md:h-12 md:w-12 rounded-full bg-white/90 p-0.5 shadow-md">
              <Image
                src="/mfm-logo.png"
                alt="Mountain of Fire and Miracles Ministries"
                fill
                sizes="40px"
                className="object-contain"
                priority
              />
            </div>
            <div className="hidden lg:block">
              <p
                className={cn(
                  "text-sm font-bold leading-tight transition-colors",
                  mounted && scrolled
                    ? "text-white"
                    : "text-[#4A148C]/90"
                )}
              >
                Mountain of Fire and Miracles Ministries
              </p>
              <p
                className={cn(
                  "text-xs leading-tight transition-colors",
                  mounted && scrolled
                    ? "text-purple-200/80"
                    : "text-gray-600"
                )}
              >
                (Youth Church)
              </p>
            </div>
          </Link>

          {/* ── 2-4. Action buttons (right side) ── */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* 2. DailyWalk — red button matching Donations/Watch Live style */}
            <Button
              asChild
              className="inline-flex items-center gap-1.5 bg-[#D32F2F] hover:bg-[#B71C1C] text-white rounded-lg px-2 sm:px-2.5 py-1 h-8 sm:h-9 font-semibold shadow-md text-xs"
            >
              <Link href="/dailywalk" className="flex items-center gap-1.5">
                <Footprints className="size-3.5" />
                <span className="hidden xs:inline">DailyWalk</span>
              </Link>
            </Button>

            {/* 3. Donations */}
            <Link
              href="/giving"
              className="inline-flex items-center bg-[#D32F2F] hover:bg-[#B71C1C] text-white rounded-lg pl-1 pr-2 h-8 sm:h-9 shadow-md transition-colors"
            >
              <svg width="26" height="33" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 self-start mt-[1px]" aria-hidden="true">
                <path d="M12 3c-1 0-1.5.5-1.5 1.5V6L8 8.5C6.5 10 6 12 6 14c0 3.5 2.5 6 6 6s6-2.5 6-6c0-2-.5-4-2-5.5L13.5 6V4.5C13.5 3.5 13 3 12 3z" />
                <path d="M10 6h4" strokeWidth="1.4" />
                <path d="M12 10.5v6" strokeWidth="1.4" strokeLinecap="round" />
                <path d="M10.5 12 C10.5 10.5 13.5 10.5 13.5 12" strokeWidth="1.4" strokeLinecap="round" fill="none" />
                <path d="M13.5 14 C13.5 15.5 10.5 15.5 10.5 14" strokeWidth="1.4" strokeLinecap="round" fill="none" />
              </svg>
              <span className="flex flex-col items-center justify-center leading-[1.15]">
                <span className="text-[10px] sm:text-[11px] font-extrabold tracking-wider uppercase text-white">
                  Donations
                </span>
                <span className="text-[8px] sm:text-[9px] font-normal tracking-wide text-white">
                  Give To The Lord
                </span>
              </span>
            </Link>

            {/* 4. Watch Live */}
            <Button
              asChild
              className="inline-flex items-center gap-1.5 bg-[#D32F2F] hover:bg-[#B71C1C] text-white rounded-lg px-2 sm:px-2.5 py-1 h-8 sm:h-9 font-semibold shadow-md text-xs"
            >
              <Link href="/live" className="flex items-center gap-1.5">
                <Radio className="size-3.5" />
                <span>Watch Live</span>
              </Link>
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
}
