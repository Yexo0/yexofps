# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

yexofps.org — personal site of Baptiste Dauvergne ("Yexo" on the creator/gaming side). Dashboard-style site organised in 7 "spaces": Home, Career, Lab (homelab), Gaming (ranks + live Valorant tracker), Creator (edits, partners, Y-Services shop), Tools (sensitivity converter), Contact. Bilingual (French first, English) via next-intl. Self-hosted on an Ubuntu VPS.

Never mention the work-study employer, its name or its city anywhere (texts, translations, metadata, Lab). The role is written as "Alternant gestionnaire d'infrastructures informatiques au sein d'une DSI".

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack), TypeScript, React 19
- **Styling:** Tailwind CSS v4, tokens in `src/app/globals.css`
- **Colors:** one accent seed per space (`SPACE_SEEDS` + second tint `SPACE_SEEDS_2` in `src/config/theme.ts`), turned into full Material You tonal palettes by `src/lib/theme.ts` (`@material/material-color-utilities`) and injected as CSS variables. `html[data-space]` (set before first paint by `themeScript`, then by `SpaceSync`) picks the page's accent; `data-accent="<space>"` colors a single element (home space tiles). Accent tokens are registered `@property` colors, so they glide from one space to the next. Neutrals: dark navy (`NEUTRAL_SEED`). Dark by default, light available.
- **Fonts:** Geist + Geist Mono (`geist` package) for text, Anton (`src/app/fonts/anton-latin.woff2`, OFL, `next/font/local`) for titles and big numbers via the `.display` class / `font-display`. No network at build.
- **3D:** three.js + React Three Fiber + drei, client-only and lazy (`next/dynamic`), in `src/components/three/`. Models in `public/models/` (optimized with `npx @gltf-transform/cli optimize in.glb out.glb --compress meshopt --texture-compress webp --texture-size 2048`), credits in `MODEL_CREDITS` (`site.ts`), shown under the statusline with the Riot Games notice.
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
- `lab.ts` — the whole homelab (VLANs, hosts, VMs, map, `LAB_SCENARIOS` replayed on the map). Invented items carry `placeholder: true` + a comment
- `career.ts` — timeline, skills, missions, PDF guides, BTS network map and `BTS_SCENARIOS`
- `valorant-settings.ts` — every in-game Valorant setting read from screenshots (tabs → sub-tabs → sections → rows), crosshair (preview + profile code), display. Sens/DPI come from `MY_SENS` in `site.ts`
- `now.ts` — weekly schedule (weekday / Saturday / Sunday, from wake-up to next wake-up) and availability per activity. The /now status, the Contact banner and the statusline segment are computed client-side in Europe/Paris time (`src/lib/now.ts`, `useNow`): no manual update. `SPOTIFY_URL` in `site.ts` shows the Spotify button during the music slot when set. Live Discord presence (`DISCORD_USER_ID` in `site.ts`, Lanyard): a game/app listed in `PRESENCE_ACTIVITIES` overrides the schedule, Spotify listening shows the current track, the Discord avatar (static, with profile decoration and status dot; DND is shown as online) replaces the activity icon on /now and the Contact banner; unlisted activities never leave the server (`src/lib/presence.ts`, 15 s server cache, client polls every 30 s while visible)

All visible text lives in `messages/fr.json` and `messages/en.json` (same keys as the config ids). Card subtitles are shell commands and stay literal, as do the Valorant setting labels (copied from the English game client).

### Components (`src/components/`)

- `shell/` — Rail (desktop: expands on hover/keyboard focus to show a title + description per space, `nav.rail.*`; the page scales down to the right with a transform on `.shell` instead of being covered) + bottom bar (mobile), Backdrop (page background: tinted gradients, low-res WebGL smoke at 30 fps, tactical SVG lines with parallax, huge outlined space number), SpaceSync, AimCursor (mouse only: the cursor is my real crosshair from `CROSSHAIR`, corners snap around the hovered clickable, buttons are magnetic, click "fires"), Credits, UIProvider (shortcuts 1–7, Ctrl/⌘+K, ?), CommandPalette, ShortcutsDialog, Statusline (small tmux-style footer), SectionNav/PageSections (sticky in-page nav), ScrollReveal, CardSpotlight (hover border light), Logo
- `ui/` — Card (base of everything: icon pill, display title, small mono subtitle, meta, "next space" link), primitives (StatTile with count-up, Chip, Tag, buttons, Skeleton), Accordion, CopyButton, NextSpace, Reticle (viewfinder corners), DotDigits (dot-matrix numbers), CountUp, SplitText (letter-by-letter reveal)
- `three/` — VandalStage (home hero: inspect-style intro spin, idle float, mouse tilt, scroll rotation), BuddyStage (Radiant gun buddy swinging like a damped pendulum, pushed by the mouse), LogoStage (Valorant logo title card with a light sweep), `useStage` (shared: mount after first paint if WebGL, read space colors, render only on screen and tab visible)
- `network-map/` — interactive SVG map (hover/click → role, neighbours, traceroute path), list view on mobile; `scenarios.tsx` replays real paths pipeline-style (packet travelling along links, steps pending / running / done, scenario bar with play/pause), only on screen, paused while a node is hovered or pinned
- `valorant/` — settings menu (tabs/sub-tabs synced with the URL hash, read-only controls), crosshair SVG drawn from the config, summary tiles (sens, eDPI, cm/360, crosshair code)
- `hosting/` — /lab/site live tiles (response time measured in the browser, uptimes, last deploy from `BUILD_TIME`/`BUILD_COMMIT` set in `next.config.ts`), request path diagram, server specs
- `now/` — current activity card (schedule or live Discord), Spotify now playing, typical week (timeline + list), Contact banner and statusline segment
- `gaming/` (RankGrid: current rank huge, peak tile with PeakBuddy, other games), `home/` (HeroVandal, KeyStats, SpaceTiles, LiveCard, FeaturedEdit, Whoami), `career/`, `creator/` (LogoTitle), `tools/` — space-specific pieces

### Tracker data flow

1. `useValorantTracker` fetches `/api/valorant?region=eu&name=Fallen%20angel&tag=yexo&mode=unrated&size=10` (params from `TRACKER` in `site.ts`)
2. The API route (unchanged) proxies HenrikDev with `HENRIK_API_KEY` and reduces each match to the player's stats
3. States: loading (skeleton) / ready / empty / error (rate limit, unavailable incl. missing key, network). The peak is always shown.
4. Auto-refresh every 90 s, manual refresh with a 25 s cooldown

### Sensitivity converter math (`src/lib/converter-math.ts`, unchanged)

Yaw: CS2 `0.022`, Valorant `0.07`, Apex `0.022`, OW2 `0.0066`. `cm360 = (360 × 2.54) / (dpi × sens × yaw)`.

## Design rules

Valorant-inspired, original (no copy of the game's UI or art). Dark navy background with the layered Backdrop (no static texture), one vivid accent per space plus a second tint for gradients and highlights (game color stripes on rank tiles stay). Bento grid of cards with cut corners (top-left and bottom-right, `clip-path` + gradient edges, `--cut`) inside a frame drawn as four viewfinder corners (6 columns from `md`, 12 from 1024 px = Tailwind `lg`, so `lg:col-span-*` always matches the grid). Sharp radii everywhere (Tailwind radius scale overridden in `@theme`), uppercase buttons with a slanted sweep on hover, primary button with an offset outline. Titles and key figures in the condensed display font, big; secondary text small; terminal flavour (card subtitles, whoami, statusline) kept but small.

Placement is deliberate, top to bottom: what matters most first and biggest. Home = hero (huge name, one line, actions, 3D Vandal on a slanted accent band, inspection callouts, key figures strip), then proof (featured edit, live stats), then the other spaces as large colored tiles. Gaming = current rank huge, peak with the swinging Radiant buddy, other games beside it (Radiant, peak a few months in 2024, now Immortal 3, only appears alongside the other ranks); creator side is "monteur vidéo (Valorant)". 3D only where it carries meaning (home hero, peak tile, Creator title card); no 3D characters.

Performance: no `backdrop-filter` on cards, sticky or fixed bars (surfaces are near-opaque instead); animate `transform`/`opacity` only (the expanding rail and the page scale use transforms; registered color transitions run only on space/theme change); first-screen cards are revealed before hydration by `earlyRevealScript`. WebGL: background smoke at ~1/3 resolution and 30 fps, every canvas renders only when on screen and the tab is visible, models compressed (meshopt + webp), three.js loaded after first paint. Soft accent glow (`--glow*`) is for wayfinding: primary action, current location, live state, hovered card, traceroute and scenario paths, aim corners.

Animations (more and richer, never gratuitous): letter-by-letter hero title, count-up figures, card reveal + cascading content, slanted button sweep, magnetic buttons, crosshair cursor with snapping corners, rail expansion with cascading labels, space color glide, diagonal page wipe in the navigation direction (React `<ViewTransition>`, `html[data-nav-dir]`, the h1 card morphs as `lead-card`), network scenarios, edit timeline, dot-matrix digits, 3D intros. Everything is disabled or frozen with `prefers-reduced-motion`; no particles, emojis in the UI, blinking text or "hacker" clichés. Contrast AA in both themes.

## Environment Variables

- `HENRIK_API_KEY` — HenrikDev Valorant API key (`.env.local`, never committed)

## Code Style

- Code files start with their path/filename as a one-line comment
- Comments describe purpose and effect when necessary
- Modularity, DRY, performance, security
