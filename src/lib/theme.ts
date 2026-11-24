// src/lib/theme.ts — Génère les variables CSS (mode sombre et clair) à partir de src/config/theme.ts.
// Neutres (fond, cartes, textes) communs à tout le site ; accent propre à chaque espace, appliqué
// par html[data-space] (posé avant le premier rendu par themeScript, puis par SpaceSync).
// Exécuté côté serveur uniquement : le CSS produit est injecté dans <head> par le layout.
import {
  Hct,
  TonalPalette,
  argbFromHex,
  hexFromArgb,
} from "@material/material-color-utilities";
import { NEUTRAL_CHROMA, NEUTRAL_SEED, SPACE_SEEDS, SPACE_SEEDS_2, THEME_OVERRIDES, type ThemeKey } from "@/config/theme";
import { SPACES } from "@/config/spaces";

const neutralHue = Hct.fromInt(argbFromHex(NEUTRAL_SEED)).hue;
const neutral = TonalPalette.fromHueAndChroma(neutralHue, NEUTRAL_CHROMA);
const variant = TonalPalette.fromHueAndChroma(neutralHue, NEUTRAL_CHROMA * 2);

/** Palette d'accent : la couleur de base garde toute sa saturation (minimum 48, comme Material You). */
function accentPalette(seedHex: string): TonalPalette {
  const seed = Hct.fromInt(argbFromHex(seedHex));
  return TonalPalette.fromHueAndChroma(seed.hue, Math.max(seed.chroma, 48));
}

const hex = (p: TonalPalette, tone: number) => hexFromArgb(p.tone(tone));

/** Ton d'une palette + opacité → rgba() */
function alpha(p: TonalPalette, tone: number, a: number): string {
  const argb = p.tone(tone);
  const r = (argb >> 16) & 0xff;
  const g = (argb >> 8) & 0xff;
  const b = argb & 0xff;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

type Tokens = Record<string, string>;

/* ─── Neutres ─────────────────────────────────────────── */

const darkNeutrals: Tokens = {
  "--bg": hex(neutral, 4),
  "--surface": alpha(neutral, 9, 0.9),
  "--surface-solid": hex(neutral, 9),
  "--surface-2": hex(neutral, 14),
  "--surface-3": hex(neutral, 21),
  "--surface-hover": hex(neutral, 25),
  "--inset": hex(neutral, 6),
  "--line": alpha(variant, 55, 0.2),
  "--line-strong": alpha(variant, 65, 0.36),
  "--text": hex(neutral, 94),
  "--text-muted": hex(variant, 78),
  "--text-dim": hex(variant, 64),
  "--shadow": "0 1px 0 rgba(255,255,255,0.03) inset, 0 12px 32px rgba(0,0,0,0.28)",
  "--backdrop-lines": "0.55",
};

const lightNeutrals: Tokens = {
  "--bg": hex(neutral, 93),
  "--surface": alpha(neutral, 99, 0.92),
  "--surface-solid": hex(neutral, 99),
  "--surface-2": hex(neutral, 95),
  "--surface-3": hex(neutral, 90),
  "--surface-hover": hex(neutral, 87),
  "--inset": hex(neutral, 92),
  "--line": alpha(variant, 50, 0.22),
  "--line-strong": alpha(variant, 40, 0.36),
  "--text": hex(neutral, 10),
  "--text-muted": hex(variant, 30),
  "--text-dim": hex(variant, 40),
  "--shadow": "0 1px 2px rgba(0,0,0,0.04), 0 10px 28px rgba(0,0,0,0.06)",
  "--backdrop-lines": "0.7",
};

/* ─── Accents (un jeu par espace) ─────────────────────── */

function darkAccent(id: ThemeKey): Tokens {
  const p = accentPalette(SPACE_SEEDS[id]);
  const p2 = accentPalette(SPACE_SEEDS_2[id]);
  return {
    "--accent": hex(p, 64),
    "--accent-2": hex(p2, 72),
    "--accent-vivid": hex(p, 56),
    "--on-accent": hex(p, 8),
    "--accent-container": hex(p, 28),
    "--on-accent-container": hex(p, 92),
    "--accent-soft": alpha(p, 64, 0.14),
    "--accent-tint": `color-mix(in oklab, ${hex(p, 64)} 18%, ${hex(neutral, 21)})`,
    // Lueurs de guidage : action principale, position actuelle, direct, survol
    "--glow": alpha(p, 60, 0.38),
    "--glow-strong": alpha(p, 60, 0.58),
    "--glow-ring": alpha(p, 70, 0.4),
    "--spot": alpha(p, 70, 0.95),
    "--spot-fill": alpha(p, 70, 0.08),
    "--accent-mid": hex(p, 50),
    "--accent-low": hex(p, 34),
    // Fond de page teinté (fumée, dégradés)
    "--haze": alpha(p, 50, 0.16),
    "--haze-2": alpha(p2, 55, 0.07),
  };
}

function lightAccent(id: ThemeKey): Tokens {
  const p = accentPalette(SPACE_SEEDS[id]);
  const p2 = accentPalette(SPACE_SEEDS_2[id]);
  return {
    "--accent": hex(p, 44),
    "--accent-2": hex(p2, 50),
    "--accent-vivid": hex(p, 52),
    "--on-accent": hex(p, 100),
    "--accent-container": hex(p, 90),
    "--on-accent-container": hex(p, 10),
    "--accent-soft": alpha(p, 44, 0.1),
    "--accent-tint": `color-mix(in oklab, ${hex(p, 44)} 12%, ${hex(neutral, 92)})`,
    "--glow": alpha(p, 50, 0.26),
    "--glow-strong": alpha(p, 50, 0.4),
    "--glow-ring": alpha(p, 44, 0.3),
    "--spot": alpha(p, 44, 0.7),
    "--spot-fill": alpha(p, 44, 0.06),
    "--accent-mid": hex(p, 62),
    "--accent-low": hex(p, 82),
    "--haze": alpha(p, 70, 0.22),
    "--haze-2": alpha(p2, 75, 0.1),
  };
}

const block = (tokens: Tokens) =>
  Object.entries(tokens)
    .map(([k, v]) => `${k}:${v};`)
    .join("");

/** CSS injecté dans <head>. Mode sombre par défaut, accent de l'accueil par défaut. */
export const themeCss =
  `:root,[data-theme="dark"]{color-scheme:dark;${block(darkNeutrals)}${block(darkAccent("home"))}}` +
  `[data-theme="light"]{color-scheme:light;${block(lightNeutrals)}${block(lightAccent("home"))}}` +
  // Espace de la page (html[data-space]) ou élément coloré à part (data-accent, ex : tuiles d'espaces)
  // Univers à part (THEME_OVERRIDES), sur le même modèle
  (Object.keys(SPACE_SEEDS) as ThemeKey[])
    .map(
      (id) =>
        `${id === "home" ? "" : `:root[data-space="${id}"],`}[data-accent="${id}"]{${block(darkAccent(id))}}` +
        `${id === "home" ? "" : `:root[data-theme="light"][data-space="${id}"],`}[data-theme="light"] [data-accent="${id}"]{${block(lightAccent(id))}}`,
    )
    .join("");

/** Couleur du navigateur (barre d'adresse mobile) */
export const themeColor = { dark: hex(neutral, 4), light: hex(neutral, 93) };

/** Préfixes d'URL → espace, pour poser data-space avant le premier rendu (voir spaceFromPath) */
const spaceRoutes = SPACES.filter((s) => s.href !== "/").map((s) => [s.id, [s.href, ...(s.aliases ?? [])]]);

/**
 * Script exécuté avant le premier rendu : applique le thème choisi par le visiteur
 * (localStorage) et la couleur de l'espace de la page, pour éviter un flash.
 * Pose aussi data-js : les animations d'apparition ne s'activent que si JavaScript tourne.
 */
export const themeScript = `(function(){var d=document.documentElement;d.setAttribute("data-js","");try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark"){d.setAttribute("data-theme",t);}}catch(e){}var p=location.pathname.replace(/^\\/(fr|en)(?=\\/|$)/,"").replace(/\\/$/,"")||"/",r=${JSON.stringify(spaceRoutes)},o=${JSON.stringify(THEME_OVERRIDES)},s="home";for(var i=0;i<r.length;i++){for(var j=0;j<r[i][1].length;j++){var h=r[i][1][j];if(p===h||p.indexOf(h+"/")===0){s=r[i][0];}}}if(o[p])s=o[p];d.setAttribute("data-space",s);})();`;

/**
 * Script placé juste après le contenu : lance tout de suite l'apparition des cartes du premier écran,
 * sans attendre le chargement de React (sur un appareil lent, plusieurs secondes de gagnées).
 * Il ne touche pas aux cartes (React les reprend telles quelles) : il ajoute dans <head> une feuille
 * de style qui les cible par leur position, puis ScrollReveal prend le relais et la retire.
 * Les cartes plus bas restent gérées par ScrollReveal au défilement. La carte principale (data-lcp)
 * n'en a pas besoin : elle est visible dès le premier affichage (globals.css).
 */
export const earlyRevealScript = `(function(){var m=document.getElementById("main");if(!m)return;var h=window.innerHeight,css=[],cards=[];function path(e){var p=[];while(e&&e!==m){var i=1,s=e;while((s=s.previousElementSibling))i++;p.unshift(e.tagName.toLowerCase()+":nth-child("+i+")");e=e.parentElement}return"#main>"+p.join(">")}m.querySelectorAll(".card:not([data-lcp])").forEach(function(c){if(c.getBoundingClientRect().top>=h)return;var s=path(c);cards.push(c);css.push(s+"{animation:early-in 700ms cubic-bezier(.16,1,.3,1) calc(var(--i,0)*70ms) both}"+s+" .stagger>*{animation:fade-up 650ms cubic-bezier(.16,1,.3,1) calc(180ms + var(--si,0)*55ms) both}")});if(!css.length)return;var st=document.createElement("style");st.id="early-reveal";st.textContent=css.join("");document.head.appendChild(st);window.__earlyCards=cards})();`;

const homeAccent = accentPalette(SPACE_SEEDS.home);

/** Couleurs en hexadécimal pour les images générées (favicon, Open Graph) — mode sombre, accueil */
export const brand = {
  bg: hex(neutral, 4),
  surface: hex(neutral, 9),
  surface2: hex(neutral, 14),
  line: hex(variant, 25),
  text: hex(neutral, 94),
  muted: hex(variant, 78),
  dim: hex(variant, 64),
  accent: hex(homeAccent, 60),
  onAccent: hex(homeAccent, 8),
  accentTint: hex(homeAccent, 25),
};
