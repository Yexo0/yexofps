// next.config.ts — Config Next.js : plugin next-intl, infos de build, transitions de page,
// images distantes autorisées, en-têtes de sécurité (CSP en Report-Only), cache des fichiers
// statiques et redirections 301 des anciennes URLs.
import { execSync } from "node:child_process";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** Anciennes URLs (avant la refonte) → nouveaux espaces */
const LEGACY: [from: string, to: string][] = [
  ["profil", "creator"],
  ["shop", "creator#services"],
  ["ranks", "gaming"],
  ["tracker", "gaming#tracker"],
  ["convert", "tools"],
  ["liens", "contact"],
  ["pro", "baptiste"],
];

/** Commit déployé (affiché sur /lab/site) : vide si le build n'est pas fait depuis un dépôt git */
function gitCommit(): string {
  try {
    return execSync("git rev-parse --short HEAD", { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
  } catch {
    return "";
  }
}

/**
 * Content Security Policy, envoyée d'abord en Report-Only (rien n'est bloqué, les écarts sont signalés
 * dans la console) : à passer en "Content-Security-Policy" une fois vérifiée en production.
 * - script-src : scripts inline de Next (thème, apparition, données RSC) → 'unsafe-inline' (pages
 *   statiques : pas de nonce possible) ; WebAssembly du décodeur meshopt (modèles 3D) ; balise Cloudflare.
 * - blob: : textures des modèles glTF (URL blob créées par le loader) ; data: : petites images en ligne.
 * - frame-src : lecteur TikTok (repli de la vidéo à la une, chargé au clic).
 * frame-ancestors est ignoré en Report-Only : il est envoyé à part, appliqué (voir headers()).
 */
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' https://static.cloudflareinsights.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "media-src 'self'",
  "connect-src 'self' blob: https://cloudflareinsights.com",
  "worker-src 'self' blob:",
  "frame-src https://www.tiktok.com",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

/** En-têtes de sécurité, sur toutes les réponses. HSTS est géré par Cloudflare (pas ici). */
const SECURITY_HEADERS = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
  { key: "Content-Security-Policy-Report-Only", value: CSP },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
];

const nextConfig: NextConfig = {
  // Infos de build, figées au moment du "npm run build" (= date du déploiement)
  env: {
    BUILD_TIME: new Date().toISOString(),
    BUILD_COMMIT: gitCommit(),
  },
  experimental: {
    // Transitions entre pages (<ViewTransition> de React, voir components/shell/page-transition)
    viewTransition: true,
  },
  images: {
    // Statut Discord en direct (/now) : pochettes Spotify, avatar et décoration Discord.
    // Les images passent par le serveur du site : les visiteurs ne contactent ni Spotify ni Discord.
    remotePatterns: [
      { protocol: "https", hostname: "i.scdn.co", pathname: "/image/**" },
      { protocol: "https", hostname: "cdn.discordapp.com", pathname: "/avatars/**" },
      { protocol: "https", hostname: "cdn.discordapp.com", pathname: "/avatar-decoration-presets/**" },
    ],
  },
  // Sécurité : toutes les réponses. Fichiers de public/ (Next met max-age=0 par défaut) :
  // - vidéos et modèles 3D : versionnés par leur nom, mis en cache un an sans revalidation (immutable).
  //   Pour en remplacer un, TOUJOURS changer son nom de fichier (featured-edit-v3.mp4…), sinon les
  //   visiteurs gardent l'ancien ;
  // - images et textures : 7 jours.
  async headers() {
    const year = "public, max-age=31536000, immutable";
    const week = "public, max-age=604800, stale-while-revalidate=86400";
    return [
      { source: "/:path*", headers: SECURITY_HEADERS },
      ...["/videos/:path*", "/models/:path*"].map((source) => ({ source, headers: [{ key: "Cache-Control", value: year }] })),
      ...["/images/:path*", "/textures/:path*"].map((source) => ({ source, headers: [{ key: "Cache-Control", value: week }] })),
    ];
  },
  async redirects() {
    return LEGACY.flatMap(([from, to]) => [
      // Avec préfixe de langue : /fr/profil, /en/shop…
      { source: `/:locale(fr|en)/${from}`, destination: `/:locale/${to}`, statusCode: 301 as const },
      // Sans préfixe : /profil → /creator, puis le proxy ajoute la langue du visiteur
      { source: `/${from}`, destination: `/${to}`, statusCode: 301 as const },
    ]);
  },
};

export default withNextIntl(nextConfig);
