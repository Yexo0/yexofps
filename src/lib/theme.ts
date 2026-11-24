// src/lib/theme.ts — Builds the CSS color tokens (dark and light) from the three brand colors in
// src/config/theme.ts. One accent for the whole site: no per-page colors.
// Server-side only: the CSS is injected into <head> by the layout, before the first paint.
import { PALETTE } from "@/config/theme";

type RGB = [number, number, number];

function rgb(hex: string): RGB {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
}

function toHex([r, g, b]: RGB): string {
  return `#${[r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("")}`;
}

/** a mixed into b: t = 0 gives b, t = 1 gives a */
function mix(a: string, b: string, t: number): string {
  const A = rgb(a);
  const B = rgb(b);
  return toHex([0, 1, 2].map((i) => A[i] * t + B[i] * (1 - t)) as RGB);
}

function alpha(hex: string, a: number): string {
  const [r, g, b] = rgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

const { ink, bone, signal } = PALETTE;
const black = "#000000";
const white = "#ffffff";

/* ─── Dark: near-black navy page, bone text ─── */

const darkBg = mix(ink, black, 0.42); // ~#060a0f
const dark = {
  bg: darkBg,
  surface: mix(ink, black, 0.62),
  surface2: mix(ink, black, 0.82),
  surface3: mix(bone, ink, 0.07),
  hover: mix(bone, ink, 0.12),
  inset: mix(ink, black, 0.5),
  text: bone,
  muted: mix(bone, darkBg, 0.72),
  dim: mix(bone, darkBg, 0.6),
  accent: signal,
  accentText: mix(signal, bone, 0.86),
};

/* ─── Light: bone page, ink text ─── */

const lightBg = bone;
const light = {
  bg: lightBg,
  surface: mix(white, bone, 0.55),
  surface2: mix(ink, bone, 0.045),
  surface3: mix(ink, bone, 0.08),
  hover: mix(ink, bone, 0.12),
  inset: mix(ink, bone, 0.03),
  text: ink,
  muted: mix(ink, lightBg, 0.76),
  dim: mix(ink, lightBg, 0.69),
  accent: mix(signal, black, 0.8),
  accentText: mix(signal, black, 0.68),
};

type Tokens = Record<string, string>;

const darkTokens: Tokens = {
  "--bg": dark.bg,
  "--surface": dark.surface,
  "--surface-solid": dark.surface,
  "--surface-2": dark.surface2,
  "--surface-3": dark.surface3,
  "--surface-hover": dark.hover,
  "--inset": dark.inset,
  "--line": alpha(bone, 0.09),
  "--line-strong": alpha(bone, 0.2),
  "--text": dark.text,
  "--text-muted": dark.muted,
  "--text-dim": dark.dim,
  "--accent": dark.accentText,
  "--accent-vivid": signal,
  "--accent-2": mix(signal, bone, 0.45),
  "--on-accent": ink,
  "--accent-container": mix(signal, darkBg, 0.22),
  "--on-accent-container": mix(signal, bone, 0.25),
  "--accent-soft": alpha(signal, 0.12),
  "--accent-tint": mix(signal, dark.surface3, 0.14),
  "--accent-mid": mix(signal, darkBg, 0.7),
  "--accent-low": mix(signal, darkBg, 0.4),
  "--glow": alpha(signal, 0.18),
  "--glow-strong": alpha(signal, 0.3),
  "--glow-ring": alpha(signal, 0.36),
  "--shadow": "0 1px 0 rgba(255,255,255,0.03) inset, 0 24px 48px -24px rgba(0,0,0,0.6)",
  "--scrim": "rgba(3, 5, 8, 0.72)",
};

const lightTokens: Tokens = {
  "--bg": light.bg,
  "--surface": light.surface,
  "--surface-solid": light.surface,
  "--surface-2": light.surface2,
  "--surface-3": light.surface3,
  "--surface-hover": light.hover,
  "--inset": light.inset,
  "--line": alpha(ink, 0.1),
  "--line-strong": alpha(ink, 0.22),
  "--text": light.text,
  "--text-muted": light.muted,
  "--text-dim": light.dim,
  "--accent": light.accentText,
  "--accent-vivid": signal,
  "--accent-2": mix(signal, black, 0.55),
  "--on-accent": ink,
  "--accent-container": mix(signal, lightBg, 0.16),
  "--on-accent-container": mix(signal, black, 0.5),
  "--accent-soft": alpha(signal, 0.1),
  "--accent-tint": mix(signal, light.surface3, 0.12),
  "--accent-mid": mix(signal, lightBg, 0.7),
  "--accent-low": mix(signal, lightBg, 0.3),
  "--glow": alpha(signal, 0.14),
  "--glow-strong": alpha(signal, 0.24),
  "--glow-ring": alpha(signal, 0.32),
  "--shadow": "0 1px 2px rgba(15,25,35,0.05), 0 24px 48px -28px rgba(15,25,35,0.28)",
  "--scrim": "rgba(15, 25, 35, 0.4)",
};

const block = (tokens: Tokens) =>
  Object.entries(tokens)
    .map(([k, v]) => `${k}:${v};`)
    .join("");

/** CSS injected into <head>. Dark by default. */
export const themeCss =
  `:root,[data-theme="dark"]{color-scheme:dark;${block(darkTokens)}}` +
  `[data-theme="light"]{color-scheme:light;${block(lightTokens)}}`;

/** Browser UI color (mobile address bar) */
export const themeColor = { dark: dark.bg, light: light.bg };

/**
 * Runs before the first paint: applies the theme saved by the visitor (localStorage) to avoid a flash,
 * and sets data-js so reveal animations only hide content when JavaScript actually runs.
 */
export const themeScript = `(function(){var d=document.documentElement;d.setAttribute("data-js","");try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark"){d.setAttribute("data-theme",t);}}catch(e){}})();`;

/**
 * Placed right after the page content: starts the reveal of everything already on the first screen
 * without waiting for React (seconds saved on a slow phone). It never touches the elements themselves
 * (React hydrates them as rendered): it adds a stylesheet that targets them by position, then
 * ScrollReveal takes over and removes it. Lower elements are revealed on scroll by ScrollReveal.
 */
export const earlyRevealScript = `(function(){var m=document.getElementById("main");if(!m)return;var h=window.innerHeight,css=[],els=[];function path(e){var p=[];while(e&&e!==m){var i=1,s=e;while((s=s.previousElementSibling))i++;p.unshift(e.tagName.toLowerCase()+":nth-child("+i+")");e=e.parentElement}return"#main>"+p.join(">")}m.querySelectorAll("[data-reveal]").forEach(function(c){if(c.getBoundingClientRect().top>=h)return;var s=path(c);els.push(c);css.push(s+"{animation:reveal-in 1000ms cubic-bezier(.16,1,.3,1) calc(120ms + var(--i,0)*80ms) both}"+s+" .stagger>*{animation:reveal-in 900ms cubic-bezier(.16,1,.3,1) calc(260ms + var(--i,0)*80ms + var(--si,0)*60ms) both}"+s+" .words .w>span{animation:word-in 1100ms cubic-bezier(.16,1,.3,1) calc(140ms + var(--wi,0)*55ms) both}")});if(!css.length)return;var st=document.createElement("style");st.id="early-reveal";st.textContent=css.join("");document.head.appendChild(st);window.__earlyReveal=els})();`;

/** Hex colors for generated images (favicon, Open Graph): dark theme */
export const brand = {
  bg: dark.bg,
  surface: dark.surface,
  surface2: dark.surface2,
  line: mix(bone, dark.bg, 0.16),
  text: bone,
  muted: dark.muted,
  dim: dark.dim,
  accent: signal,
  onAccent: ink,
  accentTint: mix(signal, dark.bg, 0.25),
};
