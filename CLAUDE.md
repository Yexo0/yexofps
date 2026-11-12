# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

yexofps.org — personal site of Baptiste Dauvergne ("Yexo" on the creator/gaming side). Dashboard-style site organised in 7 "spaces": Home, Career, Lab (homelab), Gaming (ranks + live Valorant tracker), Creator (edits, partners, Y-Services shop), Tools (sensitivity converter), Contact. Bilingual (French first, English) via next-intl. Self-hosted on an Ubuntu VPS.

Never mention the work-study employer, its name or its city anywhere (texts, translations, metadata, Lab). The role is written as "Alternant gestionnaire d'infrastructures informatiques au sein d'une DSI".

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack), TypeScript, React 19
- **Styling:** Tailwind CSS v4, tokens in `src/app/globals.css`
- **Colors:** Material You tonal palette generated from ONE seed color (`src/config/theme.ts`) by `src/lib/theme.ts` (`@material/material-color-utilities`), injected as CSS variables. Dark by default, light available.
- **Fonts:** Geist + Geist Mono (`geist` package, no network at build)
- **UI primitives:** Radix (`radix-ui`: Dialog, Accordion, Tabs), Lucide icons, brand SVGs in `src/components/icons/brands.tsx`
- **i18n:** next-intl, `/fr/...` and `/en/...` prefixes, default `fr`
- **External APIs:** HenrikDev Valorant API via `/api/valorant`; Lanyard (live Discord presence) via `/api/presence`. Own live endpoint: `/api/host` (server figures, no hostname/IP)

## Commands

```bash
npm run dev        # Dev server (port 3000)
npm run build      # Production build (must pass with no warning)
npm run lint       # ESLint (must pass with no warning)
```

## Architecture

### Routes (`src/app/[locale]/`)

| Space | Route | File |
|-------|-------|------|
| 01 Home | `/` | `page.tsx` |
| 02 Career | `/career` | `career/page.tsx` |
| 03 Lab | `/lab` | `lab/page.tsx` |
| 04 Gaming | `/gaming` | `gaming/page.tsx` |
| 05 Creator | `/creator` | `creator/page.tsx` |
| 06 Tools | `/tools` | `tools/page.tsx` |
| 07 Contact | `/contact` | `contact/page.tsx` |

Also: `gaming/settings/page.tsx` (Valorant settings, laid out like the in-game menu), `lab/site/page.tsx` (how this site is hosted: live server figures from `/api/host` via `src/lib/host.ts`, request path, stack; `HOSTING` in `site.ts` for what can't be detected), `now/page.tsx` (what I'm doing right now, attached to the Contact space via `aliases` in `spaces.ts`), `opengraph-image.tsx` (per locale), `not-found.tsx`, `[...rest]` (localized 404), `src/app/icon.tsx`, `apple-icon.tsx`, `sitemap.ts`, `robots.ts`, `api/valorant/route.ts`.

Old URLs (`/profil`, `/ranks`, `/shop`, `/tracker`, `/convert`, `/liens`, `/pro`, with or without locale) are 301-redirected in `next.config.ts`.

### Config — single sources of truth (`src/config/`)

- `theme.ts` — accent seed color (change it to re-theme the whole site)
- `site.ts` — every URL (socials, emails, affiliate links, Payhip, TikTok videos), age (`PROFILE`), featured edit (`FEATURED_EDIT`: local `video` + `poster` in `public/videos/` with a custom player — used only if the file exists at build, autoplays muted only while on screen; `aspect` "landscape" switches the home to a wide 16:9 card; otherwise TikTok embed on click), tracker account, Valorant peak, ranks, setup, products (`exampleUrl` / `previewUrl` buttons only show when set), reviews
- `spaces.ts` — the 7 spaces (order = number = keyboard shortcut); `aliases` attach extra pages to a space
- `lab.ts` — the whole homelab (VLANs, hosts, VMs, map). Invented items carry `placeholder: true` + a comment
- `career.ts` — timeline, skills, missions, PDF guides, BTS network map
- `valorant-settings.ts` — every in-game Valorant setting read from screenshots (tabs → sub-tabs → sections → rows), crosshair (preview + profile code), display. Sens/DPI come from `MY_SENS` in `site.ts`
- `now.ts` — weekly schedule (weekday / Saturday / Sunday, from wake-up to next wake-up) and availability per activity. The /now status, the Contact banner and the statusline segment are computed client-side in Europe/Paris time (`src/lib/now.ts`, `useNow`): no manual update. `SPOTIFY_URL` in `site.ts` shows the Spotify button during the music slot when set. Live Discord presence (`DISCORD_USER_ID` in `site.ts`, Lanyard): a game/app listed in `PRESENCE_ACTIVITIES` overrides the schedule, Spotify listening shows the current track, the Discord avatar (static, with profile decoration and status dot; DND is shown as online) replaces the activity icon on /now and the Contact banner; unlisted activities never leave the server (`src/lib/presence.ts`, 15 s server cache, client polls every 30 s while visible)

All visible text lives in `messages/fr.json` and `messages/en.json` (same keys as the config ids). Card subtitles are shell commands and stay literal, as do the Valorant setting labels (copied from the English game client).

### Components (`src/components/`)

- `shell/` — Rail (desktop, sliding active indicator) + bottom bar (mobile), UIProvider (shortcuts 1–7, Ctrl/⌘+K, ?), CommandPalette, ShortcutsDialog, Statusline (tmux-style footer), SectionNav/PageSections (sticky in-page nav), ScrollReveal, CardSpotlight (hover border light), Logo
- `ui/` — Card (base of everything: icon pill, title, mono subtitle, meta, "next space" link), primitives (StatTile, Chip, Tag, buttons, Skeleton), Accordion, CopyButton, NextSpace, Reticle (viewfinder corners), DotDigits (dot-matrix numbers)
- `network-map/` — interactive SVG map (hover/click → role, neighbours, traceroute path), list view on mobile
- `valorant/` — settings menu (tabs/sub-tabs synced with the URL hash, read-only controls), crosshair SVG drawn from the config, summary tiles (sens, eDPI, cm/360, crosshair code)
- `hosting/` — /lab/site live tiles (response time measured in the browser, uptimes, last deploy from `BUILD_TIME`/`BUILD_COMMIT` set in `next.config.ts`), request path diagram, server specs
- `now/` — current activity card (schedule or live Discord), Spotify now playing, typical week (timeline + list), Contact banner and statusline segment
- `gaming/`, `home/`, `career/`, `creator/`, `tools/` — space-specific pieces

### Tracker data flow

1. `useValorantTracker` fetches `/api/valorant?region=eu&name=Fallen%20angel&tag=yexo&mode=unrated&size=10` (params from `TRACKER` in `site.ts`)
2. The API route (unchanged) proxies HenrikDev with `HENRIK_API_KEY` and reduces each match to the player's stats
3. States: loading (skeleton) / ready / empty / error (rate limit, unavailable incl. missing key, network). The peak is always shown.
4. Auto-refresh every 90 s, manual refresh with a 25 s cooldown

### Sensitivity converter math (`src/lib/converter-math.ts`, unchanged)

Yaw: CS2 `0.022`, Valorant `0.07`, Apex `0.022`, OW2 `0.0066`. `cm360 = (360 × 2.54) / (dpi × sens × yaw)`.

## Design rules

Dark neutral background with a static topographic texture, an airy home page (hero, featured edit player, short fastfetch, gaming summary), bento grid of 20px-radius cards inside a thin rounded frame (6 columns from `md`, 12 from 1024 px = Tailwind `lg`, so `lg:col-span-*` always matches the grid), single pastel accent (game color stripes on rank tiles are the only exception). No neon, flashy gradients, video, particles, emojis in the UI, blinking text or "hacker" clichés. Performance: no `backdrop-filter` on cards, sticky or fixed bars (it divided scroll smoothness by 3 on modest machines; surfaces are near-opaque instead), animate `transform`/`opacity` only, and first-screen cards are revealed before hydration by `earlyRevealScript` (`src/lib/theme.ts`). Soft accent glow (`--glow*` tokens) is reserved for wayfinding only: primary action, current location (rail indicator, active section chip), live state, hovered card (border spotlight), traceroute path. Animations: soft Apple-like motion (scroll reveal via `ScrollReveal`, card content cascading in with `.stagger`, network links drawing in, edit timeline unrolling, dot-matrix digits lighting up, sliding rail indicator, page transitions (React `<ViewTransition>` in `shell/page-transition.tsx`: content slides in the navigation direction from `html[data-nav-dir]`, the h1 card morphs as `lead-card`), blur-in hero title, smooth accordion/dialog/tab transitions, press feedback), all disabled with `prefers-reduced-motion`. Long spaces (career, lab, gaming, creator) have a sticky "on this page" `SectionNav` with scrollspy and reading progress.

Tone: don't overplay ranks. Radiant (peak, a few months in 2024, now Immortal 3) appears only alongside the other ranks; the creator side is "monteur vidéo (Valorant)". Contrast AA in both themes.

## Environment Variables

- `HENRIK_API_KEY` — HenrikDev Valorant API key (`.env.local`, never committed)

## Code Style

- Code files start with their path/filename as a one-line comment
- Comments describe purpose and effect when necessary
- Modularity, DRY, performance, security
