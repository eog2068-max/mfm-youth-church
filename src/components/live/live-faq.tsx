"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    q: "What time do services start?",
    a: "Our Sunday Worship Service holds at 7:00 AM (WAT). Tuesday Digging Deep (Bible Study) is at 5:30 PM, and Thursday Faith Clinic is at 5:30 PM. All times are in West African Time (UTC+1).",
    icon: "clock",
  },
  {
    q: "Do I need an account to watch the live stream?",
    a: "No, you do not need an account. Our live stream is free and open to everyone. Simply visit this page when a service is live and the stream will begin playing automatically.",
    icon: "user",
  },
  {
    q: "Can I watch on my mobile phone?",
    a: "Yes, absolutely. Our live stream is fully responsive and works on all devices — smartphones, tablets, laptops, and desktop computers. For the best experience, use a stable WiFi or 4G connection.",
    icon: "phone",
  },
  {
    q: "The stream is buffering or not loading. What do I do?",
    a: "First, check your internet connection. Try refreshing the page or closing other tabs that may be using bandwidth. If the issue persists, try switching between WiFi and mobile data. The stream quality adjusts automatically based on your connection speed.",
    icon: "wifi",
  },
  {
    q: "Can I share the live stream with others?",
    a: "Yes, please do! Use the Share button on the video player to copy the link and share it via WhatsApp, social media, or email. Help us spread the Word of God to as many people as possible.",
    icon: "share",
  },
  {
    q: "Are service recordings available after the stream?",
    a: "Yes, all services are recorded and uploaded to our Video Gallery within 24-48 hours. You can also find sermon audio and notes in the Sermon Library.",
    icon: "video",
  },
];

export function LiveFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div>
      <div className="flex items-center gap-2 mb-5">
        <HelpCircle className="size-5 text-[#4A148C]" />
        <h3 className="text-lg font-bold text-[#4A148C]">Frequently Asked Questions</h3>
      </div>

      <div className="space-y-2">
        {faqs.map((faq, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.25, delay: i * 0.04 }}
            className="bg-white rounded-xl border border-gray-100 overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left"
            >
              <span className="text-sm font-semibold text-gray-800 pr-4">{faq.q}</span>
              <ChevronDown className={`size-4 text-gray-400 shrink-0 transition-transform duration-200 ${
                openIndex === i ? "rotate-180" : ""
              }`} />
            </button>
            <AnimatePresence>
              {openIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-50 pt-3">
                    {faq.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
