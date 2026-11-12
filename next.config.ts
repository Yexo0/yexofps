// next.config.ts — Config Next.js : plugin next-intl, infos de build, transitions de page,
// images distantes autorisées et redirections 301 des anciennes URLs.
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
  ["pro", "career"],
];

/** Commit déployé (affiché sur /lab/site) : vide si le build n'est pas fait depuis un dépôt git */
function gitCommit(): string {
  try {
    return execSync("git rev-parse --short HEAD", { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
  } catch {
    return "";
  }
}

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
