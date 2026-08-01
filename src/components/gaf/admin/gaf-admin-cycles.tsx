"use client";

/**
 * GafAdminCycles — cycle management page for admin.
 *
 * Stage 6 of Go-A-Fishing.
 */
import { useState, useCallback, useEffect } from "react";
import {
  Trophy,
  Loader2,
  AlertCircle,
  Plus,
  Lock,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  active: boolean;
}

interface Cycle {
  id: string;
  name: string;
  year: number;
  quarter: number;
  startDate: string;
  endDate: string;
  status: string;
  category: { name: string; icon: string; color: string };
  _count: { winners: number };
}

const STATUS_COLORS: Record<string, string> = {
  open: "bg-emerald-100 text-emerald-700",
  tallying: "bg-amber-100 text-amber-700",
  closed: "bg-gray-100 text-gray-600",
};

export function GafAdminCycles({ categories }: { categories: Category[] }) {
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [closingId, setClosingId] = useState<string | null>(null);
  const [newCat, setNewCat] = useState("");
  const [newYear, setNewYear] = useState(new Date().getFullYear().toString());
  const [newQuarter, setNewQuarter] = useState("");

  const fetchCycles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/gaf/admin/cycles");
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed");
      setCycles(data.cycles);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load cycles");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCycles(); }, [fetchCycles]);

  const handleCreate = async () => {
    if (!newCat || !newYear || !newQuarter) return;
    setCreating(true);
    try {
      const res = await fetch("/api/gaf/admin/cycles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryId: newCat, year: Number(newYear), quarter: Number(newQuarter) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed");
      setCreateOpen(false);
      setNewCat("");
      setNewQuarter("");
      fetchCycles();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to create cycle");
    } finally {
      setCreating(false);
    }
  };

  const handleClose = async (id: string) => {
    if (!confirm("Close this cycle? This will compute and lock the top 3 winners.")) return;
    setClosingId(id);
    try {
      const res = await fetch(`/api/gaf/admin/cycles/${id}`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed");
      alert(`Cycle closed. ${data.winnersCount} winner(s) recorded.`);
      fetchCycles();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to close");
    } finally {
      setClosingId(null);
    }
  };

  return (
    <div className="p-4 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#4A148C]">Reward Cycles</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage quarterly award cycles and compute winners
          </p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#4A148C] hover:bg-[#1A0033] text-white rounded-xl gap-2">
              <Plus className="size-4" />
              New Cycle
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Reward Cycle</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select value={newCat} onValueChange={setNewCat}>
                  <SelectTrigger><SelectValue placeholder="Select category..." /></SelectTrigger>
                  <SelectContent>
                    {categories.filter((c) => c.active).map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Year</label>
                  <Input
                    type="number"
                    value={newYear}
                    onChange={(e) => setNewYear(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Quarter</label>
                  <Select value={newQuarter} onValueChange={setNewQuarter}>
                    <SelectTrigger><SelectValue placeholder="Q1-Q4" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Q1 (Jan-Mar)</SelectItem>
                      <SelectItem value="2">Q2 (Apr-Jun)</SelectItem>
                      <SelectItem value="3">Q3 (Jul-Sep)</SelectItem>
                      <SelectItem value="4">Q4 (Oct-Dec)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
              <Button
                onClick={handleCreate}
                disabled={creating || !newCat || !newQuarter}
                className="bg-[#4A148C] hover:bg-[#1A0033] text-white gap-2"
              >
                {creating ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          <AlertCircle className="size-4" />
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <Card className="border-0 shadow-md">
          <CardContent className="py-16 flex justify-center">
            <Loader2 className="size-8 text-[#4A148C] animate-spin" />
          </CardContent>
        </Card>
      ) : cycles.length === 0 ? (
        <Card className="border-0 shadow-md">
          <CardContent className="py-12 text-center">
            <Trophy className="size-10 mx-auto text-gray-300 mb-2" />
            <p className="text-gray-500">No cycles created yet. Click &quot;New Cycle&quot; to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cycles.map((cycle) => (
            <Card key={cycle.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <div className="h-1.5 bg-gradient-to-r from-amber-400 to-amber-600 rounded-t-lg" />
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-[#4A148C]">{cycle.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{cycle.category.name}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[cycle.status] || STATUS_COLORS.closed}`}>
                    {cycle.status.toUpperCase()}
                  </span>
                </div>
                <div className="text-xs text-gray-400 space-y-0.5">
                  <p>{new Date(cycle.startDate).toLocaleDateString()} — {new Date(cycle.endDate).toLocaleDateString()}</p>
                  <p>{cycle._count.winners} winner(s)</p>
                </div>
                {cycle.status === "open" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleClose(cycle.id)}
                    disabled={closingId === cycle.id}
                    className="w-full gap-2 rounded-xl border-amber-300 text-amber-700 hover:bg-amber-50"
                  >
                    {closingId === cycle.id ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Lock className="size-4" />
                    )}
                    Close Cycle &amp; Compute Winners
                  </Button>
                )}
                {cycle.status === "closed" && (
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <CheckCircle2 className="size-3" /> Cycle closed — winners locked
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
