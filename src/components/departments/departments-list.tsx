"use client";

import { motion } from "framer-motion";
import { SectionWrapper, SectionTitle } from "@/components/home/section-wrapper";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import {
  Music,
  BookOpen,
  Heart,
  Users,
  GraduationCap,
  Megaphone,
  Camera,
  ShieldCheck,
  HandHelping,
  Baby,
  Globe,
  Server,
  Palette,
  type LucideIcon,
} from "lucide-react";

interface Department {
  name: string;
  icon: LucideIcon;
  description: string;
  activities: string[];
  meetingDay?: string;
  accentColor: string;
  bgColor: string;
}

const departments: Department[] = [
  {
    name: "Music & Worship",
    icon: Music,
    description:
      "The Music and Worship Department is responsible for leading the congregation into the presence of God through spirit-filled praise, worship, and ministrations. This team comprises talented singers, instrumentalists, and choir members who dedicate themselves to creating an atmosphere where miracles happen through worship.",
    activities: [
      "Sunday worship leading and ministration",
      "Choir rehearsals and vocal training",
      "Special programmes and concert ministrations",
      "Instrumental accompaniment for all services",
    ],
    meetingDay: "Saturdays, 4:00 PM",
    accentColor: "text-[#D32F2F]",
    bgColor: "bg-[#D32F2F]/10",
  },
  {
    name: "Sunday School",
    icon: BookOpen,
    description:
      "The Sunday School Department is the foundational teaching arm of the church, committed to systematically teaching the Word of God to all age groups. Through structured curriculum and interactive classes, members are grounded in biblical principles and equipped for daily Christian living.",
    activities: [
      "Weekly Sunday School classes for all ages",
      "Teacher training and curriculum development",
      "Bible quizzes and competitions",
      "Annual Sunday School retreat",
    ],
    meetingDay: "Sundays, 7:00 AM",
    accentColor: "text-[#4A148C]",
    bgColor: "bg-[#4A148C]/10",
  },
  {
    name: "Ushering",
    icon: ShieldCheck,
    description:
      "The Ushering Department ensures order, warmth, and excellence in every church service. Ushers are the first point of physical contact for members and visitors, creating a welcoming environment that reflects the love of Christ through courteous and organised service.",
    activities: [
      "Service coordination and seating arrangement",
      "Welcoming and directing first-time visitors",
      "Crowd control and orderliness during services",
      "Communion and special offering coordination",
    ],
    meetingDay: "Saturdays, 2:00 PM",
    accentColor: "text-[#2E7D32]",
    bgColor: "bg-[#2E7D32]/10",
  },
  {
    name: "Evangelism & Outreach",
    icon: Megaphone,
    description:
      "The Evangelism Department is the soul-winning arm of the church, driven by the Great Commission to go into all the world and preach the Gospel. This department organises community outreaches, street evangelism, hospital visits, and mission trips to reach the unsaved and bring them into the family of God.",
    activities: [
      "Weekly community outreach programmes",
      "Street evangelism and open-air crusades",
      "Hospital and prison visitations",
      "Follow-up and new converts' integration",
    ],
    meetingDay: "Saturdays, 10:00 AM",
    accentColor: "text-[#D32F2F]",
    bgColor: "bg-[#D32F2F]/10",
  },
  {
    name: "Children's Church",
    icon: Baby,
    description:
      "The Children's Church Department is dedicated to nurturing the faith of children from infancy through primary school age. Through creative Bible teaching, worship, games, and activities, children are introduced to the love of God and grounded in His Word from an early age.",
    activities: [
      "Sunday children's services (parallel to main service)",
      "Vacation Bible School (VBS) during holidays",
      "Children's choir and drama ministrations",
      "Parent-child dedication services",
    ],
    meetingDay: "Sundays, 9:00 AM",
    accentColor: "text-[#4A148C]",
    bgColor: "bg-[#4A148C]/10",
  },
  {
    name: "Youth & Teens Ministry",
    icon: Users,
    description:
      "The Youth and Teens Ministry is a vibrant department focused on raising a generation of young people who are passionate about God, purpose-driven, and relevant to their world. Through dynamic fellowship, mentorship, and activities, young people are equipped to live for God and impact their generation.",
    activities: [
      "Weekly youth fellowship and Bible study",
      "Annual youth conference and retreat",
      "Talent showcases and skill development workshops",
      "Academic support and career guidance",
    ],
    meetingDay: "Fridays, 5:00 PM",
    accentColor: "text-[#D32F2F]",
    bgColor: "bg-[#D32F2F]/10",
  },
  {
    name: "Women's Fellowship",
    icon: Heart,
    description:
      "The Women's Fellowship brings together women of all ages for spiritual growth, mutual support, and empowerment. Through Bible study, prayer meetings, conferences, and outreach, women are encouraged to discover their God-given purpose and fulfil their destinies as virtuous women of impact.",
    activities: [
      "Monthly women's fellowship meetings",
      "Annual women's conference",
      "Widows' support and care programme",
      "Community service and charity outreach",
    ],
    meetingDay: "Third Saturdays, 11:00 AM",
    accentColor: "text-[#2E7D32]",
    bgColor: "bg-[#2E7D32]/10",
  },
  {
    name: "Men's Fellowship",
    icon: Users,
    description:
      "The Men's Fellowship exists to raise godly men who are leaders in their homes, the church, and society. Through fellowship, accountability, and mentorship, men are challenged to live with integrity, provide spiritual covering for their families, and fulfil their God-ordained roles as priests and prophets in their homes.",
    activities: [
      "Monthly men's fellowship and prayer meetings",
      "Annual men's retreat and summit",
      "Father-son bonding activities",
      "Community development projects",
    ],
    meetingDay: "Third Saturdays, 11:00 AM",
    accentColor: "text-[#4A148C]",
    bgColor: "bg-[#4A148C]/10",
  },
  {
    name: "Technical & Media",
    icon: Server,
    description:
      "The Technical and Media Department handles all sound engineering, live streaming, video production, social media management, and IT support for the church. This behind-the-scenes team ensures that every service is heard clearly, broadcast effectively, and documented for future reference and wider reach.",
    activities: [
      "Sound engineering and mixing during services",
      "Live streaming and video recording",
      "Social media content creation and management",
      "Website and IT infrastructure maintenance",
    ],
    meetingDay: "Saturdays, 12:00 PM",
    accentColor: "text-[#D32F2F]",
    bgColor: "bg-[#D32F2F]/10",
  },
  {
    name: "Follow-Up & Welfare",
    icon: HandHelping,
    description:
      "The Follow-Up and Welfare Department ensures that no member or visitor falls through the cracks. This team tracks first-time visitors, follows up on new converts, and coordinates welfare support for members in need — including hospital visits, bereavement support, and financial assistance where possible.",
    activities: [
      "First-time visitor follow-up calls and visits",
      "New converts' integration and mentoring",
      "Hospital, bereavement, and welfare support",
      "Food bank and material assistance programmes",
    ],
    meetingDay: "Sundays, 2:00 PM",
    accentColor: "text-[#2E7D32]",
    bgColor: "bg-[#2E7D32]/10",
  },
  {
    name: "Creative Arts & Drama",
    icon: Palette,
    description:
      "The Creative Arts and Drama Department uses the arts — drama, dance, poetry, and visual arts — to communicate the Gospel in powerful and memorable ways. This department brings biblical stories to life during special services, church events, and outreach programmes, making the Word of God accessible and engaging for all ages.",
    activities: [
      "Drama ministrations during special services",
      "Dance and choreography for worship events",
      "Church decoration and event staging",
      "Creative workshops and talent development",
    ],
    meetingDay: "Saturdays, 3:00 PM",
    accentColor: "text-[#4A148C]",
    bgColor: "bg-[#4A148C]/10",
  },
  {
    name: "Mission & Missions",
    icon: Globe,
    description:
      "The Mission and Missions Department coordinates the church's involvement in local and international missions. This includes supporting MFM mission fields, organising short-term mission trips, collecting mission offerings, and raising awareness about the global mandate to reach unreached people groups with the Gospel of Jesus Christ.",
    activities: [
      "Monthly mission awareness and prayer meetings",
      "Support for MFM mission fields and missionaries",
      "Short-term mission trip coordination",
      "Mission offering collection and remittance",
    ],
    meetingDay: "First Sundays, 4:00 PM",
    accentColor: "text-[#D32F2F]",
    bgColor: "bg-[#D32F2F]/10",
  },
];

export function DepartmentsList() {
  return (
    <SectionWrapper className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Explore Our Departments"
          subtitle="Youth Assembly has a place for everyone. Browse our departments below and find where your gifts, passion, and calling align with God's purpose for your life."
        />

        <div className="space-y-6 mt-12">
          {departments.map((dept, index) => (
            <motion.div
              key={dept.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.5, delay: index * 0.03 }}
              className="group bg-white rounded-2xl border border-gray-100 hover:border-[#4A148C]/10 hover:shadow-xl hover:shadow-[#4A148C]/5 transition-all duration-300 overflow-hidden"
            >
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-start gap-5">
                  {/* Icon */}
                  <div
                    className={`w-14 h-14 rounded-2xl ${dept.bgColor} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <dept.icon className={`size-7 ${dept.accentColor}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                      <h3 className="text-xl font-bold text-[#4A148C]">{dept.name}</h3>
                      {dept.meetingDay && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#F3E5F5] text-[#4A148C] whitespace-nowrap">
                          {dept.meetingDay}
                        </span>
                      )}
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {dept.description}
                    </p>

                    {/* Activities */}
                    <div className="grid sm:grid-cols-2 gap-2">
                      {dept.activities.map((activity, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-gray-500">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#D32F2F] shrink-0 mt-1.5" />
                          <span>{activity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}