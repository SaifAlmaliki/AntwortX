# Zempar Cinematic Landing + Light Theme — Design Spec

Date: 2026-07-04

## Goal
Rebuild the Zempar home page (`app/page.tsx`) as an award-winning, scroll-driven
cinematic landing page, and flip the **whole site** from dark to light. Concept adapted
from a "PULSE churn-prediction" brief to Zempar's real product: **Generative Engine
Optimization (GEO)** — how a brand appears across ChatGPT, Claude, Gemini, Perplexity.

The narrative translation: the enemy isn't customer churn, it's **your brand going
invisible in AI answers / a competitor owning the citation**.

## Locked decisions
1. **Content** = Zempar's real product (GEO / AI-search visibility). All copy rewritten.
2. **Whole site → light theme.** Flip global tokens, header/footer, background grid.
   Deep polish on the landing; other pages spot-checked for contrast.
3. **Accent** = single violet (`--signal-violet` family), replacing cyan as the primary
   accent on the landing (and site-wide primary shifts toward violet).
4. **Landing is English / LTR**, bypassing the i18n `useLanguage` system. Old i18n
   sections remain in `components/` unwired.
5. **Video**: 3 clips via **kling3_0_turbo** (Seedance 2.0 is Pro-gated; unavailable on
   basic). 720p / 8s / 16:9, ~12 cr each. HERO clip is extracted to a JPG frame sequence
   and **scrubbed on `<canvas>` by scroll**. SIGNAL pinned behind feature blocks. CALM
   behind final CTA. Graceful gradient/canvas fallback for any clip that fails.

## Page structure (top → bottom)
1. **HERO** — dark cinematic void. Canvas frame-sequence of the particle-assembly clip,
   scrubbed by scroll so the dashboard builds itself. Massive headline **"See how AI
   sees you."**, sub, **"Start free"** primary CTA + secondary. Scroll cue.
2. **Logo strip** — social proof ("monitoring brands across" + AI-engine wordmarks:
   ChatGPT, Claude, Gemini, Perplexity, Copilot, Grok).
3. **Feature blocks** — three, pinned over the SIGNAL clip; each reveals one line on
   scroll: **Track · Diagnose · Win**
   - Track — every AI answer that mentions your category.
   - Diagnose — why a model cites a rival instead of you.
   - Win — earn the citation back and hold it.
4. **Metrics counters** — animate on view: **8 AI engines monitored · 40,000+ prompts
   tracked daily · 3.2× average visibility lift**.
5. **Product screenshot** — browser-frame mockup with soft shadow (rendered dashboard).
6. **Pricing** — 3 tiers (Starter / **Growth** highlighted / Scale) + monthly⇄annual
   toggle (annual = 2 months free).
7. **FAQ** — accordion: GEO vs SEO, which engines, how tracking works, data freshness,
   cancel anytime.
8. **Final CTA** — over the CALM clip; "Start seeing what AI says about you."
9. Footer (shared, light).

## Motion stack
- `framer-motion` (already installed) — `useScroll`/`useTransform` for scrub + pinning.
- Raw `<canvas>` — hero frame-sequence scrubber driven by a scroll-progress motion value.
- `lenis` — smooth scroll (new dep).
- Respect `prefers-reduced-motion` (static end-states) and graceful asset fallbacks.

## Theme flip (light)
- `globals.css`: make light tokens the active `:root`; move dark under `.dark` (unused).
  Light page bg, surfaces, borders, text. Primary → violet.
- `layout.tsx`: `<html>` → light (drop forced `dark`), light body bg.
- `Squares` background grid: light border color (e.g. `#e6e6ef`) on light bg.
- `FloatingHeader` / `Footer`: light glass, violet accents. Verify contrast.
- Spot-check about / contact / geo-monitoring / terms for broken dark assumptions.

## Delivery
- New client components under `components/cinematic/`.
- `app/page.tsx` renders the cinematic page (full-bleed; escapes the container the old
  page used). Old sections kept in `components/` (unwired).
- Assets in `public/cinematic/` (frame sequence + mp4 clips + poster fallbacks).

## Verification (before "done")
- `npm run dev`, load `/`, confirm: hero frame-sequence scrubs on scroll; pricing
  monthly⇄annual toggle updates prices; no console errors; light theme cohesive; other
  routes still render.
