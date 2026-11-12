// src/config/site.ts — Toutes les données du site : URLs, comptes, rangs, setup, produits, avis.
// Les textes affichés (titres, descriptions) sont dans messages/fr.json et messages/en.json,
// rangés sous la même clé (id) que les entrées ci-dessous.

export const SITE = {
  url: "https://yexofps.org",
  name: "Yexo",
  author: "Baptiste Dauvergne",
  since: 2021,
} as const;

/** Infos perso affichées (accueil, bio créateur). L'âge est à mettre à jour à chaque anniversaire. */
export const PROFILE = {
  age: 21,
} as const;

/* ─── Réseaux ───────────────────────────────────────────── */

export const SOCIALS = {
  tiktok: { url: "https://www.tiktok.com/@yexofps", handle: "@yexofps" },
  instagram: { url: "https://www.instagram.com/baptistedvrg", handle: "@baptistedvrg" },
  instagramFps: { url: "https://www.instagram.com/yexofps", handle: "@yexofps" },
  discord: { url: "https://discord.gg/tjAkrNUFAR", handle: "discord.gg/tjAkrNUFAR" },
  discordEdits: { url: "https://discord.gg/edits", handle: "discord.gg/edits" },
  linktree: { url: "https://linktr.ee/yexo0", handle: "linktr.ee/yexo0" },
  payhip: { url: "https://payhip.com/Yexovlr", handle: "payhip.com/Yexovlr" },
} as const;

export type SocialId = keyof typeof SOCIALS;

/**
 * Identifiant Discord (numérique) pour le statut en direct sur /now, via Lanyard (api.lanyard.rest).
 * Il faut avoir rejoint le serveur Discord de Lanyard. Laisser undefined : seul le planning est utilisé.
 */
export const DISCORD_USER_ID: string | undefined = "742336259409576057";

/**
 * Hébergement (page /lab/site) : ce qui ne se détecte pas tout seul depuis le serveur.
 * Laisser undefined masque l'info (le reste est lu en direct : système, ressources, proxy, HTTPS…).
 */
export const HOSTING: { provider?: string; reverseProxy?: string } = {
  provider: undefined,
  reverseProxy: undefined,
};

/** Spotify, affiché sur /now pendant le créneau musique. Laisser undefined masque le bouton. */
export const SPOTIFY_URL: string | undefined = "https://open.spotify.com/user/31wjlquoxlm6dmvakh6lfyk5kqfa";

export const EMAILS = {
  pro: "baptiste.dauvergne38@gmail.com",
  business: "yexobusiness@gmail.com",
} as const;

/* ─── Vidéos TikTok (exemples de montage) ───────────────── */

export const TIKTOK_VIDEOS = {
  basicEdit: "https://www.tiktok.com/@yexofps/video/7597391105256197398",
  advancedEdit: "https://www.tiktok.com/@yexofps/video/7600126324421840150",
} as const;

/**
 * Montage mis en avant sur l'accueil (lecteur avec réglage du son).
 * - `video` : fichier hébergé sur le site (ex : "/videos/edit.mp4" dans public/). Si présent, lecteur maison.
 * - sinon : lecteur TikTok intégré, chargé seulement au clic (pas de cookies TikTok avant).
 */
export const FEATURED_EDIT: { tiktokId: string; url: string; poster: string; video?: string } = {
  tiktokId: "7600126324421840150",
  url: "https://www.tiktok.com/@yexofps/video/7600126324421840150",
  poster: "/images/products/advanced-edit.webp",
  video: undefined,
};

/** Edits mis en avant dans l'espace Créateur. Ajoute une entrée + son titre dans messages (creator.edits.items). */
export const EDITS = [
  { id: "basicEdit", url: TIKTOK_VIDEOS.basicEdit, thumbnail: "/images/products/basic-edit.webp" },
  { id: "advancedEdit", url: TIKTOK_VIDEOS.advancedEdit, thumbnail: "/images/products/advanced-edit.webp" },
] as const;

/* ─── Partenaires (liens affiliés) ──────────────────────── */

export const PARTNERS = [
  {
    id: "maxEsport",
    name: "Max Esport",
    code: "YEXO",
    discount: 5,
    logo: "/images/partners/max-esport.png",
    url: "https://maxesport.gg/?aff=yexo",
  },
  {
    id: "iqunix",
    name: "Iqunix",
    code: "YEXOVLR",
    discount: 10,
    logo: "/images/partners/iqunix.webp",
    url: "https://iqunix.com/yexovlr",
  },
] as const;

/* ─── Tracker Valorant ──────────────────────────────────── */

/** Paramètres envoyés à /api/valorant (la route n'est pas modifiée). */
export const TRACKER = {
  region: "eu",
  name: "Fallen angel",
  tag: "yexo",
  mode: "unrated",
  size: 10,
  autoRefreshMs: 90_000,
  cooldownMs: 25_000,
} as const;

/** Peak affiché en permanence, même si l'API ne répond pas. */
export const VALORANT_PEAK = {
  rank: "Radiant",
  rr: 661,
  episode: 8,
  act: 2,
  image: "/images/ranks/valorant-radiant.png",
} as const;

/* ─── Rangs ─────────────────────────────────────────────── */
// `color` : liseré fin sur la tuile du jeu (seule exception à l'accent unique).

export const RANKS = [
  {
    id: "valorant",
    game: "Valorant",
    image: "/images/ranks/valorant-radiant.png",
    color: "#FF4655",
    featured: true,
  },
  {
    id: "faceit",
    game: "Faceit",
    image: "/images/ranks/faceit-level-10.png",
    color: "#FF5500",
    featured: false,
  },
  {
    id: "apex",
    game: "Apex Legends",
    image: "/images/ranks/apex-master.webp",
    color: "#C9473B",
    featured: false,
  },
  {
    id: "clashRoyale",
    game: "Clash Royale",
    image: "/images/ranks/clash-royale-ultimate-champion.webp",
    color: "#3E8EF0",
    featured: false,
  },
] as const;

export type RankId = (typeof RANKS)[number]["id"];

/* ─── Setup ─────────────────────────────────────────────── */

export const SETUP = [
  { id: "mouse", name: "ATK Dragonfly A9 Pro", image: "/images/setup/atk-dragonfly-a9-pro.webp" },
  { id: "keyboard", name: "Iqunix EV63", image: "/images/setup/iqunix-ev63.webp", partner: "iqunix" },
  { id: "mousepad", name: "Artisan FX Hayate Otsu V2", image: "/images/setup/artisan-hayate-otsu-v2.webp" },
] as const;

/* ─── Y-Services ────────────────────────────────────────── */

export interface Product {
  id: "colorAe" | "basicEdit" | "advancedEdit" | "completePack" | "colorVegas" | "antiCompression";
  /** Prix en euros. Un tableau [min, max] affiche une fourchette. */
  price: number | readonly [number, number];
  image: string;
  /** Logiciel concerné, affiché en tag. */
  software?: string;
  /** Lien vers un exemple (vidéo). Le bouton n'apparaît que si l'URL existe. */
  exampleUrl?: string;
  /** Lien vers un aperçu (image, vidéo, page). Le bouton n'apparaît que si l'URL existe. */
  previewUrl?: string;
}

export const PRODUCTS: readonly Product[] = [
  { id: "colorAe", price: 20, image: "/images/products/color-ae.webp", software: "After Effects" },
  {
    id: "basicEdit",
    price: 15,
    image: "/images/products/basic-edit.webp",
    exampleUrl: TIKTOK_VIDEOS.basicEdit,
  },
  {
    id: "advancedEdit",
    price: [25, 30],
    image: "/images/products/advanced-edit.webp",
    exampleUrl: TIKTOK_VIDEOS.advancedEdit,
  },
  { id: "completePack", price: 40, image: "/images/products/complete-pack.webp" },
  { id: "colorVegas", price: 20, image: "/images/products/color-vegas.webp", software: "Vegas Pro" },
  { id: "antiCompression", price: 20, image: "/images/products/anti-compression.webp", software: "TikTok" },
];

/** Commande : ticket Discord (le plus rapide), email business ou achat direct Payhip. */
export const ORDER_URL = SOCIALS.discord.url;

/* ─── Avis clients (texte mot pour mot dans messages : creator.reviews.items) ── */

export const REVIEWS = [
  { id: "saytroz", name: "Saytroz", platform: "Discord", avatar: "/images/reviews/saytroz.webp" },
  { id: "truthvlr", name: "Truthvlr", platform: "TikTok", avatar: "/images/reviews/truthvlr.webp" },
  { id: "s6nse", name: "S6nse", platform: "Discord", avatar: "/images/reviews/s6nse.webp" },
  { id: "yakzu", name: "Yakzu", platform: "Discord", avatar: "/images/reviews/yakzu.webp" },
] as const;

/* ─── Sensibilité perso (bouton "ma config" du convertisseur) ── */

export const MY_SENS = { game: "valo", sens: "0.19", dpi: "1600" } as const;
