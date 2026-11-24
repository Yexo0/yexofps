# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

yexofps.org — personal portfolio of Baptiste Dauvergne ("Yexo" on the creator/gaming side). Organised in 7 spaces: Home, Projects, Career, Lab (homelab), Creator (edits, partners, Y-Services shop), Gaming (ranks + live Valorant tracker), Contact. Bilingual: **English is the main language**, French is optional (language button). Self-hosted on an Ubuntu VPS.

Never mention the work-study employer, its name or its city anywhere (texts, translations, metadata, Lab). The role is written as "Work-study IT infrastructure administrator in an IT department" / "Alternant gestionnaire d'infrastructures informatiques au sein d'une DSI".

Only the first name "Baptiste" appears on the pages (`SITE.displayName`: hero, career, footer). The full name (`SITE.author`) stays in metadata only.

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack), TypeScript, React 19
- **Styling:** Tailwind CSS v4; design system in `src/app/globals.css` (tokens, typography, layout, components, motion)
- **Colors:** three brand colors in `src/config/theme.ts` (`PALETTE`: ink `#0F1923`, bone `#ECE8E1`, signal red `#FF4655`), turned into CSS tokens for both themes by `src/lib/theme.ts` and injected in `<head>`. **One accent for the whole site** (no per-page colors). `--accent` is the red for text (AA), `--accent-vivid` the pure red for fills (primary button, bars, dots). Dark by default, light available.
- **Fonts:** Geist + Geist Mono (`geist` package) for text, Anton (`src/app/fonts/anton-latin.woff2`, OFL, `next/font/local`) for titles and big figures via `.display` / `.t-hero` / `.t-h1` / `.t-h2` / `.t-h3`. No network at build.
- **Motion:** Motion (`motion/react`) for React-driven motion (header indicator, profile switch, tabs indicators, mobile menu, hero parallax), anime.js (`animejs`) for imperative animations (count-ups, SVG strokes drawing), CSS for reveals, hovers and View Transitions. Tokens: `src/lib/motion.ts` (`EASE`, `DUR`, `STAGGER`, `SPRING`), mirrored in CSS (`--ease-out`, `--ease-in-out`, `--ease-in`, `--dur-*`); anime.js helpers in `src/lib/anime.ts` (`countTo`, `drawStrokes`). `MotionConfig reducedMotion="user"` in `UIProvider`.
- **3D:** three.js + React Three Fiber + drei, client-only and lazy (`next/dynamic`), in `src/components/three/`. Models in `public/models/` (optimized with `npx @gltf-transform/cli optimize in.glb out.glb --compress meshopt --texture-compress webp --texture-size 2048`; phone variant `vandal-lite.glb` = texture 1024 + `simplify --ratio 0.5 --error 0.001`, then `meshopt`), credits in `MODEL_CREDITS` (`site.ts`), shown in the footer with the Riot Games notice. All models are lit the same way: red rim light, bone fill light (`useStage`).
- **UI primitives:** Radix (`radix-ui`: Dialog, Tabs), Lucide icons, brand SVGs in `src/components/icons/brands.tsx`
- **i18n:** next-intl, `/en/...` and `/fr/...` prefixes, default `en`. The browser language is ignored: a first visit is English. The language button saves the choice in the `NEXT_LOCALE` cookie (1 year); `src/proxy.ts` sends unprefixed URLs to that language, or English.
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
| 02 Projects | `/projects`, `/projects/<slug>` | `projects/page.tsx`, `projects/[slug]/page.tsx` |
| 03 Career | `/career` | `career/page.tsx` |
| 04 Lab | `/lab` | `lab/page.tsx` |
| 05 Creator | `/creator` | `creator/page.tsx` |
| 06 Gaming | `/gaming` | `gaming/page.tsx` |
| 07 Contact | `/contact` | `contact/page.tsx` |

Also: `baptiste/page.tsx` (second profile of the home space, pro side: laptop in 3D, pro key figures, background, fastfetch, infra projects; the `ProfileSwitch` on both heroes links `/` ↔ `/baptiste`; old `/pro` redirects here), `gaming/settings/page.tsx` (Valorant settings, laid out like the in-game menu), `lab/site/page.tsx` (how this site is hosted: live figures from `/api/host`, request path, stack), `now/page.tsx` (what I'm doing right now, attached to Contact via `aliases` in `spaces.ts`), `opengraph-image.tsx` (per locale), `not-found.tsx`, `[...rest]` (localized 404), `src/app/icon.tsx`, `apple-icon.tsx`, `sitemap.ts` (includes every project), `robots.ts`, API routes.

The sensitivity converter and the PDF guides live on their project pages (`/projects/sensitivity-converter`, `/projects/it-guides`). Old URLs (`/profil`, `/ranks`, `/shop`, `/tracker`, `/convert`, `/tools`, `/liens`, `/pro`, with or without locale) are 301-redirected in `next.config.ts`.

### Config — single sources of truth (`src/config/`)

- `theme.ts` — the three brand colors
- `spaces.ts` — the 7 spaces (order = number = keyboard shortcut 1–7); `aliases` attach extra pages to a space
- `projects.ts` — every project (id, slug, year, status, stack, cover motif and real capture, gallery, public repo, related page). Texts in `projects.items.<id>` (name, kind, tagline, summary, highlights). Only real projects, facts from their repositories. YexoUnd's description is a placeholder until its repository has content.
- `site.ts` — every URL (socials, emails, affiliate links, Payhip, TikTok videos), age (`PROFILE`), featured edit (`FEATURED_EDIT`: local `video` + `poster` in `public/videos/`, custom player, source attached only near the viewport, autoplays muted only on screen), tracker account, Valorant peak, ranks, setup, products, reviews. Files in `public/videos/` and `public/models/` are cached one year `immutable`: rename them (v2, v3…) whenever they change.
- `lab.ts` — the whole homelab (VLANs, hosts, VMs, map, `LAB_SCENARIOS`). Invented items carry `placeholder: true` + a comment
- `career.ts` — timeline, skills, missions, PDF guides, BTS network map and `BTS_SCENARIOS`
- `valorant-settings.ts` — every in-game Valorant setting (tabs → sub-tabs → sections → rows), crosshair, display. Sens/DPI from `MY_SENS` in `site.ts`
- `now.ts` — weekly schedule and availability; live status computed client-side in Europe/Paris time (`src/lib/now.ts`, `useNow`), overridden by Discord presence (`PRESENCE_ACTIVITIES`, `src/lib/presence.ts`)

All visible text lives in `messages/en.json` (main) and `messages/fr.json` (same keys). Exceptions kept literal on purpose: Valorant setting labels (copied from the English game client), product and tool names, the decorative labels inside project drawings (language-neutral tokens only).

### Components (`src/components/`)

- `shell/` — `SiteHeader` (fixed top bar: wordmark, numbered spaces with a red bar gliding to the current one, search ⌘K, theme, language; transparent at the top, solid once scrolled, hides on scroll down and comes back on scroll up, exposing `html[data-header-hidden]`), `MobileMenu` (full-screen, under 1024 px, Radix Dialog + Motion), `tool-buttons` (language and theme buttons), `SiteFooter` (closing call to action hidden on Contact, spaces, elsewhere, live status, deploy date, credits), `AimCursor` (mouse only: my real crosshair, an editing anchor point on /baptiste; turns 45° in a ring over clickables, magnetic buttons), `UIProvider` (shortcuts 1–7, Ctrl/⌘+K, ?, language cookie, Motion reduced-motion policy), CommandPalette, ShortcutsDialog, `SectionNav`/`PageSections` (sticky "on this page" bar under the header, scrollspy + reading progress), `ScrollReveal`, `PageTransition`, Logo/Wordmark, Credits
- `ui/` — `PageHeader` (space number, title rising word by word, lead, actions, aside, giant outlined number), `Section` (hairline that draws itself, index, title, intro, aside) and `Reveal`, `Card` (flat panel with hairline border, for interactive blocks), `Words` (word-by-word masked title), `SplitText` (letter by letter, hero name), primitives (StatTile, Chip, Tag, buttons, `ArrowLink`, Skeleton), CountUp (anime.js), CopyButton, DotDigits
- `projects/` — `ProjectCard` (plate, "View" badge on hover, number, name, status), `ProjectCover` (plate: grid + line drawing drawn by anime.js + real capture; shared view-transition name morphs grid → page), `motifs.tsx` (one line drawing per project), `LoopVideo` (muted loops, only on screen), `Converter`
- `three/` — VandalStage (home hero), LaptopStage (Baptiste hero), BuddyStage (Radiant gun buddy, damped pendulum pushed by the pointer), LogoStage (Creator title card), `useStage` (shared: mount near the viewport after load + idle, if WebGL; render only on screen and tab visible; frozen frame under reduced motion, software WebGL or low frame rate). `src/lib/defer.ts` holds the shared helpers.
- `home/` — `Hero` (both profiles: name huge, red band + 3D with scroll parallax, caption, punch, actions, key figures), `HeroStage`, `ProfileSwitch`, `KeyStats` (YexoStats / ProStats), `SelectedWork`, `SpaceIndex` (editorial index of spaces), `LiveCard`, `FeaturedEdit`, `Fastfetch`
- `network-map/` — interactive SVG map (hover/click → role, neighbours, traceroute path), list view on mobile; `scenarios.tsx` replays real paths
- `valorant/`, `gaming/`, `now/`, `hosting/`, `career/`, `creator/` — space-specific pieces

### Tracker data flow

1. `useValorantTracker` fetches `/api/valorant?region=eu&name=Fallen%20angel&tag=yexo&mode=unrated&size=10` (params from `TRACKER` in `site.ts`)
2. The API route proxies HenrikDev with `HENRIK_API_KEY` and reduces each match to the player's stats
3. States: loading (skeleton) / ready / empty / error. The peak is always shown.
4. Auto-refresh every 90 s, manual refresh with a 25 s cooldown

### Sensitivity converter math (`src/lib/converter-math.ts`, unchanged)

Yaw: CS2 `0.022`, Valorant `0.07`, Apex `0.022`, OW2 `0.0066`. `cm360 = (360 × 2.54) / (dpi × sens × yaw)`.

## Design rules

Minimal, editorial, premium; Valorant-inspired identity without copying the game's UI. Near-black navy page, bone text, **one red accent** used sparingly: primary action, current location, live state, key figures, one element per project drawing, and the hero's red band (the one big color moment). No glows, no blur, no decorative backgrounds.

Typography carries the hierarchy: Anton titles, huge and uppercase (`.t-hero`, `.t-h1`, `.t-h2`), Geist for text, Geist Mono for small labels (`.label`). Content is laid out in sections separated by hairlines (`Section`), with generous rhythm (`--section-gap`) in a `.container-x` (max 1520 px, `--gutter`). Boxes (`.card`) only for interactive blocks. Sharp corners everywhere; the signature cut corner is reserved to the primary button and media frames (`.media-frame`). Buttons: uppercase, a fill rises from the bottom on hover and the label inverts.

Copy: short and specific, one purpose per section, no repetition between sections or pages. English first, natural French.

Placement is deliberate, top to bottom: what matters most first and biggest. Two home profiles: Yexo (`/`, Valorant universe: Vandal) and Baptiste (`/baptiste`, pro side: laptop, gaming last). 3D only where it carries meaning (home heroes, peak panel, Creator title card); no 3D characters.

Motion: purposeful and consistent. Arrivals ease out (`--ease-out`), state changes ease in-out, exits ease in. Page titles rise word by word on load, section titles on reveal, blocks fade and rise once (`[data-reveal]`, CSS + `ScrollReveal`, early reveal before hydration via `earlyRevealScript`), project drawings draw themselves, figures count up, indicators glide (Motion `layoutId`), pages transition with View Transitions (old page lifts away, new one rises through a mask; project covers morph). Animate `transform`/`opacity` only (except the hero band's one-time clip-path); everything is disabled or frozen under `prefers-reduced-motion`. Contrast AA in both themes.

Performance: no `backdrop-filter`; near-opaque surfaces for fixed bars; every canvas renders only when on screen and the tab is visible; models compressed (meshopt + webp); three.js loaded after first paint; project loops attach their source near the viewport.

## Environment Variables

- `HENRIK_API_KEY` — HenrikDev Valorant API key (`.env.local`, never committed)

## Code Style

- Code files start with their path/filename as a one-line comment
- Comments describe purpose and effect when necessary
- Modularity, DRY, performance, security
