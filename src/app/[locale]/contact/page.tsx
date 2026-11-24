// src/app/[locale]/contact/page.tsx — 07 Contact. What matters first:
// 1. the live status, large (am I replying right now, and when I'm reachable again today);
// 2. the three main channels (work and business emails, Discord), addresses large, with actions;
// 3. the other networks.
import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowUpRight, Mail } from "lucide-react";
import { EMAILS, SOCIALS, type SocialId } from "@/config/site";
import { pageMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal, Section } from "@/components/ui/section";
import { CopyButton } from "@/components/ui/copy-button";
import { ExternalButton, buttonClass } from "@/components/ui/primitives";
import { NowCard } from "@/components/now/now-card";
import { TodayStrip } from "@/components/now/week-schedule";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.contact" });
  return pageMetadata({ locale, path: "/contact", title: t("title"), description: t("description") });
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Contact />;
}

function Contact() {
  const t = useTranslations("contact");
  return (
    <div className="page">
      <PageHeader
        space="contact"
        eyebrow={t("statusMeta")}
        title={t("title")}
        lead={<p>{t("intro")}</p>}
        aside={
          <div className="flex flex-col gap-6 border-t border-line-strong pt-5">
            <NowCard size="lg" />
            <div className="border-t border-line pt-5">
              <TodayStrip />
            </div>
          </div>
        }
      />
      <Channels />
      <Socials />
    </div>
  );
}

/** Breaks an address only at a readable point: before the "@", or after the "/" of a link */
function Breakable({ value }: { value: string }) {
  const at = value.indexOf("@");
  const slash = value.lastIndexOf("/");
  const cut = at > 0 ? at : slash > 0 ? slash + 1 : -1;
  if (cut < 0) return value;
  return (
    <>
      {value.slice(0, cut)}
      <wbr />
      {value.slice(cut)}
    </>
  );
}

/* ─── Main channels ─── */

type Channel =
  | { id: "proEmail" | "businessEmail"; kind: "email"; value: string; subject: "pro" | "business" }
  | { id: "discord"; kind: "link"; value: string; url: string };

const CHANNELS: Channel[] = [
  { id: "proEmail", kind: "email", value: EMAILS.pro, subject: "pro" },
  { id: "businessEmail", kind: "email", value: EMAILS.business, subject: "business" },
  { id: "discord", kind: "link", value: SOCIALS.discord.handle, url: SOCIALS.discord.url },
];

function Channels() {
  const t = useTranslations("contact");
  return (
    <Section id="channels" index="01" title={t("channels.title")}>
      <ul>
        {CHANNELS.map((c, i) => {
          const name = t(`keys.${c.id}`);
          const href = c.kind === "email" ? `mailto:${c.value}` : c.url;
          const external = c.kind === "link" ? { target: "_blank", rel: "noopener noreferrer" } : {};
          return (
            <li
              key={c.id}
              data-reveal=""
              style={{ "--i": i } as CSSProperties}
              className="grid gap-4 border-t border-line py-8 lg:grid-cols-12 lg:items-center lg:gap-8"
            >
              <div className="lg:col-span-3">
                <p className="label">
                  <span className="text-accent">{String(i + 1).padStart(2, "0")}</span> {name}
                </p>
                <p className="mt-2 text-[14px] text-muted">{t(`comments.${c.id}`)}</p>
              </div>
              <a href={href} {...external} className="contact-value display min-w-0 text-fg transition-colors duration-300 hover:text-accent lg:col-span-6">
                <Breakable value={c.value} />
              </a>
              <div className="flex flex-wrap gap-2 lg:col-span-3 lg:justify-end">
                {c.kind === "email" ? (
                  <a
                    href={`mailto:${c.value}?subject=${encodeURIComponent(t(`subjects.${c.subject}`))}`}
                    className={buttonClass(i === 0 ? "primary" : "tonal", "sm")}
                    aria-label={t("writeLabel", { email: c.value })}
                  >
                    <Mail size={13} aria-hidden="true" />
                    {t("write")}
                  </a>
                ) : (
                  <ExternalButton href={c.url} variant="tonal" size="sm" aria-label={t("openLabel", { name: c.value })} showIcon>
                    {t("channels.join")}
                  </ExternalButton>
                )}
                <CopyButton value={c.kind === "email" ? c.value : c.url} label={c.kind === "email" ? name : t("channels.linkLabel")} />
              </div>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

/* ─── Other networks ─── */

const SOCIAL_LINES: SocialId[] = ["tiktok", "instagramFps", "instagram", "discordEdits", "linktree"];

function Socials() {
  const t = useTranslations("contact");
  return (
    <Section id="socials" index="02" title={t("links.title")}>
      <Reveal>
        <ul className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
          {SOCIAL_LINES.map((id) => {
            const social = SOCIALS[id];
            return (
              <li key={id}>
                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-4 border-t border-line py-5"
                  aria-label={t("openLabel", { name: social.handle })}
                >
                  <span className="min-w-0">
                    <span className="label block">{t(`keys.${id}`)}</span>
                    <span className="mt-1.5 block truncate text-[17px] text-fg">{social.handle}</span>
                    <span className="mt-0.5 block truncate text-[13px] text-dim">{t(`comments.${id}`)}</span>
                  </span>
                  <ArrowUpRight size={18} aria-hidden="true" className="shrink-0 text-muted transition-transform duration-500 group-hover:rotate-45 group-hover:text-fg" />
                </a>
              </li>
            );
          })}
        </ul>
      </Reveal>
    </Section>
  );
}
