// src/app/[locale]/creator/page.tsx — 05 Creator: who I edit as (with the 3D Valorant title card),
// edits and history, partners, Y-Services and how to order, client reviews.
import Image from "next/image";
import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { useLocale, useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowUpRight, Mail, Play } from "lucide-react";
import { EDITS, EMAILS, ORDER_URL, PARTNERS, PRODUCTS, REVIEWS, SOCIALS } from "@/config/site";
import { pageMetadata } from "@/lib/metadata";
import { formatPrice } from "@/lib/utils";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal, Section } from "@/components/ui/section";
import { PageSections } from "@/components/shell/page-sections";
import { CopyButton } from "@/components/ui/copy-button";
import { ArrowLink, ExternalButton, buttonClass } from "@/components/ui/primitives";
import { DiscordIcon, InstagramIcon, TikTokIcon } from "@/components/icons/brands";
import { EditTimeline } from "@/components/creator/edit-timeline";
import { Waveform } from "@/components/creator/waveform";
import { LogoTitle } from "@/components/creator/logo-title";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.creator" });
  return pageMetadata({ locale, path: "/creator", title: t("title"), description: t("description") });
}

export default async function CreatorPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Creator />;
}

function Creator() {
  const t = useTranslations("creator.bio");
  return (
    <div className="page">
      <PageHeader
        space="creator"
        eyebrow={SOCIALS.tiktok.handle}
        title={t("title")}
        plain
        lead={
          <>
            <p className="text-fg">{t("tagline")}</p>
            <p>{t("text")}</p>
          </>
        }
        actions={
          <>
            <ExternalButton href={SOCIALS.tiktok.url} variant="primary">
              <TikTokIcon size={15} />
              TikTok
            </ExternalButton>
            <ExternalButton href={SOCIALS.instagramFps.url} variant="tonal">
              <InstagramIcon size={15} />
              Instagram
            </ExternalButton>
            <ExternalButton href={SOCIALS.discordEdits.url} variant="tonal">
              <DiscordIcon size={16} />
              Discord Edits
            </ExternalButton>
          </>
        }
        aside={<LogoTitle preload image="/images/creator/editing-setup.webp" alt={t("photoAlt")} className="media-frame aspect-[4/5] w-full lg:aspect-[3/4]" />}
      />
      <PageSections page="creator" />
      <Edits />
      <Partners />
      <Services />
      <Reviews />
    </div>
  );
}

/* ─── Edits and history ─── */

function Edits() {
  const t = useTranslations("creator.edits");
  const tHistory = useTranslations("creator.history");
  // Playhead position: build date (static pages)
  const d = new Date();
  const now = d.getFullYear() + d.getMonth() / 12;
  return (
    <Section id="edits" index="01" title={t("title")} intro={t("intro")} aside={<ArrowLink href={SOCIALS.tiktok.url} external>{t("all")}</ArrowLink>}>
      <ul className="grid gap-5 sm:grid-cols-2">
        {EDITS.map((edit, i) => (
          <li key={edit.id} data-reveal="" style={{ "--i": i } as CSSProperties}>
            <a href={edit.url} target="_blank" rel="noopener noreferrer" className="group block">
              <span className="media-frame relative block aspect-video">
                <Image src={edit.thumbnail} alt="" width={960} height={540} sizes="(min-width: 640px) 48vw, 100vw" className="zoom-media h-full w-full object-cover" />
                <span aria-hidden="true" className="absolute bottom-4 left-4 grid h-12 w-12 place-items-center rounded-full bg-accent-vivid text-on-accent transition-transform duration-500 group-hover:scale-110">
                  <Play size={17} fill="currentColor" />
                </span>
              </span>
              <span className="mt-4 flex items-center gap-3">
                <span className="font-mono text-[10px] text-dim">A1</span>
                <Waveform seed={i + 2} />
              </span>
              <span className="mt-3 flex items-center justify-between gap-3">
                <span className="display text-[28px] text-fg">{t(`items.${edit.id}`)}</span>
                <ArrowUpRight size={18} aria-hidden="true" className="shrink-0 text-muted transition-transform duration-500 group-hover:rotate-45 group-hover:text-fg" />
                <span className="sr-only">({t("newTab")})</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
      <Reveal className="mt-16">
        <p className="label mb-5">{tHistory("title")}</p>
        <EditTimeline now={now} />
      </Reveal>
    </Section>
  );
}

/* ─── Partners ─── */

function Partners() {
  const t = useTranslations("creator.partners");
  return (
    <Section id="partners" index="02" title={t("title")} intro={t("note")}>
      <ul className="grid gap-x-8 lg:grid-cols-2">
        {PARTNERS.map((p, i) => (
          <li key={p.id} data-reveal="" style={{ "--i": i } as CSSProperties} className="flex flex-wrap items-center gap-5 border-t border-line py-6">
            <Image src={p.logo} alt="" width={56} height={56} className="h-14 w-14 bg-white object-contain p-1" />
            <div className="min-w-0 flex-1">
              <p className="display text-[30px] text-fg">{p.name}</p>
              <p className="text-[14px] text-muted">{t("discount", { discount: p.discount, code: p.code })}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="border border-dashed border-line-strong px-3 py-1.5 font-mono text-[14px] font-semibold tracking-wider text-fg">{p.code}</span>
              <CopyButton value={p.code} label={t("codeLabel", { code: p.code })} compact />
              <ExternalButton href={p.url} size="sm" variant="tonal" showIcon aria-label={t("visitLabel", { name: p.name })}>
                {t("visit")}
              </ExternalButton>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}

/* ─── Y-Services and how to order ─── */

function Services() {
  const t = useTranslations("creator.services");
  const locale = useLocale();
  return (
    <Section id="services" index="03" title={t("title")} intro={t("intro")}>
      <ul className="grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {PRODUCTS.map((p, i) => (
          <li key={p.id} data-reveal="" style={{ "--i": i % 3 } as CSSProperties} className="group flex flex-col">
            <div className="media-frame relative aspect-[16/9]">
              <Image src={p.image} alt={t(`products.${p.id}.imageAlt`)} width={640} height={360} sizes="(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 100vw" className="zoom-media h-full w-full object-cover object-top" />
            </div>
            <div className="mt-4 flex items-start justify-between gap-3">
              <h3 className="text-[16px] font-semibold leading-snug text-fg">{t(`products.${p.id}.title`)}</h3>
              <p className="display shrink-0 text-[26px] leading-none text-accent">{formatPrice(p.price, locale)}</p>
            </div>
            <p className="mt-2 text-[14px] leading-relaxed text-muted">{t(`products.${p.id}.desc`)}</p>
            <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
              {p.software && <span className="tag mr-auto">{p.software}</span>}
              {p.exampleUrl && (
                <ExternalButton href={p.exampleUrl} size="sm" variant="ghost" showIcon>
                  {t("example")}
                </ExternalButton>
              )}
              {p.previewUrl && (
                <ExternalButton href={p.previewUrl} size="sm" variant="ghost" showIcon>
                  {t("preview")}
                </ExternalButton>
              )}
              <a
                href={ORDER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClass("tonal", "sm")}
                aria-label={t("orderLabel", { product: t(`products.${p.id}.title`) })}
              >
                <DiscordIcon size={13} />
                {t("order")}
              </a>
            </div>
          </li>
        ))}
      </ul>
      <Order />
    </Section>
  );
}

function Order() {
  const t = useTranslations("creator.order");
  return (
    <Reveal className="mt-20">
      <p className="label mb-5">{t("title")}</p>
      <ol className="stagger grid gap-x-8 lg:grid-cols-3">
        <li className="flex flex-col gap-4 border-t border-line-strong py-6">
          <span className="font-mono text-[11px] text-accent">01</span>
          <div>
            <p className="text-[17px] font-semibold text-fg">{t("discord.title")}</p>
            <p className="mt-1.5 text-[14px] text-muted">{t("discord.text")}</p>
          </div>
          <ExternalButton href={ORDER_URL} variant="primary" size="sm" className="mt-auto self-start">
            <DiscordIcon size={13} />
            {t("discord.cta")}
          </ExternalButton>
        </li>
        <li className="flex flex-col gap-4 border-t border-line py-6">
          <span className="font-mono text-[11px] text-dim">02</span>
          <div className="min-w-0">
            <p className="text-[17px] font-semibold text-fg">{t("email.title")}</p>
            <p className="mt-1.5 text-[14px] text-muted">{t("email.text")}</p>
            <p className="mt-2 truncate font-mono text-[12.5px] text-fg">{EMAILS.business}</p>
          </div>
          <div className="mt-auto flex flex-wrap gap-2">
            <a href={`mailto:${EMAILS.business}`} className={buttonClass("tonal", "sm")}>
              <Mail size={13} aria-hidden="true" />
              {t("email.cta")}
            </a>
            <CopyButton value={EMAILS.business} label={t("email.copyLabel")} />
          </div>
        </li>
        <li className="flex flex-col gap-4 border-t border-line py-6">
          <span className="font-mono text-[11px] text-dim">03</span>
          <div>
            <p className="text-[17px] font-semibold text-fg">{t("payhip.title")}</p>
            <p className="mt-1.5 text-[14px] text-muted">{t("payhip.text")}</p>
          </div>
          <ExternalButton href={SOCIALS.payhip.url} variant="tonal" size="sm" showIcon className="mt-auto self-start">
            {t("payhip.cta")}
          </ExternalButton>
        </li>
      </ol>
      <p className="mt-4 max-w-[80ch] text-[13px] leading-relaxed text-dim">{t("delivery")}</p>
    </Reveal>
  );
}

/* ─── Client reviews ─── */

function Reviews() {
  const t = useTranslations("creator.reviews");
  return (
    <Section id="reviews" index="04" title={t("title")} intro={t("intro")} aside={<ArrowLink href={SOCIALS.discord.url} external>{t("all")}</ArrowLink>}>
      <ul className="grid gap-x-8 sm:grid-cols-2">
        {REVIEWS.map((r, i) => (
          <li key={r.id} data-reveal="" style={{ "--i": i % 2 } as CSSProperties}>
            <figure className="flex h-full flex-col gap-6 border-t border-line py-8">
              <blockquote className="flex-1 text-[22px] font-medium leading-snug tracking-[-0.01em] text-fg sm:text-[26px]">
                <p>{t("quote", { text: t(`items.${r.id}`) })}</p>
              </blockquote>
              <figcaption className="flex items-center gap-3">
                <Image src={r.avatar} alt="" width={32} height={32} className="h-8 w-8 rounded-full object-cover" />
                <span className="text-[14px] font-semibold">{r.name}</span>
                <span className="font-mono text-[11px] text-dim">{t("via", { platform: r.platform })}</span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </Section>
  );
}
