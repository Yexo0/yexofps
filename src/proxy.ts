// src/proxy.ts — Language routing. Every page lives under /en/... or /fr/....
// A URL without a language goes to the language the visitor picked last (cookie set by the language
// button), or to English when there is no saved choice. A URL that already has a language is served
// as is. Excludes the API, files and assets, and the generated icons (/icon, /apple-icon).
import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { hasLocale } from "next-intl";
import { LOCALE_COOKIE, routing } from "./i18n/routing";

const intl = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const prefixed = routing.locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (!prefixed) {
    const saved = request.cookies.get(LOCALE_COOKIE)?.value;
    const locale = hasLocale(routing.locales, saved) ? saved : routing.defaultLocale;
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
    url.search = search;
    return NextResponse.redirect(url);
  }
  return intl(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|icon|apple-icon|.*\\..*).*)"],
};
