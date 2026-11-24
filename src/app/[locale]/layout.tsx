// src/app/[locale]/layout.tsx — Root layout per language: <html>, theme, fonts, header, page, footer.
import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import localFont from "next/font/local";
import { routing } from "@/i18n/routing";
import { SITE } from "@/config/site";
import { DEFAULT_THEME } from "@/config/theme";
import { earlyRevealScript, themeColor, themeCss, themeScript } from "@/lib/theme";
import { UIProvider } from "@/components/shell/ui-provider";
import { SiteHeader } from "@/components/shell/site-header";
import { SiteFooter } from "@/components/shell/site-footer";
import { CommandPalette } from "@/components/shell/command-palette";
import { ShortcutsDialog } from "@/components/shell/shortcuts-dialog";
import { ScrollReveal } from "@/components/shell/scroll-reveal";
import { PageTransition } from "@/components/shell/page-transition";
import { AimCursor } from "@/components/shell/aim-cursor";
import { Credits } from "@/components/shell/credits";
import "../globals.css";

// Display face for titles and big figures (local file, no network request at build)
const anton = localFont({
  src: "../fonts/anton-latin.woff2",
  variable: "--font-anton",
  display: "swap",
  fallback: ["Impact", "Arial Narrow", "sans-serif"],
});

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL(SITE.url),
    title: { default: t("home.title"), template: `%s · ${SITE.name}` },
    description: t("home.description"),
    applicationName: SITE.name,
    authors: [{ name: SITE.author }],
    openGraph: {
      type: "website",
      siteName: SITE.name,
      locale: locale === "fr" ? "fr_FR" : "en_US",
    },
    twitter: { card: "summary_large_image" },
  };
}

export const viewport: Viewport = {
  themeColor: themeColor.dark,
  colorScheme: "dark light",
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("common");
  // Pages are generated at build time: the build date is the last deploy date
  const buildDate = new Date();
  const deployedAt = new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(buildDate);

  return (
    <html
      lang={locale}
      data-theme={DEFAULT_THEME}
      data-scroll-behavior="smooth"
      className={`${GeistSans.variable} ${GeistMono.variable} ${anton.variable}`}
      suppressHydrationWarning
    >
      <head>
        <style id="theme-tokens" dangerouslySetInnerHTML={{ __html: themeCss }} />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <NextIntlClientProvider>
          <UIProvider>
            <a href="#main" className="skip-link">
              {t("skipToContent")}
            </a>
            <SiteHeader />
            <div className="site-main">
              <main id="main" tabIndex={-1} className="container-x flex-1 outline-none">
                <PageTransition>{children}</PageTransition>
                <script dangerouslySetInnerHTML={{ __html: earlyRevealScript }} />
              </main>
              <SiteFooter year={buildDate.getFullYear()} deployedAt={deployedAt} credits={<Credits />} />
            </div>
            <CommandPalette />
            <ShortcutsDialog />
            <ScrollReveal />
            <AimCursor />
          </UIProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
