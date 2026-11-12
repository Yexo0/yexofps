// src/app/sitemap.ts — Sitemap : les 7 espaces et leurs sous-pages dans les deux langues, avec alternates hreflang.
import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { SPACES } from "@/config/spaces";
import { SITE } from "@/config/site";
import { localizedPath } from "@/lib/metadata";

/** Pages rattachées à un espace, en plus des 7 espaces */
const SUB_PAGES = [
  { href: "/gaming/settings", changeFrequency: "monthly" as const, priority: 0.6 },
  { href: "/now", changeFrequency: "weekly" as const, priority: 0.5 },
  { href: "/lab/site", changeFrequency: "monthly" as const, priority: 0.5 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const pages = [
    ...SPACES.map((space) => ({
      href: space.href as string,
      changeFrequency: space.id === "gaming" ? ("daily" as const) : ("monthly" as const),
      priority: space.id === "home" ? 1 : 0.7,
    })),
    ...SUB_PAGES,
  ];
  return pages.flatMap((page) =>
    routing.locales.map((locale) => ({
      url: `${SITE.url}${localizedPath(locale, page.href)}`,
      lastModified,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      alternates: {
        languages: Object.fromEntries(routing.locales.map((l) => [l, `${SITE.url}${localizedPath(l, page.href)}`])),
      },
    })),
  );
}
