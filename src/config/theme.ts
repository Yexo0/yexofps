// src/config/theme.ts — Brand palette. Three colors, one accent, the same on every page:
// - ink: deep navy, the base of every neutral (background, surfaces, lines);
// - bone: warm off-white, for text in dark mode and the page in light mode;
// - signal: YEXO red, the only accent (primary action, current location, live state, key figures).
// src/lib/theme.ts turns these into the full set of CSS tokens for both themes.

export const PALETTE = {
  ink: "#0F1923",
  bone: "#ECE8E1",
  signal: "#FF4655",
} as const;

/** Chroma kept for the neutrals: low, so the background reads as near-black with a navy hint */
export const NEUTRAL_CHROMA = 6;

export const DEFAULT_THEME = "dark" as const;
export type ThemeMode = "dark" | "light";
