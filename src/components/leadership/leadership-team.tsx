"use client";

import { motion } from "framer-motion";
import { SectionWrapper, SectionTitle } from "@/components/home/section-wrapper";
import { Mail, Phone } from "lucide-react";

interface Leader {
  name: string;
  role: string;
  initials: string;
  bio: string;
  phone?: string;
  email?: string;
  accentColor: string;
}

const associatePastors: Leader[] = [
  {
    name: "[Name]",
    role: "Associate Pastor",
    initials: "AP",
    bio: "Passionately committed to discipleship and spiritual growth, [Name] oversees the teaching ministry and coordinates midweek programs that equip believers for victorious Christian living.",
    accentColor: "bg-[#4A148C]/10 text-[#4A148C]",
  },
  {
    name: "[Name]",
    role: "Associate Pastor (Youth & Teens)",
    initials: "YP",
    bio: "With a vibrant heart for the next generation, [Name] leads the youth and teen ministries, creating dynamic environments where young people encounter God and discover their purpose.",
    accentColor: "bg-[#D32F2F]/10 text-[#D32F2F]",
  },
  {
    name: "[Name]",
    role: "Associate Pastor (Women)",
    initials: "WP",
    bio: "A motherly figure and spiritual mentor, [Name] coordinates the women's ministry, organizing fellowships, conferences, and outreach programs that uplift and empower women in the church and community.",
    accentColor: "bg-[#2E7D32]/10 text-[#2E7D32]",
  },
];

const ministers: Leader[] = [
  {
    name: "[Name]",
    role: "Minister / Worship Leader",
    initials: "WL",
    bio: "Leads the worship team with a spirit of excellence, creating an atmosphere where the presence of God is tangible and hearts are drawn into intimate communion with the Father.",
    accentColor: "bg-[#4A148C]/10 text-[#4A148C]",
  },
  {
    name: "[Name]",
    role: "Minister / Children's Church",
    initials: "CC",
    bio: "Dedicated to raising a God-fearing generation from infancy, [Name] oversees the children's church with creative, Bible-based teaching that nurtures faith in young hearts.",
    accentColor: "bg-[#D32F2F]/10 text-[#D32F2F]",
  },
  {
    name: "[Name]",
    role: "Minister / Evangelism",
    initials: "EV",
    bio: "Driven by the Great Commission, [Name] coordinates outreach and evangelism programs, leading soul-winning initiatives that bring the Gospel to the Utako community and beyond.",
    accentColor: "bg-[#2E7D32]/10 text-[#2E7D32]",
  },
  {
    name: "[Name]",
    role: "Minister / Choir Director",
    initials: "CD",
    bio: "A gifted musician and director, [Name] leads the choir in ministrations that bless the congregation and create an atmosphere of praise and worship during services.",
    accentColor: "bg-[#4A148C]/10 text-[#4A148C]",
  },
  {
    name: "[Name]",
    role: "Minister / Discipleship",
    initials: "DS",
    bio: "Focused on building strong foundations, [Name] coordinates the new converts' class and discipleship programs, ensuring every new believer is firmly rooted in the Word.",
    accentColor: "bg-[#D32F2F]/10 text-[#D32F2F]",
  },
  {
    name: "[Name]",
    role: "Minister / Operations",
    initials: "OP",
    bio: "Oversees the day-to-day operations of the church, managing logistics, facilities, and administrative functions to ensure smooth and effective ministry delivery.",
    accentColor: "bg-[#2E7D32]/10 text-[#2E7D32]",
  },
];

function LeaderCard({ leader, index }: { leader: Leader; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-[#4A148C]/10 hover:shadow-xl hover:shadow-[#4A148C]/5 transition-all duration-300"
    >
      {/* Photo area */}
      <div className="relative h-48 bg-gradient-to-br from-[#F3E5F5] to-[#E1BEE7] flex items-center justify-center">
        <div className="w-20 h-20 rounded-full bg-white/80 shadow-md flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <span className="text-xl font-bold text-[#4A148C]">{leader.initials}</span>
        </div>
        {/* Role badge */}
        <div className="absolute bottom-3 left-3">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${leader.accentColor}`}>
            {leader.role}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-[#4A148C] mb-2">{leader.name}</h3>
        <p className="text-gray-600 text-sm leading-relaxed">{leader.bio}</p>
      </div>
    </motion.div>
  );
}

export function LeadershipTeam() {
  return (
    <>
      {/* Associate Pastors */}
      <SectionWrapper className="py-16 md:py-24 bg-[#F3E5F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Associate Pastors"
            subtitle="Our associate pastors work alongside the Senior Pastor to fulfill the vision and ensure every member of the Youth family is well-shepherded."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {associatePastors.map((pastor, i) => (
              <LeaderCard key={pastor.role} leader={pastor} index={i} />
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Ministers */}
      <SectionWrapper className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Ministers & Department Heads"
            subtitle="Our dedicated ministers and department heads serve faithfully in their various capacities, ensuring the smooth running of every arm of the church."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {ministers.map((minister, i) => (
              <LeaderCard key={minister.role} leader={minister} index={i} />
            ))}
          </div>
        </div>
      </SectionWrapper>
    </>
  );
}