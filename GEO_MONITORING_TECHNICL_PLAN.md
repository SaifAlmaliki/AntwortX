# GEO Monitoring System - Complete Technical Plan

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Database Schema](#database-schema)
4. [API Design](#api-design)
5. [Background Jobs & Scheduling](#background-jobs--scheduling)
6. [AI Engine Integrations](#ai-engine-integrations)
7. [Metrics Calculation](#metrics-calculation)
8. [UI Components](#ui-components)
9. [Cost Analysis](#cost-analysis)
10. [Implementation Phases](#implementation-phases)
11. [Environment Variables](#environment-variables)

---

## Overview

### What is GEO Monitoring?
GEO (Generative Engine Optimization) monitoring tracks how AI engines (ChatGPT, Perplexity, Gemini, etc.) discover, cite, and recommend your brand when users ask category-related questions.

### Core Metrics to Track
1. **GEO Score** - Overall visibility index across all AI engines
2. **Share of Voice (SoV)** - Percentage of AI answers mentioning your brand vs competitors
3. **Citation Rate** - How often AI provides direct links/citations to your website
4. **Brand Sentiment** - Positive/Neutral/Negative sentiment in AI responses
5. **Prompt Coverage** - Number of unique prompts that trigger your brand
6. **Snippet Retrieval Frequency** - How often specific content chunks are pulled
7. **Perceived Brand Authority** - Authority score based on high-authority source mentions
8. **Zero-Click Surface Presence** - Brand mentions in AI summaries without links

---

## Architecture

### High-Level Flow
```
User enables monitoring → System generates category prompts → 
Query AI engines → Parse responses → Calculate metrics → 
Store results → Display in dashboard → Schedule next check
```

### Components
1. **Monitoring Configuration** - User sets up what to monitor (brand, competitors, category)
2. **Prompt Generator** - Creates category-relevant prompts for testing
3. **AI Engine Clients** - Integrations with OpenAI, Perplexity, etc.
4. **Response Parser** - Extracts brand mentions, citations, sentiment
5. **Metrics Calculator** - Computes all 8 GEO metrics
6. **Scheduler** - Runs periodic checks (daily/weekly)
7. **Dashboard** - Visualizes trends and current metrics

---

## Database Schema

### New Prisma Models

```prisma
// GEO Monitoring Configuration
model GEOMonitoring {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Brand DNA reference (optional - can monitor without Brand DNA)
  brandDNAId  String?
  brandDNA    BrandDNA? @relation(fields: [brandDNAId], references: [id], onDelete: SetNull)
  
  // Monitoring configuration
  brandName   String   // Brand name to monitor
  websiteUrl  String   @db.Text // Website URL to check citations
  category    String   // e.g., "HR software", "project management tools"
  
  // Competitors (for Share of Voice calculation)
  competitors Json?    // Array of competitor brand names: ["Competitor A", "Competitor B"]
  
  // Monitoring settings
  frequency   String   @default("weekly") // daily, weekly, monthly
  isActive    Boolean  @default(true)
  
  // AI engines to monitor
  engines     String[] // ["openai", "perplexity", "gemini", "claude"]
  
  // Next scheduled check
  nextCheckAt DateTime?
  
  // Relations
  checks      GEOCheck[]
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([userId])
  @@index([isActive])
  @@index([nextCheckAt])
  @@index([brandDNAId])
  @@map("geo_monitoring")
}

// Individual monitoring check (one per scheduled run)
model GEOCheck {
  id              String   @id @default(cuid())
  monitoringId    String
  monitoring      GEOMonitoring @relation(fields: [monitoringId], references: [id], onDelete: Cascade)
  
  // Check metadata
  checkDate       DateTime @default(now())
  status          String   @default("pending") // pending, running, completed, failed
  
  // Overall metrics (aggregated across all engines)
  geoScore        Float?   // 0-100 composite score
  shareOfVoice    Float?   // Percentage (0-100)
  citationRate    Float?   // Percentage (0-100)
  brandSentiment  String?  // positive, neutral, negative
  promptCoverage  Int?     // Number of unique prompts that triggered brand
  snippetFrequency Float?  // Average snippet retrieval frequency
  brandAuthority  Float?   // 0-100 authority score
  zeroClickPresence Float? // Percentage (0-100)
  
  // Detailed results per engine
  engineResults   Json?    // {
                           //   "openai": { mentions: 5, citations: 2, sentiment: "positive", ... },
                           //   "perplexity": { mentions: 8, citations: 5, sentiment: "positive", ... }
                           // }
  
  // Prompt results
  promptResults   Json?    // Array of {
                           //   prompt: "What are the best HR tools?",
                           //   engines: {
                           //     "openai": { mentioned: true, cited: true, response: "...", ... },
                           //     "perplexity": { mentioned: true, cited: true, response: "...", ... }
                           //   }
                           // }
  
  // Error tracking
  errorMessage    String?  @db.Text
  retryCount      Int      @default(0)
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([monitoringId])
  @@index([checkDate])
  @@index([status])
  @@map("geo_checks")
}

// Prompt templates for category-based queries
model GEOPromptTemplate {
  id          String   @id @default(cuid())
  
  // Template configuration
  category    String   // e.g., "HR software", "project management"
  prompt      String   @db.Text // Template with {brandName} placeholder
  description String?  @db.Text
  
  // Usage tracking
  usageCount  Int      @default(0)
  
  // Status
  isActive    Boolean  @default(true)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([category])
  @@index([isActive])
  @@map("geo_prompt_templates")
}
```

### Update Existing Models

```prisma
// Add to BrandDNA model
model BrandDNA {
  // ... existing fields ...
  
  // GEO Monitoring relation
  geoMonitoring GEOMonitoring[]
  
  // ... rest of model ...
}
```

---

## API Design

### 1. Monitoring Configuration APIs

#### `POST /api/geo-monitoring`
Create a new monitoring configuration.

**Request:**
```json
{
  "brandDNAId": "optional-brand-dna-id",
  "brandName": "Hirios",
  "websiteUrl": "https://hirios.com/",
  "category": "HR software",
  "competitors": ["BambooHR", "Workday", "ADP"],
  "frequency": "weekly",
  "engines": ["openai", "perplexity"]
}
```

**Response:**
```json
{
  "success": true,
  "monitoring": {
    "id": "...",
    "brandName": "Hirios",
    "nextCheckAt": "2026-02-27T00:00:00Z",
    ...
  }
}
```

#### `GET /api/geo-monitoring`
List all monitoring configurations for user.

#### `GET /api/geo-monitoring/[id]`
Get specific monitoring configuration with latest check results.

#### `PATCH /api/geo-monitoring/[id]`
Update monitoring configuration.

#### `DELETE /api/geo-monitoring/[id]`
Delete monitoring configuration.

#### `POST /api/geo-monitoring/[id]/run-now`
Manually trigger a check (bypasses schedule).

### 2. Check Results APIs

#### `GET /api/geo-monitoring/[id]/checks`
Get all checks for a monitoring configuration.

**Query params:**
- `limit` - Number of results (default: 10)
- `offset` - Pagination offset
- `startDate` - Filter checks after this date
- `endDate` - Filter checks before this date

#### `GET /api/geo-monitoring/[id]/checks/[checkId]`
Get detailed results for a specific check.

#### `GET /api/geo-monitoring/[id]/metrics`
Get aggregated metrics over time (for charts).

**Query params:**
- `startDate` - Start of date range
- `endDate` - End of date range
- `metric` - Specific metric to return (geoScore, shareOfVoice, etc.)

**Response:**
```json
{
  "geoScore": [
    { "date": "2026-02-20", "value": 72.5 },
    { "date": "2026-02-27", "value": 75.2 }
  ],
  "shareOfVoice": [...],
  "citationRate": [...]
}
```

### 3. Prompt Template APIs

#### `GET /api/geo-monitoring/prompt-templates`
List available prompt templates (can be seeded with common categories).

#### `POST /api/geo-monitoring/prompt-templates`
Create custom prompt template (admin or user-specific).

---

## Background Jobs & Scheduling

### Vercel Cron Configuration

Add to `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/process-scheduled-posts",
      "schedule": "0 0 * * *"
    },
    {
      "path": "/api/cron/geo-monitoring-check",
      "schedule": "0 2 * * *"
    }
  ]
}
```

### Cron Endpoint: `/api/cron/geo-monitoring-check/route.ts`

**Purpose:** Run scheduled GEO checks for all active monitoring configurations.

**Logic:**
1. Find all `GEOMonitoring` records where:
   - `isActive = true`
   - `nextCheckAt <= now()`
2. For each monitoring:
   - Create a `GEOCheck` record with status "running"
   - Generate prompts based on category
   - Query all configured AI engines
   - Parse responses and calculate metrics
   - Update `GEOCheck` with results
   - Calculate `nextCheckAt` based on frequency
   - Update `GEOMonitoring.nextCheckAt`

**Rate Limiting:** Process max 10 monitoring configs per run to avoid timeout.

**Error Handling:** If a check fails, increment `retryCount` and schedule retry.

---

## AI Engine Integrations

### Supported Engines

1. **OpenAI (ChatGPT)**
2. **Perplexity AI**
3. **Google Gemini**
4. **Anthropic Claude** (optional)

### Implementation Structure

Create `lib/geo-engines/` directory:

```
lib/geo-engines/
├── index.ts              # Export all engines
├── base.ts               # Base engine interface
├── openai.ts             # OpenAI implementation
├── perplexity.ts         # Perplexity implementation
├── gemini.ts             # Gemini implementation
└── types.ts              # Shared types
```

### Base Engine Interface

```typescript
// lib/geo-engines/types.ts
export interface EngineResponse {
  engine: string;
  prompt: string;
  response: string;
  mentioned: boolean;        // Brand name mentioned?
  cited: boolean;            // Website URL cited?
  citationUrl?: string;       // Actual citation URL if cited
  sentiment?: 'positive' | 'neutral' | 'negative';
  mentions: number;          // Number of times brand mentioned
  context?: string;          // Surrounding context of mention
  snippets?: string[];        // Content snippets pulled from website
}

export interface EngineClient {
  name: string;
  query(prompt: string, brandName: string, websiteUrl: string): Promise<EngineResponse>;
}
```

### OpenAI Implementation

```typescript
// lib/geo-engines/openai.ts
import OpenAI from 'openai';
import { EngineClient, EngineResponse } from './types';

export class OpenAIEngine implements EngineClient {
  name = 'openai';
  private client: OpenAI;

  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not configured');
    }
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async query(
    prompt: string,
    brandName: string,
    websiteUrl: string
  ): Promise<EngineResponse> {
    const response = await this.client.chat.completions.create({
      model: 'gpt-4o-mini', // Use cheaper model for monitoring
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 1000,
    });

    const text = response.choices[0]?.message?.content || '';
    
    return this.parseResponse(text, brandName, websiteUrl);
  }

  private parseResponse(
    text: string,
    brandName: string,
    websiteUrl: string
  ): EngineResponse {
    const normalizedBrand = brandName.toLowerCase();
    const normalizedText = text.toLowerCase();
    
    // Check for brand mention
    const mentioned = normalizedText.includes(normalizedBrand);
    
    // Count mentions
    const mentions = (normalizedText.match(new RegExp(normalizedBrand, 'g')) || []).length;
    
    // Check for citation (look for website URL or domain)
    const domain = new URL(websiteUrl).hostname.replace('www.', '');
    const cited = normalizedText.includes(domain) || normalizedText.includes(websiteUrl);
    
    // Extract citation URL if present
    const urlRegex = /https?:\/\/[^\s\)]+/gi;
    const urls = text.match(urlRegex) || [];
    const citationUrl = urls.find(url => 
      url.includes(domain) || url.includes(websiteUrl)
    );
    
    // Sentiment analysis (simple keyword-based, can be enhanced with AI)
    const sentiment = this.analyzeSentiment(text, brandName);
    
    return {
      engine: this.name,
      prompt: '', // Will be set by caller
      response: text,
      mentioned,
      cited: !!citationUrl,
      citationUrl,
      sentiment,
      mentions,
      context: this.extractContext(text, brandName),
    };
  }

  private analyzeSentiment(text: string, brandName: string): 'positive' | 'neutral' | 'negative' {
    const positiveWords = ['best', 'great', 'excellent', 'recommend', 'top', 'leading'];
    const negativeWords = ['poor', 'bad', 'issues', 'problems', 'avoid'];
    
    const lowerText = text.toLowerCase();
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  private extractContext(text: string, brandName: string): string {
    const index = text.toLowerCase().indexOf(brandName.toLowerCase());
    if (index === -1) return '';
    
    const start = Math.max(0, index - 100);
    const end = Math.min(text.length, index + brandName.length + 100);
    return text.substring(start, end);
  }
}
```

### Perplexity Implementation

```typescript
// lib/geo-engines/perplexity.ts
import { EngineClient, EngineResponse } from './types';

export class PerplexityEngine implements EngineClient {
  name = 'perplexity';
  private apiKey: string;

  constructor() {
    if (!process.env.PERPLEXITY_API_KEY) {
      throw new Error('PERPLEXITY_API_KEY not configured');
    }
    this.apiKey = process.env.PERPLEXITY_API_KEY;
  }

  async query(
    prompt: string,
    brandName: string,
    websiteUrl: string
  ): Promise<EngineResponse> {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online', // Use online model for citations
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.choices[0]?.message?.content || '';
    
    // Perplexity includes citations in response, parse them
    return this.parseResponse(text, brandName, websiteUrl);
  }

  private parseResponse(
    text: string,
    brandName: string,
    websiteUrl: string
  ): EngineResponse {
    // Similar parsing logic as OpenAI
    // Perplexity citations are in format [1], [2] with sources at end
    const mentioned = text.toLowerCase().includes(brandName.toLowerCase());
    const domain = new URL(websiteUrl).hostname.replace('www.', '');
    
    // Extract citations from Perplexity format
    const citationRegex = /\[(\d+)\]/g;
    const citations: string[] = [];
    let match;
    while ((match = citationRegex.exec(text)) !== null) {
      citations.push(match[1]);
    }
    
    // Check if website URL appears in citations section
    const cited = text.includes(websiteUrl) || text.includes(domain);
    
    return {
      engine: this.name,
      prompt: '',
      response: text,
      mentioned,
      cited,
      citationUrl: cited ? websiteUrl : undefined,
      mentions: (text.match(new RegExp(brandName, 'gi')) || []).length,
      context: this.extractContext(text, brandName),
    };
  }

  private extractContext(text: string, brandName: string): string {
    // Similar to OpenAI implementation
    const index = text.toLowerCase().indexOf(brandName.toLowerCase());
    if (index === -1) return '';
    const start = Math.max(0, index - 100);
    const end = Math.min(text.length, index + brandName.length + 100);
    return text.substring(start, end);
  }
}
```

### Prompt Generation

```typescript
// lib/geo-engines/prompt-generator.ts
export class PromptGenerator {
  static generatePrompts(
    category: string,
    brandName: string,
    count: number = 10
  ): string[] {
    const templates = [
      `What are the best ${category}?`,
      `Which ${category} should I use?`,
      `Top ${category} recommendations`,
      `Compare ${category} options`,
      `What ${category} do experts recommend?`,
      `Best ${category} for small businesses`,
      `Best ${category} for enterprises`,
      `Affordable ${category} options`,
      `Most popular ${category}`,
      `What ${category} has the best features?`,
    ];

    // Return random selection of templates
    return templates
      .sort(() => Math.random() - 0.5)
      .slice(0, count)
      .map(template => template.replace('{category}', category));
  }
}
```

---

## Metrics Calculation

### Implementation: `lib/geo-metrics/calculator.ts`

```typescript
import { GEOCheck, GEOMonitoring } from '@prisma/client';

export interface CalculatedMetrics {
  geoScore: number;
  shareOfVoice: number;
  citationRate: number;
  brandSentiment: 'positive' | 'neutral' | 'negative';
  promptCoverage: number;
  snippetFrequency: number;
  brandAuthority: number;
  zeroClickPresence: number;
}

export class MetricsCalculator {
  static calculate(
    check: GEOCheck,
    monitoring: GEOMonitoring
  ): CalculatedMetrics {
    const engineResults = check.engineResults as any;
    const promptResults = check.promptResults as any[];

    // 1. GEO Score (0-100 composite)
    const geoScore = this.calculateGEOScore(engineResults, promptResults);

    // 2. Share of Voice (0-100%)
    const shareOfVoice = this.calculateShareOfVoice(
      engineResults,
      monitoring.competitors as string[]
    );

    // 3. Citation Rate (0-100%)
    const citationRate = this.calculateCitationRate(engineResults, promptResults);

    // 4. Brand Sentiment
    const brandSentiment = this.calculateSentiment(engineResults);

    // 5. Prompt Coverage
    const promptCoverage = this.calculatePromptCoverage(promptResults);

    // 6. Snippet Retrieval Frequency
    const snippetFrequency = this.calculateSnippetFrequency(engineResults);

    // 7. Brand Authority
    const brandAuthority = this.calculateBrandAuthority(engineResults);

    // 8. Zero-Click Surface Presence
    const zeroClickPresence = this.calculateZeroClickPresence(
      engineResults,
      promptResults
    );

    return {
      geoScore,
      shareOfVoice,
      citationRate,
      brandSentiment,
      promptCoverage,
      snippetFrequency,
      brandAuthority,
      zeroClickPresence,
    };
  }

  private static calculateGEOScore(
    engineResults: any,
    promptResults: any[]
  ): number {
    // Weighted composite score
    const weights = {
      mentionRate: 0.25,      // How often brand is mentioned
      citationRate: 0.30,     // How often cited
      sentimentScore: 0.20,    // Positive sentiment
      promptCoverage: 0.15,   // Breadth of coverage
      authorityScore: 0.10,   // Authority signals
    };

    const engines = Object.keys(engineResults);
    let totalScore = 0;

    engines.forEach(engine => {
      const result = engineResults[engine];
      const mentionRate = result.mentioned ? 100 : 0;
      const citationRate = result.cited ? 100 : 0;
      const sentimentScore = result.sentiment === 'positive' ? 100 :
                            result.sentiment === 'neutral' ? 50 : 0;
      const promptCoverageScore = (promptResults.filter(p => 
        p.engines[engine]?.mentioned
      ).length / promptResults.length) * 100;
      const authorityScore = result.authorityScore || 50;

      const engineScore = 
        mentionRate * weights.mentionRate +
        citationRate * weights.citationRate +
        sentimentScore * weights.sentimentScore +
        promptCoverageScore * weights.promptCoverage +
        authorityScore * weights.authorityScore;

      totalScore += engineScore;
    });

    return totalScore / engines.length;
  }

  private static calculateShareOfVoice(
    engineResults: any,
    competitors: string[]
  ): number {
    // Count total mentions across all engines
    const engines = Object.keys(engineResults);
    let brandMentions = 0;
    let totalMentions = 0;

    engines.forEach(engine => {
      const result = engineResults[engine];
      if (result.mentioned) {
        brandMentions += result.mentions || 1;
      }
      // Note: Competitor mentions would need to be tracked separately
      // For now, assume we only track brand mentions
      totalMentions += brandMentions; // Simplified
    });

    // If no competitors configured, return mention rate
    if (!competitors || competitors.length === 0) {
      return brandMentions > 0 ? 100 : 0;
    }

    // Simplified calculation - in production, would need competitor tracking
    return (brandMentions / (brandMentions + competitors.length * 2)) * 100;
  }

  private static calculateCitationRate(
    engineResults: any,
    promptResults: any[]
  ): number {
    const engines = Object.keys(engineResults);
    let totalPrompts = 0;
    let citedPrompts = 0;

    promptResults.forEach(prompt => {
      engines.forEach(engine => {
        totalPrompts++;
        if (prompt.engines[engine]?.cited) {
          citedPrompts++;
        }
      });
    });

    return totalPrompts > 0 ? (citedPrompts / totalPrompts) * 100 : 0;
  }

  private static calculateSentiment(
    engineResults: any
  ): 'positive' | 'neutral' | 'negative' {
    const engines = Object.keys(engineResults);
    let positive = 0;
    let neutral = 0;
    let negative = 0;

    engines.forEach(engine => {
      const sentiment = engineResults[engine]?.sentiment;
      if (sentiment === 'positive') positive++;
      else if (sentiment === 'negative') negative++;
      else neutral++;
    });

    if (positive > negative && positive > neutral) return 'positive';
    if (negative > positive && negative > neutral) return 'negative';
    return 'neutral';
  }

  private static calculatePromptCoverage(
    promptResults: any[]
  ): number {
    return promptResults.filter(p => {
      const engines = Object.keys(p.engines || {});
      return engines.some(engine => p.engines[engine]?.mentioned);
    }).length;
  }

  private static calculateSnippetFrequency(
    engineResults: any
  ): number {
    const engines = Object.keys(engineResults);
    let totalSnippets = 0;

    engines.forEach(engine => {
      const snippets = engineResults[engine]?.snippets || [];
      totalSnippets += snippets.length;
    });

    return engines.length > 0 ? totalSnippets / engines.length : 0;
  }

  private static calculateBrandAuthority(
    engineResults: any
  ): number {
    // Simplified - would need to analyze source citations
    const engines = Object.keys(engineResults);
    let authorityScore = 0;

    engines.forEach(engine => {
      const result = engineResults[engine];
      // Higher score if cited with high-authority sources
      if (result.cited) authorityScore += 30;
      if (result.sentiment === 'positive') authorityScore += 20;
    });

    return Math.min(100, authorityScore);
  }

  private static calculateZeroClickPresence(
    engineResults: any,
    promptResults: any[]
  ): number {
    // Percentage of mentions without citations
    const engines = Object.keys(engineResults);
    let mentionedWithoutCitation = 0;
    let totalMentions = 0;

    promptResults.forEach(prompt => {
      engines.forEach(engine => {
        const result = prompt.engines[engine];
        if (result?.mentioned) {
          totalMentions++;
          if (!result.cited) {
            mentionedWithoutCitation++;
          }
        }
      });
    });

    return totalMentions > 0 
      ? (mentionedWithoutCitation / totalMentions) * 100 
      : 0;
  }
}
```

---

## UI Components

### Page: `/app/(dashboard)/brand-dna/[id]/geo-monitoring/page.tsx`

Main GEO monitoring dashboard for a Brand DNA.

**Features:**
- Overview cards showing current metrics
- Time-series charts for each metric
- Comparison view (current vs previous period)
- Engine breakdown (how each AI engine performs)
- Prompt analysis (which prompts trigger brand)
- Competitor comparison (Share of Voice)

### Components Needed

1. **`GEOOverviewCards`** - Display 8 key metrics as cards
2. **`GEOMetricsChart`** - Recharts line/bar chart for trends
3. **`GEOEngineBreakdown`** - Table showing per-engine results
4. **`GEOPromptAnalysis`** - List of prompts with mention/citation status
5. **`GEOCompetitorComparison`** - Share of Voice visualization
6. **`GEOMonitoringSettings`** - Form to configure monitoring

---

## Cost Analysis

### API Costs (Monthly Estimates)

**OpenAI (gpt-4o-mini):**
- ~$0.15 per 1M input tokens
- ~$0.60 per 1M output tokens
- Per check: ~10 prompts × 100 tokens input + 500 tokens output = ~$0.003 per check
- Weekly monitoring: ~$0.012/month per brand

**Perplexity:**
- ~$0.20 per 1M input tokens
- ~$0.20 per 1M output tokens
- Similar cost structure

**Google Gemini:**
- Free tier: 60 requests/minute
- Paid: ~$0.00025 per 1K characters

### Estimated Monthly Costs

- **10 brands monitored weekly:** ~$0.50/month (OpenAI only)
- **100 brands monitored weekly:** ~$5/month
- **100 brands monitored daily:** ~$35/month

### Points System Integration

Recommend charging:
- **Setup:** 10 points (one-time)
- **Weekly check:** 2 points per check
- **Daily check:** 10 points per check

---

## Implementation Phases

### Phase 1: Foundation (Week 1-2)
- [ ] Add Prisma schema for `GEOMonitoring` and `GEOCheck`
- [ ] Run migration
- [ ] Create API routes for monitoring CRUD
- [ ] Create OpenAI engine integration
- [ ] Basic prompt generation
- [ ] Simple metrics calculation (GEO Score, Citation Rate)

### Phase 2: Core Features (Week 3-4)
- [ ] Add Perplexity engine integration
- [ ] Implement all 8 metrics
- [ ] Create cron job for scheduled checks
- [ ] Build basic dashboard UI
- [ ] Add manual "Run Now" functionality

### Phase 3: Advanced Features (Week 5-6)
- [ ] Add Gemini engine integration
- [ ] Competitor tracking for Share of Voice
- [ ] Enhanced sentiment analysis
- [ ] Time-series charts
- [ ] Export functionality (CSV/PDF reports)

### Phase 4: Polish & Optimization (Week 7-8)
- [ ] Error handling and retries
- [ ] Rate limiting
- [ ] Cost optimization (batch processing)
- [ ] Email alerts for significant changes
- [ ] Documentation

---

## Environment Variables

Add to `.env.example`:

```bash
# GEO Monitoring
OPENAI_API_KEY="sk-..." # Already exists
PERPLEXITY_API_KEY="pplx-..."
GOOGLE_GEMINI_API_KEY="..." # Optional
ANTHROPIC_API_KEY="sk-ant-..." # Optional

# GEO Monitoring Settings
GEO_MONITORING_MAX_CHECKS_PER_RUN=10
GEO_MONITORING_DEFAULT_FREQUENCY="weekly"
```

---

## Next Steps

1. **Review this plan** - Ensure it aligns with your vision
2. **Prioritize features** - Decide which metrics are most important
3. **Start with Phase 1** - Build foundation first
4. **Test with one brand** - Validate approach before scaling
5. **Iterate based on feedback** - Refine metrics and UI

---

## Questions to Consider

1. **Which AI engines are highest priority?** (Start with OpenAI + Perplexity?)
2. **How often should checks run?** (Daily might be overkill initially)
3. **Should this be a premium feature?** (Require paid plan or higher point cost)
4. **Do you want real-time alerts?** (Email when metrics drop significantly)
5. **Competitor tracking complexity?** (Simple list vs. automatic detection)

---

This plan provides a complete roadmap for building the GEO monitoring system. Start with Phase 1 and iterate based on user feedback and usage patterns.
