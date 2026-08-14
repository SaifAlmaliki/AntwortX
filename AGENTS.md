# AGENTS.md

Guidelines for agentic coding agents operating in this repository.

## Role

Pair-program with the user: follow their instructions and use session context (open files, diagnostics, recent edits) when it is relevant.

- Prefer **editing files in this repo** over dumping long patches in chat, unless the user asks for code only.
- **Read** surrounding code before non-trivial changes; stop gathering context once you can make a correct, minimal edit.
- **Ship runnable changes**: match existing style and conventions in files you touch; fix obvious new linter issues you introduce.

## Product

This repo is the **Blyzk / بلايزك** marketing site (`blyzk.com`) — a bilingual (Arabic default, English) landing page for shared electric scooters in Iraq.

- Brand (EN): Blyzk
- Brand (AR): بلايزك
- Hero line: Move smarter. Breathe better. / تنقّل أذكى، وهواء أنظف.
- Iraq line: مشوار أسرع، أثر أقل.
- Do not overclaim “zero emissions”. Prefer cleaner air / lighter footprint.

## Build / Lint / Test

```bash
npm run dev
npm run build
npm run lint
npm run start
```

No test framework is currently configured.

## Project Structure

```
app/                 # Next.js App Router pages
  page.tsx           # Cinematic home
  about/ contact/ terms-of-service/
components/
  cinematic/         # Home landing sections
  ui/                # shadcn primitives
lib/
  brand.ts           # Name, domain, taglines, email
  cinematic-content.ts
locales/             # en.json, ar.json
```

## Frontend & shadcn/ui

Whenever you apply frontend changes (App Router pages and layouts, `components/`, Tailwind styling, or shadcn primitives), read the **shadcn** agent skill and follow it.

## Code Style

### Imports

Group imports in this order:
1. React/Next.js
2. Third-party packages
3. Internal imports using `@/`

### Types

- Use `interface` for object shapes
- Use `type` for unions, literals, and mapped types
- Prefer explicit return types for exported functions

### Naming

| Element | Convention | Example |
|----------|------------|---------|
| Components | PascalCase | `CinematicLanding` |
| Functions | camelCase | `getCinematicContent` |
| Constants | SCREAMING_SNAKE | `BRAND_NAME_EN` |
| Files | kebab-case | `site-url.ts` |
| Types | PascalCase | `CinematicContent` |

### React

- Use `"use client"` for client components
- Extract shared utilities to `lib/`
- Use `cn()` for conditional Tailwind classes
- Use `flex` + `gap-*`, not `space-y-*` / `space-x-*`
- Use semantic tokens (`bg-background`, `text-muted-foreground`)

### i18n

- Default language is Arabic (`dir="rtl"`)
- Copy lives in `locales/ar.json` and `locales/en.json`
- Brand strings that must stay consistent also live in `lib/brand.ts`

### Environment

Access via `process.env.VARIABLE_NAME`. See `.env.example`.

```typescript
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
```

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Motion**: Framer Motion + Lenis
- **i18n**: JSON locales (ar / en)
