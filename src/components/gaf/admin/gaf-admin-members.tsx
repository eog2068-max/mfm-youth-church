"use client";

/**
 * GafAdminMembers — member management page for admin.
 *
 * Stage 6 of Go-A-Fishing.
 */
import { useState, useCallback } from "react";
import {
  Search,
  Loader2,
  Ban,
  CheckCircle2,
  UserCheck,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Member {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  referralCode: string;
  avatarUrl: string | null;
  status: string;
  joinDate: string;
  createdAt: string;
  _count: { referralsMade: number; rewardWinners: number; commendations: number };
}

const STATUS_STYLES: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700",
  suspended: "bg-red-100 text-red-700",
  inactive: "bg-gray-100 text-gray-600",
};

export function GafAdminMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchMembers = useCallback(async (searchTerm: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ take: "50" });
      if (searchTerm) params.set("search", searchTerm);
      const res = await fetch(`/api/gaf/admin/members?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to load");
      setMembers(data.members);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load members");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load.
  useState(() => { fetchMembers(""); });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMembers(search);
  };

  const handleStatusChange = async (memberId: string, newStatus: string) => {
    setActionLoading(memberId);
    try {
      const res = await fetch(`/api/gaf/admin/members/${memberId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Failed to update");
      }
      setMembers((prev) =>
        prev.map((m) => (m.id === memberId ? { ...m, status: newStatus } : m))
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update member");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="p-4 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-[#4A148C]">Members</h1>
        <p className="text-sm text-gray-500 mt-1">
          {total} registered {total === 1 ? "member" : "members"}
        </p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, phone, or referral code..."
            className="pl-10 rounded-xl"
          />
        </div>
        <Button type="submit" variant="outline" className="rounded-xl">
          Search
        </Button>
      </form>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          <AlertCircle className="size-4 shrink-0" />
          <p>{error}</p>
          <Button variant="ghost" size="sm" onClick={() => fetchMembers(search)}>
            Retry
          </Button>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <Card className="border-0 shadow-md">
          <CardContent className="py-16 flex justify-center">
            <Loader2 className="size-8 text-[#4A148C] animate-spin" />
          </CardContent>
        </Card>
      ) : members.length === 0 ? (
        <Card className="border-0 shadow-md">
          <CardContent className="py-12 text-center text-gray-500">
            No members found.
          </CardContent>
        </Card>
      ) : (
        <Card className="border-0 shadow-md">
          <CardContent className="p-0">
            <ul className="divide-y divide-gray-100">
              {members.map((m) => (
                <li key={m.id} className="flex items-center gap-4 p-4 hover:bg-gray-50">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-[#4A148C]/10 flex items-center justify-center text-sm font-bold text-[#4A148C]">
                    {m.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-[#4A148C] truncate">{m.fullName}</p>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          STATUS_STYLES[m.status] || STATUS_STYLES.active
                        }`}
                      >
                        {m.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {m.email}
                      {m.phone && ` · ${m.phone}`}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                      <span className="font-mono">{m.referralCode}</span>
                      <span>{m._count.referralsMade} referrals</span>
                      <span>{m._count.rewardWinners} awards</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {m.status !== "active" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleStatusChange(m.id, "active")}
                        disabled={actionLoading === m.id}
                        className="text-emerald-600 hover:bg-emerald-50 h-8 w-8 p-0"
                        title="Reactivate"
                      >
                        <UserCheck className="size-4" />
                      </Button>
                    )}
                    {m.status === "active" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleStatusChange(m.id, "suspended")}
                        disabled={actionLoading === m.id}
                        className="text-red-600 hover:bg-red-50 h-8 w-8 p-0"
                        title="Suspend"
                      >
                        <Ban className="size-4" />
                      </Button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
