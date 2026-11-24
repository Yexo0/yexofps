// src/app/[locale]/now/page.tsx — /now: what I'm doing right now, computed in Paris time from my
// schedule (src/config/now.ts), and my typical week. Belongs to the Contact space.
import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal, Section } from "@/components/ui/section";
import { NowCard } from "@/components/now/now-card";
import { WeekSchedule } from "@/components/now/week-schedule";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.now" });
  return pageMetadata({ locale, path: "/now", title: t("title"), description: t("description") });
}

export default async function NowPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Now />;
}

function Now() {
  const t = useTranslations("now");
  return (
    <div className="page">
      <PageHeader
        space="contact"
        eyebrow={t("meta")}
        title={t("title")}
        lead={<p>{t("lead")}</p>}
        aside={
          <div className="border-t border-line-strong pt-5">
            <NowCard />
          </div>
        }
      />
      <Section id="week" index="01" title={t("week.title")}>
        <Reveal>
          <WeekSchedule />
        </Reveal>
      </Section>
    </div>
  );
}
