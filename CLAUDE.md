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
- Contact form → opens the visitor’s email client via `mailto:` (no third-party email API)

### Notes

- `next.config.ts` has `eslint.ignoreDuringBuilds: true` — ESLint errors won't block builds
- Spline 3D scenes are used in hero/demo components (`@splinetool/react-spline`)
- Framer Motion handles page and component animations
