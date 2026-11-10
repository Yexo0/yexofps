// next.config.ts — Config Next.js : plugin next-intl et redirections 301 des anciennes URLs.
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

const nextConfig: NextConfig = {
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
