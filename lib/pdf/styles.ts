import { StyleSheet } from "@react-pdf/renderer";

/** Light theme for client-facing GEO PDFs (print-friendly, high contrast). */
export const COLORS = {
  bg: "#ffffff",
  surface: "#f8fafc",
  border: "#e2e8f0",
  card: "#f1f5f9",
  background: "#f8fafc",
  accent: "#0891b2",
  heading: "#0f172a",
  white: "#ffffff",
  muted: "#475569",
  dim: "#94a3b8",
  success: "#22c55e",
  error: "#ef4444",
  excellent: "#22c55e",
  good: "#84cc16",
  fair: "#f59e0b",
  poor: "#f97316",
  critical: "#ef4444",
  /** Zebra / subtle table row fill */
  tableStripe: "#f4f4f5",
};

export function gradeColor(grade: string): string {
  switch (grade) {
    case "Excellent": return COLORS.excellent;
    case "Good": return COLORS.good;
    case "Fair": return COLORS.fair;
    case "Poor": return COLORS.poor;
    default: return COLORS.critical;
  }
}

export const styles = StyleSheet.create({
  page: {
    backgroundColor: COLORS.bg,
    paddingTop: 48,
    paddingBottom: 48,
    paddingHorizontal: 48,
    fontFamily: "Helvetica",
    color: COLORS.muted,
  },
  section: {
    marginBottom: 24,
  },
  heading1: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.heading,
    marginBottom: 8,
  },
  heading2: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.heading,
    marginBottom: 8,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  body: {
    fontSize: 10,
    color: COLORS.muted,
    lineHeight: 1.6,
    marginBottom: 6,
  },
  label: {
    fontSize: 9,
    color: COLORS.dim,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingVertical: 7,
    alignItems: "center",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: COLORS.card,
    paddingVertical: 7,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  tableCellLeft: {
    flex: 3,
    fontSize: 10,
    color: COLORS.muted,
    paddingLeft: 8,
  },
  tableCellCenter: {
    flex: 1,
    fontSize: 10,
    color: COLORS.heading,
    textAlign: "center",
    fontWeight: "bold",
  },
  tableCellRight: {
    flex: 1,
    fontSize: 9,
    color: COLORS.dim,
    textAlign: "center",
  },
  badge: {
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: "flex-start",
  },
  badgeText: {
    fontSize: 9,
    fontWeight: "bold",
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginVertical: 16,
  },
  chip: {
    backgroundColor: COLORS.card,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 6,
  },
  chipText: {
    fontSize: 9,
    color: COLORS.muted,
  },
});
