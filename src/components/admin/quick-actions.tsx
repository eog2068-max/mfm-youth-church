"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  Calendar,
  Megaphone,
  MessageSquare,
  Star,
  Users,
  Image,
  Mail,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { quickActions } from "./admin-data";

const iconMap: Record<string, React.ElementType> = {
  BookOpen,
  Calendar,
  Megaphone,
  MessageSquare,
  Star,
  Users,
  Image,
  Mail,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

export function QuickActions() {
  return (
    <Card className="border-[#EBF0FA] bg-white shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-[#4A148C]">
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 gap-3 sm:gap-4"
        >
          {quickActions.map((action) => {
            const IconComponent = iconMap[action.icon];
            return (
              <motion.a
                key={action.id}
                href={action.href}
                variants={itemVariants}
                whileHover={{ y: -2, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.97 }}
                className="group flex flex-col items-center gap-2.5 rounded-xl border border-[#EBF0FA] bg-[#F8FAFF] p-4 text-center transition-colors hover:border-transparent hover:bg-white hover:shadow-md sm:p-5"
              >
                <div
                  className="flex size-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${action.color}12` }}
                >
                  {IconComponent && (
                    <IconComponent
                      className="size-5"
                      style={{ color: action.color }}
                    />
                  )}
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#4A148C] sm:text-sm">
                    {action.label}
                  </p>
                  <p className="mt-0.5 hidden text-[10px] leading-snug text-[#4A148C]/45 sm:block">
                    {action.description}
                  </p>
                </div>
              </motion.a>
            );
          })}
        </motion.div>
      </CardContent>
    </Card>
  );
}