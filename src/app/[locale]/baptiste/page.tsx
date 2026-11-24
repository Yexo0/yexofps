// src/app/[locale]/baptiste/page.tsx — Home, Baptiste profile: the professional side, outside the
// Valorant world. Laptop in 3D. Top to bottom: hero (first name, one sentence, actions, key figures),
// background in short next to the fastfetch summary, infra projects, then the spaces in the order
// that matters for this profile (gaming last).
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { TIMELINE } from "@/config/career";
import { SITE } from "@/config/site";
import { pageMetadata } from "@/lib/metadata";
import { Reveal, Section } from "@/components/ui/section";
import { ArrowLink, ButtonLink } from "@/components/ui/primitives";
import { Hero } from "@/components/home/hero";
import { ProStats } from "@/components/home/key-stats";
import { Fastfetch } from "@/components/home/fastfetch";
import { SpaceIndex } from "@/components/home/space-index";
import { SelectedWork } from "@/components/home/selected-work";

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

/** Spaces in the order that matters for the pro side (gaming last) */
const PRO_ORDER = ["career", "lab", "projects", "creator", "contact", "gaming"] as const;

function Baptiste() {
  const t = useTranslations("home.pro");
  return (
    <div className="page">
      <Hero
        profile="baptiste"
        name={SITE.displayName}
        long
        punch={t("punch")}
        scene="laptop"
        caption={t("caption")}
        stats={<ProStats />}
        actions={
          <>
            <ButtonLink href="/career" variant="primary">
              {t("actions.career")}
              <ArrowRight size={15} aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href="/lab" variant="tonal">
              {t("actions.lab")}
            </ButtonLink>
            <ButtonLink href="/contact" variant="tonal">
              {t("actions.contact")}
            </ButtonLink>
          </>
        }
      />
      <Background />
      <SelectedWork ids={["homelab", "site", "claimd"]} index="02" />
      <SpaceIndex index="03" order={PRO_ORDER} />
    </div>
  );
}

/* ─── Background in short: the three latest steps, next to the infra summary ─── */

function Background() {
  const t = useTranslations("home.pro.timeline");
  const tItems = useTranslations("career.timeline");
  const items = TIMELINE.slice(0, 3);
  return (
    <Section id="background" index="01" title={t("title")} aside={<ArrowLink href="/career">{t("all")}</ArrowLink>}>
      <div className="grid gap-10 lg:grid-cols-12">
        <Reveal className="lg:col-span-6">
          <ol className="stagger">
            {items.map((item, i) => (
              <li key={item.id} className="grid grid-cols-[88px_1fr] gap-4 border-t border-line py-6" style={{ "--si": i } as CSSProperties}>
                <p className="font-mono text-[11.5px] text-dim">
                  {item.current && <span aria-hidden="true" className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-accent-vivid align-middle" />}
                  {tItems(`items.${item.id}.date`)}
                </p>
                <div>
                  <p className="display text-[28px] leading-[0.95] text-fg sm:text-[34px]">{tItems(`items.${item.id}.title`)}</p>
                  <p className="mt-2 text-[14px] text-muted">{tItems(`items.${item.id}.place`)}</p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
        <Fastfetch pro index={1} className="lg:col-span-6" />
      </div>
    </Section>
  );
}
