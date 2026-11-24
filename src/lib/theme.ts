// src/lib/theme.ts — Variables CSS des deux thèmes, à partir de src/config/theme.ts.
// Neutres noirs et gris (thème sombre) ou gris très clairs (thème clair), un seul accent rouge.
// Surfaces en verre : --surface (cartes) et les calques gris (--surface-2/3, --inset) sont translucides
// pour laisser voir le fond animé ; --surface-solid reste opaque (fenêtres, barres collantes).
// Côté serveur uniquement : le CSS produit est injecté dans <head> par le layout, avant le premier rendu.
import { PALETTE } from "@/config/theme";

type Tokens = Record<string, string>;

const dark: Tokens = {
  "--bg": "#000000",
  "--surface": "rgba(28, 28, 32, 0.62)",
  "--surface-solid": "#121214",
  "--surface-2": "rgba(255, 255, 255, 0.055)",
  "--surface-3": "rgba(255, 255, 255, 0.09)",
  "--surface-hover": "rgba(255, 255, 255, 0.13)",
  "--inset": "rgba(0, 0, 0, 0.32)",
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
  /* Verre : reflet en haut de la carte, liseré, panneaux flottants (rail, barre mobile) */
  "--glass-sheen": "rgba(255, 255, 255, 0.035)",
  "--glass-edge": "rgba(255, 255, 255, 0.07)",
  "--glass-top": "rgba(255, 255, 255, 0.08)",
  "--glass-float": "rgba(24, 24, 28, 0.72)",
  /* Fond animé : dégradé de départ (avant le canvas, voir Backdrop) */
  "--aurora-1": "rgba(255, 70, 85, 0.2)",
  "--aurora-2": "rgba(122, 16, 32, 0.38)",
  "--aurora-3": "rgba(179, 18, 42, 0.14)",
};

const light: Tokens = {
  "--bg": "#f5f5f7",
  "--surface": "rgba(255, 255, 255, 0.66)",
  "--surface-solid": "#ffffff",
  "--surface-2": "rgba(0, 0, 0, 0.04)",
  "--surface-3": "rgba(0, 0, 0, 0.07)",
  "--surface-hover": "rgba(0, 0, 0, 0.1)",
  "--inset": "rgba(0, 0, 0, 0.035)",
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
  "--glass-sheen": "rgba(255, 255, 255, 0.5)",
  "--glass-edge": "rgba(0, 0, 0, 0.05)",
  "--glass-top": "rgba(255, 255, 255, 0.9)",
  "--glass-float": "rgba(255, 255, 255, 0.72)",
  "--aurora-1": "rgba(255, 120, 130, 0.2)",
  "--aurora-2": "rgba(255, 196, 200, 0.5)",
  "--aurora-3": "rgba(255, 220, 223, 0.45)",
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
 * Les cartes visibles sont trouvées par un IntersectionObserver : aucune lecture de géométrie pendant
 * l'analyse de la page (pas de recalcul de mise en page forcé). Si ScrollReveal a déjà démarré
 * (data-reveal), il ne fait rien. La carte principale (data-lcp) est visible dès le premier affichage.
 */
export const earlyRevealScript = `(function(){var m=document.getElementById("main"),d=document.documentElement;if(!m||!window.IntersectionObserver)return;var all=m.querySelectorAll(".card:not([data-lcp])");if(!all.length)return;function path(e){var p=[];while(e&&e!==m){var i=1,s=e;while((s=s.previousElementSibling))i++;p.unshift(e.tagName.toLowerCase()+":nth-child("+i+")");e=e.parentElement}return"#main>"+p.join(">")}var io=new IntersectionObserver(function(es){io.disconnect();if(d.hasAttribute("data-reveal"))return;var css=[],cards=[];es.forEach(function(en){if(!en.isIntersecting)return;var s=path(en.target);cards.push(en.target);css.push(s+"{animation:early-in 800ms cubic-bezier(.22,1,.36,1) calc(var(--i,0)*70ms) both}"+s+" .stagger>*{animation:fade-up 700ms cubic-bezier(.22,1,.36,1) calc(160ms + var(--si,0)*50ms) both}")});if(!css.length)return;var st=document.createElement("style");st.id="early-reveal";st.textContent=css.join("");document.head.appendChild(st);window.__earlyCards=cards});for(var i=0;i<all.length;i++)io.observe(all[i])})();`;

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
