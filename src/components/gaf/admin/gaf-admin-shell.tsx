"use client";

/**
 * GafAdminShell — shared admin sidebar + header for all /admin/gaf/* pages.
 *
 * Uses the same visual style as the existing admin sidebar (dark navy #4A148C)
 * but scoped to Go-A-Fishing admin navigation only.
 *
 * Stage 6 of Go-A-Fishing.
 */
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Fish,
  Trophy,
  Settings,
  Shield,
  LogOut,
  Menu,
  X,
  Church,
  ChevronRight,
  Award,
  BarChart3,
  MapPin,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface GafAdminShellProps {
  children: React.ReactNode;
  role: string;
  userEmail: string;
}

const NAV_ITEMS = [
  { label: "Overview", icon: LayoutDashboard, href: "/admin/gaf" },
  { label: "Members", icon: Users, href: "/admin/gaf/members" },
  { label: "Referrals", icon: Fish, href: "/admin/gaf/referrals" },
  { label: "Outreach", icon: MapPin, href: "/admin/gaf/outreach" },
  { label: "Cycles", icon: Trophy, href: "/admin/gaf/cycles" },
  { label: "Commendations", icon: Award, href: "/admin/gaf/commendations" },
  { label: "Reports", icon: BarChart3, href: "/admin/gaf/reports" },
  { label: "Notifications", icon: Bell, href: "/admin/gaf/notifications" },
  { label: "Configuration", icon: Settings, href: "/admin/gaf/config" },
  { label: "Audit Log", icon: Shield, href: "/admin/gaf/audit-log" },
];

export function GafAdminShell({ children, role, userEmail }: GafAdminShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/admin/gaf") return pathname === "/admin/gaf";
    return pathname.startsWith(href);
  };

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#4A148C] text-white fixed inset-y-0 left-0 z-40">
        <div className="flex items-center gap-3 h-16 px-4 border-b border-white/10">
          <div className="flex size-9 items-center justify-center rounded-lg bg-white/15">
            <Fish className="size-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate">Go-A-Fishing</p>
            <p className="text-xs text-purple-200 truncate">Admin Panel</p>
          </div>
        </div>

        <ScrollArea className="flex-1 py-3">
          <nav className="px-3 space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                    active
                      ? "bg-white/20 text-white"
                      : "text-purple-100/70 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                  {active && <ChevronRight className="size-3 ml-auto" />}
                </Link>
              );
            })}
          </nav>

          <div className="px-3 mt-6 pt-4 border-t border-white/10">
            <p className="text-xs text-purple-300/60 px-3 mb-2">MAIN ADMIN</p>
            <Link
              href="/admin"
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-purple-100/70 hover:bg-white/10 hover:text-white transition-colors"
            >
              <Church className="size-4" />
              <span>General Admin</span>
            </Link>
          </div>
        </ScrollArea>

        {/* User info at bottom */}
        <div className="border-t border-white/10 px-4 py-3">
          <p className="text-xs text-purple-200 truncate">{userEmail}</p>
          <p className="text-xs text-purple-300/60 capitalize">{role}</p>
        </div>
      </aside>

      {/* Mobile header + overlay sidebar */}
      <div className="lg:hidden fixed inset-0 z-40">
        {/* Mobile top bar */}
        <header className="fixed top-0 left-0 right-0 h-14 bg-[#4A148C] text-white z-50 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Fish className="size-5" />
            <span className="text-sm font-bold">GAF Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-purple-200 capitalize">{role}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileOpen(true)}
              className="text-white hover:bg-white/10"
            >
              <Menu className="size-5" />
            </Button>
          </div>
        </header>

        {/* Overlay sidebar */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setMobileOpen(false)}
            />
            <aside className="absolute left-0 top-0 bottom-0 w-72 bg-[#4A148C] text-white">
              <div className="flex items-center justify-between h-14 px-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Fish className="size-5" />
                  <span className="text-sm font-bold">GAF Admin</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMobileOpen(false)}
                  className="text-white hover:bg-white/10"
                >
                  <X className="size-5" />
                </Button>
              </div>
              <ScrollArea className="flex-1 py-3">
                <nav className="px-3 space-y-1">
                  {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                          active
                            ? "bg-white/20 text-white"
                            : "text-purple-100/70 hover:bg-white/10 hover:text-white"
                        )}
                      >
                        <Icon className="size-4" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
                <div className="px-3 mt-6 pt-4 border-t border-white/10">
                  <Link
                    href="/go-a-fishing"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-purple-100/70 hover:bg-white/10 hover:text-white"
                  >
                    <LogOut className="size-4" />
                    <span>Back to GAF</span>
                  </Link>
                  <Link
                    href="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-purple-100/70 hover:bg-white/10 hover:text-white"
                  >
                    <Church className="size-4" />
                    <span>General Admin</span>
                  </Link>
                </div>
              </ScrollArea>
            </aside>
          </div>
        )}
      </div>

      {/* Main content area */}
      <main className="flex-1 lg:pl-64">
        <div className="pt-14 lg:pt-0">{children}</div>
      </main>
    </div>
  );
}
