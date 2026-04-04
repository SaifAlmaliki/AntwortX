# GEO Audit Report: Ibtikar Media

**Audit Date:** April 4, 2026  
**URL:** https://ibtikar.media/  
**Business Type:** SaaS (AI marketing workspace — credits/pricing model, sign-up CTAs, feature grid)  
**Pages Analyzed:** 5 URL checks (3 full HTML reviews + 2 failed routes)

---

## Executive Summary

**Overall GEO Score: 45/100 (Poor)**

The marketing homepage is **server-rendered** with substantial, structured copy (hero, feature grid, “How it works,” audience segments), which helps crawlers and LLMs ingest the product story. Critical gaps undermine trust and citability: **`/pricing` returns 404** while linked from the hero CTA and footer, there is **no `robots.txt`**, **no XML sitemap**, **no `llms.txt`**, **no JSON-LD**, and **legal pages reuse the homepage title and meta description**. Footer social links are explicitly “not yet configured” (`href="#"`). Third-party search surfaces **Ibtikar AI (ibtikarai.com)** and similar names more readily than **ibtikar.media**, increasing **entity ambiguity** for AI systems.

### Score Breakdown

| Category | Score | Weight | Weighted Score |
|---|---|---|---|
| AI Citability | 64/100 | 25% | 16.0 |
| Brand Authority | 35/100 | 20% | 7.0 |
| Content E-E-A-T | 44/100 | 20% | 8.8 |
| Technical GEO | 52/100 | 15% | 7.8 |
| Schema & Structured Data | 15/100 | 10% | 1.5 |
| Platform Optimization | 40/100 | 10% | 4.0 |
| **Overall GEO Score** | | | **45/100** |

---

## Critical Issues (Fix Immediately)

1. **`/pricing` is HTTP 404** while the homepage CTA and footer link to `/pricing`. Broken primary conversion and pricing URLs are strong negative trust signals for users and for models summarizing the product. **Fix:** Ship a live pricing/credits page or remove/replace links until it exists.

2. **No structured data (JSON-LD) detected** on the homepage or sampled legal pages. For a SaaS, missing **Organization** and **SoftwareApplication** (or **WebApplication**) makes it harder for AI answers to ground facts (name, URL, offer). **Fix:** Add valid JSON-LD for Organization + product type; optionally **FAQPage** if you add FAQs.

3. **Entity / brand ambiguity:** Web results prominently feature other “Ibtikar”-branded properties (e.g. ibtikarai.com) and press that may not clearly map to **ibtikar.media**. **Fix:** Consistent naming, clear About page, sameAs links to official profiles, and distinct positioning copy.

---

## High Priority Issues

1. **No `robots.txt`** (request returns **404** HTML, not a policy file). Crawlers lack declared sitemap location and explicit AI crawler guidance. **Fix:** Add `/robots.txt` with sitemap URL and intentional rules (including any AI bots you want to allow or disallow).

2. **No `llms.txt`** (404). Emerging convention for helping AI systems understand site purpose and allowed use. **Fix:** Publish `/llms.txt` summarizing the product, key pages, and contact.

3. **No XML sitemap** (`/sitemap.xml` and `/sitemap_index.xml` → 404). Discovery of legal and future marketing pages is weaker. **Fix:** Generate a sitemap and reference it in `robots.txt`.

4. **Duplicate metadata on `/privacy-policy` and `/terms-of-service`:** Title and meta description match the homepage (“Ibtikar Media - Your Complete AI Platform” / generic tagline) instead of page-specific titles and summaries. **Fix:** Unique `<title>`, `meta name="description"`, and Open Graph tags per route.

5. **Placeholder social and company links:** Footer “About,” “Blog,” “Careers,” “Cookie Policy,” X, LinkedIn, and GitHub use `href="#"` with aria labels stating links are not configured. **Fix:** Real URLs or remove until live.

6. **Clerk publishable key exposed as `pk_test_...` in HTML** suggests a **development** Clerk instance in production-facing markup. Hurts trust and professional perception in audits. **Fix:** Use production Clerk keys and domain configuration for the live site.

---

## Medium Priority Issues

1. **Homepage meta description vs. on-page H1:** Meta still emphasizes “virtual influencers” and “high-converting ads” while the visible hero centers “complete AI marketing workspace” and a broader workflow. Align for consistent model summaries.

2. **No FAQ or HowTo schema** despite SaaS-typical questions (credits, integrations, n8n mention in copy). Adding FAQ blocks + **FAQPage** schema would improve answer-style citations.

3. **Thin “Company” surface:** No dedicated About, team, or credentials; limits E-E-A-T for B2B SaaS.

4. **404 responses for `robots.txt`:** The HTML 404 template for `/robots.txt` included `noindex` in sampled error HTML (when fetching robots). Ensure error pages don’t pollute crawler expectations; prefer a real plain-text robots file.

---

## Low Priority Issues

1. **No Open Graph / Twitter Card tags** observed in the initial HTML snapshot of the homepage (beyond core meta). Improves rich previews when links are shared and can reinforce brand snippets.

2. **Optional:** Add `rel="canonical"` on key pages if duplicate URL variants exist.

3. **Decorative imagery:** Hero uses decorative shapes; ensure any meaningful images include descriptive `alt` if added later.

---

## Category Deep Dives

### AI Citability (64/100)

**Strengths:** Clear module descriptions (Brand DNA, influencers, lead lists, email sequences, social publishing, newsletters, GEA visibility). “How it works” is a four-step narrative models can quote. “Who it’s for” segments (e-commerce, agencies, sales, creators) are extractable.

**Gaps:** No dedicated pricing/credits explanation (page missing). Terminology mixes **GEA** with industry term **GEO**—clarify in one sentence for models. Add a short **“What is Ibtikar Media?”** definitional paragraph (1–2 sentences) near the top for direct answers.

### Brand Authority (35/100)

**Findings:** Working contact email `hello@ibtikar.media` in the footer. Social and many company links are placeholders. External search does not clearly establish **ibtikar.media** as the canonical entity versus similarly named sites.

**Recommendations:** Publish LinkedIn company page and link via `sameAs` in schema; add About page with company location and story; secure consistent listings (if applicable).

### Content E-E-A-T (44/100)

**Findings:** Legal pages exist (200) but share generic metadata. No visible leadership, address, or detailed trust center. Product copy is clear but not backed by case studies, logos, or security/compliance detail on the public homepage HTML reviewed.

**Recommendations:** About page, security/privacy highlights, and optional customer quotes with permission.

### Technical GEO (52/100)

**Findings:** Homepage and legal pages return **200** with substantial HTML (good for non-JS crawlers). **Strict-Transport-Security** header observed on the homepage response. **Missing:** `robots.txt`, sitemap, `llms.txt`. **Broken:** `/pricing` (404).

**Recommendations:** Implement robots + sitemap + llms.txt; fix pricing route; verify no accidental `noindex` on public marketing routes.

### Schema & Structured Data (15/100)

**Findings:** No `application/ld+json` blocks detected on homepage or `/privacy-policy` sample.

**Recommendations:** Minimum viable: `Organization` + `WebSite` (+ `SoftwareApplication`). Add `FAQPage` when FAQ content exists.

### Platform Optimization (40/100)

**Findings:** No configured X/LinkedIn/GitHub links; no evidence in this crawl of YouTube, Reddit, or Wikipedia presence for **ibtikar.media**. GEA feature copy shows awareness of ChatGPT-style visibility but the public site does not yet reinforce platform-native presence.

**Recommendations:** Complete at least LinkedIn + X with consistent branding; consider short product explainer on YouTube for multimodal discovery.

---

## Quick Wins (Implement This Week)

1. **Restore or create `/pricing`** and verify all internal links return 200.  
2. **Add `/robots.txt`** pointing to a **sitemap**.  
3. **Add JSON-LD** `Organization` + `SoftwareApplication` / `WebApplication` on the homepage.  
4. **Unique titles and meta descriptions** for Privacy and Terms (and Pricing when live).  
5. **Replace `#` placeholders** with real URLs or hide those footer items until ready.

---

## 30-Day Action Plan

### Week 1: Crawl & trust foundations
- [ ] Deploy `robots.txt` + XML sitemap  
- [ ] Fix `/pricing` (or update navigation/CTAs)  
- [ ] Page-level metadata for legal and pricing routes  
- [ ] Production Clerk configuration (no `pk_test_` on public site)

### Week 2: Structured data & AI hints
- [ ] JSON-LD Organization + product schema  
- [ ] Publish `llms.txt`  
- [ ] Optional FAQ section + FAQPage schema

### Week 3: E-E-A-T & entity clarity
- [ ] Live About page (company, mission, contact)  
- [ ] LinkedIn (and other) profiles linked in footer + `sameAs`  
- [ ] Align meta description with primary positioning

### Week 4: Platform & citability
- [ ] First case study or use-case page (quotable outcomes)  
- [ ] Social proof (logos/quotes) where permitted  
- [ ] Content addressing “vs. alternatives” or “what is X?” for AI Q&A patterns

---

## Appendix: Pages Analyzed

| URL | HTTP | Title (approx.) | GEO Issues |
|---|---|---|---|
| https://ibtikar.media/ | 200 | Ibtikar Media - Your Complete AI Platform | No JSON-LD; no OG/Twitter observed; meta vs H1 drift |
| https://ibtikar.media/pricing | 404 | (404 / not found template) | **Broken link** from homepage & footer |
| https://ibtikar.media/privacy-policy | 200 | Same as homepage | Duplicate meta; no JSON-LD |
| https://ibtikar.media/terms-of-service | 200 | Same as homepage | Duplicate meta; no JSON-LD |
| https://ibtikar.media/robots.txt | 404 | n/a | Missing policy file |
| https://ibtikar.media/sitemap.xml | 404 | n/a | Missing sitemap |
| https://ibtikar.media/llms.txt | 404 | n/a | Missing llms.txt |

---

*Method notes: Fetches used a standard browser-like user agent with per-request timeouts (≤35s) and ≥1s spacing between batches. HTML was inspected for title, meta description, visible headings, internal links, and JSON-LD. Automated subagent delegation described in the orchestration skill was simulated by applying the same category rubric in this single report.*
