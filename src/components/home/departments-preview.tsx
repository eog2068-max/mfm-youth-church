import Link from "next/link";
import { Music, Users, Baby, Sparkles, Camera, Megaphone, ArrowRight } from "lucide-react";
import { SectionWrapper, SectionTitle } from "./section-wrapper";

const departments = [
  {
    name: "Choir (Music)",
    description: "Leading the congregation in heartfelt worship and praise through music and songs.",
    icon: Music,
    color: "text-[#4A148C]",
    bg: "bg-[#EBF0FA]",
  },
  {
    name: "Ushering",
    description: "Ensuring order, warmth, and a welcoming atmosphere during all church services and events.",
    icon: Users,
    color: "text-[#2E7D32]",
    bg: "bg-[#E8F5E9]",
  },
  {
    name: "Children Church",
    description: "Nurturing the next generation with Bible-based teachings, fun activities, and godly values.",
    icon: Baby,
    color: "text-[#D32F2F]",
    bg: "bg-[#FFEBEE]",
  },
  {
    name: "Youth Church",
    description: "Empowering young people to live purpose-driven lives and impact their generation for Christ.",
    icon: Sparkles,
    color: "text-[#C62828]",
    bg: "bg-[#FFF3E0]",
  },
  {
    name: "Media",
    description: "Leveraging technology and creative arts to broadcast the gospel and enhance worship experiences.",
    icon: Camera,
    color: "text-[#6A1B9A]",
    bg: "bg-[#F3E5F5]",
  },
  {
    name: "Evangelism",
    description: "Taking the message of salvation beyond the church walls. Join our Go-A-Fishing digital evangelism program to track referrals and earn awards.",
    icon: Megaphone,
    color: "text-[#00695C]",
    bg: "bg-[#E0F2F1]",
  },
];

export function DepartmentsPreview() {
  return (
    <SectionWrapper className="bg-[#F3E5F5] py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionTitle title="Our Departments" subtitle="Serving God together through diverse ministries" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {departments.map((dept) => (
            <div
              key={dept.name}
              className="bg-white rounded-2xl p-6 shadow-md shadow-black/5 border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className={`w-12 h-12 ${dept.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <dept.icon className={`size-6 ${dept.color}`} />
              </div>
              <h3 className="text-lg font-bold text-[#4A148C] mb-2">{dept.name}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{dept.description}</p>
              {dept.name === "Evangelism" && (
                <Link
                  href="/go-a-fishing"
                  className="inline-flex items-center gap-1 mt-2 text-[#7B1FA2] text-xs font-semibold hover:gap-2 transition-all"
                >
                  Go-A-Fishing →
                </Link>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/departments"
            className="inline-flex items-center gap-1.5 text-[#D32F2F] font-semibold hover:gap-2.5 transition-all text-sm"
          >
            View All Departments
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </SectionWrapper>
  );
}