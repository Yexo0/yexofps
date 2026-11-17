// src/app/[locale]/page.tsx — 01 Accueil, pensé de haut en bas :
// 1. hero plein écran : qui je suis (nom en très grand, une phrase, actions) + la Vandal en 3D
//    + les chiffres clés (rangs, homelab) ;
// 2. la preuve : le montage à la une et les stats Valorant en direct ;
// 3. la suite : les six autres espaces en grandes tuiles colorées.
import { existsSync } from "node:fs";
import { join } from "node:path";
import Image from "next/image";
import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Mail, Play } from "lucide-react";
import { FEATURED_EDIT, PROFILE, SOCIALS } from "@/config/site";
import { pageMetadata } from "@/lib/metadata";
import { Card } from "@/components/ui/card";
import { SplitText } from "@/components/ui/split-text";
import { ButtonLink, ExternalButton } from "@/components/ui/primitives";
import { DiscordIcon, TikTokIcon } from "@/components/icons/brands";
import { LiveCard } from "@/components/home/live-card";
import { Whoami } from "@/components/home/whoami";
import { FeaturedEdit } from "@/components/home/featured-edit";
import { HeroVandal } from "@/components/home/hero-vandal";
import { KeyStats } from "@/components/home/key-stats";
import { SpaceTiles } from "@/components/home/space-tiles";

/** Vidéo à la une seulement si le fichier existe dans public/ (vérifié au build) : sinon lecteur TikTok */
function featuredVideo(): string | undefined {
  const video = FEATURED_EDIT.video;
  return video && existsSync(join(process.cwd(), "public", video)) ? video : undefined;
}

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

function Home() {
  const t = useTranslations("home");
  const video = featuredVideo();
  // Vidéo horizontale : large carte à gauche ; sinon (vertical ou TikTok) colonne plus étroite
  const landscape = Boolean(video) && FEATURED_EDIT.aspect === "landscape";

  return (
    <div className="bento lg:gap-4">
      <Hero />
      <Card
        id="edit"
        icon={Play}
        title={t("edit.title")}
        subtitle="mpv ~/edits/une.mp4"
        meta={t("edit.meta")}
        index={1}
        className={landscape ? "md:col-span-6 lg:col-span-8" : "md:col-span-3 lg:col-span-5"}
      >
        <FeaturedEdit video={video} landscape={landscape} />
      </Card>
      <LiveCard index={2} className={landscape ? "md:col-span-6 lg:col-span-4" : "md:col-span-3 lg:col-span-7"} />
      <SpaceTiles className="md:col-span-6 lg:col-span-12" />
    </div>
  );
}

function Hero() {
  const t = useTranslations("home.hero");

  return (
    <section
      aria-labelledby="hero-title"
      className="card hero-card md:col-span-6 lg:col-span-12"
      style={{ "--i": 0, viewTransitionName: "lead-card" } as CSSProperties}
    >
      {/* Décor : bande colorée en biais derrière l'arme, contour décalé, repères d'inspection */}
      <span aria-hidden="true" className="hero-band" />
      <svg aria-hidden="true" className="hero-band-outline" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polygon points="16,0 100,0 84,100 0,100" vectorEffect="non-scaling-stroke" />
      </svg>
      <HeroVandal className="hero-3d" />
      <span aria-hidden="true" className="hero-callout hero-callout-a">
        <span className="hero-callout-dot" />
        <span className="hero-callout-line" />
        <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-fg">{t("callouts.weapon")}</span>
      </span>
      <span aria-hidden="true" className="hero-callout hero-callout-b">
        <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">{t("callouts.main")}</span>
        <span className="hero-callout-line" />
        <span className="hero-callout-dot" />
      </span>

      <div className="relative z-[2] flex max-w-[640px] flex-col">
        <div className="flex items-center gap-3">
          <Image
            src="/images/avatar.webp"
            alt={t("avatarAlt")}
            width={88}
            height={88}
            preload
            className="h-11 w-11 rounded-[5px] object-cover ring-1 ring-line-strong"
          />
          <p className="label">{t("realName", { age: PROFILE.age })}</p>
        </div>

        <h1 id="hero-title" className="display hero-name mt-4 text-fg">
          <SplitText text="Yexo" delay={120} />
        </h1>

        <p className="hero-punch mt-5 max-w-[24ch] text-[24px] font-bold leading-[1.15] tracking-tight text-fg sm:text-[30px]">
          {t("punch")}
        </p>
        <div className="mt-5 max-w-[56ch]">
          <Whoami />
        </div>

        <div className="stagger mt-7 flex flex-wrap items-center gap-2.5">
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
        </div>
      </div>

      <KeyStats className="relative z-[2] mt-10 lg:mt-auto" />
    </section>
  );
}
