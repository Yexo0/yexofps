// src/config/theme.ts — Couleurs du site.
// Chaque espace a sa couleur d'accent (une seule valeur hexadécimale) : src/lib/theme.ts en tire
// une palette complète (accent, conteneurs, lueurs, mode clair) avec l'algorithme Material You.
// Le fond reste sombre et neutre, légèrement bleu nuit ; il prend la teinte de l'espace en fondu.
// En plus des 7 espaces, des "univers" peuvent recolorer une page sans changer d'espace dans le rail :
// "pro" = page Baptiste (côté infra et After Effects), rattachée à l'accueil mais hors univers Valorant.
import { spaceFromPath, type SpaceId } from "./spaces";

/** Clé de thème : un espace, ou un univers à part */
export type ThemeKey = SpaceId | "pro";

/** Pages qui changent d'univers sans changer d'espace (chemin sans préfixe de langue → clé de thème) */
export const THEME_OVERRIDES: Record<string, ThemeKey> = {
  "/baptiste": "pro",
};

/** Clé de thème d'une page (chemin sans préfixe de langue) */
export function themeKeyFromPath(pathname: string): ThemeKey {
  const path = pathname.replace(/\/$/, "") || "/";
  return THEME_OVERRIDES[path] ?? spaceFromPath(path).id;
}

/** Accent de chaque espace. Changer une valeur re-colore tout l'espace (rail, boutons, fond, 3D). */
export const SPACE_SEEDS: Record<ThemeKey, string> = {
  home: "#FF4655", // rouge Valorant
  career: "#4F8CFF", // bleu
  lab: "#2FD08A", // vert
  gaming: "#FF4655", // rouge Valorant
  creator: "#A06CFF", // violet (logiciels de montage)
  projects: "#22C3E6", // cyan
  contact: "#F2B84B", // or
  pro: "#8C8CFF", // pervenche (After Effects), loin du rouge Valorant
};

/** Seconde teinte de chaque espace (dégradés, fumée du fond, reflets). */
export const SPACE_SEEDS_2: Record<ThemeKey, string> = {
  home: "#F2C14E", // or (Vandal Champions)
  career: "#7C6CF2",
  lab: "#22C3E6",
  gaming: "#F2C14E",
  creator: "#FF4FA3",
  projects: "#4F8CFF",
  contact: "#FF7A45",
  pro: "#2EC8FF", // cyan
};

/** Teinte des neutres (fond, cartes, textes) : bleu nuit très désaturé. */
export const NEUTRAL_SEED = "#0F1923";
/** Chroma des neutres. 0 = gris pur ; on reste bas pour un fond sombre lisible. */
export const NEUTRAL_CHROMA = 5;

export const DEFAULT_THEME = "dark" as const;
export type ThemeMode = "dark" | "light";
