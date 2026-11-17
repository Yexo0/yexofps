// src/app/[locale]/page.tsx — 01 Accueil, profil Yexo (univers Valorant ; le profil Baptiste est /baptiste).
// Pensé de haut en bas :
// 1. hero plein écran : qui je suis (nom en très grand, une phrase, actions) + la Vandal en 3D
//    + les chiffres clés (rangs, homelab) ;
// 2. la preuve : le montage à la une et les stats Valorant en direct ;
// 3. la suite : les six autres espaces en grandes tuiles colorées.
import { existsSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Mail, Play } from "lucide-react";
import { FEATURED_EDIT, SOCIALS } from "@/config/site";
import { pageMetadata } from "@/lib/metadata";
import { Card } from "@/components/ui/card";
import { ButtonLink, ExternalButton } from "@/components/ui/primitives";
import { DiscordIcon, TikTokIcon } from "@/components/icons/brands";
import { LiveCard } from "@/components/home/live-card";
import { FeaturedEdit } from "@/components/home/featured-edit";
import { YexoStats } from "@/components/home/key-stats";
import { Hero } from "@/components/home/hero";
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
      <YexoHero />
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

function YexoHero() {
  const t = useTranslations("home.hero");
  return (
    <Hero
      profile="yexo"
      name="Yexo"
      punch={t("punch")}
      scene="vandal"
      callouts={[t("callouts.weapon"), t("callouts.main")]}
      stats={<YexoStats />}
      actions={
        <>
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
        </>
      }
    />
  );
}
