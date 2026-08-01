"use client";

import { motion } from "framer-motion";
import { User } from "lucide-react";

interface Member {
  id: string;
  name: string;
  role: string;
  department?: string;
  joinedYear?: string;
  bio?: string;
  image?: string;
}

interface MemberCardProps {
  member: Member;
  index: number;
  isAdmin?: boolean;
  onEdit?: (member: Member) => void;
  onDelete?: (id: string) => void;
}

export function MemberCard({ member, index, isAdmin, onEdit, onDelete }: MemberCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: "easeOut" }}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
    >
      {/* Photo area */}
      <div className="relative h-52 md:h-56 bg-gradient-to-br from-[#F3E5F5] to-[#E8EDFF] overflow-hidden">
        {member.image ? (
          <div className="absolute inset-0 bg-[#E8EDFF] flex items-center justify-center">
            <User className="size-20 text-[#4A148C]/15" />
            <span className="absolute text-xs text-[#4A148C]/30 font-medium">Photo</span>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-white/80 flex items-center justify-center shadow-inner">
              <User className="size-10 text-[#4A148C]/40" />
            </div>
          </div>
        )}

        {/* Role badge */}
        {member.role && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-[#4A148C]/90 text-white text-xs font-semibold backdrop-blur-sm">
              {member.role}
            </span>
          </div>
        )}

        {/* Department badge */}
        {member.department && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-white/90 text-[#4A148C] text-xs font-medium backdrop-blur-sm">
              {member.department}
            </span>
          </div>
        )}

        {/* Hover overlay for admin actions */}
        {isAdmin && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-end justify-end p-3 opacity-0 group-hover:opacity-100">
            {onEdit && (
              <button
                onClick={() => onEdit(member)}
                className="px-3 py-1.5 rounded-lg bg-white text-[#4A148C] text-xs font-semibold hover:bg-[#F3E5F5] transition-colors shadow-md"
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(member.id)}
                className="ml-2 px-3 py-1.5 rounded-lg bg-[#D32F2F] text-white text-xs font-semibold hover:bg-[#B71C1C] transition-colors shadow-md"
              >
                Remove
              </button>
            )}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 md:p-5">
        <h3 className="text-base md:text-lg font-bold text-[#4A148C] leading-tight truncate">
          {member.name}
        </h3>
        {member.bio && (
          <p className="mt-1.5 text-sm text-gray-500 leading-relaxed line-clamp-2">
            {member.bio}
          </p>
        )}
        {member.joinedYear && (
          <p className="mt-2 text-xs text-gray-400">
            Member since {member.joinedYear}
          </p>
        )}
      </div>
    </motion.div>
  );
}