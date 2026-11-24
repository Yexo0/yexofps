// src/app/[locale]/page.tsx — 01 Home, Yexo profile (Valorant world; the Baptiste profile is /baptiste).
// Top to bottom:
// 1. full-screen hero: the name, huge, one sentence, actions, the Vandal in 3D on the red band, key figures;
// 2. selected work: three projects;
// 3. the latest edit and live Valorant stats;
// 4. the other spaces, as an index.
import { existsSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { FEATURED_EDIT, SOCIALS } from "@/config/site";
import type { ProjectId } from "@/config/projects";
import { pageMetadata } from "@/lib/metadata";
import { Reveal, Section } from "@/components/ui/section";
import { ButtonLink, ExternalButton } from "@/components/ui/primitives";
import { DiscordIcon, TikTokIcon } from "@/components/icons/brands";
import { LiveCard } from "@/components/home/live-card";
import { FeaturedEdit } from "@/components/home/featured-edit";
import { YexoStats } from "@/components/home/key-stats";
import { Hero } from "@/components/home/hero";
import { SpaceIndex } from "@/components/home/space-index";
import { SelectedWork } from "@/components/home/selected-work";

/** Featured video only if the file exists in public/ (checked at build): otherwise TikTok player */
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

/** Projects shown on the Yexo home */
const SELECTED: ProjectId[] = ["yexofx", "claimd", "yexoclip"];

function Home() {
  const t = useTranslations("home");
  const video = featuredVideo();
  const landscape = Boolean(video) && FEATURED_EDIT.aspect === "landscape";

  return (
    <div className="page">
      <YexoHero />
      <SelectedWork ids={SELECTED} index="01" />
      <Section id="edit" index="02" title={t("edit.title")} intro={t("edit.intro")}>
        <div className="grid gap-5 lg:grid-cols-12 lg:gap-8">
          <Reveal className={landscape ? "lg:col-span-8" : "lg:col-span-5"}>
            <FeaturedEdit video={video} landscape={landscape} />
          </Reveal>
          <LiveCard index={1} className={landscape ? "lg:col-span-4" : "lg:col-span-7"} />
        </div>
      </Section>
      <SpaceIndex index="03" />
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
      caption={t("caption")}
      stats={<YexoStats />}
      actions={
        <>
          <ExternalButton href={SOCIALS.tiktok.url} variant="primary" aria-label={`TikTok ${SOCIALS.tiktok.handle}`}>
            <TikTokIcon size={15} />
            TikTok
          </ExternalButton>
          <ExternalButton href={SOCIALS.discord.url} variant="tonal">
            <DiscordIcon size={16} />
            Discord
          </ExternalButton>
          <ButtonLink href="/projects" variant="tonal">
            {t("work")}
            <ArrowRight size={15} aria-hidden="true" />
          </ButtonLink>
        </>
      }
    />
  );
}
