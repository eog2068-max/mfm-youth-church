"use client";

/**
 * GafAdminAuditLog — admin audit trail viewer.
 *
 * Stage 6 of Go-A-Fishing.
 */
import { useState, useCallback, useEffect } from "react";
import { Shield, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface LogEntry {
  id: string;
  action: string;
  entityType: string;
  entityId: string | null;
  metadata: string;
  ipAddress: string | null;
  createdAt: string;
  actorMember: { fullName: string; email: string } | null;
}

export function GafAdminAuditLog() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/gaf/admin/audit-log?take=100");
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed");
      setLogs(data.logs);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  return (
    <div className="p-4 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#4A148C]">Audit Log</h1>
          <p className="text-sm text-gray-500 mt-1">
            {total} {total === 1 ? "entry" : "entries"} — admin action trail
          </p>
        </div>
        <Button variant="outline" onClick={fetchLogs} className="gap-2 rounded-xl">
          <RefreshCw className="size-4" />
          Refresh
        </Button>
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
      ) : logs.length === 0 ? (
        <Card className="border-0 shadow-md">
          <CardContent className="py-12 text-center">
            <Shield className="size-10 mx-auto text-gray-300 mb-2" />
            <p className="text-gray-500">No admin actions recorded yet.</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-0 shadow-md">
          <CardContent className="p-0">
            <ul className="divide-y divide-gray-100">
              {logs.map((log) => (
                <li key={log.id} className="p-4 hover:bg-gray-50">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 bg-[#4A148C]/10 text-[#4A148C] rounded text-xs font-mono">
                          {log.action}
                        </span>
                        <span className="text-xs text-gray-400">
                          {log.entityType}
                          {log.entityId && `:${log.entityId.slice(0, 8)}`}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        by <span className="font-medium">{log.actorMember?.fullName || "System"}</span>
                        {log.actorMember?.email && (
                          <span className="text-gray-400"> ({log.actorMember.email})</span>
                        )}
                      </p>
                    </div>
                    <p className="text-xs text-gray-400 shrink-0">
                      {new Date(log.createdAt).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </p>
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
