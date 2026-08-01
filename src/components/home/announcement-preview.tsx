import Link from "next/link";
import { Megaphone, Calendar, ArrowRight } from "lucide-react";
import { SectionWrapper, SectionTitle } from "./section-wrapper";

const announcements = [
  {
    title: "Weekly Programme Update",
    date: "This Week",
    excerpt:
      "Please note the updated schedule for this week's activities. Sunday services are at 7:00 AM. Tuesday Bible Study continues at 5:30 PM.",
    icon: Megaphone,
  },
  {
    title: "Special Workers' Meeting",
    date: "Saturday, 10:00 AM",
    excerpt:
      "All church workers are invited to a special planning and orientation meeting this Saturday. Please come prepared with your department reports.",
    icon: Calendar,
  },
  {
    title: "Prayer Focus for the Week",
    date: "Ongoing",
    excerpt:
      "This week, we are focusing our prayers on family unity and the peace of our nation. Join us in the prayer room daily between 6:00 AM and 7:00 AM.",
    icon: Megaphone,
  },
];

export function AnnouncementPreview() {
  return (
    <SectionWrapper className="py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <SectionTitle title="Latest Announcements" />

        <div className="space-y-4">
          {announcements.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-5 md:p-6 shadow-md shadow-black/5 border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#FFEBEE] flex items-center justify-center shrink-0">
                  <item.icon className="size-5 text-[#D32F2F]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-bold text-[#4A148C] text-base">{item.title}</h3>
                    <span className="text-xs text-gray-400 shrink-0 mt-1">{item.date}</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.excerpt}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/announcements"
            className="inline-flex items-center gap-1.5 text-[#D32F2F] font-semibold hover:gap-2.5 transition-all text-sm"
          >
            View All Announcements
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </SectionWrapper>
  );
}