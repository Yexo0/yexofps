// src/app/sitemap.ts — Sitemap : les 7 espaces dans les deux langues, avec alternates hreflang.
import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { SPACES } from "@/config/spaces";
import { SITE } from "@/config/site";
import { localizedPath } from "@/lib/metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return SPACES.flatMap((space) =>
    routing.locales.map((locale) => ({
      url: `${SITE.url}${localizedPath(locale, space.href)}`,
      lastModified,
      changeFrequency: space.id === "gaming" ? ("daily" as const) : ("monthly" as const),
      priority: space.id === "home" ? 1 : 0.7,
      alternates: {
        languages: Object.fromEntries(routing.locales.map((l) => [l, `${SITE.url}${localizedPath(l, space.href)}`])),
      },
    })),
  );
}
