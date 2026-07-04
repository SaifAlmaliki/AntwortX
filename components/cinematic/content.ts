// Copy + data for the Zempar cinematic landing page.
// Concept: your brand's visibility across AI answer engines (GEO).

export const HERO = {
  eyebrow: "Generative Engine Optimization",
  headline: "See how AI sees you.",
  sub: "Zempar tracks how your brand shows up across ChatGPT, Claude, Gemini and Perplexity — so you catch a competitor owning the answer before your traffic disappears.",
  primaryCta: { label: "Get a free audit", href: "/#geo-lead" },
  secondaryCta: { label: "Book a demo", href: "/contact" },
} as const;

export const ENGINES = [
  "ChatGPT",
  "Claude",
  "Gemini",
  "Perplexity",
  "Copilot",
  "Grok",
] as const;

export const FEATURES = [
  {
    tag: "01",
    word: "Track",
    line: "Track every AI answer that mentions your category.",
    detail:
      "Zempar runs thousands of real buyer prompts across every major engine, every day, and records exactly where — and whether — your brand appears.",
  },
  {
    tag: "02",
    word: "Diagnose",
    line: "Diagnose why a model cites a rival instead of you.",
    detail:
      "Trace each answer back to the sources the model trusted, so you know the precise gap in citations, freshness or authority to close.",
  },
  {
    tag: "03",
    word: "Win",
    line: "Win the citation back — and hold it.",
    detail:
      "Ship the fixes Zempar recommends, then watch your share of AI answers climb and stay defended as models update.",
  },
] as const;

export const METRICS = [
  { value: 8, suffix: "", label: "AI engines monitored", prefix: "" },
  { value: 40000, suffix: "+", label: "Prompts tracked daily", prefix: "" },
  { value: 3.2, suffix: "×", label: "Average visibility lift", prefix: "" },
] as const;

export const PRICING = [
  {
    name: "Starter",
    monthly: 49,
    tagline: "For a single brand finding its footing in AI answers.",
    features: [
      "3 AI engines monitored",
      "250 tracked prompts / day",
      "Weekly visibility report",
      "Email alerts on drops",
    ],
    cta: "Start free",
    highlight: false,
  },
  {
    name: "Growth",
    monthly: 149,
    tagline: "For teams competing for the answer across every engine.",
    features: [
      "All 6 AI engines monitored",
      "5,000 tracked prompts / day",
      "Citation-gap diagnostics",
      "Competitor share tracking",
      "Slack + email alerts",
    ],
    cta: "Start free",
    highlight: true,
  },
  {
    name: "Scale",
    monthly: 449,
    tagline: "For agencies and multi-brand portfolios.",
    features: [
      "Unlimited brands & workspaces",
      "50,000 tracked prompts / day",
      "API + data export",
      "Custom prompt sets",
      "Dedicated strategist",
    ],
    cta: "Talk to sales",
    highlight: false,
  },
] as const;

export const FAQ = [
  {
    q: "What is GEO, and how is it different from SEO?",
    a: "SEO gets you ranked on a results page. Generative Engine Optimization gets you cited inside the answer an AI assistant gives directly. As buyers ask ChatGPT and Perplexity instead of scrolling Google, the citation is the new click — and it's what Zempar measures and defends.",
  },
  {
    q: "Which AI engines does Zempar monitor?",
    a: "ChatGPT, Claude, Gemini, Perplexity, Copilot and Grok, with new engines added as they gain real usage. You choose which ones matter for your market.",
  },
  {
    q: "How does tracking actually work?",
    a: "You define the buyer questions that matter. Zempar runs them across each engine on a daily cadence, captures the full answer, and detects whether your brand is mentioned, how prominently, and which sources the model leaned on.",
  },
  {
    q: "How fresh is the data?",
    a: "Prompts are re-run daily by default, and you can trigger an on-demand refresh any time you ship a change and want to see if the answer moved.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Plans are month-to-month, no contract. Annual billing simply saves you two months.",
  },
] as const;

export const FINAL_CTA = {
  headline: "Start seeing what AI says about you.",
  sub: "Enter your site and we’ll send a free GEO visibility report — where you show up in AI answers, where you don’t, and what to fix first.",
  primaryCta: { label: "Get a free audit", href: "/#geo-lead" },
  secondaryCta: { label: "Book a demo", href: "/contact" },
} as const;
