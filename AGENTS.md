# AGENTS.md

Guidelines for agentic coding agents operating in this repository.

## Build/Lint/Test Commands

```bash
# Development server (with Turbopack)
npm run dev

# Production build
npm run build

# Lint check
npm run lint

# Start production server
npm run start

# Generate Prisma client (required after schema changes)
npx prisma generate
```

**No test framework is currently configured.** When adding tests, useVitest or Jest with acommand like `npm test`.

## Project Structure

```
app/                    # Next.js App Router
  api/                  # API routes (server-side)
    geo-lead/          # GEO audit endpoint
    geo-monitoring/    # Monitoring CRUD endpoints
    cron/              # Scheduled jobs
  page.tsx             # Homepage
  layout.tsx           # Root layout

lib/
  geo/                  # GEO analysis pipeline
    fetch-website.ts    # Website scraping (Cheerio)
    run-agent.ts        # Anthropic Claude integration
    scoring.ts          # Composite score calculation
    types.ts            # Shared TypeScript types
    messages/           # Agent prompt builders
  email/               # SMTP email (Nodemailer)
  pdf/                 # PDF generation (React-PDF)
  generated/prisma/    # Generated Prisma client

components/            # React components
contexts/              # React contexts
locales/               # i18n JSON files (en.json, ar.json)

agents/                # Claude agent system prompts (markdown)
```

## Code Style Guidelines

### Imports

Group imports in this order:
1. React/Next.js imports
2. Third-party packages
3. Internal imports using `@/` alias

```typescript
// ✅ Good
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Anthropic from "@anthropic-ai/sdk";

import { fetchWebsite } from "@/lib/geo/fetch-website";
import { computeCompositeScore } from "@/lib/geo/scoring";
import type { AgentResults } from "@/lib/geo/types";

// ❌ Bad - unsorted
import { computeCompositeScore } from "@/lib/geo/scoring";
import { useState } from "react";
import Anthropic from "@anthropic-ai/sdk";
```

### Types

- Use `interface`for object shapes
- Use `type` for unions, literals, and mapped types
- Prefer explicit return types for exported functions

```typescript
// ✅ Good
export interface WebsiteData {
  url: string;
  domain: string;
  wordCount: number;
}

export type Grade = 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Critical';

export function computeScore(data: WebsiteData): number {
  // ...
}

// ❌ Bad
export type WebsiteData = {
  url: string;
}
```

### Naming Conventions

| Element | Convention | Example |
|----------|------------|---------|
| Components | PascalCase | `GeoLeadSection` |
| Functions | camelCase | `fetchWebsite`, `computeScore` |
| Constants | SCREAMING_SNAKE | `MAX_BODY`, `DEFAULT_NOTIFY` |
| Files | kebab-case | `fetch-website.ts`, `run-agent.ts` |
| Types | PascalCase | `AgentResult`, `CompositeScore` |

### Error Handling

- Return typed error responses from API routes
- Use `try/catch`for async operations
- Log errors with context using `console.error`

```typescript
// ✅ Good
try {
  const data = await fetchWebsite(url);
  return NextResponse.json({ ok: true, data });
} catch (e) {
  console.error("geo-lead analysis error", e);
  return NextResponse.json({ error: "analysis_failed" }, { status: 500 });
}

// ❌ Bad - no error handling
const data = await fetchWebsite(url);
return NextResponse.json({ data });
```

### API Routes

- Always export `runtime = "nodejs"` for routes using Node.js APIs
- Validate input types before processing
- Use `NextResponse.json()` for responses
- Use `after()` for background processing

```typescript
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const ct = req.headers.get("content-type")?.split(";")[0]?.trim();
  if (ct !== "application/json") {
    return NextResponse.json({ error: "unsupported_media" }, { status: 415 });
  }
  // ... process request
}
```

### Environment Variables

Access via `process.env.VARIABLE_NAME`:

```typescript
const apiKey = process.env.ANTHROPIC_API_KEY;
const smtpHost = process.env.SMTP_HOST;
```

Required env vars are defined in `.env.example`.

### Prisma

Import from the generated client:

```typescript
import { prisma } from "@/lib/db";

// Usage
const monitors = await prisma.gEOMonitoring.findMany({
  where: { isActive: true },
});
```

After schema changes, regenerate:

```bash
npx prisma generate
```

### React Components

- Use `"use client"` directive for client components
- Extract reusable utilities to `lib/`
- Use `cn()` utility for conditional Tailwind classes

```typescript
"use client";

import { cn } from "@/lib/utils";

export function MyComponent({ isActive }: { isActive: boolean }) {
  return (
    <div className={cn(
      "base-styles",
      isActive && "active-styles"
    )}>
      Content
    </div>
  );
}
```

### Comments

- Use JSDoc for exported functions with parameters/returns
- Keep implementation comments brief
- No commented-out code in production

```typescript
/**
 * Compute the composite GEO score from agent results.
 * Weights: Visibility 45%, Content 20%, Technical 15%, Schema 10%, Platform 10%
 */
export function computeCompositeScore(agents: AgentResults): CompositeScore {
  // ...
}
```

### Async Patterns

- Use `async/await` over `.then()` chains
- Run independent async operations in parallel with `Promise.all`

```typescript
// ✅ Good - parallel execution
const [visibility, content, technical, platform, schema] = await Promise.all([
  runAgent(client, "geo-ai-visibility", msg1),
  runAgent(client, "geo-content", msg2),
  runAgent(client, "geo-technical", msg3),
  runAgent(client, "geo-platform", msg4),
  runAgent(client, "geo-schema", msg5),
]);

// ❌ Bad - sequential execution
const visibility = await runAgent(client, "geo-ai-visibility", msg1);
const content = await runAgent(client, "geo-content", msg2);
```

## Modularity & DRY Principles

### Code Organization

- **Single Responsibility**: Each file/module should have one clear purpose
- **Extract reusable logic**: Move shared code to `lib/` utilities
- **Avoid duplication**: If code appears twice, extract it to a shared function

```typescript
// ✅ Good - shared utility in lib/geo/scoring.ts
export function scoreToGrade(score: number): Grade {
  if (score >= 90) return 'Excellent';
  if (score >= 75) return 'Good';
  if (score >= 60) return 'Fair';
  if (score >= 40) return 'Poor';
  return 'Critical';
}

// ✅ Good - reused across multiple files
import { scoreToGrade } from "@/lib/geo/scoring";

// ❌ Bad - duplicated logic in multiple files
function getGrade(score: number) {
  if (score >= 90) return 'Excellent'; // duplicated!
}
```

### Component Reuse

- **Check existing components first**: Before creating new components, check `components/ui/` and `components/`
- **Use shadcn/ui primitives**: Build on existing Button, Dialog, Card, etc.
- **Extract shared patterns**: Repeated UI patterns should become components

```typescript
// ✅ Good - reuse existing UI components
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

// ✅ Good - create reusable wrapper for common patterns
export function ScoreBadge({ score }: { score: number }) {
  const grade = scoreToGrade(score);
  return (
    <span className={cn("badge", gradeToTailwind(grade))}>
      {score}/100
    </span>
  );
}

// ❌ Bad - inline styles repeated across files
<span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-red-500/10 text-red-500">
```

### Utility Functions

- **Place in `lib/`**: Shared utilities go in `lib/utils.ts` or domain-specific files
- **Pure functions preferred**: Functions without side effects are easier to test and reuse
- **Small, focused functions**: Each function should do one thing well

```typescript
// ✅ Good - focused, reusable utility in lib/utils.ts
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ✅ Good - domain-specific utility in lib/geo/grade.ts
export function gradeToTailwind(grade: Grade): string {
  const classes: Record<Grade, string> = {
    Excellent: 'text-green-500',
    Good: 'text-blue-500',
    Fair: 'text-amber-500',
    Poor: 'text-orange-500',
    Critical: 'text-red-500',
  };
  return classes[grade];
}
```

### Avoid Code Duplication

- **Check before writing**: Search existing code for similar functionality
- **Abstract common patterns**: Create shared functions/types for repeated logic
- **Use TypeScript sparingly**: Don't repeat type definitions; extract to `types.ts`

```typescript
// ✅ Good - shared types in lib/geo/types.ts
export interface AgentResult {
  agentName: string;
  score: number;
  grade: Grade;
  rawMarkdown: string;
}

// ✅ Good - import shared type
import type { AgentResult } from "@/lib/geo/types";

// ❌ Bad - duplicated type definition
interface AgentResult { // defined again in another file
  agentName: string;
  score: number;
}
```

### API Route Patterns

- **Extract validation logic**: Common validation should be in shared utilities
- **Reuse error responses**: Use consistent error response shapes

```typescript
// ✅ Good - shared validation in lib/validation.ts
export function isValidEmail(input: unknown): input is string {
  if (typeof input !== "string") return false;
  const e = input.trim();
  return e.length > 0 && e.length <= 320 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

// ✅ Good - consistent error response shape
return NextResponse.json({ error: "validation_error" }, { status: 400 });
```

### When to Create New Files

| Create a new file when... | Place it in... |
|---------------------------|----------------|
| Logic is reused in 2+ places | `lib/<domain>.ts` |
| UI pattern appears 2+ times | `components/<name>.tsx` |
| Type is shared across files | `lib/<domain>/types.ts` |
| API endpoint exceeds 100 lines | Split into helper functions in same file first |

### When NOT to Create New Files

- Don't create for single-use code
- Don't over-abstract prematurely
- Don't split files just for organization; only when there's reuse benefit

## Key Files to Know

| File | Purpose |
|------|---------|
| `app/api/geo-lead/route.ts` | Main audit endpoint |
| `lib/geo/run-agent.ts` | Claude Haiku API wrapper |
| `lib/geo/scoring.ts` | Composite score calculation |
| `lib/geo/fetch-website.ts` | Web scraping with Cheerio |
| `lib/email/sender.ts` | SMTP email sending|
| `lib/pdf/generate-pdf.ts` | PDF report generation |
| `lib/db.ts` | Prisma client singleton |

## Tech Stack

- **Framework**: Next.js 15.5 (App Router)
- **Runtime**: Node.js
- **Language**: TypeScript 5.8
- **Styling**: Tailwind CSS 3.4 + shadcn/ui
- **Database**: PostgreSQL (Neon) via Prisma 7.6
- **LLM**: Anthropic Claude Haiku 4.5
- **Email**: Nodemailer (SMTP)
- **PDF**: @react-pdf/renderer
- **Scraping**: Cheerio

## Common Tasks

### Adding a new API endpoint

1. Create `app/api/<name>/route.ts`
2. Export `runtime = "nodejs"` if using Node APIs
3. Export `GET`, `POST`, etc. handlers
4. Return typed JSON responses

### Adding a new agent

1. Create prompt file in `agents/<name>.md`
2. Create builder in `lib/geo/messages/<name>.ts`
3. Import and run in the pipeline

### Modifying the scoring

1. Edit `lib/geo/scoring.ts`
2. Update weights in documentation

### Adding email functionality

1. Add SMTP vars to `.env`
2. Use `sendReportEmail()` from `lib/email/sender.ts`