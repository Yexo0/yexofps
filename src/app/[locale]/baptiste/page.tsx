// src/app/[locale]/baptiste/page.tsx — Accueil, profil Baptiste : le côté pro, hors univers Valorant.
// Même design que l'accueil Yexo, sans Valorant : PC portable
// en 3D. De haut en bas : hero (prénom, une phrase, actions, chiffres clés), puis
// le parcours en bref et le résumé de l'infra, puis les espaces dans l'ordre utile à ce profil.
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, GitCommitHorizontal, Mail, Network } from "lucide-react";
import { TIMELINE } from "@/config/career";
import { SITE } from "@/config/site";
import { pageMetadata } from "@/lib/metadata";
import { Card } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/primitives";
import { Hero } from "@/components/home/hero";
import { ProStats } from "@/components/home/key-stats";
import { Fastfetch } from "@/components/home/fastfetch";
import { SpaceTiles } from "@/components/home/space-tiles";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.baptiste" });
  return pageMetadata({ locale, path: "/baptiste", title: t("title"), description: t("description") });
}

export default async function BaptistePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Baptiste />;
}

/** Les espaces dans l'ordre utile au côté pro (le gaming passe en dernier) */
const PRO_ORDER = ["career", "lab", "projects", "creator", "contact", "gaming"] as const;

function Baptiste() {
  const t = useTranslations("home.pro");
  const tHero = useTranslations("home.hero");
  return (
    <div className="bento lg:gap-4">
      <Hero
        profile="baptiste"
        name={SITE.displayName}
        nameClassName="hero-name-long"
        punch={t("punch")}
        scene="laptop"
        callouts={[t("callouts.ae"), t("callouts.machine")]}
        stats={<ProStats />}
        actions={
          <>
            <ButtonLink href="/career" variant="primary">
              {t("actions.career")}
              <ArrowRight size={16} aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href="/lab" variant="tonal">
              <Network size={16} aria-hidden="true" />
              {t("actions.lab")}
            </ButtonLink>
            <ButtonLink href="/contact" variant="tonal">
              <Mail size={16} aria-hidden="true" />
              {tHero("contact")}
            </ButtonLink>
          </>
        }
      />
      <TimelineBrief />
      <Fastfetch pro index={2} className="md:col-span-6 lg:col-span-5" />
      <SpaceTiles className="md:col-span-6 lg:col-span-12" order={PRO_ORDER} />
    </div>
  );
}

/* ─── Parcours en bref : les trois dernières étapes, en grand ─── */

function TimelineBrief() {
  const t = useTranslations("home.pro.timeline");
  const tItems = useTranslations("career.timeline");
  const items = TIMELINE.slice(0, 3);
  return (
    <Card
      id="timeline"
      icon={GitCommitHorizontal}
      title={t("title")}
      subtitle="git log --oneline -3 ~/parcours"
      index={1}
      className="md:col-span-6 lg:col-span-7"
      bodyClassName="gap-5"
    >
      <ol className="stagger relative flex flex-col gap-5 border-l border-line-strong pl-6">
        {items.map((item, i) => (
          <li key={item.id} className="relative" style={{ "--si": i } as CSSProperties}>
            <span
              aria-hidden="true"
              className={
                item.current
                  ? "absolute -left-[29.5px] top-1.5 h-[11px] w-[11px] rotate-45 bg-accent shadow-[0_0_14px_var(--glow-strong)]"
                  : "absolute -left-[29.5px] top-1.5 h-[11px] w-[11px] rotate-45 border border-line-strong bg-surface-solid"
              }
            />
            <p className="font-mono text-[11.5px] text-dim">{tItems(`items.${item.id}.date`)}</p>
            <p className="display mt-1 text-[26px] leading-[0.98] text-fg sm:text-[30px]">{tItems(`items.${item.id}.title`)}</p>
            <p className="mt-1 text-[14px] text-muted">{tItems(`items.${item.id}.place`)}</p>
          </li>
        ))}
      </ol>
      <ButtonLink href="/career#timeline" variant="tonal" size="sm" className="mt-auto self-start">
        {t("all")}
        <ArrowRight size={14} aria-hidden="true" />
      </ButtonLink>
    </Card>
  );
}
