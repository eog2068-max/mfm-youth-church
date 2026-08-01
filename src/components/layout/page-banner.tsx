"use client";

import { motion } from "framer-motion";
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageBannerProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  className?: string;
  overlay?: boolean;
}

export function PageBanner({
  title,
  subtitle,
  breadcrumbs,
  className = "",
  overlay = true,
}: PageBannerProps) {
  return (
    <section
      className={cn(
        "relative pt-32 pb-16 md:pt-40 md:pb-20 overflow-hidden",
        className
      )}
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-[#1A0033] via-[#4A148C] to-[#4A148C]"
      />
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D32F2F] rounded-full blur-[128px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#7B1FA2] rounded-full blur-[128px] translate-y-1/2 -translate-x-1/3" />
      </div>
      {overlay && (
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTMwVjBoLTEydjRoMTJ6TTI0IDI0aDEydi0ySDI0djJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40" />
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6"
          >
            <ol className="flex items-center gap-1.5 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-white/60 hover:text-white transition-colors flex items-center gap-1"
                >
                  <Home className="size-3.5" />
                  Home
                </Link>
              </li>
              {breadcrumbs.map((crumb, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <ChevronRight className="size-3.5 text-white/40" />
                  {crumb.href ? (
                    <Link
                      href={crumb.href}
                      className="text-white/60 hover:text-white transition-colors"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-white font-medium">{crumb.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </motion.nav>
        )}

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-4 text-lg md:text-xl text-purple-200/80 max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          )}
        </motion.div>

        {/* Red accent line */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 64 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="h-1 bg-[#D32F2F] rounded-full mt-6"
        />
      </div>
    </section>
  );
}