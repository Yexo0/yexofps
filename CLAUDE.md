# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Yexo Portfolio — a personal gaming portfolio site for a Valorant content creator (Yexo). Rebuilt with Next.js from the original static HTML/CSS/JS site. Includes dashboard, profile, gaming ranks, shop (video editing services), Valorant match tracker, sensitivity converter, and links page. Bilingual (French/English) via next-intl.

## Tech Stack

- **Framework:** Next.js 16 with App Router, TypeScript
- **UI Components:** shadcn/ui (Radix UI primitives) — components in `src/components/ui/`
- **Styling:** Tailwind CSS v4, custom dark theme in `src/app/globals.css`
- **Icons:** Lucide React + custom SVG components for TikTok/Discord in `src/components/icons/`
- **i18n:** next-intl with `/en/...` and `/fr/...` route prefixes
- **External API:** HenrikDev Valorant API via `/api/valorant` proxy route

## Commands

```bash
npm run dev        # Start dev server (default port 3000)
npm run build      # Production build
npm run lint       # ESLint
```

## Architecture

### Routing (`src/app/`)

All pages are under `[locale]/` for i18n routing:

| Route | File | Type | Purpose |
|-------|------|------|---------|
| `/` | `[locale]/page.tsx` | Server | Dashboard — avatar + 6 navigation cards |
| `/profil` | `[locale]/profil/page.tsx` | Server | About, partners, social media |
| `/ranks` | `[locale]/ranks/page.tsx` | Server | Gaming ranks + setup |
| `/shop` | `[locale]/shop/page.tsx` | Client | Products, trust stats, reviews, Payhip |
| `/tracker` | `[locale]/tracker/page.tsx` | Client | Valorant match tracker with live stats |
| `/convert` | `[locale]/convert/page.tsx` | Client | Sensitivity converter (cm/360) |
| `/liens` | `[locale]/liens/page.tsx` | Client | Contact links + clipboard copy |
| `/api/valorant` | `api/valorant/route.ts` | API | HenrikDev Valorant proxy |

### i18n Setup (`src/i18n/`)

- `routing.ts` — locale config (`en`, `fr`, default `en`)
- `request.ts` — server-side message loading
- `navigation.ts` — typed `Link`, `useRouter`, `usePathname`
- `src/middleware.ts` — locale redirect middleware (excludes `/api`, `/images`)
- `messages/en.json` + `messages/fr.json` — all UI translations

### Shared Components

- `components/layout/` — AuroraBackground (client, random blobs), BackButton, LanguageSwitcher (client), Footer, PageReveal
- `components/shared/` — GlassPanel, SectionTitle, PageHeader
- `components/icons/` — TikTokIcon, DiscordIcon (SVG)

### Key Libraries (`src/lib/`)

- `constants.ts` — all hardcoded data (social URLs, emails, partners, ranks, setup, products, reviews, tracker config)
- `tracker-types.ts` — `MatchData`/`TrackerStats` types, `computeStats()`, `fmtPct()`, `fmtNum()`
- `converter-math.ts` — game yaw values, `cm360()`, `sensFromCm360()`, `round()`

### Visual Design

Dark theme (`#0b0b0c` background) with animated aurora blobs, glass-morphism cards (`.glass-panel` class in globals.css), micro-stars with twinkle animation, staggered fade-in reveal on page load. All custom CSS in `src/app/globals.css`.

### Tracker Data Flow

1. Client fetches `/api/valorant?region=eu&name=tanjiro&tag=33333&mode=unrated&size=10`
2. API route proxies to HenrikDev with `HENRIK_API_KEY` auth header
3. Response reduced to player-specific stats per match
4. Client aggregates into TrackerStats and renders stat cards + match list
5. Auto-refresh every 90s, manual refresh with 25s cooldown

### Sensitivity Converter Math

Yaw values: CS2=`0.022`, Valorant=`0.07`, Apex=`0.022`, OW2=`0.0066`
Formula: `cm360 = (360 * 2.54) / (dpi * sens * yaw)`

## Environment Variables

- `HENRIK_API_KEY` — HenrikDev Valorant API key (in `.env.local`)

## Code Style (from rules.md)

- Code files start with path/filename as a one-line comment
- Comments describe purpose, effect when necessary
- Prioritize modularity, DRY, performance, security
- Finish one file before the next; use TODO comments for incomplete work
