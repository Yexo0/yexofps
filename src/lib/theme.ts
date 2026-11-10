// src/lib/theme.ts — Génère les variables CSS (mode sombre et clair) à partir de ACCENT_SEED.
// Exécuté côté serveur uniquement : le CSS produit est injecté dans <head> par le layout.
import {
  Hct,
  TonalPalette,
  argbFromHex,
  hexFromArgb,
} from "@material/material-color-utilities";
import { ACCENT_SEED, NEUTRAL_CHROMA } from "@/config/theme";

const seed = Hct.fromInt(argbFromHex(ACCENT_SEED));
// Même règle que la palette "primary" de Material You : chroma minimum de 48.
const primary = TonalPalette.fromHueAndChroma(seed.hue, Math.max(seed.chroma, 48));
const neutral = TonalPalette.fromHueAndChroma(seed.hue, NEUTRAL_CHROMA);
const variant = TonalPalette.fromHueAndChroma(seed.hue, NEUTRAL_CHROMA * 2);

const hex = (p: TonalPalette, tone: number) => hexFromArgb(p.tone(tone));

/** Couleur hexadécimale + opacité → rgba() */
function alpha(p: TonalPalette, tone: number, a: number): string {
  const argb = p.tone(tone);
  const r = (argb >> 16) & 0xff;
  const g = (argb >> 8) & 0xff;
  const b = argb & 0xff;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

type Tokens = Record<string, string>;

const dark: Tokens = {
  "--bg": hex(neutral, 4),
  "--surface": alpha(neutral, 10, 0.78),
  "--surface-solid": hex(neutral, 10),
  "--surface-2": hex(neutral, 15),
  "--surface-3": hex(neutral, 22),
  "--surface-hover": hex(neutral, 25),
  "--inset": hex(neutral, 6),
  "--line": alpha(variant, 50, 0.22),
  "--line-strong": alpha(variant, 60, 0.38),
  "--text": hex(neutral, 92),
  "--text-muted": hex(variant, 80),
  "--text-dim": hex(variant, 66),
  "--accent": hex(primary, 80),
  "--on-accent": hex(primary, 20),
  "--accent-container": hex(primary, 30),
  "--on-accent-container": hex(primary, 90),
  "--accent-soft": alpha(primary, 80, 0.12),
  "--accent-tint": `color-mix(in oklab, ${hex(primary, 80)} 16%, ${hex(neutral, 22)})`,
  "--accent-mid": hex(primary, 60),
  "--accent-low": hex(primary, 40),
  "--texture-opacity": "0.11",
  "--texture-blend": "screen",
  "--texture-filter": "none",
  "--shadow": "0 1px 0 rgba(255,255,255,0.03) inset, 0 12px 32px rgba(0,0,0,0.28)",
};

const light: Tokens = {
  "--bg": hex(neutral, 94),
  "--surface": alpha(neutral, 99, 0.82),
  "--surface-solid": hex(neutral, 99),
  "--surface-2": hex(neutral, 95),
  "--surface-3": hex(neutral, 90),
  "--surface-hover": hex(neutral, 87),
  "--inset": hex(neutral, 92),
  "--line": alpha(variant, 50, 0.2),
  "--line-strong": alpha(variant, 40, 0.35),
  "--text": hex(neutral, 10),
  "--text-muted": hex(variant, 30),
  "--text-dim": hex(variant, 40),
  "--accent": hex(primary, 40),
  "--on-accent": hex(primary, 100),
  "--accent-container": hex(primary, 90),
  "--on-accent-container": hex(primary, 10),
  "--accent-soft": alpha(primary, 40, 0.1),
  "--accent-tint": `color-mix(in oklab, ${hex(primary, 40)} 12%, ${hex(neutral, 92)})`,
  "--accent-mid": hex(primary, 60),
  "--accent-low": hex(primary, 80),
  "--texture-opacity": "0.07",
  "--texture-blend": "multiply",
  "--texture-filter": "invert(1)",
  "--shadow": "0 1px 2px rgba(0,0,0,0.04), 0 10px 28px rgba(0,0,0,0.06)",
};

const block = (tokens: Tokens) =>
  Object.entries(tokens)
    .map(([k, v]) => `${k}:${v};`)
    .join("");

/** CSS injecté dans <head>. Le mode sombre est le mode par défaut. */
export const themeCss =
  `:root,[data-theme="dark"]{color-scheme:dark;${block(dark)}}` +
  `[data-theme="light"]{color-scheme:light;${block(light)}}`;

/** Couleur du navigateur (barre d'adresse mobile) */
export const themeColor = { dark: hex(neutral, 4), light: hex(neutral, 94) };

/**
 * Script exécuté avant le premier rendu : applique le thème choisi par le visiteur
 * (localStorage) pour éviter un flash. Sans choix enregistré, on reste en sombre.
 */
export const themeScript = `(function(){try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark"){document.documentElement.setAttribute("data-theme",t);}}catch(e){}})();`;
