import React from "react";
import { Page, View, Text, Link } from "@react-pdf/renderer";
import { styles, COLORS } from "../styles";

interface Props {
  domain: string;
}

export function ServicesPage({ domain }: Props) {
  return (
    <Page size="A4" style={styles.page}>
      <View style={{ marginBottom: 36 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", color: COLORS.accent }}>Zempar</Text>
      </View>

      <View style={{ marginBottom: 24 }}>
        <Text style={[styles.heading1, { marginBottom: 8 }]}>Book your GEO briefing</Text>
        <Text style={{ fontSize: 10, color: COLORS.muted, lineHeight: 1.45, maxWidth: 440 }}>
          We already mapped gaps for {domain || "your site"} in this report. On a short call we walk through the
          prioritized fix list, competitor benchmarks, and a practical timeline — no fluff.
        </Text>
      </View>

      <View
        style={{
          backgroundColor: COLORS.surface,
          borderRadius: 8,
          padding: 20,
          marginBottom: 20,
          borderWidth: 1,
          borderColor: COLORS.accent,
        }}
      >
        <Text style={{ fontSize: 15, fontWeight: "bold", color: COLORS.accent, marginBottom: 10 }}>
          15-minute GEO briefing
        </Text>

        <View style={{ gap: 6, marginBottom: 16 }}>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Text style={{ fontSize: 10, color: COLORS.accent }}>✓</Text>
            <Text style={{ fontSize: 10, color: COLORS.heading, flex: 1 }}>Prioritized remediation from this audit</Text>
          </View>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Text style={{ fontSize: 10, color: COLORS.accent }}>✓</Text>
            <Text style={{ fontSize: 10, color: COLORS.heading, flex: 1 }}>Competitor gap view</Text>
          </View>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Text style={{ fontSize: 10, color: COLORS.accent }}>✓</Text>
            <Text style={{ fontSize: 10, color: COLORS.heading, flex: 1 }}>Implementation sequence & effort</Text>
          </View>
        </View>

        <View style={{ borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 14 }}>
          <Text style={{ fontSize: 10, fontWeight: "bold", color: COLORS.heading, marginBottom: 10 }}>Contact</Text>
          <View style={{ flexDirection: "row", gap: 28 }}>
            <View>
              <Text style={[styles.label, { marginBottom: 4 }]}>Email</Text>
              <Link src="mailto:contact@zempar.com" style={{ fontSize: 11, color: COLORS.accent }}>
                contact@zempar.com
              </Link>
            </View>
            <View>
              <Text style={[styles.label, { marginBottom: 4 }]}>Web</Text>
              <Link src="https://zempar.com/contact" style={{ fontSize: 11, color: COLORS.accent }}>
                zempar.com/contact
              </Link>
            </View>
          </View>
        </View>
      </View>

      <View style={{ position: "absolute", bottom: 32, left: 48, right: 48, flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ fontSize: 9, color: COLORS.dim }}>Prepared by Zempar · zempar.com</Text>
        <Text style={{ fontSize: 9, color: COLORS.dim }}>Next steps</Text>
      </View>
    </Page>
  );
}
