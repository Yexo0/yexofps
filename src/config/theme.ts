// src/config/theme.ts — Couleur de base du site.
// Toute la palette (accent pastel, surfaces, textes, mode clair) est générée
// à partir de cette seule couleur par src/lib/theme.ts (algorithme Material You).
// Pour changer l'accent du site, change uniquement cette valeur.

export const ACCENT_SEED = "#7C6CF2"; // Iris

// Chroma des neutres (fond, cartes, textes). 0 = gris pur, 4 = teinte Material par défaut.
// On reste très bas pour garder un fond sombre neutre quelle que soit la couleur d'accent.
export const NEUTRAL_CHROMA = 2;

export const DEFAULT_THEME = "dark" as const;
export type ThemeMode = "dark" | "light";
