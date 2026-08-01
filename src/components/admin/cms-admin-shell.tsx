"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Megaphone,
  Clock,
  ArrowLeft,
  Menu,
  X,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface CmsAdminShellProps {
  role: string;
  userEmail: string;
  children: React.ReactNode;
}

const navItems = [
  { label: "Dashboard", href: "/admin/cms", icon: LayoutDashboard },
  { label: "Content Blocks", href: "/admin/cms/blocks", icon: FileText },
  { label: "Announcements", href: "/admin/cms/announcements", icon: Megaphone },
  { label: "Service Info", href: "/admin/cms/service-info", icon: Clock },
];

export function CmsAdminShell({ role, userEmail, children }: CmsAdminShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navContent = (
    <nav className="flex flex-col gap-1 mt-4">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              isActive
                ? "bg-white/15 text-white font-semibold"
                : "text-purple-200/70 hover:text-white hover:bg-white/10"
            }`}
          >
            <Icon className="size-4 shrink-0" />
            {item.label}
          </Link>
        );
      })}
      <div className="border-t border-white/10 my-3" />
      <Link
        href="/admin"
        onClick={() => setMobileOpen(false)}
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-purple-200/70 hover:text-white hover:bg-white/10 transition-colors"
      >
        <ArrowLeft className="size-4 shrink-0" />
        Back to Admin Home
      </Link>
    </nav>
  );

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-[#1A0033] flex-col">
        <div className="p-5 border-b border-white/10">
          <h1 className="text-lg font-bold text-white">CMS Admin</h1>
          <p className="text-xs text-purple-200/50 mt-1">Church Management System</p>
        </div>
        {navContent}
        <div className="mt-auto p-4 border-t border-white/10">
          <p className="text-xs text-purple-200/40">{userEmail}</p>
          <p className="text-[10px] text-purple-200/30 mt-0.5 uppercase tracking-wider">{role}</p>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-3">
            {/* Mobile menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <button className="lg:hidden p-2 rounded-lg hover:bg-gray-100" aria-label="Open menu">
                  <Menu className="size-5 text-gray-600" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0 bg-[#1A0033] text-white">
                <SheetHeader className="p-5 border-b border-white/10">
                  <SheetTitle className="text-white text-left">CMS Admin</SheetTitle>
                </SheetHeader>
                {navContent}
              </SheetContent>
            </Sheet>
            <h2 className="text-sm font-semibold text-gray-900">Church Management System</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-xs text-gray-500">{userEmail}</span>
            <span className="text-[10px] bg-purple-50 text-[#4A148C] px-2 py-0.5 rounded-full font-medium uppercase">{role}</span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
