import React from "react";
import { Page, View, Text } from "@react-pdf/renderer";
import { styles, COLORS, gradeColor } from "../styles";
import type { CompositeScore } from "../../geo/types";

interface Props {
  url: string;
  company: string;
  composite: CompositeScore;
  date: string;
}

export function CoverPage({ url, company, composite, date }: Props) {
  let domain = url;
  try { domain = new URL(url).hostname; } catch { /* use raw */ }

  const color = gradeColor(composite.grade);

  return (
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={{ marginBottom: 48 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", color: COLORS.accent }}>
          Zempar
        </Text>
      </View>

      {/* Score badge */}
      <View style={{ alignItems: "center", marginBottom: 40 }}>
        <View
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: color,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 12,
          }}
        >
          <Text style={{ fontSize: 40, fontWeight: "bold", color: "#000" }}>
            {composite.overall}
          </Text>
        </View>
        <Text style={{ fontSize: 11, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
          GEO Visibility Score
        </Text>
        <Text style={{ fontSize: 22, fontWeight: "bold", color }}>
          {composite.grade}
        </Text>
      </View>

      {/* Report title */}
      <View style={{ marginBottom: 32, alignItems: "center" }}>
        <Text style={{ fontSize: 28, fontWeight: "bold", color: COLORS.white, marginBottom: 8, textAlign: "center" }}>
          GEO Visibility Report
        </Text>
        <Text style={{ fontSize: 14, color: COLORS.muted, marginBottom: 4 }}>{domain}</Text>
        {company ? (
          <Text style={{ fontSize: 12, color: COLORS.dim }}>{company}</Text>
        ) : null}
      </View>

      {/* Score breakdown table */}
      <View style={{ backgroundColor: "#0f0f0f", borderRadius: 8, padding: 16, borderWidth: 1, borderColor: COLORS.border }}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableCellLeft, { color: COLORS.dim, fontSize: 9, textTransform: "uppercase" }]}>Dimension</Text>
          <Text style={[styles.tableCellCenter, { color: COLORS.dim, fontSize: 9, textTransform: "uppercase" }]}>Score</Text>
          <Text style={[styles.tableCellRight, { color: COLORS.dim, fontSize: 9, textTransform: "uppercase" }]}>Weight</Text>
        </View>
        {(
          [
            ["AI Visibility & Citability", composite.breakdown.citability, "25%"],
            ["Brand Authority", composite.breakdown.brand, "20%"],
            ["Content Quality (E-E-A-T)", composite.breakdown.eeat, "20%"],
            ["Technical GEO", composite.breakdown.technical, "15%"],
            ["Schema & Structured Data", composite.breakdown.schema, "10%"],
            ["Platform Optimization", composite.breakdown.platform, "10%"],
          ] as [string, number, string][]
        ).map(([label, score, weight]) => (
          <View key={label} style={styles.tableRow}>
            <Text style={styles.tableCellLeft}>{label}</Text>
            <Text style={[styles.tableCellCenter, { color: gradeColor(score >= 90 ? "Excellent" : score >= 75 ? "Good" : score >= 60 ? "Fair" : score >= 40 ? "Poor" : "Critical") }]}>
              {score}/100
            </Text>
            <Text style={styles.tableCellRight}>{weight}</Text>
          </View>
        ))}
        <View style={[styles.tableRow, { backgroundColor: "#1a1a1a" }]}>
          <Text style={[styles.tableCellLeft, { fontWeight: "bold", color: COLORS.white }]}>Overall GEO Score</Text>
          <Text style={[styles.tableCellCenter, { color, fontSize: 14 }]}>{composite.overall}/100</Text>
          <Text style={styles.tableCellRight}>—</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={{ position: "absolute", bottom: 32, left: 48, right: 48, flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ fontSize: 9, color: COLORS.dim }}>Prepared by Zempar · zempar.com</Text>
        <Text style={{ fontSize: 9, color: COLORS.dim }}>{date}</Text>
      </View>
    </Page>
  );
}
