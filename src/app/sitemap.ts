// src/app/sitemap.ts — Sitemap: the 7 spaces, their sub-pages and every project, in both languages, with hreflang alternates.
import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { SPACES } from "@/config/spaces";
import { SITE } from "@/config/site";
import { PROJECTS } from "@/config/projects";
import { localizedPath } from "@/lib/metadata";

/** Pages attached to a space, on top of the 7 spaces */
const SUB_PAGES = [
  { href: "/baptiste", changeFrequency: "monthly" as const, priority: 0.9 },
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
    ...PROJECTS.map((p) => ({ href: `/projects/${p.slug}`, changeFrequency: "monthly" as const, priority: 0.6 })),
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
