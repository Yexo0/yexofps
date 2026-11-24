// src/i18n/routing.ts — Site languages. English is the main language, French is optional.
// The browser language is ignored on purpose: a first visit is always in English. The visitor's own
// choice (language button) is kept in a cookie for a year and read by src/proxy.ts on the next visit.
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "fr"],
  defaultLocale: "en",
  localePrefix: "always",
  // No Accept-Language guess and no automatic cookie: the proxy applies the saved choice itself
  localeDetection: false,
  localeCookie: false,
});

export type Locale = (typeof routing.locales)[number];

/** Cookie that remembers the language picked with the language button (1 year) */
export const LOCALE_COOKIE = "NEXT_LOCALE";
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
