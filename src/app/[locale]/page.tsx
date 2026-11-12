// src/app/[locale]/page.tsx — 01 Accueil, volontairement aéré : hero, montage à la une (avec le son),
// fastfetch court (côté infra) et carte Gaming (rangs + dernières parties).
import { existsSync } from "node:fs";
import { join } from "node:path";
import Image from "next/image";
import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Mail, Play } from "lucide-react";
import { FEATURED_EDIT, PROFILE, SOCIALS } from "@/config/site";
import { pageMetadata } from "@/lib/metadata";
import { Card } from "@/components/ui/card";
import { Reticle } from "@/components/ui/reticle";
import { ButtonLink, ExternalButton } from "@/components/ui/primitives";
import { DiscordIcon, TikTokIcon } from "@/components/icons/brands";
import { LiveCard } from "@/components/home/live-card";
import { Fastfetch } from "@/components/home/fastfetch";
import { Whoami } from "@/components/home/whoami";
import { FeaturedEdit } from "@/components/home/featured-edit";

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
        className="md:col-span-6 lg:col-span-4 lg:row-span-2"
      >
        <FeaturedEdit video={featuredVideo()} />
      </Card>
      <Fastfetch index={2} className="md:col-span-3 lg:col-span-4" />
      <LiveCard index={3} className="md:col-span-3 lg:col-span-4" />
    </div>
  );
}

function Hero() {
  const t = useTranslations("home.hero");

  return (
    <section
      aria-labelledby="hero-title"
      className="card justify-between gap-10 md:col-span-6 lg:col-span-8 lg:p-10"
      style={{ ["--i" as string]: 0 }}
    >
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
        <span className="absolute -left-24 -top-28 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,var(--glow)_0%,transparent_65%)] opacity-80" />
      </span>
      <div className="relative">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end">
          <span className="relative shrink-0 p-2.5">
            <Reticle size={12} inset={0} />
            <Image
              src="/images/avatar.webp"
              alt={t("avatarAlt")}
              width={128}
              height={128}
              preload
              className="h-24 w-24 rounded-xl object-cover sm:h-28 sm:w-28"
            />
          </span>
          <div className="min-w-0">
            <h1
              id="hero-title"
              className="hero-title text-[64px] font-bold leading-[0.9] tracking-[-0.04em] text-fg sm:text-[88px] xl:text-[104px]"
            >
              Yexo
            </h1>
            <p className="label mt-3">{t("realName", { age: PROFILE.age })}</p>
          </div>
        </div>

        <p className="mt-9 max-w-[30ch] text-[24px] font-bold leading-[1.2] tracking-tight text-fg sm:text-[30px]">
          {t("tagline")}
        </p>
        <div className="mt-6">
          <Whoami />
        </div>
      </div>

      <div className="stagger relative flex flex-wrap items-center gap-2.5">
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
    </section>
  );
}
