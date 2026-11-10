// src/app/[locale]/gaming/page.tsx — 04 Gaming : rangs, tracker Valorant, dernières parties, setup.
import Image from "next/image";
import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Gamepad2, Keyboard } from "lucide-react";
import { PARTNERS, RANKS, SETUP } from "@/config/site";
import { pageMetadata } from "@/lib/metadata";
import { Card } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import { ExternalButton } from "@/components/ui/primitives";
import { RankGrid } from "@/components/gaming/rank-grid";
import { TrackerSection } from "@/components/gaming/tracker-section";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.gaming" });
  return pageMetadata({ locale, path: "/gaming", title: t("title"), description: t("description") });
}

export default async function GamingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="bento">
      <Ranks />
      <TrackerSection />
      <Setup />
    </div>
  );
}

function Ranks() {
  const t = useTranslations("gaming");
  return (
    <Card
      id="ranks"
      icon={Gamepad2}
      title={t("intro.title")}
      subtitle="ls ~/ranks --peak"
      meta={t("ranks.meta", { count: RANKS.length })}
      headingLevel={1}
      index={0}
      className="md:col-span-6 lg:col-span-5"
      bodyClassName="gap-5"
    >
      <p className="max-w-[34ch] text-[22px] font-bold leading-tight tracking-tight">{t("intro.tagline")}</p>
      <RankGrid className="flex-1" />
    </Card>
  );
}

function Setup() {
  const t = useTranslations("gaming.setup");
  return (
    <Card
      id="setup"
      icon={Keyboard}
      title={t("title")}
      subtitle="ls ~/setup"
      meta={t("meta", { count: SETUP.length })}
      next="creator"
      index={3}
      className="md:col-span-6 lg:col-span-12"
    >
      <ul className="grid gap-2.5 sm:grid-cols-3">
        {SETUP.map((item) => {
          const partner = "partner" in item ? PARTNERS.find((p) => p.id === item.partner) : undefined;
          return (
            <li key={item.id} className="tile flex flex-col overflow-hidden">
              <div className="m-2 mb-0 grid h-36 place-items-center rounded-[10px] bg-[#f4f4f5] p-4">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={240}
                  height={160}
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="flex flex-1 flex-col gap-1 px-4 py-3.5">
                <p className="label">{t(`items.${item.id}`)}</p>
                <p className="text-[15px] font-bold">{item.name}</p>
                {partner && (
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="text-[13px] text-muted">
                      {t("partner", { discount: partner.discount, code: partner.code })}
                    </span>
                    <CopyButton value={partner.code} label={t("codeLabel")} compact />
                    <ExternalButton href={partner.url} size="sm" variant="tonal" showIcon>
                      {partner.name}
                    </ExternalButton>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
