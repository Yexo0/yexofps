// src/app/[locale]/gaming/settings/page.tsx — Settings Valorant : résumé (sensi, réticule) puis
// le menu complet, organisé comme celui du jeu. Rattachée à l'espace 04 Gaming.
import type { Metadata } from "next";
import { useFormatter, useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft, Settings2, SlidersHorizontal } from "lucide-react";
import { MY_SENS } from "@/config/site";
import { SETTINGS_CAPTURED_AT, VALO_DISPLAY, settingsCount } from "@/config/valorant-settings";
import { pageMetadata } from "@/lib/metadata";
import { Card } from "@/components/ui/card";
import { ButtonLink, StatTile } from "@/components/ui/primitives";
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
  return (
    <div className="bento">
      <Summary />
      <Menu />
    </div>
  );
}

function Summary() {
  const t = useTranslations("valoSettings.summary");
  const format = useFormatter();
  const captured = format.dateTime(new Date(`${SETTINGS_CAPTURED_AT}T12:00:00Z`), { dateStyle: "long" });

  return (
    <Card
      id="summary"
      icon={Settings2}
      title={t("title")}
      subtitle="cat ~/valorant/settings.ini"
      meta={t("meta", { count: settingsCount() })}
      headingLevel={1}
      index={0}
      className="md:col-span-6 lg:col-span-12"
    >
      <div className="grid gap-5 lg:grid-cols-12 lg:gap-6">
        <div className="flex flex-col items-start gap-3 lg:col-span-5">
          <ButtonLink href="/gaming" variant="ghost" size="sm" className="-ml-2">
            <ArrowLeft size={14} aria-hidden="true" />
            {t("back")}
          </ButtonLink>
          <p className="max-w-[34ch] text-[22px] font-bold leading-tight tracking-tight">{t("tagline")}</p>
          <p className="max-w-[60ch] text-sm leading-relaxed text-muted">{t("intro")}</p>
          <p className="font-mono text-[11.5px] text-dim">{t("captured", { date: captured })}</p>
          <ButtonLink href="/tools#converter" variant="tonal" size="sm" className="mt-1">
            <SlidersHorizontal size={14} aria-hidden="true" />
            {t("convert")}
          </ButtonLink>
        </div>
        <div className="flex min-w-0 flex-col gap-2.5 lg:col-span-7">
          <SensTiles />
          <div className="grid gap-2.5 sm:grid-cols-2">
            <CrosshairTile />
            <StatTile
              label={t("display")}
              value={VALO_DISPLAY.resolution}
              unit={`${VALO_DISPLAY.ratio} · ${VALO_DISPLAY.hz} Hz`}
              className="[&_span:first-child]:text-[24px]"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}

function Menu() {
  const t = useTranslations("valoSettings.menu");
  return (
    <Card
      id="menu"
      title={t("title")}
      hideHeader
      index={1}
      next="creator"
      className="md:col-span-6 lg:col-span-12"
    >
      <SettingsMenu />
    </Card>
  );
}
