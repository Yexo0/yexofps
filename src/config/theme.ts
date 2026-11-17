// src/config/theme.ts — Couleurs du site.
// Chaque espace a sa couleur d'accent (une seule valeur hexadécimale) : src/lib/theme.ts en tire
// une palette complète (accent, conteneurs, lueurs, mode clair) avec l'algorithme Material You.
// Le fond reste sombre et neutre, légèrement bleu nuit ; il prend la teinte de l'espace en fondu.
import type { SpaceId } from "./spaces";

/** Accent de chaque espace. Changer une valeur re-colore tout l'espace (rail, boutons, fond, 3D). */
export const SPACE_SEEDS: Record<SpaceId, string> = {
  home: "#FF4655", // rouge Valorant
  career: "#4F8CFF", // bleu
  lab: "#2FD08A", // vert
  gaming: "#FF4655", // rouge Valorant
  creator: "#A06CFF", // violet (logiciels de montage)
  tools: "#22C3E6", // cyan
  contact: "#F2B84B", // or
};

/** Seconde teinte de chaque espace (dégradés, fumée du fond, reflets). */
export const SPACE_SEEDS_2: Record<SpaceId, string> = {
  home: "#F2C14E", // or (Vandal Champions)
  career: "#7C6CF2",
  lab: "#22C3E6",
  gaming: "#F2C14E",
  creator: "#FF4FA3",
  tools: "#4F8CFF",
  contact: "#FF7A45",
};

/** Teinte des neutres (fond, cartes, textes) : bleu nuit très désaturé. */
export const NEUTRAL_SEED = "#0F1923";
/** Chroma des neutres. 0 = gris pur ; on reste bas pour un fond sombre lisible. */
export const NEUTRAL_CHROMA = 5;

export const DEFAULT_THEME = "dark" as const;
export type ThemeMode = "dark" | "light";
