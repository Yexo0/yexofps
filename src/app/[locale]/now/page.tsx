// src/app/[locale]/now/page.tsx — /now : ce que je fais en ce moment, calculé à l'heure de Paris
// depuis mon emploi du temps (src/config/now.ts), et ma semaine type. Rattachée à l'espace Contact.
import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CalendarClock, Radio } from "lucide-react";
import { pageMetadata } from "@/lib/metadata";
import { Card } from "@/components/ui/card";
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
    <div className="bento">
      <Card
        id="now"
        icon={Radio}
        title={t("title")}
        subtitle="watch -n 60 now"
        meta={t("meta")}
        headingLevel={1}
        index={0}
        className="md:col-span-6 lg:col-span-5"
      >
        <NowCard />
      </Card>
      <Card
        id="week"
        icon={CalendarClock}
        title={t("week.title")}
        subtitle="crontab -l"
        index={1}
        next="home"
        className="md:col-span-6 lg:col-span-7"
      >
        <WeekSchedule />
      </Card>
    </div>
  );
}
