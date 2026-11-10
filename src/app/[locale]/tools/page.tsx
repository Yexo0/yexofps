// src/app/[locale]/tools/page.tsx — 06 Outils : convertisseur de sensibilité.
import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BookOpen, SlidersHorizontal } from "lucide-react";
import { GAMES, GAME_KEYS } from "@/lib/converter-math";
import { pageMetadata } from "@/lib/metadata";
import { Card } from "@/components/ui/card";
import { Converter } from "@/components/tools/converter";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.tools" });
  return pageMetadata({ locale, path: "/tools", title: t("title"), description: t("description") });
}

export default async function ToolsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Tools />;
}

function Tools() {
  const t = useTranslations("tools");
  return (
    <div className="bento">
      <Card
        id="converter"
        icon={SlidersHorizontal}
        title={t("converter.title")}
        subtitle="sens --convert --keep cm/360"
        meta={t("converter.meta", { count: GAME_KEYS.length })}
        headingLevel={1}
        index={0}
        className="md:col-span-6 lg:col-span-8"
        bodyClassName="gap-4"
      >
        <p className="max-w-[70ch] text-sm leading-relaxed text-muted">{t("converter.intro")}</p>
        <Converter />
      </Card>

      <Card
        id="how"
        icon={BookOpen}
        title={t("how.title")}
        subtitle="man sens"
        index={1}
        next="contact"
        className="md:col-span-6 lg:col-span-4"
        bodyClassName="gap-4"
      >
        <p className="text-sm leading-relaxed text-muted">{t("how.text")}</p>
        <div className="terminal px-4 py-3.5 text-[12.5px]">
          <p className="label mb-1.5">{t("how.formula")}</p>
          <p className="text-fg">cm/360 = (360 × 2.54) / (DPI × sens × yaw)</p>
          <p className="text-fg">sens₂ = (360 × 2.54) / (DPI₂ × cm/360 × yaw₂)</p>
          <p className="mt-1.5 text-dim">eDPI = DPI × sens</p>
        </div>
        <div>
          <p className="label mb-2">{t("how.yaw")}</p>
          <dl className="flex flex-col gap-1">
            {GAME_KEYS.map((k) => (
              <div key={k} className="tile flex items-center justify-between px-3.5 py-2 text-sm">
                <dt>{GAMES[k].name}</dt>
                <dd className="font-mono text-[13px] text-muted">{GAMES[k].yaw}</dd>
              </div>
            ))}
          </dl>
        </div>
        <p className="text-xs text-dim">{t("how.note")}</p>
      </Card>
    </div>
  );
}
