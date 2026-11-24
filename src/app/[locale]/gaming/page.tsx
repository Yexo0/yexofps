// src/app/[locale]/gaming/page.tsx — 06 Gaming: ranks (current huge, peak with the Radiant buddy),
// live Valorant tracker and recent matches, my settings in short, setup.
import Image from "next/image";
import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { PARTNERS, SETUP } from "@/config/site";
import { settingsCount } from "@/config/valorant-settings";
import { pageMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal, Section } from "@/components/ui/section";
import { PageSections } from "@/components/shell/page-sections";
import { CopyButton } from "@/components/ui/copy-button";
import { ArrowLink, ButtonLink, ExternalButton } from "@/components/ui/primitives";
import { RankGrid } from "@/components/gaming/rank-grid";
import { TrackerSection } from "@/components/gaming/tracker-section";
import { CrosshairTile, SensTiles } from "@/components/valorant/summary";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.gaming" });
  return pageMetadata({ locale, path: "/gaming", title: t("title"), description: t("description") });
}

export default async function GamingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Gaming />;
}

function Gaming() {
  const t = useTranslations("gaming");
  return (
    <div className="page">
      <PageHeader space="gaming" eyebrow={t("intro.eyebrow")} title={t("intro.title")} lead={<p>{t("intro.tagline")}</p>} />
      <PageSections page="gaming" />
      <Section id="ranks" index="01" title={t("ranks.title")}>
        <RankGrid />
      </Section>
      <Section id="tracker" index="02" title={t("tracker.sectionTitle")} intro={t("tracker.intro")}>
        <div className="grid gap-5 lg:grid-cols-12">
          <TrackerSection />
        </div>
      </Section>
      <ValorantSettings />
      <Setup />
    </div>
  );
}

function ValorantSettings() {
  const t = useTranslations("valoSettings");
  return (
    <Section
      id="settings"
      index="03"
      title={t("teaser.title")}
      intro={t("teaser.text")}
      aside={<span className="label">{t("summary.meta", { count: settingsCount() })}</span>}
    >
      <Reveal className="grid gap-8 lg:grid-cols-12 lg:items-end">
        <SensTiles className="lg:col-span-8" />
        <CrosshairTile compact className="lg:col-span-4" />
      </Reveal>
      <Reveal i={1} className="mt-8">
        <ButtonLink href="/gaming/settings" variant="primary">
          {t("teaser.open")}
          <ArrowRight size={15} aria-hidden="true" />
        </ButtonLink>
      </Reveal>
    </Section>
  );
}

function Setup() {
  const t = useTranslations("gaming.setup");
  return (
    <Section id="setup" index="04" title={t("title")} aside={<ArrowLink href="/projects/sensitivity-converter">{t("convert")}</ArrowLink>}>
      <ul className="grid gap-5 sm:grid-cols-3">
        {SETUP.map((item, i) => {
          const partner = "partner" in item ? PARTNERS.find((p) => p.id === item.partner) : undefined;
          return (
            <li key={item.id} data-reveal="" style={{ "--i": i } as CSSProperties} className="group flex flex-col">
              <div className="media-frame relative aspect-[4/3] bg-white">
                <Image src={item.image} alt={item.name} fill sizes="(min-width: 640px) 31vw, 100vw" className="zoom-media object-contain p-8" />
              </div>
              <p className="label mt-5">{t(`items.${item.id}`)}</p>
              <p className="display mt-2 text-[28px] text-fg">{item.name}</p>
              {partner && (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="text-[13px] text-muted">{t("partner", { discount: partner.discount, code: partner.code })}</span>
                  <CopyButton value={partner.code} label={t("codeLabel")} compact />
                  <ExternalButton href={partner.url} size="sm" variant="tonal" showIcon>
                    {partner.name}
                  </ExternalButton>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
