// src/lib/logo.ts — Géométrie du logo, partagée par le site (Logo), le favicon, l'icône iOS et l'image
// Open Graph. Le Y est un ruban facetté : la silhouette exacte du Y d'Inter Tight (graisse 800),
// découpée en deux branches qui se croisent et une tige, chaque bande en deux facettes de rouge
// (la branche droite, la plus claire, passe devant). « exo » est le texte Inter Tight 800 vectorisé
// (crénage de la police, interlettrage -60) : le logo ne dépend d'aucune police chargée.
// Unités de la police (2048 par em) : hauteur des capitales 1490, ligne de base à y = 1490.

/** Facettes du Y, dans l'ordre de dessin (chaque bande : sa teinte sombre, puis la facette claire par-dessus) */
export const LOGO_FACETS: readonly { points: string; fill: string }[] = [
  { points: "555,980 912,980 912,1490 555,1490", fill: "#a61e2b" },
  { points: "733.5,980 912,980 912,1490 733.5,1490", fill: "#e02f3d" },
  { points: "9,0 412,0 912,993 555,993", fill: "#7a1520" },
  { points: "9,0 412,0 912,993", fill: "#b3202f" },
  { points: "1056,0 1457,0 912,993 555,993", fill: "#d12d3b" },
  { points: "1056,0 1457,0 555,993", fill: "#ff4655" },
];

/** Cadre du Y seul (symbole) */
export const LOGO_MARK_VIEWBOX = "9 0 1448 1490";

/** « exo » vectorisé, placé après le Y (même ligne de base) */
export const LOGO_EXO_PATH =
  "M1758 1511Q1582 1511 1455 1442Q1328 1372 1260 1243Q1193 1114 1193 935Q1193 762 1261 633Q1329 503 1453 430Q1577 358 1745 358Q1864 358 1964 395Q2063 433 2135 505Q2208 578 2247 684Q2287 790 2287 929V1017H1316V812H2118L1952 860Q1952 783 1929 728Q1906 674 1861 644Q1816 614 1749 614Q1682 614 1636 644Q1590 674 1566 727Q1542 781 1542 854V1001Q1542 1079 1570 1136Q1597 1193 1648 1224Q1698 1254 1764 1254Q1810 1254 1848 1241Q1886 1228 1913 1203Q1940 1177 1954 1141L2280 1150Q2260 1260 2192 1341Q2124 1422 2014 1467Q1904 1511 1758 1511ZM2613 372 2796 742 2987 372H3346L3034 932L3358 1490H3001L2796 1120L2597 1490H2236L2561 932L2252 372ZM3873 1511Q3697 1511 3571 1438Q3445 1366 3377 1236Q3310 1107 3310 935Q3310 762 3377 632Q3445 503 3571 430Q3697 358 3873 358Q4049 358 4176 430Q4302 503 4370 632Q4437 762 4437 935Q4437 1107 4370 1236Q4302 1366 4176 1438Q4049 1511 3873 1511ZM3875 1240Q3940 1240 3984 1202Q4028 1164 4052 1094Q4075 1025 4075 933Q4075 840 4052 772Q4028 704 3984 666Q3940 629 3875 629Q3810 629 3764 666Q3718 704 3695 772Q3672 840 3672 933Q3672 1025 3695 1094Q3718 1164 3764 1202Q3810 1240 3875 1240Z";

/** Cadre du logotype complet « Yexo » (les rondeurs de e et o dépassent la ligne de base de 21) */
export const LOGO_WORDMARK_VIEWBOX = "9 0 4429 1512";
