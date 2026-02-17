// src/lib/constants.ts

export const SOCIAL_LINKS = {
  tiktok: "https://www.tiktok.com/@yexofps",
  instagram: "https://www.instagram.com/yexo0",
  instagramFps: "https://www.instagram.com/yexofps",
  discord: "https://discord.gg/tjAkrNUFAR",
  discordEdits: "https://discord.gg/edits",
  linktree: "https://linktr.ee/yexo0",
  payhip: "https://payhip.com/Yexovlr",
} as const;

export const EMAILS = {
  pro: "baptiste.dauvergne38@gmail.com",
  business: "yexobusiness@gmail.com",
} as const;

export const PARTNERS = [
  {
    name: "Max Esport",
    discount: "-5%",
    code: "YEXO",
    logo: "/images/maxesport.png",
    url: "https://maxesport.gg/?aff=yexo",
  },
  {
    name: "Iqunix",
    discount: "-10%",
    code: "YEXOVLR",
    logo: "/images/iqunix.png",
    url: "https://iqunix.com/yexovlr",
  },
] as const;

export const RANKS = [
  { game: "Valorant", rank: "RADIANT", image: "/images/radiant.png" },
  { game: "Faceit (CS:GO)", rank: "LEVEL 10", image: "/images/faceit10.png" },
  { game: "Apex Legends", rank: "MASTER", image: "/images/master.png" },
  { game: "Clash Royale", rank: "ULTIMATE CHAMPION", image: "/images/ultimate.png" },
] as const;

export const SETUP = [
  { categoryKey: "mouse" as const, name: "ATK Dragonfly A9 Pro", image: "/images/dragonfly.png" },
  { categoryKey: "keyboard" as const, name: "EV63 Iqunix", image: "/images/ev63.png" },
  { categoryKey: "mousepad" as const, name: "Artisan FX Hayate Otsu V2", image: "/images/artisan.png" },
] as const;

export interface Product {
  id: string;
  price: string;
  image: string;
  previewSrc?: string;
  exampleHref?: string;
  badge?: "bestValue" | "popular";
}

export const PRODUCTS: Product[] = [
  {
    id: "colorAe",
    price: "20€",
    image: "/images/colors.png",
    previewSrc: "/images/colors.png",
  },
  {
    id: "basicEdit",
    price: "15€",
    image: "/images/basique.png",
    exampleHref: "https://www.tiktok.com/@yexofps/video/7597391105256197398",
  },
  {
    id: "advancedEdit",
    price: "25–30€",
    image: "/images/avancée.png",
    exampleHref: "https://www.tiktok.com/@yexofps/video/7600126324421840150",
  },
  {
    id: "completePack",
    price: "40€",
    image: "/images/pack.png",
    previewSrc: "/images/pack.png",
    badge: "bestValue",
  },
  {
    id: "colorVegas",
    price: "20€",
    image: "/images/colorsvegas.png",
    previewSrc: "/images/colorsvegas.png",
  },
  {
    id: "antiCompression",
    price: "20€",
    image: "/images/patch.png",
    previewSrc: "/images/patch.png",
    badge: "popular",
  },
];

export const REVIEWS = [
  { name: "Saytroz", platform: "Discord", avatar: "/images/pfp1.png", key: "saytroz" },
  { name: "Truthvlr", platform: "TikTok", avatar: "/images/pfp3.png", key: "truthvlr" },
  { name: "S6nse", platform: "Discord", avatar: "/images/pfp2.png", key: "s6nse" },
  { name: "Yakzu", platform: "Discord", avatar: "/images/pfp4.png", key: "yakzu" },
] as const;

export interface TrustStat {
  count: number;
  suffix: string;
  decimals?: number;
  labelKey: string;
  noteKey: string;
  color: "blue" | "orange" | "purple";
}

export const TRUST_STATS: TrustStat[] = [
  { count: 120, suffix: "+", labelKey: "ordersLabel", noteKey: "ordersNote", color: "blue" },
  { count: 2, suffix: "h", labelKey: "replyLabel", noteKey: "replyNote", color: "orange" },
  { count: 4.9, suffix: "/5", decimals: 1, labelKey: "ratingLabel", noteKey: "ratingNote", color: "purple" },
];

export const TRACKER_CONFIG = {
  region: "eu",
  name: "tanjiro",
  tag: "33333",
  mode: "unrated",
  size: 10,
  autoRefreshMs: 90_000,
  cooldownMs: 25_000,
} as const;
