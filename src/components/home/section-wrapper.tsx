"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";

interface SectionWrapperProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

export function SectionWrapper({ children, className = "", id }: SectionWrapperProps) {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
  light?: boolean;
}

export function SectionTitle({ title, subtitle, className = "", light = false }: SectionTitleProps) {
  return (
    <div className={`text-center mb-10 md:mb-14 ${className}`}>
      <h2
        className={`text-3xl md:text-4xl font-bold tracking-tight ${
          light ? "text-white" : "text-[#4A148C]"
        }`}
      >
        {title}
      </h2>
      <div className="w-16 h-1 bg-[#D32F2F] mx-auto rounded-full mt-3 mb-3" />
      {subtitle && (
        <p className={`text-base md:text-lg mt-2 ${light ? "text-white/80" : "text-gray-600"}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}