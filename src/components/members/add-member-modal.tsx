"use client";

import { useState } from "react";
import { X, Upload, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface AddMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const departments = [
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
  "Media",
  "Decoration",
];

const roles = ["Worker", "Deacon", "Deaconess", "Assistant Pastor", "Elder"];

export function AddMemberModal({ open, onOpenChange }: AddMemberModalProps) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("Worker");
  const [department, setDepartment] = useState("");
  const [bio, setBio] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Will connect to Supabase when admin auth is wired
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitting(false);
    onOpenChange(false);
    setName("");
    setRole("Worker");
    setDepartment("");
    setBio("");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-5 md:p-6 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-[#4A148C]">Add New Member</h2>
            <p className="text-xs text-gray-500 mt-0.5">This member will appear in the gallery</p>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 md:p-6 space-y-5">
          {/* Photo upload placeholder */}
          <div className="flex justify-center">
            <div className="w-28 h-28 rounded-2xl bg-[#F3E5F5] border-2 border-dashed border-[#4A148C]/20 flex flex-col items-center justify-center cursor-pointer hover:bg-[#E8EDFF] hover:border-[#4A148C]/40 transition-colors group">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                <User className="size-5 text-[#4A148C]/50" />
              </div>
              <div className="mt-2 flex items-center gap-1 text-xs text-[#4A148C]/60 font-medium">
                <Upload className="size-3" />
                Upload Photo
              </div>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Full Name <span className="text-[#D32F2F]">*</span>
            </label>
            <Input
              required
              placeholder="e.g. Brother John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl border-gray-200 h-11 focus:border-[#4A148C]/30"
            />
          </div>

          {/* Role + Department row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Role <span className="text-[#D32F2F]">*</span>
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 appearance-none cursor-pointer focus:outline-none focus:border-[#4A148C]/30 focus:ring-2 focus:ring-[#4A148C]/10"
              >
                {roles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Department <span className="text-[#D32F2F]">*</span>
              </label>
              <select
                required
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 appearance-none cursor-pointer focus:outline-none focus:border-[#4A148C]/30 focus:ring-2 focus:ring-[#4A148C]/10"
              >
                <option value="" disabled>
                  Select...
                </option>
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Short Bio
            </label>
            <Textarea
              placeholder="A brief description about this member..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="rounded-xl border-gray-200 resize-none focus:border-[#4A148C]/30"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 rounded-xl h-11 border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting || !name || !department}
              className="flex-1 rounded-xl h-11 bg-[#4A148C] hover:bg-[#1A0033] text-white font-semibold disabled:opacity-50"
            >
              {submitting ? "Adding..." : "Add Member"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}