"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, LayoutGrid, List, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MemberCard } from "./member-card";
import { AddMemberModal } from "./add-member-modal";
import { SectionWrapper, SectionTitle } from "@/components/home/section-wrapper";

interface Member {
  id: string;
  name: string;
  role: string;
  department?: string;
  joinedYear?: string;
  bio?: string;
  image?: string;
}

const mockMembers: Member[] = [
  {
    id: "1",
    name: "Brother Emmanuel Okafor",
    role: "Worker",
    department: "Ushering",
    joinedYear: "2019",
    bio: "A dedicated usher who ensures every service runs with order and warmth.",
  },
  {
    id: "2",
    name: "Sister Grace Adeyemi",
    role: "Worker",
    department: "Choir",
    joinedYear: "2018",
    bio: "A gifted vocalist leading worship with passion and excellence.",
  },
  {
    id: "3",
    name: "Brother David Ishaku",
    role: "Deacon",
    department: "Technical",
    joinedYear: "2017",
    bio: "Oversees all audio-visual and technical operations during services.",
  },
  {
    id: "4",
    name: "Sister Peace Obi",
    role: "Worker",
    department: "Children Church",
    joinedYear: "2020",
    bio: "Passionate about nurturing the next generation in the Word of God.",
  },
  {
    id: "5",
    name: "Brother Samuel Eze",
    role: "Worker",
    department: "Evangelism",
    joinedYear: "2019",
    bio: "Committed to spreading the Gospel and reaching the unsaved in the community.",
  },
  {
    id: "6",
    name: "Sister Faith Balogun",
    role: "Worker",
    department: "Welfare",
    joinedYear: "2021",
    bio: "Coordinates welfare activities and support for members in need.",
  },
  {
    id: "7",
    name: "Brother Joshua Musa",
    role: "Worker",
    department: "Sanctuary Keepers",
    joinedYear: "2020",
    bio: "Ensures the sanctuary is always clean and prepared for worship.",
  },
  {
    id: "8",
    name: "Sister Ruth Tanko",
    role: "Worker",
    department: "Follow-up",
    joinedYear: "2022",
    bio: "Dedicated to following up with new converts and first-time worshippers.",
  },
  {
    id: "9",
    name: "Brother Paul Chukwu",
    role: "Worker",
    department: "Ushering",
    joinedYear: "2018",
    bio: "A warm and hospitable usher committed to making everyone feel welcome.",
  },
  {
    id: "10",
    name: "Sister Mercy Adekunle",
    role: "Worker",
    department: "Choir",
    joinedYear: "2021",
    bio: "A talented instrumentalist who adds beauty to our worship services.",
  },
  {
    id: "11",
    name: "Brother Daniel Bello",
    role: "Deacon",
    department: "Finance",
    joinedYear: "2017",
    bio: "Manages the financial records and accountability of the parish.",
  },
  {
    id: "12",
    name: "Sister Hope Ogbonna",
    role: "Worker",
    department: "Prayer Ministry",
    joinedYear: "2019",
    bio: "A prayer warrior committed to interceding for the church and community.",
  },
];

const departments = [
  "All Departments",
  "Ushering",
  "Choir",
  "Technical",
  "Children Church",
  "Evangelism",
  "Welfare",
  "Sanctuary Keepers",
  "Follow-up",
  "Finance",
  "Prayer Ministry",
];

export function MembersGallery() {
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showAddModal, setShowAddModal] = useState(false);
  const [isAdmin] = useState(false); // Will be connected to Supabase auth later

  const filtered = mockMembers.filter((m) => {
    const matchSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.role.toLowerCase().includes(search.toLowerCase()) ||
      (m.department && m.department.toLowerCase().includes(search.toLowerCase()));
    const matchDept = selectedDept === "All Departments" || m.department === selectedDept;
    return matchSearch && matchDept;
  });

  return (
    <section className="py-16 md:py-20 bg-[#F8FAFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionWrapper>
          <SectionTitle
            title="Our Members"
            subtitle="The beautiful people who make Youth Church a thriving family of faith"
          />
        </SectionWrapper>

        {/* Controls Bar */}
        <SectionWrapper>
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between mb-8">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <Input
                placeholder="Search by name, role, or department..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 rounded-xl border-gray-200 bg-white h-11 focus:border-[#4A148C]/30"
              />
            </div>

            <div className="flex items-center gap-3">
              {/* Department filter */}
              <div className="relative">
                <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="pl-10 pr-8 h-11 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 appearance-none cursor-pointer focus:outline-none focus:border-[#4A148C]/30 focus:ring-2 focus:ring-[#4A148C]/10"
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              {/* View toggle */}
              <div className="hidden sm:flex items-center bg-white rounded-xl border border-gray-200 p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "grid"
                      ? "bg-[#4A148C] text-white"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                  aria-label="Grid view"
                >
                  <LayoutGrid className="size-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "list"
                      ? "bg-[#4A148C] text-white"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                  aria-label="List view"
                >
                  <List className="size-4" />
                </button>
              </div>

              {/* Admin: Add Member button */}
              {isAdmin && (
                <Button
                  onClick={() => setShowAddModal(true)}
                  className="bg-[#4A148C] hover:bg-[#1A0033] text-white rounded-xl h-11 font-semibold shadow-md"
                >
                  <Plus className="size-4" />
                  Add Member
                </Button>
              )}
            </div>
          </div>
        </SectionWrapper>

        {/* Results count */}
        <p className="text-sm text-gray-500 mb-6">
          Showing <span className="font-semibold text-[#4A148C]">{filtered.length}</span> member{filtered.length !== 1 ? "s" : ""}
          {selectedDept !== "All Departments" && (
            <span> in <span className="font-medium text-gray-700">{selectedDept}</span></span>
          )}
        </p>

        {/* Grid / List Layout */}
        {filtered.length > 0 ? (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6"
                : "flex flex-col gap-4"
            }
          >
            {filtered.map((member, i) =>
              viewMode === "grid" ? (
                <MemberCard
                  key={member.id}
                  member={member}
                  index={i}
                  isAdmin={isAdmin}
                  onEdit={() => {}}
                  onDelete={() => {}}
                />
              ) : (
                <MemberListItem key={member.id} member={member} index={i} />
              )
            )}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Search className="size-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700">No members found</h3>
            <p className="text-sm text-gray-500 mt-1">
              Try adjusting your search or filter to find what you&apos;re looking for.
            </p>
          </motion.div>
        )}
      </div>

      {/* Add Member Modal */}
      {showAddModal && <AddMemberModal open={showAddModal} onOpenChange={setShowAddModal} />}
    </section>
  );
}

/* List view variant */
function MemberListItem({ member, index }: { member: Member; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
    >
      {/* Avatar */}
      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#F3E5F5] to-[#E8EDFF] flex items-center justify-center shrink-0">
        <span className="text-lg font-bold text-[#4A148C]">
          {member.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-[#4A148C] truncate">{member.name}</h3>
        <p className="text-xs text-gray-500 mt-0.5">
          {member.role}
          {member.department && (
            <span className="text-gray-400"> &middot; {member.department}</span>
          )}
        </p>
      </div>

      {member.joinedYear && (
        <span className="hidden sm:inline-flex text-xs text-gray-400 shrink-0">
          Since {member.joinedYear}
        </span>
      )}
    </motion.div>
  );
}