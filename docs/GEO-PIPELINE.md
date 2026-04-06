# GEO Audit Pipeline

This document explains how the GEO (Generative Engine Optimization) audit pipeline works, from the initial request to the final scored report.

## Overview

When a lead submits their website for audit, the system runs a multi-step pipeline that:

1. Fetches and analyzes the website
2. Runs 5 specialized AI agents in parallel
3. Computes a composite GEO score
4. Generates a PDF report
5. Sends the report via email

## Pipeline Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           GEO AUDIT PIPELINE                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  [Client]                                                                    │
│      │                                                                       │
│      │ POST /api/geo-lead {website, email, company}                        │
│      ▼                                                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ 1. VALIDATION                                                        │    │
│  │    • Validate email format                                           │    │
│  │    • Normalize website URL                                           │    │
│  │    • Check honeypot (spam protection)                                 │    │
│  │    • Return 202 Accepted immediately                                  │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│      │                                                                       │
│      │ after() - Process in background                                      │
│      ▼                                                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ 2. WEBSITE FETCH                                                    │    │
│  │    • Fetch HTML from target URL                                     │    │
│  │    • Parse with Cheerio                                              │    │
│  │    • Extract: title, meta, headings, content, links                 │    │
│  │    • Fetch robots.txt and check AI crawler access                   │    │
│  │    • Check llms.txt and llms-full.txt                               │    │
│  │    • Extract JSON-LD structured data                                 │    │
│  │    • Collect security headers                                         │    │
│  │    → Output: WebsiteData object                                       │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│      │                                                                       │
│      ▼                                                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ 3. AI AGENTS (5 parallel)                                           │    │
│  │                                                                       │    │
│  │    ┌─────────────────────┐  ┌─────────────────────┐                 │    │
│  │    │ AI Visibility       │  │ Content E-E-A-T      │                 │    │
│  │    │ (Citability 25%,    │  │ (20% weight)         │                 │    │
│  │    │  Brand 20%)         │  │                      │                 │    │
│  │    │ 45% total weight    │  │ Analyzes:            │                 │    │
│  │    │                     │  │ • Experience signals │                 │    │
│  │    │ Analyzes:           │  │ • Expertise          │                 │    │
│  │    │ • AI citability     │  │ • Authoritativeness  │                 │    │
│  │    │ • Brand mentions    │  │ • Trustworthiness    │                 │    │
│  │    │ • Crawler access    │  │ • Content depth      │                 │    │
│  │    │ • llms.txt          │  │                       │                 │    │
│  │    └─────────────────────┘  └─────────────────────┘                 │    │
│  │                                                                       │    │
│  │    ┌─────────────────────┐  ┌─────────────────────┐                 │    │
│  │    │ Technical GEO       │  │ Platform Opt.       │                 │    │
│  │    │ (15% weight)        │  │ (10% weight)         │                 │    │
│  │    │                     │  │                      │                 │    │
│  │    │ Analyzes:           │  │ Analyzes:            │                 │    │
│  │    │ • SSR/CSR           │  │ • Google AI Overview │                 │    │
│  │    │ • Meta tags         │  │ • ChatGPT Search     │                 │    │
│  │    │ • Crawlability      │  │ • Perplexity AI      │                 │    │
│  │    │ • Security headers   │  │ • Google Gemini      │                 │    │
│  │    │ • Core Web Vitals   │  │ • Bing Copilot       │                 │    │
│  │    │ • Mobile optimization│ │                      │                 │    │
│  │    └─────────────────────┘  └─────────────────────┘                 │    │
│  │                                                                       │    │
│  │    ┌─────────────────────┐                                          │    │
│  │    │ Schema & Structure  │                                          │    │
│  │    │ (10% weight)        │                                          │    │
│  │    │                     │                                          │    │
│  │    │ Analyzes:           │                                          │    │
│  │    │ • JSON-LD schema    │                                          │    │
│  │    │ • Organization data │                                          │    │
│  │    │ • sameAs links      │                                          │    │
│  │    │ • Rich result types │                                          │    │
│  │    └─────────────────────┘                                          │    │
│  │                                                                       │    │
│  │    Each agent returns: {score, grade, rawMarkdown}                  │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│      │                                                                       │
│      ▼                                                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ 4. SCORE COMPUTATION                                                 │    │
│  │                                                                       │    │
│  │    Weighted formula:                                                  │    │
│  │                                                                       │    │
│  │    overall = round(                                                  │    │
│  │      visibility × 0.45   // AI citability + brand                    │    │
│  │      + content × 0.20    // E-E-A-T                                  │    │
│  │      + technical × 0.15  // Technical GEO                           │    │
│  │      + schema × 0.10     // Structured data                         │    │
│  │      + platform × 0.10   // Platform optimization                    │    │
│  │    )                                                                  │    │
│  │                                                                       │    │
│  │    Grade assignment:                                                  │    │
│  │    90-100 → Excellent                                                │    │
│  │    75-89  → Good                                                     │    │
│  │    60-74  → Fair                                                      │    │
│  │    40-59  → Poor                                                      │    │
│  │    0-39   → Critical                                                  │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│      │                                                                       │
│      ▼                                                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ 5. PDF GENERATION                                                    │    │
│  │    • React-PDF renders report document                               │    │
│  │    • Cover page with overall score and grade                        │    │
│  │    • 5 agent sections with detailed analysis                        │    │
│  │    • Prioritized action plan                                         │    │
│  │    → Output: PDF Buffer (~200-400 KB)                                │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│      │                                                                       │
│      ▼                                                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ 6. EMAIL DELIVERY                                                    │    │
│  │                                                                       │    │
│  │    a) Report email to lead                                           │    │
│  │       • From: Zempar <info@zempar.com>                               │    │
│  │       • Subject: Your GEO Visibility Report for {domain}             │    │
│  │       • Body: HTML email with score breakdown                        │    │
│  │       • Attachment: GEO-Report-{domain}-{date}.pdf                  │    │
│  │                                                                       │    │
│  │    b) Internal notification                                          │    │
│  │       • To: saif.almaliki@zempar.com                                 │    │
│  │       • Reply-To: lead's email                                       │    │
│  │       • Subject: [Zempar] GEO report sent — {domain}                 │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Score Calculation

### Weight Distribution

| Agent | Weight | Coverage |
|-------|--------|----------|
| AI Visibility & Citability | 45% | Citability (25%) + Brand Authority (20%) |
| Content E-E-A-T | 20% | Experience, Expertise, Authoritativeness, Trustworthiness |
| Technical GEO | 15% | SSR, Meta, Crawlability, Security, Performance |
| Platform Optimization | 10% | Google AI, ChatGPT, Perplexity, Gemini, Bing |
| Schema & Structured Data | 10% | JSON-LD, Organization, sameAs links |

### Formula

```typescript
overall = Math.round(
  visibility.score × 0.45 +
  content.score × 0.20 +
  technical.score × 0.15 +
  schema.score × 0.10 +
  platform.score × 0.10
)
```

### Grade Thresholds

| Score Range | Grade | Color |
|-------------|-------|-------|
| 90-100 | Excellent | Green (#22c55e) |
| 75-89 | Good | Blue (#3b82f6) |
| 60-74 | Fair | Amber (#f59e0b) |
| 40-59 | Poor | Orange (#f97316) |
| 0-39 | Critical | Red (#ef4444) |

## Agent Details

### 1. AI Visibility & Citability Agent

**Weight:** 45% (combines Citability 25% + Brand Authority 20%)

**Analyzes:**
- **Citability Score:** Can AI models cite/quote the content?
  - Extractable content blocks
  - Clear, factual statements
  - Quote-ready passages
  - Structured data fallbacks

- **Brand Mentions:** Presence across authoritative platforms
  - Wikipedia entry
  - LinkedIn company page
  - Social media profiles
  - Industry reviews (G2, Capterra)

- **Crawler Access:** AI crawler permissions
  - GPTBot (OpenAI)
  - ClaudeBot (Anthropic)
  - PerplexityBot
  - Google-Extended (Gemini)
  - Applebot-Extended
  - CCBot (Common Crawl)

- **llms.txt Status:** AI-specific documentation
  - /llms.txt exists and valid
  - /llms-full.txt exists
  - Proper markdown structure

### 2. Content E-E-A-T Agent

**Weight:** 20%

**Analyzes Google's E-E-A-T framework:**

| Dimension | Weight | Evaluation Criteria |
|------------|--------|---------------------|
| Experience | 25% | Case studies, original research, first-hand accounts |
| Expertise | 25% | Author credentials, technical depth, methodology |
| Authoritativeness | 25% | External citations, backlinks, industry recognition |
| Trustworthiness | 25% | HTTPS, contact info, privacy policy, transparency |

**Content Quality Metrics:**
- Word count
- Heading structure (H1-H6)
- Internal/external links
- Content freshness
- AI content detection signals

### 3. Technical GEO Agent

**Weight:** 15%

**Analyzes:**

| Category | Score Weight |
|----------|-------------|
| Server-Side Rendering | 25% |
| Meta Tags & Indexability | 15% |
| Crawlability | 15% |
| Security Headers | 10% |
| Core Web Vitals Risk | 10% |
| Mobile Optimization | 10% |
| URL Structure | 5% |
| Response & Status | 5% |
| Additional Checks | 5% |

**Key Technical Checks:**
- SSR vs CSR (critical for AI visibility)
- Meta robots, canonical, viewport
- robots.txt and sitemap.xml
- Security headers (HSTS, CSP, X-Frame-Options)
- HTTPS enforcement
- Mobile viewport configuration

### 4. Platform Optimization Agent

**Weight:** 10%

**Analyzes 5 major AI platforms:**

| Platform | Key Signals |
|----------|-------------|
| Google AI Overviews | Content structure, heading patterns, Q&A format |
| ChatGPT Web Search | Entity recognition, Wikipedia presence, llms.txt |
| Perplexity AI | Community validation, source directness, freshness |
| Google Gemini | YouTube presence, Knowledge Graph, Google Business |
| Bing Copilot | Bing Webmaster Tools, IndexNow, Microsoft ecosystem |

**Average of 5 platform scores** → Platform Optimization Score

### 5. Schema & Structured Data Agent

**Weight:** 10%

**Analyzes:**

| Schema Type | Purpose |
|-------------|---------|
| Organization | Company info, logo, contact |
| WebSite | Site name, URL, SearchAction |
| Service | Service offerings, areas served |
| FAQPage | Q&A content (limited rich result eligibility) |
| Person | Author/team profiles |

**Validation Checks:**
- JSON-LD syntax validity
- Required property presence
- Rich result eligibility
- sameAs entity linking (Wikipedia, LinkedIn, etc.)

## Website Data Collection

The `fetch-website.ts` module collects:

```typescript
interface WebsiteData {
  // Basic metadata
  url: string;
  domain: string;
  title: string;
  metaDescription: string;
  canonical: string | null;

  // Content structure
  h1Tags: string[];
  headingStructure: HeadingEntry[];
  textContent: string;
  wordCount: number;
  contentBlocks: ContentBlock[];

  // Links
  internalLinks: string[];
  externalLinks: string[];

  // Structured data
  structuredData: unknown[];
  metaTags: Record<string, string>;

  // Media
  images: ImageEntry[];

  // Technical
  securityHeaders: SecurityHeaders;
  statusCode: number;
  redirectChain: RedirectEntry[];
  hasSSRContent: boolean;

  // AI-specific
  robotsTxt: RobotsTxtData;  // AI crawler access
  llmsTxt: LlmsTxtData;      // AI documentation

  // Error tracking
  fetchError: string | null;
}
```

## AI Crawler Detection

The system checks these AI crawlers in `robots.txt`:

```typescript
const AI_CRAWLERS = [
  "GPTBot",           // OpenAI - ChatGPT training
  "OAI-SearchBot",    // OpenAI - ChatGPT search
  "ChatGPT-User",     // OpenAI - ChatGPT browsing
  "ClaudeBot",        // Anthropic - Claude training
  "anthropic-ai",     // Anthropic - Additional crawler
  "PerplexityBot",    // Perplexity AI search
  "Amazonbot",        // Amazon Alexa AI
  "CCBot",            // Common Crawl - feeds many AI models
  "Bytespider",       // ByteDance/TikTok AI
  "Google-Extended",  // Google Gemini training
  "Applebot-Extended", // Apple Intelligence
  "FacebookBot",      // Meta AI features
];
```

## Email Configuration

### Environment Variables

```env
# SMTP Configuration
SMTP_HOST=mail.privateemail.com
SMTP_PORT=587
SMTP_USER=info@zempar.com
SMTP_PASS=your-smtp-password

# Email Settings
GEO_LEAD_FROM="Zempar <info@zempar.com>"
GEO_LEAD_NOTIFY_TO=saif.almaliki@zempar.com

# Development
GEO_LEAD_SKIP_EMAIL=false  # Set to true to skip emails in dev
```

### Email Flow

1. **Lead Email:**
   - From: `Zempar <info@zempar.com>`
   - To: Lead's email address
   - Reply-To: `saif.almaliki@zempar.com`
   - Subject: `Your GEO Visibility Report for {domain} — Score: {score}/100 ({grade})`
   - Attachment: PDF report

2. **Internal Notification:**
   - From: `Zempar <info@zempar.com>`
   - To: `saif.almaliki@zempar.com`
   - Reply-To: Lead's email
   - Subject: `[Zempar] GEO report sent — {domain} — {score}/100`
   - Contains: Lead details, score summary, delivery status

## Performance Targets

| Stage | Target Time | Notes |
|-------|-------------|-------|
| Website Fetch | 2-5s | Depends on target site |
| AI Agents (5 parallel) | 15-30s | Anthropic API latency |
| Score Computation | <100ms | Pure calculation |
| PDF Generation | 1-3s | React-PDF rendering |
| Email Delivery | 2-5s | SMTP transmission |
| **Total Pipeline** | **20-45s** | End-to-end |

## Error Handling

1. **Validation Errors** (400):
   - Invalid email format
   - Malformed URL
   - Honeypot triggered

2. **Analysis Errors** (500):
   - Website fetch timeout
   - Anthropic API failure
   - PDF generation failure
   - SMTP send failure

3. **Graceful Degradation:**
   - Missing robots.txt → Default allowed for all crawlers
   - Missing llms.txt → Score penalty in visibility agent
   - SMTP failure → Internal notification still sent
   - Email skip mode → `GEO_LEAD_SKIP_EMAIL=true`

## File Structure

```
app/api/geo-lead/
  route.ts                 # Main API endpoint

lib/geo/
  types.ts                 # Shared type definitions
  grade.ts                 # Score → Grade conversion
  scoring.ts               # Composite score calculation
  fetch-website.ts          # Website data collection
  run-agent.ts             # Anthropic API wrapper
  loader.ts                # Agent prompt loader
  messages/
    ai-visibility.ts        # AI Visibility agent prompt
    content.ts             # E-E-A-T agent prompt
    technical.ts           # Technical GEO agent prompt
    platform.ts            # Platform Optimization prompt
    schema.ts              # Schema agent prompt

lib/email/
  sender.ts                # Nodemailer send functions
  templates.ts             # HTML email templates
  outbound-config.ts       # SMTP configuration checks

lib/pdf/
  generate-pdf.ts          # PDF buffer generation
  GeoReport.tsx            # React-PDF document
  components/
    CoverPage.tsx          # Title page
    AgentSection.tsx       # Agent results
    ActionPlan.tsx         # Prioritized recommendations
```

## Monitoring

Console logs are emitted with a unique pipeline ID for tracking:

```
[geo-lead:m1a2b3c] New audit request
[geo-lead:m1a2b3c] Website: www.example.com
[geo-lead:m1a2b3c] Email: lead@example.com
[14:32:01] [geo-lead:m1a2b3c] [1/8] Fetching website...
[14:32:03] [geo-lead:m1a2b3c]       Website fetched in 2100ms — 2450 words
[14:32:03] [geo-lead:m1a2b3c] [2/8] Running 5 AI agents in parallel...
[14:32:15] [geo-lead:m1a2b3c]       ✓ AI Visibility: 42/100 (Poor) — 12400ms
[14:32:18] [geo-lead:m1a2b3c]       ✓ Content E-E-A-T: 8/100 (Critical) — 15200ms
[14:32:20] [geo-lead:m1a2b3c]       ✓ Technical GEO: 28/100 (Critical) — 17100ms
[14:32:22] [geo-lead:m1a2b3c]       ✓ Platform: 18/100 (Critical) — 19000ms
[14:32:25] [geo-lead:m1a2b3c]       ✓ Schema: 58/100 (Poor) — 22300ms
[14:32:25] [geo-lead:m1a2b3c] [3/8] Computing composite score...
[14:32:25] [geo-lead:m1a2b3c]       Score: 32/100 (Critical)
[14:32:27] [geo-lead:m1a2b3c] [4/8] Generating PDF report...
[14:32:30] [geo-lead:m1a2b3c] [5/8] Sending report email...
[14:32:31] [geo-lead:m1a2b3c] [6/8] Sending internal notification...
[14:32:31] [geo-lead:m1a2b3c] Pipeline complete in 30000ms
```