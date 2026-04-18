"use client";

import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { toast } from "sonner";
import { ChevronDown } from "lucide-react";

export type PositioningInitial = {
  category?: string;
  services?: string[];
  industryVerticals?: string[];
  geographies?: string[];
  capabilities?: string[];
  icpSize?: "SMB" | "Mid-market" | "Enterprise" | "Mixed";
  buyerRoles?: string[];
  differentiators?: string[];
  targetAudience?: string;
};

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
    positioning?: PositioningInitial | null;
  };
}

const ENGINE_OPTIONS = [
  { value: "openai", label: "OpenAI (ChatGPT)" },
  { value: "perplexity", label: "Perplexity" },
  { value: "gemini", label: "Google Gemini" },
  { value: "claude", label: "Anthropic Claude" },
];

function splitComma(s: string): string[] {
  return s
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

function hasPositioningInput(
  industryVerticalsText: string,
  geographiesText: string,
  capabilitiesText: string,
  buyerRolesText: string,
  differentiatorsText: string,
  targetAudienceText: string
): boolean {
  return (
    industryVerticalsText.trim().length > 0 ||
    geographiesText.trim().length > 0 ||
    capabilitiesText.trim().length > 0 ||
    buyerRolesText.trim().length > 0 ||
    differentiatorsText.trim().length > 0 ||
    targetAudienceText.trim().length > 0
  );
}

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
  const [regenerating, setRegenerating] = useState(false);
  const [positioningOpen, setPositioningOpen] = useState(false);

  const [industryVerticalsText, setIndustryVerticalsText] = useState("");
  const [geographiesText, setGeographiesText] = useState("");
  const [capabilitiesText, setCapabilitiesText] = useState("");
  const [buyerRolesText, setBuyerRolesText] = useState("");
  const [differentiatorsText, setDifferentiatorsText] = useState("");
  const [icpSize, setIcpSize] = useState<"SMB" | "Mid-market" | "Enterprise" | "Mixed">("Mixed");
  const [targetAudienceText, setTargetAudienceText] = useState("");

  /** Last (open, editingId) we hydrated from the server — avoids re-seeding when `initialData` identity changes after refetch while the user is editing. */
  const lastHydratedSessionRef = useRef<string | null>(null);

  useEffect(() => {
    if (!open) {
      lastHydratedSessionRef.current = null;
      return;
    }

    const sessionKey = `${editingId ?? "__new__"}`;
    if (lastHydratedSessionRef.current === sessionKey) {
      return;
    }
    lastHydratedSessionRef.current = sessionKey;

    setBrandName(initialData?.brandName || "");
    setWebsiteUrl(initialData?.websiteUrl || "");
    setCategory(initialData?.category || "");
    setCompetitors(initialData?.competitors || "");
    setFrequency(initialData?.frequency || "weekly");
    setEngines(initialData?.engines?.length ? initialData.engines : ["openai"]);

    const p = initialData?.positioning;
    if (p && typeof p === "object") {
      setIndustryVerticalsText(
        Array.isArray(p.industryVerticals) ? p.industryVerticals.join(", ") : ""
      );
      setGeographiesText(Array.isArray(p.geographies) ? p.geographies.join(", ") : "");
      setCapabilitiesText(Array.isArray(p.capabilities) ? p.capabilities.join(", ") : "");
      setBuyerRolesText(Array.isArray(p.buyerRoles) ? p.buyerRoles.join(", ") : "");
      setDifferentiatorsText(
        Array.isArray(p.differentiators) ? p.differentiators.join(", ") : ""
      );
      setIcpSize(p.icpSize ?? "Mixed");
      setTargetAudienceText(typeof p.targetAudience === "string" ? p.targetAudience : "");
    } else {
      setIndustryVerticalsText("");
      setGeographiesText("");
      setCapabilitiesText("");
      setBuyerRolesText("");
      setDifferentiatorsText("");
      setIcpSize("Mixed");
      setTargetAudienceText("");
    }
    // Intentionally omit `initialData` from deps: parent refetch (e.g. after Run check) must not clobber unsaved edits. We only re-seed when the dialog session changes (`open` or `editingId`).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, editingId]);

  function toggleEngine(engine: string) {
    setEngines((prev) =>
      prev.includes(engine) ? prev.filter((e) => e !== engine) : [...prev, engine]
    );
  }

  function buildPositioningPayload() {
    if (
      !hasPositioningInput(
        industryVerticalsText,
        geographiesText,
        capabilitiesText,
        buyerRolesText,
        differentiatorsText,
        targetAudienceText
      )
    ) {
      return undefined;
    }
    return {
      category: category.trim(),
      services: [] as string[],
      industryVerticals: splitComma(industryVerticalsText),
      geographies: splitComma(geographiesText),
      capabilities: splitComma(capabilitiesText),
      icpSize,
      buyerRoles: splitComma(buyerRolesText),
      differentiators: splitComma(differentiatorsText),
      targetAudience: targetAudienceText.trim(),
    };
  }

  async function handleRegeneratePrompts() {
    if (!editingId) {
      toast.error("Save monitoring first", {
        description: "Create the record, then regenerate prompts from the edit dialog.",
      });
      return;
    }
    setRegenerating(true);
    try {
      const res = await fetch(`/api/geo-monitoring/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ regeneratePrompts: true }),
      });
      if (!res.ok) throw new Error("regenerate failed");
      toast.success("Test prompts regenerated");
      onSuccess?.();
    } catch {
      toast.error("Failed to regenerate prompts");
    } finally {
      setRegenerating(false);
    }
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
        .map((c) => c.trim())
        .filter(Boolean);

      const url = editingId ? `/api/geo-monitoring/${editingId}` : "/api/geo-monitoring";

      const method = editingId ? "PATCH" : "POST";

      const positioning = buildPositioningPayload();
      const body: Record<string, unknown> = {
        brandName,
        websiteUrl,
        category,
        competitors: competitorList,
        frequency,
        engines,
      };
      if (positioning) {
        body.positioning = positioning;
      }
      if (editingId && positioning) {
        body.regeneratePrompts = true;
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw new Error("Failed to save monitoring configuration");
      }

      toast.success(editingId ? "Monitoring updated" : "Monitoring created");
      onSuccess?.();
      onOpenChange(false);
    } catch {
      toast.error("Failed to save monitoring configuration");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] max-w-2xl flex-col overflow-y-auto sm:max-w-2xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-0">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Monitoring" : "New Monitoring"}</DialogTitle>
            <DialogDescription>
              {editingId
                ? "Update configuration and niche positioning used for LLM test prompts."
                : "Set up a brand to track. We auto-detect niche positioning from your site after save."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="brandName">Brand Name *</Label>
              <Input
                id="brandName"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="e.g., Hirios"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="websiteUrl">Website URL *</Label>
              <Input
                id="websiteUrl"
                type="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g., Family law firm, K-12 enrollment software, dental practice group"
              />
            </div>

            <Collapsible open={positioningOpen} onOpenChange={setPositioningOpen}>
              <CollapsibleTrigger asChild>
                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded-lg border border-border px-3 py-2 text-left text-sm font-medium hover:bg-muted/50"
                >
                  <span>Positioning (auto-detected / override)</span>
                  <ChevronDown
                    className={`size-4 shrink-0 transition-transform ${positioningOpen ? "rotate-180" : ""}`}
                  />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-3 border-x border-b border-border rounded-b-lg px-3 py-3">
                <p className="text-xs text-muted-foreground">
                  Comma-separated lists. Used to generate realistic buyer prompts from your niche (vertical ×
                  geography × services), not generic one-word category searches.
                </p>
                <div className="space-y-2">
                  <Label htmlFor="industryVerticals">Industry verticals</Label>
                  <Input
                    id="industryVerticals"
                    value={industryVerticalsText}
                    onChange={(e) => setIndustryVerticalsText(e.target.value)}
                    placeholder="e.g., K-12 private schools, plaintiffs’ employment law, independent pharmacy"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="geographies">Geographies</Label>
                  <Input
                    id="geographies"
                    value={geographiesText}
                    onChange={(e) => setGeographiesText(e.target.value)}
                    placeholder="e.g., Texas, Ontario, UK, Dubai, Latin America"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capabilities">Capabilities</Label>
                  <Input
                    id="capabilities"
                    value={capabilitiesText}
                    onChange={(e) => setCapabilitiesText(e.target.value)}
                    placeholder="e.g., bilingual curriculum, estate planning, CRM rollout, preventive care"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="buyerRoles">Buyer roles</Label>
                  <Input
                    id="buyerRoles"
                    value={buyerRolesText}
                    onChange={(e) => setBuyerRolesText(e.target.value)}
                    placeholder="e.g., school principal, practice manager, HR director, parent, GC"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="differentiators">Differentiators</Label>
                  <Input
                    id="differentiators"
                    value={differentiatorsText}
                    onChange={(e) => setDifferentiatorsText(e.target.value)}
                    placeholder="e.g., fixed-fee, local firm, accredited, sector-specific, nonprofit rates"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="icpSize">ICP size</Label>
                  <select
                    id="icpSize"
                    value={icpSize}
                    onChange={(e) =>
                      setIcpSize(e.target.value as "SMB" | "Mid-market" | "Enterprise" | "Mixed")
                    }
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="SMB">SMB</option>
                    <option value="Mid-market">Mid-market</option>
                    <option value="Enterprise">Enterprise</option>
                    <option value="Mixed">Mixed</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetAudience">Target audience (sentence)</Label>
                  <Textarea
                    id="targetAudience"
                    value={targetAudienceText}
                    onChange={(e) => setTargetAudienceText(e.target.value)}
                    placeholder="Who buys from you in one sentence"
                    rows={2}
                  />
                </div>
                {editingId ? (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    disabled={regenerating}
                    onClick={handleRegeneratePrompts}
                  >
                    {regenerating ? "Regenerating…" : "Regenerate test prompts only"}
                  </Button>
                ) : null}
              </CollapsibleContent>
            </Collapsible>

            <div className="space-y-2">
              <Label htmlFor="competitors">Competitors</Label>
              <Textarea
                id="competitors"
                value={competitors}
                onChange={(e) => setCompetitors(e.target.value)}
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
                {ENGINE_OPTIONS.map((engine) => (
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
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="weekly">Weekly</option>
                <option value="daily">Daily</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="btn-signal-primary" disabled={submitting}>
              {submitting ? "Saving..." : editingId ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
