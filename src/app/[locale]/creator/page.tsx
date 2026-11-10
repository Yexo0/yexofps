// src/app/[locale]/creator/page.tsx — 05 Créateur : bio, historique, edits TikTok, partenaires, Y-Services, commande, avis.
import Image from "next/image";
import type { Metadata } from "next";
import { useLocale, useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  Clapperboard,
  ExternalLink,
  Gamepad2,
  Handshake,
  History,
  Mail,
  MapPin,
  MessageSquareQuote,
  Play,
  ShoppingBag,
  Video,
  Zap,
} from "lucide-react";
import { EDITS, EMAILS, ORDER_URL, PARTNERS, PRODUCTS, REVIEWS, SOCIALS } from "@/config/site";
import { pageMetadata } from "@/lib/metadata";
import { formatPrice } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import { Chip, ExternalButton, buttonClass } from "@/components/ui/primitives";
import { DiscordIcon, InstagramIcon, TikTokIcon } from "@/components/icons/brands";
import { EditTimeline } from "@/components/creator/edit-timeline";
import { Waveform } from "@/components/creator/waveform";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.creator" });
  return pageMetadata({ locale, path: "/creator", title: t("title"), description: t("description") });
}

export default async function CreatorPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="bento">
      <Bio />
      <Partners />
      <CreatorHistory />
      <Edits />
      <Reviews />
      <Services />
      <Order />
    </div>
  );
}

/* ─── Bio ─── */

function Bio() {
  const t = useTranslations("creator.bio");
  return (
    <Card
      id="bio"
      icon={Clapperboard}
      title={t("title")}
      subtitle="cat ~/bio.md"
      meta={SOCIALS.tiktok.handle}
      headingLevel={1}
      index={0}
      className="md:col-span-6 lg:col-span-7"
    >
      <div className="grid gap-5 sm:grid-cols-[1fr_180px]">
        <div className="flex flex-col gap-4">
          <p className="text-[22px] font-bold leading-tight tracking-tight">{t("tagline")}</p>
          <p className="text-[15px] leading-relaxed text-muted">{t("text")}</p>
          <ul className="flex flex-wrap gap-1.5">
            <li>
              <Chip icon={Gamepad2}>{t("chips.radiant")}</Chip>
            </li>
            <li>
              <Chip icon={Video}>{t("chips.editor")}</Chip>
            </li>
            <li>
              <Chip icon={MapPin}>{t("chips.location")}</Chip>
            </li>
          </ul>
        </div>
        <Image
          src="/images/creator/editing-setup.webp"
          alt={t("photoAlt")}
          width={360}
          height={380}
          className="hidden h-full max-h-[240px] w-full rounded-2xl object-cover sm:block"
        />
      </div>
      <div className="mt-6 flex flex-wrap gap-2.5">
        <ExternalButton href={SOCIALS.tiktok.url} variant="primary">
          <TikTokIcon size={16} />
          TikTok
        </ExternalButton>
        <ExternalButton href={SOCIALS.instagramFps.url} variant="tonal">
          <InstagramIcon size={16} />
          Instagram FPS
        </ExternalButton>
        <ExternalButton href={SOCIALS.discordEdits.url} variant="tonal">
          <DiscordIcon size={17} />
          Discord Edits
        </ExternalButton>
      </div>
    </Card>
  );
}

/* ─── Historique : timeline de montage ─── */

function CreatorHistory() {
  const t = useTranslations("creator.history");
  // Position de la tête de lecture : date du build (pages statiques)
  const d = new Date();
  const now = d.getFullYear() + d.getMonth() / 12;
  return (
    <Card
      id="history"
      icon={History}
      title={t("title")}
      subtitle="ffprobe ~/yexo/2021-now.mov"
      meta={t("meta", { count: 5 })}
      index={2}
      className="md:col-span-6 lg:col-span-12"
    >
      <EditTimeline now={now} />
    </Card>
  );
}

/* ─── Edits ─── */

function Edits() {
  const t = useTranslations("creator.edits");
  return (
    <Card
      id="edits"
      icon={Play}
      title={t("title")}
      subtitle="ls ~/edits"
      meta="TikTok"
      index={3}
      className="md:col-span-6 lg:col-span-7"
      bodyClassName="gap-4"
    >
      <p className="text-sm text-muted">{t("intro")}</p>
      <ul className="grid gap-2.5 sm:grid-cols-2">
        {EDITS.map((edit, i) => (
          <li key={edit.id}>
            <a
              href={edit.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block overflow-hidden rounded-[14px] bg-surface-2"
            >
              <span className="relative block aspect-video overflow-hidden">
                <Image
                  src={edit.thumbnail}
                  alt=""
                  width={480}
                  height={270}
                  className="h-full w-full object-cover transition-opacity duration-150 group-hover:opacity-85"
                />
                <span
                  aria-hidden="true"
                  className="absolute bottom-3 left-3 grid h-9 w-9 place-items-center rounded-full bg-accent text-on-accent"
                >
                  <Play size={15} fill="currentColor" />
                </span>
              </span>
              <span className="flex items-center gap-2.5 px-4 pt-3">
                <span className="font-mono text-[10px] text-dim">A1</span>
                <Waveform seed={i + 2} />
              </span>
              <span className="flex items-center justify-between gap-3 px-4 py-3">
                <span className="text-sm font-semibold">{t(`items.${edit.id}`)}</span>
                <ExternalLink size={14} aria-hidden="true" className="shrink-0 text-dim" />
                <span className="sr-only">({t("newTab")})</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
      <div>
        <ExternalButton href={SOCIALS.tiktok.url} variant="tonal" showIcon>
          <TikTokIcon size={15} />
          {t("all")}
        </ExternalButton>
      </div>
    </Card>
  );
}

/* ─── Partenaires ─── */

function Partners() {
  const t = useTranslations("creator.partners");
  return (
    <Card
      id="partners"
      icon={Handshake}
      title={t("title")}
      subtitle="cat ~/partners.txt"
      meta={t("meta")}
      index={1}
      className="md:col-span-6 lg:col-span-5"
    >
      <ul className="flex flex-col gap-2">
        {PARTNERS.map((p) => (
          <li key={p.id} className="tile flex flex-wrap items-center gap-4 px-4 py-4">
            <Image src={p.logo} alt="" width={48} height={48} className="h-12 w-12 rounded-xl bg-white object-contain" />
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-bold">{p.name}</p>
              <p className="text-[13px] text-muted">{t("discount", { discount: p.discount, code: p.code })}</p>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="rounded-lg border border-dashed border-line-strong px-2.5 py-1 font-mono text-sm font-semibold tracking-wider">
                {p.code}
              </span>
              <CopyButton value={p.code} label={t("codeLabel", { code: p.code })} compact />
              <ExternalButton href={p.url} size="sm" variant="tonal" showIcon aria-label={t("visitLabel", { name: p.name })}>
                {t("visit")}
              </ExternalButton>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-dim">{t("note")}</p>
    </Card>
  );
}

/* ─── Y-Services ─── */

function Services() {
  const t = useTranslations("creator.services");
  const locale = useLocale();
  return (
    <Card
      id="services"
      icon={ShoppingBag}
      title={t("title")}
      subtitle="ls ~/y-services"
      meta={t("meta", { count: PRODUCTS.length })}
      index={5}
      className="md:col-span-6 lg:col-span-12"
      bodyClassName="gap-4"
    >
      <p className="max-w-[80ch] text-sm leading-relaxed text-muted">{t("intro")}</p>
      <ul className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {PRODUCTS.map((p) => (
          <li key={p.id} className="tile flex flex-col overflow-hidden">
            <div className="relative aspect-[16/9] overflow-hidden bg-surface-3">
              <Image
                src={p.image}
                alt={t(`products.${p.id}.imageAlt`)}
                width={480}
                height={270}
                className="h-full w-full object-cover object-top"
              />
            </div>
            <div className="flex flex-1 flex-col gap-2 px-4 py-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-[15px] font-bold leading-snug">{t(`products.${p.id}.title`)}</h3>
                <p className="shrink-0 font-mono text-[17px] font-semibold text-accent">{formatPrice(p.price, locale)}</p>
              </div>
              <p className="text-[13px] leading-relaxed text-muted">{t(`products.${p.id}.desc`)}</p>
              {p.software && (
                <div>
                  <span className="tag">{p.software}</span>
                </div>
              )}
              <div className="mt-auto flex flex-wrap gap-2 pt-2">
                <a
                  href={ORDER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonClass("tonal", "sm")}
                  aria-label={t("orderLabel", { product: t(`products.${p.id}.title`) })}
                >
                  <DiscordIcon size={14} />
                  {t("order")}
                </a>
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
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

/* ─── Commander ─── */

function Order() {
  const t = useTranslations("creator.order");
  return (
    <Card
      id="order"
      icon={Zap}
      title={t("title")}
      subtitle="cat ~/y-services/commander.md"
      index={6}
      next="tools"
      className="md:col-span-6 lg:col-span-12"
      bodyClassName="gap-2"
    >
      <ol className="grid gap-2 lg:grid-cols-3">
        <li className="tile flex flex-col gap-3 px-4 py-4">
          <div className="flex items-start gap-3">
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent font-mono text-[11px] text-on-accent">1</span>
            <div>
              <p className="text-sm font-semibold">{t("discord.title")}</p>
              <p className="mt-0.5 text-[13px] text-muted">{t("discord.text")}</p>
            </div>
          </div>
          <ExternalButton href={ORDER_URL} variant="primary" size="sm" className="self-start">
            <DiscordIcon size={14} />
            {t("discord.cta")}
          </ExternalButton>
        </li>
        <li className="tile flex flex-col gap-3 px-4 py-4">
          <div className="flex items-start gap-3">
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-surface-3 font-mono text-[11px] text-muted">2</span>
            <div className="min-w-0">
              <p className="text-sm font-semibold">{t("email.title")}</p>
              <p className="mt-0.5 text-[13px] text-muted">{t("email.text")}</p>
              <p className="mt-1 truncate font-mono text-[12.5px] text-fg">{EMAILS.business}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href={`mailto:${EMAILS.business}`} className={buttonClass("tonal", "sm")}>
              <Mail size={14} aria-hidden="true" />
              {t("email.cta")}
            </a>
            <CopyButton value={EMAILS.business} label={t("email.copyLabel")} />
          </div>
        </li>
        <li className="tile flex flex-col gap-3 px-4 py-4">
          <div className="flex items-start gap-3">
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-surface-3 font-mono text-[11px] text-muted">3</span>
            <div>
              <p className="text-sm font-semibold">{t("payhip.title")}</p>
              <p className="mt-0.5 text-[13px] text-muted">{t("payhip.text")}</p>
            </div>
          </div>
          <ExternalButton href={SOCIALS.payhip.url} variant="tonal" size="sm" showIcon className="self-start">
            {t("payhip.cta")}
          </ExternalButton>
        </li>
      </ol>
      <p className="mt-2 text-xs leading-relaxed text-dim">{t("delivery")}</p>
      <p className="text-xs leading-relaxed text-dim">{t("tip")}</p>
    </Card>
  );
}

/* ─── Avis ─── */

function Reviews() {
  const t = useTranslations("creator.reviews");
  return (
    <Card
      id="reviews"
      icon={MessageSquareQuote}
      title={t("title")}
      subtitle="tail -n 4 ~/y-services/reviews.log"
      meta={t("meta", { count: REVIEWS.length })}
      index={4}
      className="md:col-span-6 lg:col-span-5"
      bodyClassName="gap-3"
    >
      <p className="text-sm text-muted">{t("intro")}</p>
      <ul className="grid gap-2">
        {REVIEWS.map((r) => (
          <li key={r.id}>
            <figure className="tile flex h-full flex-col gap-3 px-4 py-4">
              <blockquote className="flex-1 text-[14px] leading-relaxed text-fg">
                <p>{t("quote", { text: t(`items.${r.id}`) })}</p>
              </blockquote>
              <figcaption className="flex items-center gap-2.5">
                <Image src={r.avatar} alt="" width={28} height={28} className="h-7 w-7 rounded-full object-cover" />
                <span className="text-[13px] font-semibold">{r.name}</span>
                <span className="font-mono text-[11px] text-dim">{t("via", { platform: r.platform })}</span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
      <div>
        <ExternalButton href={SOCIALS.discord.url} variant="ghost" size="sm" showIcon>
          {t("all")}
        </ExternalButton>
      </div>
    </Card>
  );
}
