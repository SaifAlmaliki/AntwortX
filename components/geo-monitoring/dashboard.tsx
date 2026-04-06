"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/components/geo-monitoring/metric-card";
import { StatusBadge } from "@/components/geo-monitoring/status-badge";
import { MonitoringSettings } from "@/components/geo-monitoring/settings-dialog";
import { EngineIcon, EngineName } from "@/components/geo-monitoring/engine-icon";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import { Activity, Link2, MessageSquare, TrendingUp, Shield, Zap, BarChart3, Eye, Plus, RefreshCw, Play } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface MonitoringConfig {
  id: string;
  brandName: string;
  websiteUrl: string;
  category: string;
  frequency: string;
  isActive: boolean;
  engines: string[];
  nextCheckAt: string | null;
  checks: Array<{
    id: string;
    status: string;
    geoScore: number | null;
    shareOfVoice: number | null;
    citationRate: number | null;
    brandSentiment: string | null;
    promptCoverage: number | null;
    snippetFrequency: number | null;
    brandAuthority: number | null;
    zeroClickPresence: number | null;
    checkDate: string;
    engineResults?: Record<string, { mentioned: boolean; cited: boolean; mentions: number; sentiment: string }>;
  }>;
}

export function MonitoringDashboard() {
  const [monitoring, setMonitoring] = useState<MonitoringConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [runningCheck, setRunningCheck] = useState(false);

  useEffect(() => {
    fetchMonitoring();
  }, []);

  async function fetchMonitoring() {
    try {
      const res = await fetch("/api/geo-monitoring");
      const data = await res.json();
      setMonitoring(data.monitoring || []);
      if (data.monitoring?.length > 0 && !selectedId) {
        setSelectedId(data.monitoring[0].id);
      }
    } catch (error) {
      console.error("Failed to fetch monitoring:", error);
    } finally {
      setLoading(false);
    }
  }

  async function runCheckNow() {
    if (!selectedId) return;
    setRunningCheck(true);
    try {
      const res = await fetch(`/api/geo-monitoring/${selectedId}/run-now`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to run check");
      const data = await res.json();
      toast.success("Check completed", { description: `GEO Score: ${data.metrics?.geoScore ?? "N/A"}` });
      await fetchMonitoring();
    } catch (error) {
      toast.error("Check failed", { description: "An error occurred while running the check." });
    } finally {
      setRunningCheck(false);
    }
  }

  const selected = monitoring.find(m => m.id === selectedId);
  const latestCheck = selected?.checks?.[0];

  const metricConfig = [
    { label: "GEO Score", value: latestCheck?.geoScore ?? "—", unit: latestCheck?.geoScore != null ? "/100" : undefined, description: "Overall visibility across AI engines" },
    { label: "Share of Voice", value: latestCheck?.shareOfVoice ?? "—", unit: latestCheck?.shareOfVoice != null ? "%" : undefined, description: "Brand mentions vs competitors" },
    { label: "Citation Rate", value: latestCheck?.citationRate ?? "—", unit: latestCheck?.citationRate != null ? "%" : undefined, description: "How often your site is cited" },
    { label: "Brand Sentiment", value: latestCheck?.brandSentiment ?? "—", description: "Sentiment in AI responses" },
    { label: "Prompt Coverage", value: latestCheck?.promptCoverage ?? "—", unit: latestCheck?.promptCoverage != null ? "prompts" : undefined, description: "Unique prompts triggering brand" },
    { label: "Snippet Frequency", value: latestCheck?.snippetFrequency ?? "—", unit: latestCheck?.snippetFrequency != null ? "avg" : undefined, description: "Content snippets retrieved" },
    { label: "Brand Authority", value: latestCheck?.brandAuthority ?? "—", unit: latestCheck?.brandAuthority != null ? "/100" : undefined, description: "Authority score from sources" },
    { label: "Zero-Click Presence", value: latestCheck?.zeroClickPresence ?? "—", unit: latestCheck?.zeroClickPresence != null ? "%" : undefined, description: "Mentions without citations" },
  ];

  if (loading) {
    return (
      <div className="min-h-dvh bg-page">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="card-surface h-32 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (monitoring.length === 0) {
    return (
      <div className="min-h-dvh bg-page">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Activity className="mx-auto size-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No monitoring configured</h2>
            <p className="text-muted-foreground mb-6 text-balance max-w-md mx-auto">
              Set up your first brand to track how AI engines discover, cite, and recommend your brand.
            </p>
            <Button className="btn-signal-primary" onClick={() => setSettingsOpen(true)}>
              <Plus className="mr-2 size-4" />
              Add Monitoring
            </Button>
          </motion.div>
        </div>
        <MonitoringSettings
          open={settingsOpen}
          onOpenChange={setSettingsOpen}
          onSuccess={fetchMonitoring}
        />
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-page">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold">GEO Monitoring</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Track your brand visibility across AI engines
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setSettingsOpen(true)}>
              <Plus className="mr-2 size-3.5" />
              Add Brand
            </Button>
          </div>
        </div>

        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          {monitoring.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedId(m.id)}
              className={`flex-shrink-0 px-4 py-3 rounded-lg border text-left transition-colors ${
                selectedId === m.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/30"
              }`}
            >
              <p className="font-medium text-sm">{m.brandName}</p>
              <p className="text-xs text-muted-foreground">{m.category}</p>
            </button>
          ))}
        </div>

        {selected && (
          <motion.div
            key={selected.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold">{selected.brandName}</h2>
                <p className="text-sm text-muted-foreground">
                  {selected.websiteUrl} · {selected.category}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  {selected.engines.map((engine) => (
                    <EngineIcon key={engine} engine={engine} />
                  ))}
                </div>
                {latestCheck && <StatusBadge status={latestCheck.status as any} />}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={runCheckNow}
                  disabled={runningCheck}
                >
                  <Play className="mr-1.5 size-3.5" />
                  {runningCheck ? "Running..." : "Run Now"}
                </Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              {metricConfig.map((metric) => (
                <MetricCard
                  key={metric.label}
                  label={metric.label}
                  value={metric.value}
                  unit={metric.unit}
                  description={metric.description}
                />
              ))}
            </div>

            {latestCheck?.geoScore != null && (
              <Card className="card-surface mb-8">
                <CardHeader>
                  <CardTitle className="text-base">GEO Score Trend</CardTitle>
                  <CardDescription>Score over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={selected.checks.filter(c => c.geoScore != null).map(c => ({
                        date: format(new Date(c.checkDate), "MMM d"),
                        score: c.geoScore,
                      })).reverse()}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground) / 0.1)" />
                        <XAxis dataKey="date" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                        <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                            fontSize: "12px",
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="score"
                          stroke="hsl(var(--primary))"
                          strokeWidth={2}
                          dot={{ fill: "hsl(var(--primary))", strokeWidth: 0, r: 3 }}
                          activeDot={{ r: 5 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="card-surface">
              <CardHeader>
                <CardTitle className="text-base">Engine Breakdown</CardTitle>
                <CardDescription>Performance by AI engine</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selected.engines.map((engine) => (
                    <div key={engine} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                      <div className="flex items-center gap-3">
                        <EngineIcon engine={engine} />
                        <span className="text-sm font-medium"><EngineName engine={engine} /></span>
                      </div>
                      <div className="flex items-center gap-6 text-sm tabular-nums">
                        <span className="text-muted-foreground">
                          Mentions: {latestCheck?.engineResults?.[engine]?.mentions ?? 0}
                        </span>
                        <span className="text-muted-foreground">
                          Citations: {latestCheck?.engineResults?.[engine]?.cited ? "Yes" : "No"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      <MonitoringSettings
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        onSuccess={fetchMonitoring}
      />
    </div>
  );
}
