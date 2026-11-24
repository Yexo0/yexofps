// src/lib/theme.ts — Variables CSS des deux thèmes, à partir de src/config/theme.ts.
// Neutres noirs et gris (thème sombre) ou gris très clairs (thème clair), un seul accent rouge.
// Côté serveur uniquement : le CSS produit est injecté dans <head> par le layout, avant le premier rendu.
import { PALETTE } from "@/config/theme";

type Tokens = Record<string, string>;

const dark: Tokens = {
  "--bg": "#000000",
  "--surface": "#121214",
  "--surface-solid": "#121214",
  "--surface-2": "#1c1c1f",
  "--surface-3": "#26262a",
  "--surface-hover": "#2e2e33",
  "--inset": "#0b0b0c",
  "--line": "rgba(255, 255, 255, 0.07)",
  "--line-strong": "rgba(255, 255, 255, 0.14)",
  "--text": "#f5f5f7",
  "--text-muted": "#a1a1a6",
  "--text-dim": "#8e8e93",
  "--accent": PALETTE.red,
  "--accent-2": "#ff8a93",
  "--accent-vivid": PALETTE.red,
  "--accent-strong": PALETTE.redStrong,
  "--on-accent": "#ffffff",
  "--accent-container": "rgba(255, 70, 85, 0.16)",
  "--on-accent-container": "#ff8a93",
  "--accent-soft": "rgba(255, 70, 85, 0.12)",
  "--accent-tint": "rgba(255, 70, 85, 0.14)",
  "--accent-mid": "#b3313c",
  "--accent-low": "#5c1a20",
  "--glow": "rgba(255, 70, 85, 0.22)",
  "--glow-strong": "rgba(255, 70, 85, 0.35)",
  "--glow-ring": "rgba(255, 70, 85, 0.4)",
  "--spot": "transparent",
  "--spot-fill": "transparent",
  "--haze": "rgba(255, 70, 85, 0.3)",
  "--haze-2": "transparent",
  "--shadow": "0 24px 48px -24px rgba(0, 0, 0, 0.7)",
  "--overlay": "rgba(0, 0, 0, 0.55)",
};

const light: Tokens = {
  "--bg": "#f5f5f7",
  "--surface": "#ffffff",
  "--surface-solid": "#ffffff",
  "--surface-2": "#f2f2f4",
  "--surface-3": "#e8e8ed",
  "--surface-hover": "#e1e1e6",
  "--inset": "#f5f5f7",
  "--line": "rgba(0, 0, 0, 0.07)",
  "--line-strong": "rgba(0, 0, 0, 0.14)",
  "--text": "#1d1d1f",
  "--text-muted": "#515154",
  "--text-dim": "#6e6e73",
  "--accent": "#c4283a",
  "--accent-2": "#e0505d",
  "--accent-vivid": PALETTE.red,
  "--accent-strong": "#d12d3b",
  "--on-accent": "#ffffff",
  "--accent-container": "rgba(255, 70, 85, 0.12)",
  "--on-accent-container": "#a31f2e",
  "--accent-soft": "rgba(255, 70, 85, 0.1)",
  "--accent-tint": "rgba(255, 70, 85, 0.1)",
  "--accent-mid": "#e86a74",
  "--accent-low": "#f6c6ca",
  "--glow": "rgba(255, 70, 85, 0.18)",
  "--glow-strong": "rgba(255, 70, 85, 0.28)",
  "--glow-ring": "rgba(255, 70, 85, 0.35)",
  "--spot": "transparent",
  "--spot-fill": "transparent",
  "--haze": "rgba(255, 70, 85, 0.22)",
  "--haze-2": "transparent",
  "--shadow": "0 1px 2px rgba(0, 0, 0, 0.04), 0 18px 40px -24px rgba(0, 0, 0, 0.18)",
  "--overlay": "rgba(0, 0, 0, 0.3)",
};

const block = (tokens: Tokens) =>
  Object.entries(tokens)
    .map(([k, v]) => `${k}:${v};`)
    .join("");

/** CSS injecté dans <head>. Sombre par défaut. */
export const themeCss = `:root,[data-theme="dark"]{color-scheme:dark;${block(dark)}}[data-theme="light"]{color-scheme:light;${block(light)}}`;

/** Couleur du navigateur (barre d'adresse mobile) */
export const themeColor = { dark: dark["--bg"], light: light["--bg"] };

/**
 * Script exécuté avant le premier rendu : applique le thème choisi par le visiteur (localStorage) pour
 * éviter un flash, et pose data-js : les animations d'apparition ne s'activent que si JavaScript tourne.
 */
export const themeScript = `(function(){var d=document.documentElement;d.setAttribute("data-js","");try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark"){d.setAttribute("data-theme",t);}}catch(e){}})();`;

/**
 * Script placé juste après le contenu : lance tout de suite l'apparition des cartes du premier écran,
 * sans attendre le chargement de React (sur un appareil lent, plusieurs secondes de gagnées).
 * Il ne touche pas aux cartes (React les reprend telles quelles) : il ajoute dans <head> une feuille
 * de style qui les cible par leur position, puis ScrollReveal prend le relais et la retire.
 * Les cartes plus bas restent gérées par ScrollReveal au défilement. La carte principale (data-lcp)
 * n'en a pas besoin : elle est visible dès le premier affichage (globals.css).
 */
export const earlyRevealScript = `(function(){var m=document.getElementById("main");if(!m)return;var h=window.innerHeight,css=[],cards=[];function path(e){var p=[];while(e&&e!==m){var i=1,s=e;while((s=s.previousElementSibling))i++;p.unshift(e.tagName.toLowerCase()+":nth-child("+i+")");e=e.parentElement}return"#main>"+p.join(">")}m.querySelectorAll(".card:not([data-lcp])").forEach(function(c){if(c.getBoundingClientRect().top>=h)return;var s=path(c);cards.push(c);css.push(s+"{animation:early-in 800ms cubic-bezier(.22,1,.36,1) calc(var(--i,0)*70ms) both}"+s+" .stagger>*{animation:fade-up 700ms cubic-bezier(.22,1,.36,1) calc(160ms + var(--si,0)*50ms) both}")});if(!css.length)return;var st=document.createElement("style");st.id="early-reveal";st.textContent=css.join("");document.head.appendChild(st);window.__earlyCards=cards})();`;

/** Couleurs en hexadécimal pour les images générées (favicon, Open Graph) : thème sombre */
export const brand = {
  bg: "#000000",
  surface: "#121214",
  surface2: "#1c1c1f",
  line: "#2a2a2e",
  text: "#f5f5f7",
  muted: "#a1a1a6",
  dim: "#8e8e93",
  accent: PALETTE.red,
  onAccent: "#ffffff",
  accentTint: "#3a1418",
};
