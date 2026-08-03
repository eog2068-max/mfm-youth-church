"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
  Radio,
  Heart,
  Fish,
  MessageCircle,
  HandHeart,
  HelpCircle,
  Sparkles,
  MonitorPlay,
  Megaphone,
  CalendarDays,
  BookOpen,
  Mic,
  Music,
  Building2,
  Film,
  Camera,
  Users,
  Gift,
  Star,
  Mail,
  Info,
  UserCog,
  Tv,
  LayoutDashboard,
  Link2,
  MapPin,
  User,
  Bell,
  Trophy,
  ChevronDown,
  ChevronUp,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// ──────────────────────────────────────────────────────────────
// Desktop top-level nav (kept lean — detailed nav lives in hamburger)
// ──────────────────────────────────────────────────────────────
const desktopNavItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
];

// ──────────────────────────────────────────────────────────────
// Explore dropdown items (CMS / ORGANIZE)
// ──────────────────────────────────────────────────────────────
const exploreDropdownItems = [
  { label: "Announcements", href: "/announcements", icon: Megaphone },
  { label: "Events", href: "/events", icon: CalendarDays },
  { label: "Devotionals", href: "/devotionals", icon: BookOpen },
  { label: "Sermons", href: "/sermons", icon: Mic },
  { label: "Prayer Requests", href: "/prayer", icon: HandHeart },
  { label: "Giving", href: "/giving", icon: Gift },
  { label: "Testimonies", href: "/testimonies", icon: Star },
  { label: "Contact", href: "/contact", icon: Mail },
];

// ──────────────────────────────────────────────────────────────
// Hamburger menu — four categorized sections
// ──────────────────────────────────────────────────────────────

interface MenuItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

interface MenuCategory {
  id: string;
  title: string;
  subtitle: string;
  purposeTag?: string;
  quote?: string;
  headerLink?: string;
  color: {
    headerBg: string;
    accentBar: string;
    accentText: string;
    ctaBg: string;
    ctaHover: string;
    iconBg: string;
    iconText: string;
    itemActiveBg: string;
    itemActiveText: string;
  };
  items: MenuItem[];
  cta?: { label: string; href: string };
}

const menuCategories: MenuCategory[] = [
  // ── YOUTHCONNECT SOCIAL ──
  {
    id: "youth-connect-social",
    title: "YouthConnect",
    subtitle: "To Youth Home",
    headerLink: "/social",
    color: {
      headerBg: "bg-[#C62828]",
      accentBar: "bg-[#C62828]",
      accentText: "text-white",
      ctaBg: "bg-[#C62828]",
      ctaHover: "hover:bg-[#B71C1C]",
      iconBg: "bg-red-100",
      iconText: "text-[#C62828]",
      itemActiveBg: "bg-red-50",
      itemActiveText: "text-[#C62828]",
    },
    items: [
      { label: "FamilyChat", href: "/social/family-chat", icon: MessageCircle },
      { label: "Prayer Circle", href: "/social/prayer-circle", icon: HandHeart },
      { label: "Today's Question", href: "/social/todays-question", icon: HelpCircle },
      { label: "Amen Wall", href: "/social/amen-wall", icon: Sparkles },
      { label: "Live Together", href: "/social/live-together", icon: MonitorPlay },
    ],
  },

  // ── CHURCH MANAGEMENT SYSTEM ──
  {
    id: "church-management",
    title: "Church Management System",
    subtitle: "To CMS Home",
    headerLink: "/cms",
    color: {
      headerBg: "bg-[#4A148C]",
      accentBar: "bg-[#4A148C]",
      accentText: "text-white",
      ctaBg: "bg-[#4A148C]",
      ctaHover: "hover:bg-[#1A0033]",
      iconBg: "bg-purple-100",
      iconText: "text-[#4A148C]",
      itemActiveBg: "bg-purple-50",
      itemActiveText: "text-[#4A148C]",
    },
    items: [
      { label: "Announcements", href: "/announcements", icon: Megaphone },
      { label: "Events & Registration", href: "/events", icon: CalendarDays },
      { label: "Devotionals", href: "/devotionals", icon: BookOpen },
      { label: "Sermons", href: "/sermons", icon: Mic },
      { label: "Prayer Requests", href: "/prayer", icon: HandHeart },
      { label: "Ministries", href: "/join-ministry", icon: Music },
      { label: "Departments", href: "/departments", icon: Building2 },
      { label: "Church Media", href: "/media", icon: Film },
      { label: "Photo Gallery", href: "/gallery", icon: Camera },
      { label: "Member Gallery", href: "/members", icon: Users },
      { label: "Giving", href: "/giving", icon: Gift },
      { label: "Testimonies", href: "/testimonies", icon: Star },
      { label: "Contact", href: "/contact", icon: Mail },
    ],
  },

  // ── GO-A-FISHING ──
  {
    id: "go-a-fishing",
    title: "Go-A-Fishing",
    subtitle: "To GAF Home",
    headerLink: "/go-a-fishing",
    color: {
      headerBg: "bg-[#7B1FA2]",
      accentBar: "bg-[#7B1FA2]",
      accentText: "text-white",
      ctaBg: "bg-[#7B1FA2]",
      ctaHover: "hover:bg-[#4A148C]",
      iconBg: "bg-purple-100",
      iconText: "text-[#7B1FA2]",
      itemActiveBg: "bg-purple-50",
      itemActiveText: "text-[#7B1FA2]",
    },
    items: [
      { label: "My Dashboard", href: "/go-a-fishing/dashboard", icon: LayoutDashboard },
      { label: "My Referrals", href: "/go-a-fishing/my-referrals", icon: Link2 },
      { label: "My Outreach", href: "/go-a-fishing/my-outreach", icon: MapPin },
      { label: "Leaderboard", href: "/go-a-fishing/leaderboard", icon: Trophy },
      { label: "Awards & Recognition", href: "/go-a-fishing/awards", icon: Star },
      { label: "Profile", href: "/go-a-fishing/profile", icon: User },
      { label: "Notifications", href: "/go-a-fishing/notifications", icon: Bell },
    ],
  },

  // ── CHURCH INFORMATION ──
  {
    id: "general",
    title: "Church Information",
    subtitle: "To About",
    headerLink: "/about",
    color: {
      headerBg: "bg-[#4B5563]",
      accentBar: "bg-[#4B5563]",
      accentText: "text-white",
      ctaBg: "bg-[#4B5563]",
      ctaHover: "hover:bg-[#374151]",
      iconBg: "bg-gray-100",
      iconText: "text-[#4B5563]",
      itemActiveBg: "bg-gray-50",
      itemActiveText: "text-[#4B5563]",
    },
    items: [
      { label: "About Us", href: "/about", icon: Info },
      { label: "Leadership", href: "/leadership", icon: UserCog },
      { label: "Watch Live", href: "/live", icon: Tv },
    ],
  },
];

// ──────────────────────────────────────────────────────────────
// Collapsible category component for the hamburger menu
// ──────────────────────────────────────────────────────────────
function MenuCategorySection({
  category,
  pathname,
  onClose,
  defaultOpen = false,
}: {
  category: MenuCategory;
  pathname: string;
  onClose: () => void;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const isAnyItemActive = category.items.some(
    (item) => pathname === item.href
  );

  return (
    <div className="rounded-xl overflow-hidden border border-gray-100">
      {/* Category header */}
      {category.headerLink ? (
        <div className={cn("px-4 py-3", category.color.headerBg)}>
          <p className={cn("text-sm font-bold text-center", category.color.accentText)}>
            {category.title}
          </p>
          <div className="flex items-center justify-center gap-2 mt-0.5">
            <Link
              href={category.headerLink}
              onClick={onClose}
              className="text-[10px] text-white/70 truncate"
            >
              {category.subtitle}
            </Link>
            <span className="text-[10px] text-white/40">|</span>
            <Link
              href="/"
              onClick={onClose}
              className="text-[10px] text-white/70 shrink-0"
            >
              To App Home
            </Link>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(!open)}
          className={cn(
            "w-full flex items-center justify-between px-3 py-2.5 text-left transition-colors",
            category.color.headerBg
          )}
        >
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div
                className={cn("h-0.5 w-4 rounded-full", category.color.accentBar)}
              />
              <span
                className={cn(
                  "text-xs font-bold tracking-wider",
                  category.color.accentText
                )}
              >
                {category.title}
              </span>
              {isAnyItemActive && (
                <span className="h-1.5 w-1.5 rounded-full bg-[#D32F2F]" />
              )}
            </div>
            <p className="text-[10px] text-gray-500 mt-0.5 ml-6 truncate">
              {category.subtitle}
            </p>
            {category.quote && (
              <p className="text-[10px] italic text-gray-400 mt-0.5 ml-6 truncate">
                &ldquo;{category.quote}&rdquo;
              </p>
            )}
          </div>
          {open ? (
            <ChevronUp className="size-4 text-gray-400 shrink-0" />
          ) : (
            <ChevronDown className="size-4 text-gray-400 shrink-0" />
          )}
        </button>
      )}

      {/* Category items */}
      {open && (
        <div className="bg-white">
          {category.headerLink ? null : (
            <div className={cn("h-0.5 w-full", category.color.accentBar)} />
          )}
          <div className="flex flex-col">
            {category.items.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 text-sm transition-colors",
                    isActive
                      ? cn(
                          "font-semibold",
                          category.color.itemActiveBg,
                          category.color.itemActiveText
                        )
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <div
                    className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center shrink-0",
                      isActive
                        ? cn(category.color.iconBg)
                        : "bg-gray-50"
                    )}
                  >
                    <Icon
                      className={cn(
                        "size-3.5",
                        isActive
                          ? category.color.iconText
                          : "text-gray-400"
                      )}
                    />
                  </div>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Category CTA */}
          {category.cta && (
            <div className="px-3 pb-3 pt-2">
              <Button
                asChild
                className={cn(
                  "w-full text-white rounded-xl text-xs font-bold tracking-wide py-2.5",
                  category.color.ctaBg,
                  category.color.ctaHover
                )}
              >
                <Link href={category.cta.href} onClick={onClose}>
                  {category.cta.label}
                </Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Main Navbar component
// ──────────────────────────────────────────────────────────────
export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

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
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo + Church Name */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
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

          {/* Desktop Nav Links — lean set, detailed nav in hamburger */}
          <div className="hidden xl:flex items-center gap-1">
            {desktopNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  mounted && scrolled
                    ? pathname === item.href
                      ? "text-white bg-white/20 font-semibold"
                      : "text-purple-100/80 hover:text-white hover:bg-white/10"
                    : pathname === item.href
                      ? "text-[#4A148C] bg-[#4A148C]/10 font-semibold"
                      : "text-gray-600 hover:text-[#4A148C] hover:bg-[#4A148C]/5"
                )}
              >
                {item.label}
              </Link>
            ))}

            {/* Explore dropdown (CMS / ORGANIZE) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={cn(
                    "flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors outline-none",
                    mounted && scrolled
                      ? "text-purple-100/80 hover:text-white hover:bg-white/10"
                      : "text-gray-600 hover:text-[#4A148C] hover:bg-[#4A148C]/5"
                  )}
                >
                  Explore
                  <ChevronDown className="size-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                sideOffset={8}
                alignOffset={-10}
                className={cn(
                  "w-56 rounded-xl p-1.5 data-[side=bottom]:animate-in data-[side=bottom]:fade-in-0 data-[side=bottom]:zoom-in-95",
                  mounted && scrolled
                    ? "bg-[#1A0033]/95 backdrop-blur-xl border-white/10"
                    : "bg-white border-gray-200 shadow-lg"
                )}
              >
                <DropdownMenuLabel
                  className={cn(
                    "px-2.5 py-2",
                    mounted && scrolled
                      ? "text-purple-100/80"
                      : "text-gray-500"
                  )}
                >
                  <div className="text-xs font-bold tracking-wider">Church Management System</div>
                  <div className="text-[10px] font-normal mt-0.5">Everything in one place</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator
                  className={cn(
                    mounted && scrolled ? "bg-white/10" : "bg-gray-100"
                  )}
                />
                {exploreDropdownItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm cursor-pointer transition-colors",
                          mounted && scrolled
                            ? cn(
                                pathname === item.href
                                  ? "text-white bg-white/15 font-semibold"
                                  : "text-purple-100/80 hover:text-white hover:bg-white/10"
                              )
                            : cn(
                                pathname === item.href
                                  ? "text-[#4A148C] bg-[#4A148C]/10 font-semibold"
                                  : "text-gray-600 hover:text-[#4A148C] hover:bg-[#4A148C]/5"
                              )
                        )}
                      >
                        <Icon className="size-4 shrink-0" />
                        {item.label}
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
                <DropdownMenuSeparator
                  className={cn(
                    mounted && scrolled ? "bg-white/10" : "bg-gray-100"
                  )}
                />
                <DropdownMenuItem asChild>
                  <Link
                    href="/announcements"
                    className={cn(
                      "flex items-center justify-between gap-2.5 px-2.5 py-2 rounded-lg text-sm cursor-pointer transition-colors",
                      mounted && scrolled
                        ? "text-[#CE93D8] hover:text-white hover:bg-white/10"
                        : "text-[#4A148C] hover:text-[#1A0033] hover:bg-[#4A148C]/5"
                    )}
                  >
                    View All
                    <ArrowRight className="size-3.5" />
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Right side: Mobile Hamburger + Watch Live before it */}
          <div className="flex items-center gap-2">
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

            {/* Watch Live — icon + text always visible together, shorter height */}
            <Button
              asChild
              className="inline-flex items-center gap-1.5 bg-[#D32F2F] hover:bg-[#B71C1C] text-white rounded-lg px-2.5 py-1 h-8 sm:h-9 font-semibold shadow-md text-xs"
            >
              <Link href="/live" className="flex items-center gap-1.5">
                <Radio className="size-3.5" />
                <span>Watch Live</span>
              </Link>
            </Button>

            {/* Mobile Hamburger — categorized four-section menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <button
                  className={cn(
                    "xl:hidden p-2 rounded-lg transition-colors",
                    mounted && scrolled
                      ? "text-white hover:bg-white/10"
                      : "text-[#4A148C] hover:bg-[#4A148C]/5"
                  )}
                  aria-label="Open menu"
                >
                  <Menu className="size-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 overflow-y-auto p-0">
                {/* Sheet header */}
                <SheetHeader className="px-4 pt-6 pb-4 bg-gradient-to-b from-[#F3E5F5] to-white">
                  <SheetTitle className="text-[#4A148C] flex items-center gap-3">
                    <div className="relative h-8 w-8 rounded-full bg-[#F3E5F5] p-0.5">
                      <Image
                        src="/mfm-logo.png"
                        alt="Mountain of Fire and Miracles Ministries"
                        fill
                        sizes="32px"
                        className="object-contain"
                      />
                    </div>
                    Youth Church
                  </SheetTitle>
                </SheetHeader>

                {/* Categorized menu sections */}
                <div className="flex flex-col gap-10 px-3 pb-4">
                  {menuCategories.map((category, idx) => (
                    <MenuCategorySection
                      key={category.id}
                      category={category}
                      pathname={pathname}
                      onClose={closeMobile}
                      defaultOpen={category.headerLink ? true : idx === 0}
                    />
                  ))}
                </div>

                {/* Persistent Watch Live CTA at bottom */}
                <div className="px-3 pb-6">
                  <Button
                    asChild
                    className="w-full bg-[#D32F2F] hover:bg-[#B71C1C] text-white rounded-xl font-semibold py-3"
                  >
                    <Link href="/live" onClick={closeMobile}>
                      <Radio className="size-4" />
                      Watch Live
                    </Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}
