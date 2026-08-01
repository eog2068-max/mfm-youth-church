"use client";

import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Navigation,
  ExternalLink,
  Clock,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContactForm } from "./contact-form";
import { ServiceTimesCard } from "./service-times-card";
import { churchInfo, socialLinks, officeHours } from "./contact-data";

const socialIconMap = {
  facebook: Facebook,
  instagram: Instagram,
  youtube: Youtube,
  twitter: Twitter,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const infoCards = [
  {
    icon: MapPin,
    label: "Address",
    value: churchInfo.address,
    href: churchInfo.mapsUrl,
    external: true,
    color: "text-[#D32F2F]",
    bg: "bg-red-50",
  },
  {
    icon: Phone,
    label: "Phone",
    value: churchInfo.phone,
    href: `tel:${churchInfo.phoneRaw}`,
    external: false,
    color: "text-[#2E7D32]",
    bg: "bg-green-50",
  },
  {
    icon: Mail,
    label: "Email",
    value: churchInfo.email,
    href: `mailto:${churchInfo.email}`,
    external: false,
    color: "text-[#4A148C]",
    bg: "bg-[#EBF0FA]",
  },
  {
    icon: Globe,
    label: "Website",
    value: churchInfo.website,
    href: churchInfo.websiteUrl,
    external: true,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
];

export function ContactMain() {
  return (
    <section className="py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10"
        >
          {/* Left Column: Form + Map */}
          <div className="lg:col-span-3 space-y-8">
            {/* Contact Form */}
            <motion.div variants={itemVariants} id="contact-form">
              <ContactForm />
            </motion.div>

            {/* Map Placeholder */}
            <motion.div variants={itemVariants}>
              <div className="relative rounded-2xl overflow-hidden border border-gray-100 shadow-sm h-64 md:h-80">
                {/* Dark gradient background simulating a map */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#1A0033] via-[#4A148C] to-[#1B2656]" />

                {/* Decorative grid lines to simulate streets */}
                <div className="absolute inset-0 opacity-[0.06]">
                  <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="map-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                        <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="1" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#map-grid)" />
                  </svg>
                </div>

                {/* Subtle "road" lines */}
                <div className="absolute top-1/3 left-0 right-0 h-[1px] bg-white/10" />
                <div className="absolute top-2/3 left-0 right-0 h-[1px] bg-white/10" />
                <div className="absolute left-1/4 top-0 bottom-0 w-[1px] bg-white/10" />
                <div className="absolute left-2/3 top-0 bottom-0 w-[1px] bg-white/10" />

                {/* Blur circles for atmosphere */}
                <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-[#7B1FA2] rounded-full blur-[80px] opacity-30" />
                <div className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-[#D32F2F] rounded-full blur-[80px] opacity-10" />

                {/* Pin and address overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center px-6">
                  <motion.div
                    initial={{ scale: 0, y: -20 }}
                    whileInView={{ scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                  >
                    <div className="relative">
                      <div className="absolute -inset-3 bg-[#D32F2F]/20 rounded-full blur-md" />
                      <div className="relative w-14 h-14 rounded-full bg-[#D32F2F] flex items-center justify-center shadow-lg shadow-[#D32F2F]/30">
                        <MapPin className="size-7 text-white" />
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="mt-5"
                  >
                    <p className="text-white font-semibold text-sm md:text-base max-w-md leading-relaxed">
                      {churchInfo.address}
                    </p>
                    <p className="text-purple-200/60 text-xs mt-2">
                      {churchInfo.shortName}
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                    className="mt-5"
                  >
                    <Button
                      asChild
                      className="bg-white text-[#4A148C] hover:bg-gray-100 rounded-xl px-6 font-semibold shadow-lg text-sm"
                    >
                      <a
                        href={churchInfo.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Navigation className="size-4 mr-2" />
                        Get Directions
                        <ExternalLink className="size-3.5 ml-1.5 opacity-50" />
                      </a>
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Info cards, Service times, Social, Office hours */}
          <div className="lg:col-span-2 space-y-6">
            {/* Church Info Cards */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
              {infoCards.map((card) => {
                const IconComp = card.icon;
                return (
                  <a
                    key={card.label}
                    href={card.href}
                    target={card.external ? "_blank" : undefined}
                    rel={card.external ? "noopener noreferrer" : undefined}
                    className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all group"
                  >
                    <div
                      className={`w-10 h-10 rounded-lg ${card.bg} flex items-center justify-center shrink-0`}
                    >
                      <IconComp className={`size-5 ${card.color}`} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        {card.label}
                      </p>
                      <p className="text-sm font-medium text-gray-700 mt-0.5 group-hover:text-[#4A148C] transition-colors leading-snug">
                        {card.value}
                      </p>
                    </div>
                    {card.external && (
                      <ExternalLink className="size-3.5 text-gray-300 group-hover:text-gray-500 shrink-0 mt-1 transition-colors" />
                    )}
                  </a>
                );
              })}
            </motion.div>

            {/* Service Times */}
            <motion.div variants={itemVariants}>
              <ServiceTimesCard />
            </motion.div>

            {/* Office Hours */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                  <Clock className="size-4 text-amber-600" />
                </div>
                <h3 className="text-sm font-bold text-gray-800">Office Hours</h3>
              </div>
              <div className="space-y-2 ml-10">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Weekdays</span>
                  <span className="text-sm font-medium text-gray-800">9 AM - 5 PM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Saturday</span>
                  <span className="text-sm font-medium text-gray-800">10 AM - 2 PM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Sunday</span>
                  <span className="text-sm font-medium text-gray-800">Before &amp; after services</span>
                </div>
              </div>
            </motion.div>

            {/* Social Media */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
            >
              <h3 className="text-sm font-bold text-gray-800 mb-3">
                Connect With Us
              </h3>
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => {
                  const IconComp = socialIconMap[social.icon];
                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.name}
                      className="w-10 h-10 rounded-xl bg-[#F3E5F5] flex items-center justify-center text-[#4A148C] hover:bg-[#4A148C] hover:text-white transition-all hover:shadow-md hover:shadow-[#4A148C]/20"
                    >
                      <IconComp className="size-4.5" />
                    </a>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}