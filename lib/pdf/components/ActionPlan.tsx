import React from "react";
import { Page, View, Text } from "@react-pdf/renderer";
import { styles, COLORS } from "../styles";
import type { AgentResults } from "../../geo/types";

interface Props {
  agents: AgentResults;
}

/**
 * Extracts "Priority Actions" sections from all agent reports
 * and compiles them into a single consolidated action plan page.
 */
function extractActions(markdown: string, limit = 5): string[] {
  const lines = markdown.split("\n");
  const actions: string[] = [];
  let inActions = false;

  for (const line of lines) {
    if (/priority actions/i.test(line)) {
      inActions = true;
      continue;
    }
    if (inActions && line.startsWith("#")) {
      break; // next section
    }
    if (inActions && (line.startsWith("1.") || line.startsWith("2.") || line.startsWith("3.") || line.startsWith("4.") || line.startsWith("5.") || line.startsWith("-"))) {
      const clean = line.replace(/^[\d\-.*]+\s*/, "").replace(/\*\*/g, "").trim();
      if (clean.length > 10) actions.push(clean);
    }
    if (actions.length >= limit) break;
  }

  return actions;
}

const PRIORITY_COLORS: Record<string, string> = {
  CRITICAL: "#ef4444",
  HIGH: "#f97316",
  MEDIUM: "#f59e0b",
  LOW: "#84cc16",
};

function getPriorityLabel(action: string): string {
  if (/critical/i.test(action)) return "CRITICAL";
  if (/high/i.test(action)) return "HIGH";
  if (/medium/i.test(action)) return "MEDIUM";
  return "LOW";
}

export function ActionPlan({ agents }: Props) {
  const sections = [
    { title: "AI Visibility & Citability", agent: agents.visibility },
    { title: "Content Quality", agent: agents.content },
    { title: "Technical GEO", agent: agents.technical },
    { title: "Platform Optimization", agent: agents.platform },
    { title: "Schema & Structured Data", agent: agents.schema },
  ];

  return (
    <Page size="A4" style={styles.page}>
      <Text style={[styles.heading1, { marginBottom: 4 }]}>Prioritized Action Plan</Text>
      <Text style={[styles.body, { marginBottom: 20 }]}>
        Consolidated recommendations across all GEO dimensions, ordered by impact.
      </Text>
      <View style={styles.divider} />

      {sections.map(({ title, agent }) => {
        const actions = extractActions(agent.rawMarkdown);
        if (actions.length === 0) return null;
        return (
          <View key={title} style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 11, fontWeight: "bold", color: COLORS.white, marginBottom: 8 }}>
              {title}
            </Text>
            {actions.map((action, i) => {
              const priority = getPriorityLabel(action);
              const color = PRIORITY_COLORS[priority] || COLORS.muted;
              return (
                <View key={i} style={{ flexDirection: "row", gap: 8, marginBottom: 6, alignItems: "flex-start" }}>
                  <View style={{ backgroundColor: color, borderRadius: 3, paddingHorizontal: 5, paddingVertical: 2, minWidth: 60, alignItems: "center" }}>
                    <Text style={{ fontSize: 8, fontWeight: "bold", color: "#000" }}>{priority}</Text>
                  </View>
                  <Text style={[styles.body, { flex: 1, marginBottom: 0 }]}>
                    {action.replace(/\[(CRITICAL|HIGH|MEDIUM|LOW)\]\s*/gi, "").trim()}
                  </Text>
                </View>
              );
            })}
          </View>
        );
      })}

      <View style={{ position: "absolute", bottom: 24, left: 48, right: 48, flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ fontSize: 9, color: COLORS.dim }}>Zempar GEO Report</Text>
        <Text style={{ fontSize: 9, color: COLORS.dim }}>Action Plan</Text>
      </View>
    </Page>
  );
}
