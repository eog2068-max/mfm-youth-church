"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Radio,
  Footprints,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HamburgerMenu } from "./hamburger-menu";

// ──────────────────────────────────────────────────────────────
// Navbar: DailyWalk | Donations | Watch Live (centered)
// Hamburger: fixed below navbar on non-home pages
// ──────────────────────────────────────────────────────────────

/** Pick a hamburger icon color that contrasts with the page background */
function getHamburgerColor(pathname: string): string {
  if (pathname.startsWith("/live")) return "white";
  return "black";
}

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  const hamburgerColor = useMemo(() => getHamburgerColor(pathname), [pathname]);

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
    <>
      <header
        suppressHydrationWarning
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          mounted && scrolled
            ? "bg-[#1A0033]/95 backdrop-blur-xl shadow-lg shadow-black/10 border-b border-white/10"
            : "bg-[#F3E5F5]/70 backdrop-blur-md border-b border-white/30"
        )}
      >
        <nav className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* ── 3 Action buttons (centered with equal gaps) ── */}
            <div className="flex items-center gap-2 sm:gap-3 mx-auto">
              {/* 1. DailyWalk */}
              <Button
                asChild
                className="inline-flex items-center gap-1 bg-[#D32F2F] hover:bg-[#B71C1C] text-white rounded-sm px-2 sm:px-3 py-1 h-8 sm:h-9 font-semibold shadow-md text-xs"
              >
                <Link href="/dailywalk" className="flex items-center gap-1">
                  <Footprints className="size-3.5" />
                  <span>DailyWalk</span>
                </Link>
              </Button>

              {/* 2. Donations */}
              <Link
                href="/giving"
                className="inline-flex items-center bg-[#D32F2F] hover:bg-[#B71C1C] text-white rounded-sm pl-1 pr-2 sm:pr-3 h-8 sm:h-9 shadow-md transition-colors"
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
                  <span className="text-[8px] sm:text-[9px] font-normal tracking-wide text-white whitespace-nowrap">
                    Give To The Lord
                  </span>
                </span>
              </Link>

              {/* 3. Watch Live */}
              <Button
                asChild
                className="inline-flex items-center gap-1 bg-[#D32F2F] hover:bg-[#B71C1C] text-white rounded-sm px-2 sm:px-2.5 py-1 h-8 sm:h-9 font-semibold shadow-md text-xs"
              >
                <Link href="/live" className="flex items-center gap-1">
                  <Radio className="size-3.5" />
                  <span>Watch Live</span>
                </Link>
              </Button>
            </div>
          </div>
        </nav>
      </header>

      {/* ── Hamburger: fixed below navbar, top-right of page body (non-home only) ── */}
      {!isHome && (
        <div className="fixed top-16 md:top-20 right-2 sm:right-4 z-40">
          <HamburgerMenu iconColor={hamburgerColor} />
        </div>
      )}
    </>
  );
}
