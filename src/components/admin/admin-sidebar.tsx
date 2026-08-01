"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Calendar,
  Megaphone,
  Heart,
  Star,
  MessageSquare,
  Image,
  Settings,
  ChevronLeft,
  Church,
  LogOut,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard,
  Users,
  BookOpen,
  Calendar,
  Megaphone,
  Heart,
  Star,
  MessageSquare,
  Image,
  Settings,
};

interface NavItem {
  label: string;
  icon: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: "Dashboard", icon: "LayoutDashboard", href: "/admin" },
  { label: "Members", icon: "Users", href: "/admin/members" },
  { label: "Sermons", icon: "BookOpen", href: "/admin/sermons" },
  { label: "Events", icon: "Calendar", href: "/admin/events" },
  { label: "Announcements", icon: "Megaphone", href: "/admin/announcements" },
  { label: "Devotionals", icon: "Heart", href: "/admin/devotionals" },
  { label: "Testimonies", icon: "Star", href: "/admin/testimonies" },
  { label: "Prayer Requests", icon: "MessageSquare", href: "/admin/prayer" },
  { label: "Media", icon: "Image", href: "/admin/media" },
  { label: "Ministries", icon: "Users", href: "/admin/ministries" },
  { label: "Settings", icon: "Settings", href: "/admin/settings" },
];

interface AdminSidebarProps {
  activeItem: string;
  isOpen: boolean;
  onClose: () => void;
}

export function AdminSidebar({ activeItem, isOpen, onClose }: AdminSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const sidebarContent = (
    <div
      className={cn(
        "flex h-full flex-col bg-[#4A148C] text-white transition-all duration-300",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-4">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/15">
          <Church className="size-5 text-white" />
        </div>
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="overflow-hidden whitespace-nowrap"
            >
              <span className="text-sm font-bold tracking-wide">Youth Admin</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Separator className="bg-white/10" />

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="flex flex-col gap-1" aria-label="Admin navigation">
          {navItems.map((item) => {
            const IconComponent = iconMap[item.icon];
            const isActive = activeItem === item.label;
            const isDashboard = item.href === "/admin";

            return (
              <Link
                key={item.label}
                href={isDashboard ? item.href : "#"}
                onClick={(e) => {
                  e.preventDefault();
                  if (isDashboard) {
                    onClose();
                  }
                }}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-white/20 text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                )}
                title={collapsed ? item.label : undefined}
              >
                {IconComponent && (
                  <IconComponent
                    className={cn(
                      "size-5 shrink-0",
                      isActive ? "text-white" : "text-white/60"
                    )}
                  />
                )}
                <AnimatePresence mode="wait">
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="overflow-hidden whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      <Separator className="bg-white/10" />

      {/* Collapse Toggle */}
      <div className="hidden px-3 py-2 lg:block">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="w-full justify-center text-white/70 hover:bg-white/10 hover:text-white"
        >
          <ChevronLeft
            className={cn(
              "size-4 transition-transform duration-300",
              collapsed && "rotate-180"
            )}
          />
        </Button>
      </div>

      {/* User Section */}
      <div className="border-t border-white/10 p-3">
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <Avatar className="size-9 shrink-0 border-2 border-white/20">
            <AvatarFallback className="bg-[#D32F2F] text-xs font-bold text-white">
              AU
            </AvatarFallback>
          </Avatar>
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="flex flex-1 items-center justify-between overflow-hidden"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">Admin User</p>
                  <p className="truncate text-xs text-white/50">admin@mfmannexyouth.org</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 shrink-0 text-white/50 hover:bg-white/10 hover:text-white"
                >
                  <LogOut className="size-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:flex-col"
        aria-label="Admin sidebar"
      >
        {sidebarContent}
      </aside>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={onClose}
              aria-hidden="true"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 lg:hidden"
              aria-label="Admin sidebar mobile"
            >
              <div className="relative h-full w-64">{sidebarContent}</div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}