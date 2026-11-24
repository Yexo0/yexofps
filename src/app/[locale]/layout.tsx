// src/app/[locale]/layout.tsx — Layout racine par langue : <html>, thème, polices, fond, rail, cadre, pied de page.
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
import { Rail } from "@/components/shell/rail";
import { UIProvider } from "@/components/shell/ui-provider";
import { CommandPalette } from "@/components/shell/command-palette";
import { ShortcutsDialog } from "@/components/shell/shortcuts-dialog";
import { SiteFooter } from "@/components/shell/site-footer";
import { ScrollReveal } from "@/components/shell/scroll-reveal";
import { PageTransition } from "@/components/shell/page-transition";
import { Backdrop } from "@/components/shell/backdrop";
import { Credits } from "@/components/shell/credits";
import "../globals.css";

// Police des titres et gros chiffres : Inter Tight (fichier local, aucune requête réseau au build)
const interTight = localFont({
  src: "../fonts/inter-tight-latin.woff2",
  variable: "--font-title",
  weight: "100 900",
  display: "swap",
  fallback: ["Inter", "system-ui", "sans-serif"],
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
  // Pages générées au build : la date de build = date du dernier déploiement
  const buildDate = new Date();
  const deployedAt = new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(buildDate);

  return (
    <html
      lang={locale}
      data-theme={DEFAULT_THEME}
      data-scroll-behavior="smooth"
      className={`${GeistSans.variable} ${GeistMono.variable} ${interTight.variable}`}
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
            <Backdrop />
            <Rail />
            <div className="shell">
              <main id="main" tabIndex={-1} className="frame flex flex-col outline-none">
                <PageTransition>{children}</PageTransition>
                <script dangerouslySetInnerHTML={{ __html: earlyRevealScript }} />
                <div className="mt-auto">
                  <SiteFooter year={buildDate.getFullYear()} deployedAt={deployedAt}>
                    <Credits />
                  </SiteFooter>
                </div>
              </main>
            </div>
            <CommandPalette />
            <ShortcutsDialog />
            <ScrollReveal />
          </UIProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
