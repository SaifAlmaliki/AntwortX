import { StyleSheet } from "@react-pdf/renderer";

export const COLORS = {
  bg: "#060606",
  surface: "#0f0f0f",
  border: "#1f1f1f",
  accent: "#06b6d4",
  white: "#ffffff",
  muted: "#a3a3a3",
  dim: "#606060",
  excellent: "#22c55e",
  good: "#84cc16",
  fair: "#f59e0b",
  poor: "#f97316",
  critical: "#ef4444",
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
    color: COLORS.white,
  },
  section: {
    marginBottom: 24,
  },
  heading1: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.white,
    marginBottom: 8,
  },
  heading2: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.white,
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
    backgroundColor: "#1a1a1a",
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
    color: COLORS.white,
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
    backgroundColor: "#1a1a1a",
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
