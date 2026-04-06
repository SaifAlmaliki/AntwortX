import React from "react";
import { Page, View, Text, Link } from "@react-pdf/renderer";
import { styles, COLORS } from "../styles";

interface Props {
  domain: string;
}

const SERVICES = [
  {
    title: "Full-Service Implementation",
    description: "We handle all GEO improvements end-to-end",
    features: [
      "Technical fixes (SSR, meta tags, crawlability)",
      "Content optimization (E-E-A-T, citability)",
      "Schema & structured data implementation",
      "Platform-specific optimizations",
      "Monthly progress reporting",
    ],
  },
  {
    title: "Consulting & Guidance",
    description: "Strategic recommendations with hands-on support",
    features: [
      "Priority roadmap creation",
      "Technical guidance for your team",
      "Monthly strategy sessions",
      "Competitor analysis",
      "Content strategy advisory",
    ],
  },
  {
    title: "Ongoing Monitoring",
    description: "Track your AI visibility over time",
    features: [
      "Monthly GEO score tracking",
      "Competitive benchmarking",
      "Alerts for score changes",
      "Quarterly strategy reviews",
      "Priority support",
    ],
  },
];

export function ServicesPage({ domain }: Props) {
  return (
    <Page size="A4" style={styles.page}>
      <Text style={[styles.heading1, { marginBottom: 4 }]}>
        Improve Your AI Visibility
      </Text>
      <Text style={[styles.body, { marginBottom: 24, maxWidth: 450 }]}>
        Based on your audit results, Zempar offers tailored services to help
        {domain ? ` ${domain}` : " your website"} achieve better visibility in
        AI-powered search engines. Let's discuss how we can support you.
      </Text>

      <View style={styles.divider} />

      <Text style={[styles.heading2, { marginTop: 12, marginBottom: 16 }]}>
        Our Services
      </Text>

      {SERVICES.map((service, index) => (
        <View
          key={service.title}
          style={{
            backgroundColor: COLORS.surface,
            borderRadius: 6,
            padding: 14,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: COLORS.border,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 6,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: "bold",
                color: COLORS.white,
              }}
            >
              {service.title}
            </Text>
            <Text
              style={{
                fontSize: 9,
                color: COLORS.accent,
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              Service {index + 1}
            </Text>
          </View>
          <Text
            style={{
              fontSize: 10,
              color: COLORS.muted,
              marginBottom: 10,
            }}
          >
            {service.description}
          </Text>
          {service.features.map((feature, i) => (
            <View
              key={i}
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                marginBottom: 4,
              }}
            >
              <Text style={{ fontSize: 10, color: COLORS.accent, marginRight: 8 }}>
                •
              </Text>
              <Text style={[styles.body, { marginBottom: 0, flex: 1 }]}>
                {feature}
              </Text>
            </View>
          ))}
        </View>
      ))}

      <View style={styles.divider} />

      <View
        style={{
          backgroundColor: "#0a1419",
          borderRadius: 8,
          padding: 20,
          marginTop: 16,
          borderWidth: 1,
          borderColor: COLORS.accent,
        }}
      >
        <Text
          style={{
            fontSize: 14,
            fontWeight: "bold",
            color: COLORS.accent,
            marginBottom: 8,
          }}
        >
          Let's Discuss Your AI Visibility Strategy
        </Text>
        <Text style={[styles.body, { marginBottom: 16, maxWidth: 420 }]}>
          Schedule an online meeting to see how we can support you to improve
          your visibility in the era of AI. We'll review your audit results and
          discuss the best approach for your specific needs.
        </Text>
        <View style={{ flexDirection: "row", gap: 24 }}>
          <View>
            <Text style={[styles.label, { marginBottom: 4 }]}>Email</Text>
            <Link
              src="mailto:contact@zempar.com"
              style={{ fontSize: 11, color: COLORS.accent }}
            >
              contact@zempar.com
            </Link>
          </View>
          <View>
            <Text style={[styles.label, { marginBottom: 4 }]}>Website</Text>
            <Link
              src="https://zempar.com/contact"
              style={{ fontSize: 11, color: COLORS.accent }}
            >
              zempar.com/contact
            </Link>
          </View>
        </View>
      </View>

      <View
        style={{
          position: "absolute",
          bottom: 24,
          left: 48,
          right: 48,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontSize: 9, color: COLORS.dim }}>Zempar GEO Report</Text>
        <Text style={{ fontSize: 9, color: COLORS.dim }}>Next Steps</Text>
      </View>
    </Page>
  );
}