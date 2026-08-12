// Copy + data for the Zempar micromobility cinematic landing page.

export const HERO = {
  eyebrow: "Shared micromobility platform",
  headline: "Move cities forward.",
  sub: "Zempar powers e-scooter sharing across multiple markets — premium hardware, smart fleet software, and operations built to scale.",
  primaryCta: { label: "Partner with us", href: "/#partner" },
  secondaryCta: { label: "See the platform", href: "/#technology" },
} as const;

/** Scroll-synced story beats for the hero scrollytelling section. */
export const SCROLL_BEATS = [
  {
    id: "hero",
    range: [0, 0.15] as const,
    align: "center" as const,
    eyebrow: "Zempar Fleet",
    headline: "Move cities forward.",
    sub: "Premium shared e-scooters. Built for reliability, designed for riders.",
  },
  {
    id: "engineering",
    range: [0.15, 0.4] as const,
    align: "left" as const,
    eyebrow: "Engineering",
    headline: "Precision-built for the street.",
    sub: "Swappable batteries, reinforced deck, and IP-rated electronics — every component tuned for uptime and rider safety.",
    bullets: [
      "Aircraft-grade aluminum frame",
      "Dual-brake system with regenerative rear hub",
      "All-weather sealed electronics",
    ],
  },
  {
    id: "fleet",
    range: [0.4, 0.65] as const,
    align: "right" as const,
    eyebrow: "Smart fleet",
    headline: "Every scooter, always connected.",
    sub: "Real-time GPS, remote diagnostics, and predictive maintenance keep your fleet earning — not sitting in a warehouse.",
    bullets: [
      "Live location and battery telemetry",
      "Geofencing and no-ride zones",
      "Automated rebalancing alerts",
    ],
  },
  {
    id: "performance",
    range: [0.65, 0.85] as const,
    align: "left" as const,
    eyebrow: "Performance",
    headline: "Range that keeps riders moving.",
    sub: "High-capacity swappable packs and efficient hub motors deliver 40+ km per charge — fewer swaps, more revenue per unit.",
    bullets: [
      "40 km range on a single charge",
      "3-hour full swap turnaround",
      "Whisper-quiet 500W hub motor",
    ],
  },
  {
    id: "cta",
    range: [0.85, 1] as const,
    align: "center" as const,
    eyebrow: "Ready to launch",
    headline: "Your city. Your fleet. Our platform.",
    sub: "From hardware to operations software — Zempar gives operators everything to launch and grow a shared e-scooter business.",
    primaryCta: { label: "Launch your fleet", href: "/#partner" },
    secondaryCta: { label: "View specifications", href: "/contact" },
  },
] as const;

export const EXPLODED_PARTS = [
  { id: "battery", label: "Swappable battery", x: "48%", y: "62%", dx: 0, dy: 80 },
  { id: "motor", label: "500W hub motor", x: "72%", y: "78%", dx: 90, dy: 40 },
  { id: "gps", label: "GPS + IoT module", x: "52%", y: "18%", dx: -20, dy: -90 },
  { id: "deck", label: "Reinforced deck", x: "38%", y: "55%", dx: -100, dy: 20 },
  { id: "suspension", label: "Front suspension", x: "22%", y: "72%", dx: -80, dy: 60 },
  { id: "controls", label: "Smart controls", x: "58%", y: "8%", dx: 60, dy: -70 },
] as const;

export const MARKETS = [
  "Paris",
  "Berlin",
  "Madrid",
  "Dubai",
  "Riyadh",
  "Cairo",
] as const;

export const FEATURES = [
  {
    tag: "01",
    word: "Deploy",
    line: "Launch in weeks, not years.",
    detail:
      "Zempar ships hardware, rider app, operator dashboard, and compliance tooling — so you go live fast in any regulated market.",
  },
  {
    tag: "02",
    word: "Operate",
    line: "Run fleets that stay on the street.",
    detail:
      "Predictive maintenance, swap routing, and live analytics cut downtime — keeping utilization high and ops lean.",
  },
  {
    tag: "03",
    word: "Scale",
    line: "Grow across cities with one platform.",
    detail:
      "Multi-market dashboards, localized pricing, and franchise-ready tooling let you expand without rebuilding your stack.",
  },
] as const;

export const METRICS = [
  { value: 12, suffix: "+", label: "Cities operating", prefix: "" },
  { value: 8500, suffix: "+", label: "Fleet vehicles deployed", prefix: "" },
  { value: 98.2, suffix: "%", label: "Fleet uptime average", prefix: "" },
] as const;

export const FAQ = [
  {
    q: "What does Zempar provide to operators?",
    a: "Zempar is a full-stack micromobility platform: premium e-scooter hardware, rider mobile app, operator dashboard, fleet telematics, and ongoing ops support. You focus on your market — we handle the technology backbone.",
  },
  {
    q: "Can I operate in multiple cities or countries?",
    a: "Yes. Zempar is built for multi-market operators. Each market gets localized pricing, geofencing, compliance settings, and reporting — all managed from a single control plane.",
  },
  {
    q: "How does battery swapping work?",
    a: "Our scooters use hot-swappable battery packs designed for field ops. Swap crews get route optimization in the dashboard, and each pack reports health metrics in real time.",
  },
  {
    q: "What regulations do you support?",
    a: "We work with operators across EU, MENA, and other regulated markets. Zempar provides speed limiting, parking zones, insurance documentation, and data exports required by local authorities.",
  },
  {
    q: "How do I get started?",
    a: "Tell us your target city and fleet size through the partner form. Our team will schedule a discovery call and share a tailored launch plan within 48 hours.",
  },
] as const;

export const FINAL_CTA = {
  headline: "The future of urban mobility starts here.",
  sub: "Join operators across 12+ cities who trust Zempar to power their shared e-scooter fleets.",
  primaryCta: { label: "Become a partner", href: "/#partner" },
  secondaryCta: { label: "Talk to our team", href: "/contact" },
} as const;

export const APP_SHOWCASE = {
  eyebrow: "Rider experience",
  headline: "Discover a nearby ride.",
  sub: "Our rider app makes finding, reserving, and unlocking a scooter effortless — with transparent pricing and eco-friendly routing.",
  stats: [
    { label: "Range", value: "40 km" },
    { label: "Unlock", value: "< 3 sec" },
    { label: "Markets", value: "12+" },
  ],
} as const;
