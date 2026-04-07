import React from "react";
import { Page, View, Text, Link } from "@react-pdf/renderer";
import { styles, COLORS } from "../styles";

interface Props {
  domain: string;
}

export function ServicesPage({ domain }: Props) {
  return (
    <Page size="A4" style={styles.page}>
      <View style={{ marginBottom: 48 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", color: COLORS.accent }}>
          Zempar
        </Text>
      </View>

      <View style={{ alignItems: "center", marginBottom: 32 }}>
        <Text style={[styles.heading1, { textAlign: "center", marginBottom: 12 }]}>
          Let&apos;s Fix Your AI Visibility
        </Text>
        <Text style={[styles.body, { textAlign: "center", maxWidth: 400, marginBottom: 0 }]}>
          This report identified specific gaps between where {domain ? domain : "your site"} is today
          and where it needs to be to appear in AI search results. We have a complete plan ready.
        </Text>
      </View>

      <View style={styles.divider} />

      <View
        style={{
          backgroundColor: COLORS.surface,
          borderRadius: 8,
          padding: 24,
          marginBottom: 24,
          borderWidth: 1,
          borderColor: COLORS.accent,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "bold", color: COLORS.accent, marginBottom: 12 }}>
          Book a 15-Minute GEO Briefing
        </Text>
        <Text style={[styles.body, { marginBottom: 16 }]}>
          In this session, we&apos;ll walk through your full technical roadmap, show you exactly what
          competitors are doing differently, and outline a clear path to AI visibility.
        </Text>

        <View style={{ gap: 8, marginBottom: 20 }}>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Text style={{ fontSize: 10, color: COLORS.accent }}>✓</Text>
            <Text style={[styles.body, { marginBottom: 0 }]}>Prioritized action plan with specific fixes</Text>
          </View>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Text style={{ fontSize: 10, color: COLORS.accent }}>✓</Text>
            <Text style={[styles.body, { marginBottom: 0 }]}>Competitor gap analysis and benchmarking</Text>
          </View>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Text style={{ fontSize: 10, color: COLORS.accent }}>✓</Text>
            <Text style={[styles.body, { marginBottom: 0 }]}>Custom implementation timeline and cost estimate</Text>
          </View>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Text style={{ fontSize: 10, color: COLORS.accent }}>✓</Text>
            <Text style={[styles.body, { marginBottom: 0 }]}>No obligation — just actionable insights</Text>
          </View>
        </View>

        <View style={{ borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 16 }}>
          <Text style={{ fontSize: 11, fontWeight: "bold", color: COLORS.heading, marginBottom: 12 }}>
            Get in Touch
          </Text>
          <View style={{ flexDirection: "row", gap: 32 }}>
            <View>
              <Text style={[styles.label, { marginBottom: 4 }]}>Email</Text>
              <Link src="mailto:contact@zempar.com" style={{ fontSize: 12, color: COLORS.accent }}>
                contact@zempar.com
              </Link>
            </View>
            <View>
              <Text style={[styles.label, { marginBottom: 4 }]}>Website</Text>
              <Link src="https://zempar.com/contact" style={{ fontSize: 12, color: COLORS.accent }}>
                zempar.com/contact
              </Link>
            </View>
          </View>
        </View>
      </View>

      <View style={{ position: "absolute", bottom: 32, left: 48, right: 48, flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ fontSize: 9, color: COLORS.dim }}>Prepared by Zempar · zempar.com</Text>
        <Text style={{ fontSize: 9, color: COLORS.dim }}>Next Steps</Text>
      </View>
    </Page>
  );
}
