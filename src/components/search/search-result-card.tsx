"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  BookOpen,
  Calendar,
  Megaphone,
  Heart,
  Star,
  FileText,
  Users,
  Image,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { SearchResult } from "./search-data";
import { typeConfig } from "./search-data";

const iconMap: Record<string, React.ElementType> = {
  BookOpen,
  Calendar,
  Megaphone,
  Heart,
  Star,
  FileText,
  Users,
  Image,
  HandsPraying: Heart,
};

interface SearchResultCardProps {
  result: SearchResult;
  index: number;
}

export function SearchResultCard({ result, index }: SearchResultCardProps) {
  const config = typeConfig[result.type];
  const IconComponent = iconMap[config.icon] || FileText;

  const metaEntries = Object.entries(result.meta);
  const formattedDate = new Date(result.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
    >
      <Link
        href={result.url}
        className="group block rounded-xl border border-gray-200/80 bg-white p-4 md:p-5 shadow-sm hover:shadow-md hover:border-gray-300/80 transition-all duration-200"
      >
        <div className="flex items-start gap-3 md:gap-4">
          {/* Type icon */}
          <div
            className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${config.bgColor} border ${config.borderColor}`}
          >
            <IconComponent className={`size-5 ${config.textColor}`} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Type badge + date row */}
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <Badge
                variant="outline"
                className={`text-[10px] px-2 py-0 font-medium ${config.color}`}
              >
                {config.label}
              </Badge>
              <span className="text-xs text-gray-400">{formattedDate}</span>
            </div>

            {/* Title */}
            <h3 className="text-base font-semibold text-gray-900 group-hover:text-[#4A148C] transition-colors line-clamp-1 mb-1">
              {result.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed mb-2">
              {result.description}
            </p>

            {/* Meta info */}
            {metaEntries.length > 0 && (
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400">
                {metaEntries.map(([key, value]) => (
                  <span key={key}>
                    <span className="font-medium text-gray-500 capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}:
                    </span>{" "}
                    {value}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Arrow */}
          <div className="flex-shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowRight className="size-4 text-gray-400" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}