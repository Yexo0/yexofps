// src/app/[locale]/page.tsx — 01 Accueil : hero, carte live Valorant, fastfetch, aperçu des rangs, raccourcis.
import Image from "next/image";
import type { Metadata } from "next";
import { useLocale, useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Briefcase, Clapperboard, Mail, SlidersHorizontal, Trophy, type LucideIcon } from "lucide-react";
import { PRODUCTS, RANKS, SOCIALS } from "@/config/site";
import { LAB_SINCE } from "@/config/lab";
import type { SpaceId } from "@/config/spaces";
import { pageMetadata } from "@/lib/metadata";
import { formatPrice } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { NextSpace } from "@/components/ui/next-space";
import { ButtonLink, ExternalButton } from "@/components/ui/primitives";
import { DiscordIcon, TikTokIcon } from "@/components/icons/brands";
import { RankGrid } from "@/components/gaming/rank-grid";
import { LiveCard } from "@/components/home/live-card";
import { Fastfetch } from "@/components/home/fastfetch";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return pageMetadata({ locale, path: "/", title: t("home.title"), description: t("home.description"), absoluteTitle: true });
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Home />;
}

/** Années repères affichées dans la ligne "uptime" du hero (réelles) */
const SINCE = { homelab: LAB_SINCE, radiant: 2024, tiktok: 2022 };

function Home() {
  const t = useTranslations("home");

  return (
    <div className="bento">
      <Hero />
      <LiveCard index={1} className="md:col-span-6 lg:col-span-4" />
      <Fastfetch index={2} className="md:col-span-6 lg:col-span-7" />
      <Card
        id="ranks"
        icon={Trophy}
        title={t("ranks.title")}
        subtitle="ls ~/ranks --peak"
        meta={t("ranks.meta", { count: RANKS.length })}
        next="gaming"
        index={3}
        className="md:col-span-6 lg:col-span-5"
      >
        <RankGrid className="flex-1" />
      </Card>
      <Shortcuts />
    </div>
  );
}

function Hero() {
  const t = useTranslations("home.hero");

  return (
    <section
      aria-labelledby="hero-title"
      className="card justify-between gap-8 md:col-span-6 lg:col-span-8"
      style={{ ["--i" as string]: 0 }}
    >
      <div>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
          <Image
            src="/images/avatar.webp"
            alt={t("avatarAlt")}
            width={128}
            height={128}
            priority
            className="h-24 w-24 shrink-0 rounded-2xl object-cover ring-1 ring-line sm:h-28 sm:w-28"
          />
          <div className="min-w-0">
            <h1
              id="hero-title"
              className="text-[64px] font-bold leading-[0.9] tracking-[-0.04em] text-fg sm:text-[88px] xl:text-[104px]"
            >
              Yexo
            </h1>
            <p className="label mt-3">{t("realName")}</p>
          </div>
        </div>

        <p className="mt-7 max-w-[34ch] text-[24px] font-bold leading-[1.2] tracking-tight text-fg sm:text-[28px]">
          {t("tagline")}
        </p>
        <p className="mt-4 max-w-[68ch] text-[15px] leading-relaxed text-muted">{t("intro")}</p>

        <p className="terminal mt-5 inline-flex max-w-full flex-wrap items-center gap-x-2 rounded-xl px-3.5 py-2 text-[12.5px]">
          <span className="prompt">$ uptime</span>
          <span className="text-fg">{t("uptime", SINCE)}</span>
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <ExternalButton href={SOCIALS.tiktok.url} variant="primary" aria-label={`TikTok ${SOCIALS.tiktok.handle}`}>
          <TikTokIcon size={16} />
          TikTok
        </ExternalButton>
        <ExternalButton href={SOCIALS.discord.url} variant="tonal">
          <DiscordIcon size={17} />
          Discord
        </ExternalButton>
        <ButtonLink href="/contact" variant="tonal">
          <Mail size={16} aria-hidden="true" />
          {t("contact")}
        </ButtonLink>
        <span className="ml-auto hidden sm:block">
          <NextSpace to="career" />
        </span>
      </div>
      <span className="sm:hidden">
        <NextSpace to="career" />
      </span>
    </section>
  );
}

/** Rangée de cartes courtes vers les autres espaces */
function Shortcuts() {
  const t = useTranslations("home.shortcuts");
  const locale = useLocale();
  const prices = PRODUCTS.flatMap((p) => (typeof p.price === "number" ? [p.price] : [...p.price]));

  const items: { id: SpaceId; icon: LucideIcon; subtitle: string; meta?: string; text: string }[] = [
    { id: "career", icon: Briefcase, subtitle: "cat ~/parcours/now.txt", text: t("career.text") },
    {
      id: "creator",
      icon: Clapperboard,
      subtitle: "ls ~/y-services",
      meta: t("creator.meta", { count: PRODUCTS.length }),
      text: t("creator.text", {
        min: formatPrice(Math.min(...prices), locale),
        max: formatPrice(Math.max(...prices), locale),
      }),
    },
    { id: "tools", icon: SlidersHorizontal, subtitle: "sens --convert", text: t("tools.text") },
    { id: "contact", icon: Mail, subtitle: "cat contact.txt", text: t("contact.text") },
  ];

  return (
    <>
      {items.map((item, i) => (
        <Card
          key={item.id}
          icon={item.icon}
          title={t(`${item.id}.title`)}
          subtitle={item.subtitle}
          meta={item.meta}
          index={4 + i}
          className="md:col-span-3 lg:col-span-3"
          bodyClassName="justify-between gap-6"
        >
          <p className="text-sm leading-relaxed text-muted">{item.text}</p>
          <NextSpace to={item.id} />
        </Card>
      ))}
    </>
  );
}
