"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
  Radio,
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

// ──────────────────────────────────────────────────────────────
// Menu data structures
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

// ──────────────────────────────────────────────────────────────
// Hamburger menu — four categorized sections
// (Moved from navbar.tsx — all data and behavior preserved verbatim)
// ──────────────────────────────────────────────────────────────

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
// Collapsible category component
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
// Exported HamburgerMenu component
// ──────────────────────────────────────────────────────────────

export function HamburgerMenu({ iconColor = "black" }: { iconColor?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const close = useCallback(() => setOpen(false), []);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          className="p-2 rounded-lg hover:bg-black/5 transition-all duration-200 group"
          aria-label="Open menu"
        >
          <Menu className={cn("size-8 group-hover:scale-110 transition-transform", iconColor === "white" ? "text-white hover:bg-white/10" : "text-black hover:bg-black/5")} />
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
              onClose={close}
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
            <Link href="/live" onClick={close}>
              <Radio className="size-4" />
              Watch Live
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
