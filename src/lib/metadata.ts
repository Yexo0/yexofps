// src/lib/metadata.ts — Metadata par page : title, description, canonical, hreflang, Open Graph.
import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import { SITE } from "@/config/site";

export function localizedPath(locale: string, path: string) {
  return `/${locale}${path === "/" ? "" : path}`;
}

export function pageMetadata({
  locale,
  path,
  title,
  description,
  absoluteTitle = false,
}: {
  locale: string;
  path: string;
  title: string;
  description: string;
  /** true pour l'accueil : le titre n'est pas suffixé par " · Yexo" */
  absoluteTitle?: boolean;
}): Metadata {
  const languages = Object.fromEntries(routing.locales.map((l) => [l, localizedPath(l, path)]));
  const url = localizedPath(locale, path);
  const ogTitle = absoluteTitle ? title : `${title} · ${SITE.name}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: url,
      languages: { ...languages, "x-default": localizedPath(routing.defaultLocale, path) },
    },
    openGraph: {
      type: "website",
      siteName: SITE.name,
      url,
      title: ogTitle,
      description,
      locale: locale === "fr" ? "fr_FR" : "en_US",
      alternateLocale: routing.locales.filter((l) => l !== locale).map((l) => (l === "fr" ? "fr_FR" : "en_US")),
    },
    twitter: { card: "summary_large_image", title: ogTitle, description },
  };
}
