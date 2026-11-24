// src/config/theme.ts — Couleurs du site. Un seul accent, le rouge YEXO, sur des neutres noirs et gris
// façon « premium doux ». src/lib/theme.ts en tire les variables CSS des deux thèmes (sombre et clair).

export const PALETTE = {
  /** Rouge YEXO : points, barres, petits accents (texte rouge sur fond sombre) */
  red: "#FF4655",
  /** Rouge des boutons pleins : un peu plus profond, pour du texte blanc lisible (AA) */
  redStrong: "#E02F3D",
} as const;

export const DEFAULT_THEME = "dark" as const;
export type ThemeMode = "dark" | "light";
