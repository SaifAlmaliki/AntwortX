"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface MonitoringSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  editingId?: string | null;
  initialData?: {
    brandName: string;
    websiteUrl: string;
    category: string;
    competitors: string;
    frequency: string;
    engines: string[];
  };
}

const ENGINE_OPTIONS = [
  { value: "openai", label: "OpenAI (ChatGPT)" },
  { value: "perplexity", label: "Perplexity" },
  { value: "gemini", label: "Google Gemini" },
  { value: "claude", label: "Anthropic Claude" },
];

export function MonitoringSettings({
  open,
  onOpenChange,
  onSuccess,
  editingId,
  initialData,
}: MonitoringSettingsProps) {
  const [brandName, setBrandName] = useState(initialData?.brandName || "");
  const [websiteUrl, setWebsiteUrl] = useState(initialData?.websiteUrl || "");
  const [category, setCategory] = useState(initialData?.category || "");
  const [competitors, setCompetitors] = useState(initialData?.competitors || "");
  const [frequency, setFrequency] = useState(initialData?.frequency || "weekly");
  const [engines, setEngines] = useState<string[]>(initialData?.engines || ["openai"]);
  const [submitting, setSubmitting] = useState(false);

  function toggleEngine(engine: string) {
    setEngines(prev =>
      prev.includes(engine)
        ? prev.filter(e => e !== engine)
        : [...prev, engine]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!brandName || !websiteUrl || !category) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (engines.length === 0) {
      toast.error("Select at least one AI engine");
      return;
    }

    setSubmitting(true);

    try {
      const competitorList = competitors
        .split(",")
        .map(c => c.trim())
        .filter(Boolean);

      const url = editingId
        ? `/api/geo-monitoring/${editingId}`
        : "/api/geo-monitoring";

      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandName,
          websiteUrl,
          category,
          competitors: competitorList,
          frequency,
          engines,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to save monitoring configuration");
      }

      toast.success(editingId ? "Monitoring updated" : "Monitoring created");
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to save monitoring configuration");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Monitoring" : "New Monitoring"}
            </DialogTitle>
            <DialogDescription>
              {editingId
                ? "Update your monitoring configuration."
                : "Set up a new brand to track across AI engines."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="brandName">Brand Name *</Label>
              <Input
                id="brandName"
                value={brandName}
                onChange={e => setBrandName(e.target.value)}
                placeholder="e.g., Hirios"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="websiteUrl">Website URL *</Label>
              <Input
                id="websiteUrl"
                type="url"
                value={websiteUrl}
                onChange={e => setWebsiteUrl(e.target.value)}
                placeholder="https://example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                value={category}
                onChange={e => setCategory(e.target.value)}
                placeholder="e.g., HR software, project management tools"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="competitors">Competitors</Label>
              <Textarea
                id="competitors"
                value={competitors}
                onChange={e => setCompetitors(e.target.value)}
                placeholder="Competitor A, Competitor B, Competitor C"
                rows={2}
              />
              <p className="text-xs text-muted-foreground">
                Comma-separated list for Share of Voice calculation
              </p>
            </div>

            <div className="space-y-2">
              <Label>AI Engines *</Label>
              <div className="grid grid-cols-2 gap-2">
                {ENGINE_OPTIONS.map(engine => (
                  <button
                    key={engine.value}
                    type="button"
                    onClick={() => toggleEngine(engine.value)}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                      engines.includes(engine.value)
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:border-primary/30"
                    }`}
                  >
                    <span
                      className={`size-3 rounded-full border ${
                        engines.includes(engine.value)
                          ? "border-primary bg-primary"
                          : "border-muted-foreground"
                      }`}
                    />
                    {engine.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="frequency">Check Frequency</Label>
              <select
                id="frequency"
                value={frequency}
                onChange={e => setFrequency(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="weekly">Weekly</option>
                <option value="daily">Daily</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="btn-signal-primary"
              disabled={submitting}
            >
              {submitting ? "Saving..." : editingId ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
