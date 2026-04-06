# GEO Audit Pipeline - Technical Documentation

## Score Calculation

### Weighted Formula

The overall GEO score is calculated using a **weighted average** of5 agent scores:

```
Overall Score = round(
    Visibility × 0.45  +
    Content × 0.20  +
    Technical × 0.15  +
    Schema × 0.10  +
    Platform × 0.10  
)
```

### Why These Weights?

| Dimension | Weight | Rationale |
|-----------|--------|-----------|
| **AI Visibility** | 45% | Combines Citability (25%) + Brand Authority (20%). Most critical for AI search visibility. |
| **Content E-E-A-T** | 20% | Google's quality guidelines emphasize Experience, Expertise, Authoritativeness, Trustworthiness. |
| **Technical GEO** | 15% | Foundational - if crawlers can't access content, nothing else matters. |
| **Schema** | 10% | Structured data helps AI understand context, but less critical than content quality. |
| **Platform** | 10% | Platform-specific optimizations are important but secondary to core visibility. |

### Implementation

```typescript
// lib/geo/scoring.ts
export function computeCompositeScore(agents: AgentResults): CompositeScore {
  const { visibility, content, technical, platform, schema } = agents;

  const overall = Math.round(
    visibility.score * 0.45 +
    content.score * 0.20 +
    technical.score * 0.15 +
    schema.score * 0.10 +
    platform.score * 0.10
  );

  return {
    overall,
    grade: scoreToGrade(overall),
    breakdown: {
      citability: visibility.score,
      brand: visibility.score,
      eeat: content.score,
      technical: technical.score,
      schema: schema.score,
      platform: platform.score,
    },
  };
}
```

### Grade Assignment

| Score Range | Grade | Color | Interpretation |
|-------------|-------|-------|----------------|
| 90-100 | Excellent | 🟢 Green | Strong AI search visibility |
| 75-89 | Good | 🔵 Blue | Solid presence with room for improvement |
| 60-74 | Fair | 🟡 Amber | Some visibility but significant gaps |
| 40-59 | Poor | 🟠 Orange | Minimal AI discoverability |
| 0-39| Critical | 🔴 Red | Virtually invisible to AI search |

```typescript
// lib/geo/grade.ts
export function scoreToGrade(score: number): Grade {
  if (score >= 90) return 'Excellent';
  if (score >= 75) return 'Good';
  if (score >= 60) return 'Fair';
  if (score >= 40) return 'Poor';
  return 'Critical';
}
```

---

## LLM Model

### Model Used

**Claude Haiku 4.5** (`claude-haiku-4-5-20251001`)

```typescript
// lib/geo/run-agent.ts
const response = await client.messages.create({
  model: "claude-haiku-4-5-20251001",
  max_tokens: 4096,
  system: systemPrompt,
  messages: [{ role: "user", content: userMessage }],
});
```

### Why Claude Haiku 4.5?

| Factor | Reason |
|--------|--------|
| **Speed** | Haiku is optimized for fast responses (~2-5s per agent) |
| **Cost** | ~10x cheaper than Claude Sonnet/Opus for high-volume audits |
| **Quality** | Sufficient for structured analysis tasks with clear prompts |
| **Context Window** | 200K tokens - handles full website content |
| **Output Format** | Strong at following markdown formatting instructions |

### API Configuration

```typescript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});
```

### Environment Variable

```env
ANTHROPIC_API_KEY=sk-ant-...
```

---

## The 5 Agents

Each agent is a specialized Claude prompt that analyzes a specific aspect of AI visibility. All agents run **in parallel** for performance.

### Agent 1: AI Visibility & Citability

**File:** `lib/geo/messages/ai-visibility.ts`  
**Weight:** 45% (Citability 25% + Brand Authority 20%)

**System Prompt:** `agents/geo-ai-visibility.md`

**Analyzes:**
| Category | Weight | What It Checks |
|----------|--------|-----------------|
| Citability | 35% | Can AI quote/cite content? Extractable blocks, factual statements |
| Brand Mentions | 30% | Wikipedia, LinkedIn, social media, industry reviews |
| Crawler Access | 25% | robots.txt permissions for AI crawlers |
| llms.txt | 10% | AI-specific documentation file |

**Output:** Score (0-100), Grade, Detailed markdown analysis

---

### Agent 2: Content E-E-A-T

**File:** `lib/geo/messages/content.ts`  
**Weight:** 20%

**System Prompt:** `agents/geo-content.md`

**Analyzes:**
| Dimension | Weight | What It Checks |
|-----------|--------|-----------------|
| Experience | 25% | Case studies, original research, first-hand accounts |
| Expertise | 25% | Author credentials, technical depth, methodology |
| Authoritativeness | 25% | External citations, backlinks, industry recognition |
| Trustworthiness | 25% | HTTPS, contact info, privacy policy, transparency |

**Additional Checks:**
- Word count & content depth
- Heading structure
- Internal/external links
- Publication dates
- AI content detection signals

---

### Agent 3: Technical GEO

**File:** `lib/geo/messages/technical.ts`  
**Weight:** 15%

**System Prompt:** `agents/geo-technical.md`

**Analyzes:**
| Category | Weight | What It Checks |
|----------|--------|-----------------|
| Server-Side Rendering | 25% | Is content in HTML or JS-rendered? (Critical for AI crawlers) |
| Meta Tags | 15% | Title, description, canonical, viewport |
| Crawlability | 15% | robots.txt, sitemap.xml, meta robots |
| Security Headers | 10% | HSTS, CSP, X-Frame-Options |
| Core Web Vitals | 10% | Performance risk assessment |
| Mobile Optimization | 10% | Viewport, responsive design |
| URL Structure | 5% | Clean URLs, redirects |
| Response Status | 5% | HTTP status codes |
| Additional Checks | 5% | Various technical signals |

---

### Agent 4: Platform Optimization

**File:** `lib/geo/messages/platform.ts`  
**Weight:** 10%

**System Prompt:** `agents/geo-platform-analysis.md`

**Analyzes 5 AI Platforms:**
| Platform | Key Signals |
|----------|-------------|
| Google AI Overviews | Content structure, heading patterns, Q&A format |
| ChatGPT Web Search | Entity recognition, Wikipedia presence, llms.txt |
| Perplexity AI | Community validation, source directness, freshness |
| Google Gemini | YouTube presence, Knowledge Graph, Google Business |
| Bing Copilot | Bing Webmaster Tools, IndexNow, Microsoft ecosystem |

**Output:** Average of 5 platform-specific scores

---

### Agent 5: Schema & Structured Data

**File:** `lib/geo/messages/schema.ts`  
**Weight:** 10%

**System Prompt:** `agents/geo-schema.md`

**Analyzes:**
| Schema Type | Purpose |
|-------------|---------|
| Organization | Company info, logo, contact, sameAs links |
| WebSite | Site name, URL, SearchAction |
| Service | Service offerings, areas served |
| FAQPage | Q&A content |
| Person | Author/team profiles |

**Validation Checks:**
- JSON-LD syntax validity
- Required properties
- sameAs entity linking (Wikipedia, Wikidata, LinkedIn, Crunchbase)
- Rich result eligibility

---

## Agent Execution Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    PARALLEL EXECUTION                       │
├─────────────────────────────────────────────────────────────┤
│                     │
│ fetchWebsite(url) ────┬───► WebsiteData                     │
│                     │                │
│                     ▼                    │
│ ┌─────────────────────────────────────────────────────┐    │
│ │              5 Agents Run in Parallel                 │    │
│ ├─────────────────────────────────────────────────────┤    │
│ │                                                       │    │
│ │  ┌──────────────┐  ┌──────────────┐                │    │
│ │  │ AI Visibility │  │ Content E-E-A-T│               │    │
│ │  │ (45% weight)  │  │ (20% weight)  │               │    │
│ │  └───────┬──────┘  └───────┬──────┘                │    │
│ │          ││     │
│ │          ▼                    ▼                        │    │
│ │  ┌──────────────┐  ┌──────────────┐                │    │
│ │  │ Technical GEO │  │ Platform Opt.│                 │    │
│ │  │ (15% weight)  │  │ (10% weight) │                │    │
│ │  └───────┬──────┘  └───────┬──────┘                │    │
│ │          │      │                     │
│ │          ▼                    ▼                        │    │
│ │       ┌──────────────┐                                 │    │
│ │       │ Schema       │                                 │    │
│ │       │ (10% weight) │                                 │    │
│ │       └───────┬──────┘                                │    │
│ │               │                                       │    │
│ └───────────────┼───────────────────────────────────────┘    │
│                 ▼                                            │
│        ┌────────────────┐                                   │
│        │ Promise.all([]) │                                   │
│        │ {visibility,    │                                   │
│        │  content,       │                                   │
│        │  technical,     │                                   │
│        │  platform,      │                                   │
│        │  schema}         │                                   │
│        └───────┬────────┘                                   │
│                ▼                                            │
│        computeCompositeScore()                              │
│                ▼                                            │
│        { overall: 32, grade: "Critical" }│
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.5.14 | React framework with App Router |
| **React** | 19.0.0 | UI library |
| **TypeScript** | 5.8.0 | Type safety |
| **Tailwind CSS** | 3.4.1 | Styling |
| **shadcn/ui** | 0.0.4 | UI components |
| **Radix UI** | - | Accessible primitives |
| **Framer Motion** | 12.4.7 | Animations |
| **Recharts** | 3.8.1 | Charts for monitoring dashboard |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js API Routes** | 15.5.14 | Serverless API endpoints |
| **Prisma** | 7.6.0 | ORM for PostgreSQL |
| **Neon** | - | PostgreSQL database hosting |
| **Nodemailer** | 6.10.0 | SMTP email sending |

### AI/ML

| Technology | Version | Purpose |
|------------|---------|---------|
| **Anthropic SDK** | 0.80.0 | Claude API integration |
| **Claude Haiku 4.5** | - | LLM for all 5 agents |
| **OpenAI SDK** | 6.33.0 | GPT models (monitoring feature) |
| **Google Generative AI** | 0.24.1 | Gemini models (monitoring feature) |

### Data Processing

| Technology | Version | Purpose |
|------------|---------|---------|
| **Cheerio** | 1.2.0 | HTML parsing & web scraping |
| **React-PDF** | 4.3.2 | PDF generation |

### Email

| Technology | Version | Purpose |
|------------|---------|---------|
| **Nodemailer** | 6.10.0 | SMTP client |
| **PrivateEmail** | - | SMTP server (mail.privateemail.com:587) |

---

## Key Files

```
app/api/geo-lead/
  route.ts                    # Main audit endpoint

lib/geo/
  types.ts                    # Type definitions
  grade.ts                    # Score → Grade conversion
  scoring.ts                  # Composite score calculation
  fetch-website.ts             # Website data collection
  run-agent.ts                # Claude API wrapper
  loader.ts                   # Agent prompt loader
  messages/
    ai-visibility.ts           # Agent 1 prompt builder
    content.ts                # Agent 2 prompt builder
    technical.ts              # Agent 3 prompt builder
    platform.ts               # Agent 4 prompt builder
    schema.ts                 # Agent 5 prompt builder

agents/
  geo-ai-visibility.md         # Agent 1 system prompt
  geo-content.md              # Agent 2 system prompt
  geo-technical.md            # Agent 3 system prompt
  geo-platform-analysis.md    # Agent 4 system prompt
  geo-schema.md               # Agent 5 system prompt

lib/email/
  sender.ts                   # Email sending functions
  templates.ts                # HTML email templates
  outbound-config.ts          # SMTP config checks

lib/pdf/
  generate-pdf.ts             # PDF buffer generation
  GeoReport.tsx               # React-PDF document
```

---

## Performance Characteristics

| Metric | Value | Notes |
|--------|-------|-------|
| Website Fetch | 2-5s | Depends on target site |
| Agent Execution | 15-30s | 5 agents in parallel |
| Score Calculation | <100ms | Pure math |
| PDF Generation | 1-3s | React-PDF rendering |
| Email Delivery | 2-5s | SMTP transmission |
| **Total Pipeline** | **20-45s** | End-to-end |

### Parallel Execution Benefit

Running 5 agents in parallel saves significant time:

```
Sequential: 5 agents × 5s each = 25s
Parallel: max(5s) = 5s
Time saved: 20s (80% faster)
```

---

## Environment Variables

```env
# LLM
ANTHROPIC_API_KEY=sk-ant-...# Claude Haiku for audits

# SMTP Email
SMTP_HOST=mail.privateemail.com
SMTP_PORT=587
SMTP_USER=info@zempar.com
SMTP_PASS=your-password
GEO_LEAD_FROM="Zempar <info@zempar.com>"
GEO_LEAD_NOTIFY_TO=notifications@example.com

# Database
DATABASE_URL=postgresql://...

# Monitoring AI Engines (optional)
OPENAI_API_KEY=sk-...
PERPLEXITY_API_KEY=pplx-...
GOOGLE_GEMINI_API_KEY=...
```

---

## Future Improvements

1. **Streaming Progress:** Use SSE to show real-time agent progress
2. **Caching:** Cache website fetch results for repeated audits
3. **Agent Models:** Allow per-agent model selection (Haiku vs Sonnet)
4. **Comparative Analysis:** Track score changes over time
5. **Competitor Benchmarking:** Compare against competitor scores