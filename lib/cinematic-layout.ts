/** Layout-only constants for scroll scrollytelling (text lives in locales). */

export const SCROLL_BEAT_LAYOUT = [
  { id: "hero", range: [0, 0.15] as const, align: "center" as const },
  { id: "traffic", range: [0.15, 0.4] as const, align: "left" as const },
  { id: "green", range: [0.4, 0.65] as const, align: "right" as const },
  { id: "ride", range: [0.65, 0.85] as const, align: "left" as const },
  { id: "cta", range: [0.85, 1] as const, align: "center" as const },
] as const;

export const EXPLODED_PART_LAYOUT = [
  { id: "battery", x: "48%", y: "62%", dx: 0, dy: 80 },
  { id: "motor", x: "72%", y: "78%", dx: 90, dy: 40 },
  { id: "gps", x: "52%", y: "18%", dx: -20, dy: -90 },
  { id: "deck", x: "38%", y: "55%", dx: -100, dy: 20 },
  { id: "suspension", x: "22%", y: "72%", dx: -80, dy: 60 },
  { id: "controls", x: "58%", y: "8%", dx: 60, dy: -70 },
] as const;

export type ScrollBeatId = (typeof SCROLL_BEAT_LAYOUT)[number]["id"];
export type ExplodedPartId = (typeof EXPLODED_PART_LAYOUT)[number]["id"];
