// src/app/[locale]/layout.tsx — Layout racine par langue : <html>, thème, police, rail, cadre.
import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { routing } from "@/i18n/routing";
import { SITE } from "@/config/site";
import { DEFAULT_THEME } from "@/config/theme";
import { themeColor, themeCss, themeScript } from "@/lib/theme";
import { Rail } from "@/components/shell/rail";
import { UIProvider } from "@/components/shell/ui-provider";
import { CommandPalette } from "@/components/shell/command-palette";
import { ShortcutsDialog } from "@/components/shell/shortcuts-dialog";
import "../globals.css";

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

  return (
    <html
      lang={locale}
      data-theme={DEFAULT_THEME}
      className={`${GeistSans.variable} ${GeistMono.variable}`}
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
            <Rail />
            <div className="shell">
              <main id="main" tabIndex={-1} className="frame outline-none">
                {children}
                <footer className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 px-2 pb-1 pt-5 font-mono text-[11px] text-dim">
                  <p>{t("footer.copyright", { year: new Date().getFullYear(), name: SITE.name, author: SITE.author })}</p>
                  <p>{t("footer.hosting")}</p>
                </footer>
              </main>
            </div>
            <CommandPalette />
            <ShortcutsDialog />
          </UIProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
