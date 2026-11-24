// src/app/[locale]/gaming/settings/page.tsx — Valorant settings: summary (sens, crosshair, display), then
// the full menu, organised like the in-game one. Belongs to the Gaming space.
import type { Metadata } from "next";
import { useFormatter, useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { MY_SENS } from "@/config/site";
import { SETTINGS_CAPTURED_AT, VALO_DISPLAY, settingsCount } from "@/config/valorant-settings";
import { pageMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal } from "@/components/ui/section";
import { ArrowLink, StatTile } from "@/components/ui/primitives";
import { CrosshairTile, SensTiles } from "@/components/valorant/summary";
import { SettingsMenu } from "@/components/valorant/settings-menu";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.valoSettings" });
  return pageMetadata({
    locale,
    path: "/gaming/settings",
    title: t("title"),
    description: t("description", { sens: MY_SENS.sens, dpi: MY_SENS.dpi }),
  });
}

export default async function ValorantSettingsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Settings />;
}

function Settings() {
  const t = useTranslations("valoSettings");
  const format = useFormatter();
  const captured = format.dateTime(new Date(`${SETTINGS_CAPTURED_AT}T12:00:00Z`), { dateStyle: "long" });

  return (
    <div className="page">
      <PageHeader
        space="gaming"
        eyebrow={t("summary.meta", { count: settingsCount() })}
        title={t("summary.title")}
        lead={<p>{t("summary.lead", { date: captured })}</p>}
        actions={
          <>
            <ArrowLink href="/gaming">{t("summary.back")}</ArrowLink>
            <ArrowLink href="/projects/sensitivity-converter">{t("summary.convert")}</ArrowLink>
          </>
        }
      />
      <Reveal className="flex flex-col gap-6">
        <SensTiles />
        <div className="grid gap-x-6 sm:grid-cols-2">
          <CrosshairTile />
          <StatTile label={t("summary.display")} value={VALO_DISPLAY.resolution} unit={`${VALO_DISPLAY.ratio} · ${VALO_DISPLAY.hz} Hz`} className="[&_span:first-child]:text-[30px]" />
        </div>
      </Reveal>
      <section id="menu" aria-label={t("menu.title")} data-reveal="">
        <SettingsMenu />
      </section>
    </div>
  );
}
