"use client";

/**
 * GafAdminConfig — AdminConfig editor for admin.
 *
 * Stage 6 of Go-A-Fishing.
 */
import { useState, useEffect, useCallback } from "react";
import { Loader2, Save, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface Config {
  id: string;
  referralLinkBaseUrl: string;
  qrCodeDefaultColor: string;
  qrCodeDefaultSize: number;
  leaderboardRefreshIntervalSec: number;
  leaderboardShowRealNames: boolean;
  leaderboardShowPhotos: boolean;
  leaderboardTopN: number;
  defaultRewardCycleQuarters: number;
  outreachActivitySelfReportAllowed: boolean;
  requireAdminApprovalForReferral: boolean;
  scoringWeights: string;
  featureFlags: string;
}

const DEFAULT_WEIGHTS = { invited: 1, attended: 5, saved: 10, baptized: 25, member: 50, lost_contact: 0 };

export function GafAdminConfig() {
  const [config, setConfig] = useState<Config | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [weights, setWeights] = useState(DEFAULT_WEIGHTS);

  const fetchConfig = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/gaf/admin/config");
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed");
      setConfig(data.config);
      try {
        const parsed = JSON.parse(data.config.scoringWeights);
        setWeights({ ...DEFAULT_WEIGHTS, ...parsed });
      } catch { /* use defaults */ }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load config");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchConfig(); }, [fetchConfig]);

  const handleSave = async () => {
    if (!config) return;
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch("/api/gaf/admin/config", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          referralLinkBaseUrl: config.referralLinkBaseUrl,
          qrCodeDefaultColor: config.qrCodeDefaultColor,
          qrCodeDefaultSize: config.qrCodeDefaultSize,
          leaderboardRefreshIntervalSec: config.leaderboardRefreshIntervalSec,
          leaderboardShowRealNames: config.leaderboardShowRealNames,
          leaderboardShowPhotos: config.leaderboardShowPhotos,
          leaderboardTopN: config.leaderboardTopN,
          outreachActivitySelfReportAllowed: config.outreachActivitySelfReportAllowed,
          requireAdminApprovalForReferral: config.requireAdminApprovalForReferral,
          scoringWeights: JSON.stringify(weights),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed");
      setConfig(data.config);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const updateConfig = (key: keyof Config, value: unknown) => {
    setConfig((prev) => prev ? { ...prev, [key]: value } : prev);
  };

  if (loading) {
    return (
      <div className="p-4 lg:p-8 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="size-8 text-[#4A148C] animate-spin" />
      </div>
    );
  }

  if (!config) {
    return (
      <div className="p-4 lg:p-8">
        <Card className="border-0 shadow-md p-12 text-center text-gray-500">
          <AlertCircle className="size-10 mx-auto mb-2" />
          <p>Failed to load configuration.</p>
          <Button variant="outline" className="mt-4" onClick={fetchConfig}>
            <RefreshCw className="size-4" /> Retry
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#4A148C]">Configuration</h1>
          <p className="text-sm text-gray-500 mt-1">
            Scoring weights, leaderboard settings, and feature flags
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#4A148C] hover:bg-[#1A0033] text-white rounded-xl gap-2"
        >
          {saving ? <Loader2 className="size-4 animate-spin" /> : saved ? <CheckCircle2 className="size-4" /> : <Save className="size-4" />}
          {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
        </Button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          <AlertCircle className="size-4" />
          <p>{error}</p>
        </div>
      )}

      {/* Scoring weights */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg text-[#4A148C]">Scoring Weights</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(DEFAULT_WEIGHTS).map(([key, _default]) => (
            <div key={key} className="space-y-1.5">
              <Label className="text-xs text-gray-500 capitalize">{key.replace("_", " ")}</Label>
              <Input
                type="number"
                min={0}
                value={weights[key as keyof typeof weights] ?? _default}
                onChange={(e) =>
                  setWeights((prev) => ({
                    ...prev,
                    [key]: Number(e.target.value) || 0,
                  }))
                }
                className="rounded-xl"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Referral link settings */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg text-[#4A148C]">Referral Link</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-gray-500">Base URL</Label>
            <Input
              value={config.referralLinkBaseUrl}
              onChange={(e) => updateConfig("referralLinkBaseUrl", e.target.value)}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-gray-500">QR Default Color</Label>
            <div className="flex gap-2">
              <div className="w-10 h-10 rounded-lg border shrink-0" style={{ backgroundColor: config.qrCodeDefaultColor }} />
              <Input
                value={config.qrCodeDefaultColor}
                onChange={(e) => updateConfig("qrCodeDefaultColor", e.target.value)}
                placeholder="#4A148C"
                className="rounded-xl"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard settings */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg text-[#4A148C]">Leaderboard</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-gray-500">Refresh Interval (seconds)</Label>
            <Input
              type="number"
              min={30}
              value={config.leaderboardRefreshIntervalSec}
              onChange={(e) => updateConfig("leaderboardRefreshIntervalSec", Number(e.target.value))}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-gray-500">Top N Display</Label>
            <Input
              type="number"
              min={3}
              max={100}
              value={config.leaderboardTopN}
              onChange={(e) => updateConfig("leaderboardTopN", Number(e.target.value))}
              className="rounded-xl"
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm">Show Real Names</Label>
            <Switch
              checked={config.leaderboardShowRealNames}
              onCheckedChange={(v) => updateConfig("leaderboardShowRealNames", v)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm">Show Photos</Label>
            <Switch
              checked={config.leaderboardShowPhotos}
              onCheckedChange={(v) => updateConfig("leaderboardShowPhotos", v)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Feature flags */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg text-[#4A148C]">Feature Flags</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm">Self-Report Referrals</Label>
              <p className="text-xs text-gray-500">Allow members to manually add referrals</p>
            </div>
            <Switch
              checked={config.outreachActivitySelfReportAllowed}
              onCheckedChange={(v) => updateConfig("outreachActivitySelfReportAllowed", v)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm">Require Admin Approval</Label>
              <p className="text-xs text-gray-500">New referrals need admin approval before counting</p>
            </div>
            <Switch
              checked={config.requireAdminApprovalForReferral}
              onCheckedChange={(v) => updateConfig("requireAdminApprovalForReferral", v)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
