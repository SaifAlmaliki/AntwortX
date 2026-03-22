# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server with Turbopack (http://localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Architecture

**AntwortX** is a Next.js 15 marketing/landing site for an AI solutions platform, built with the App Router.

### Key Patterns

**Routing:** App Router (`app/`) with server and client components. All pages are under `app/` with a shared root layout at `app/layout.tsx`.

**Internationalization:** Context-based EN/AR switching via `contexts/language-context.tsx`. Use the `useLanguage()` hook to access `t(key)`, `language`, and `direction`. Translations live in `locales/en.json` and `locales/ar.json`. RTL layout is handled dynamically — the root `<html>` element updates its `dir` and `lang` attributes.

**State Management:** Zustand store at `lib/store.ts` holds chat messages and knowledge base items. Lightweight — only used for AI chat interactions.

**UI Components:** ShadCN UI (style: `new-york`) with custom components in `components/ui/`. Import path alias `@/*` maps to the project root. Use `cn()` from `lib/utils.ts` for conditional class merging. Dark mode is always enforced (`className="dark"` on `<html>`).

**Styling:** Tailwind CSS with CSS variables for theming (defined in `app/globals.css`). All theme colors reference variables like `hsl(var(--background))`.

**Backend Integration:**
- Newsletter subscriptions → Kit.com API via `app/api/subscribe/route.ts` (server-side, uses `KIT_API_KEY`, `KIT_NEWSLETTER_ID`, `KIT_API_URL`)
- Contact form → EmailJS (client-side, env vars: `NEXT_PUBLIC_EMAILJS_*`)
- AI agent backend → n8n via webhook (`NEXT_PUBLIC_N8N_WEBHOOK_URL`)

### Environment Variables

| Variable | Purpose |
|---|---|
| `KIT_API_KEY` | Kit.com newsletter API key |
| `KIT_NEWSLETTER_ID` | Kit.com subscriber list ID |
| `KIT_API_URL` | Kit.com API base URL |
| `NEXT_PUBLIC_EMAILJS_SERVICE_ID` | EmailJS service ID |
| `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID` | EmailJS template ID |
| `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` | EmailJS public key |
| `NEXT_PUBLIC_N8N_WEBHOOK_URL` | n8n webhook for AI requests |

### Notes

- `next.config.ts` has `eslint.ignoreDuringBuilds: true` — ESLint errors won't block builds
- Spline 3D scenes are used in hero/demo components (`@splinetool/react-spline`)
- Framer Motion handles page and component animations
- Socket.io-client is installed but not actively used in current routes
