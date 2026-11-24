// src/app/[locale]/contact/page.tsx — 07 Contact. De haut en bas, ce qui compte d'abord :
// 1. mon statut en direct, en grand (est-ce que je réponds maintenant, par où me joindre, et la
//    journée en cours pour savoir quand je redeviens joignable) ;
// 2. les trois canaux principaux (emails pro et business, Discord), avec leurs actions ;
// 3. les autres réseaux, façon "cat contact.txt", et à côté qui contacter selon le sujet.
import type { Metadata } from "next";
import type { ComponentType } from "react";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Briefcase, ExternalLink, Handshake, Mail, Radio, Route, Send, ShoppingBag, SquareTerminal } from "lucide-react";
import { EMAILS, SOCIALS, type SocialId } from "@/config/site";
import { pageMetadata } from "@/lib/metadata";
import { Card } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import { ExternalButton, buttonClass } from "@/components/ui/primitives";
import { DiscordIcon } from "@/components/icons/brands";
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
  return (
    <div className="bento">
      <Status />
      <Channels />
      <Socials />
      <Routing />
    </div>
  );
}

/** Coupe une adresse seulement à un endroit lisible : avant le « @ », ou après le « / » d'un lien */
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

/* ─── 1. Statut en direct (carte principale) ─── */

function Status() {
  const t = useTranslations("contact");
  return (
    <Card
      id="contact"
      icon={Radio}
      title={t("title")}
      subtitle="watch -n 60 now"
      meta={
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="live-dot h-1.5 w-1.5 rounded-full bg-accent" />
          {t("statusMeta")}
        </span>
      }
      headingLevel={1}
      index={0}
      className="md:col-span-6 lg:col-span-7"
      bodyClassName="gap-6"
    >
      <NowCard size="lg" />
      {/* Quand je redeviens joignable : la journée en cours, d'un coup d'œil */}
      <div className="border-t border-line pt-5">
        <TodayStrip />
      </div>
    </Card>
  );
}

/* ─── 2. Canaux principaux ─── */

type Channel =
  | { id: "proEmail" | "businessEmail"; kind: "email"; value: string; subject: "pro" | "business"; icon: ComponentType<{ size?: number }> }
  | { id: "discord"; kind: "link"; value: string; url: string; icon: ComponentType<{ size?: number }> };

const CHANNELS: Channel[] = [
  { id: "proEmail", kind: "email", value: EMAILS.pro, subject: "pro", icon: Mail },
  { id: "businessEmail", kind: "email", value: EMAILS.business, subject: "business", icon: Briefcase },
  { id: "discord", kind: "link", value: SOCIALS.discord.handle, url: SOCIALS.discord.url, icon: DiscordIcon },
];

function Channels() {
  const t = useTranslations("contact");
  return (
    <Card
      id="channels"
      icon={Send}
      title={t("channels.title")}
      subtitle="ls ~/canaux"
      meta={t("meta", { count: CHANNELS.length })}
      index={1}
      className="md:col-span-6 lg:col-span-5"
      bodyClassName="gap-3"
    >
      <p className="text-[14px] leading-relaxed text-muted">{t("intro")}</p>
      <ul className="stagger flex flex-col gap-2">
        {CHANNELS.map((c) => {
          const Icon = c.icon;
          const name = t(`keys.${c.id}`);
          const href = c.kind === "email" ? `mailto:${c.value}` : c.url;
          const external = c.kind === "link" ? { target: "_blank", rel: "noopener noreferrer" } : {};
          return (
            <li key={c.id} className="tile flex gap-3.5 px-4 py-4">
              <span aria-hidden="true" className="grid h-10 w-10 shrink-0 place-items-center rounded-[4px] bg-accent-tint text-accent">
                <Icon size={18} />
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-2.5">
                <div className="min-w-0">
                  <p className="label">{name}</p>
                  <a href={href} {...external} className="contact-value display mt-1.5 block text-fg transition-colors hover:text-accent">
                    <Breakable value={c.value} />
                  </a>
                  <p className="mt-1.5 text-[12.5px] text-muted">{t(`comments.${c.id}`)}</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {c.kind === "email" ? (
                    <a
                      href={`mailto:${c.value}?subject=${encodeURIComponent(t(`subjects.${c.subject}`))}`}
                      className={buttonClass("tonal", "sm")}
                      aria-label={t("writeLabel", { email: c.value })}
                    >
                      <Mail size={14} aria-hidden="true" />
                      {t("write")}
                    </a>
                  ) : (
                    <ExternalButton href={c.url} variant="tonal" size="sm" aria-label={t("openLabel", { name: c.value })} showIcon>
                      {t("channels.join")}
                    </ExternalButton>
                  )}
                  <CopyButton value={c.kind === "email" ? c.value : c.url} label={c.kind === "email" ? name : t("channels.linkLabel")} />
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

/* ─── 3. Autres réseaux (terminal) ─── */

const SOCIAL_LINES: SocialId[] = ["discordEdits", "tiktok", "instagram", "instagramFps", "linktree"];

function Socials() {
  const t = useTranslations("contact");
  return (
    <Card
      id="socials"
      icon={SquareTerminal}
      title={t("links.title")}
      subtitle="cat ~/contact.txt"
      meta={t("links.meta", { count: SOCIAL_LINES.length })}
      index={2}
      className="md:col-span-6 lg:col-span-7"
    >
      <div className="terminal px-3 py-3 sm:px-4 sm:py-4">
        <p className="px-2 pb-2">
          <span className="prompt">yexo@homelab</span> <span className="text-dim">~ $</span>{" "}
          <span className="text-fg">cat contact.txt</span>
        </p>
        <ul className="stagger flex flex-col">
          {SOCIAL_LINES.map((id) => {
            const social = SOCIALS[id];
            return (
              <li
                key={id}
                className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 rounded-xl px-2 py-2.5 hover:bg-surface-2 sm:grid-cols-[130px_1fr_auto]"
              >
                <span className="key col-span-2 sm:col-span-1">{t(`keys.${id}`)}</span>
                <span className="min-w-0">
                  <span className="block truncate text-[13.5px] text-fg">{social.handle}</span>
                  <span className="block truncate text-[11.5px] text-dim"># {t(`comments.${id}`)}</span>
                </span>
                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonClass("tonal", "sm", "font-sans")}
                  aria-label={t("openLabel", { name: social.handle })}
                >
                  {t("open")}
                  <ExternalLink size={13} aria-hidden="true" className="opacity-70" />
                </a>
              </li>
            );
          })}
        </ul>
        <p className="px-2 pt-2">
          <span className="prompt">yexo@homelab</span> <span className="text-dim">~ $</span>{" "}
          <span aria-hidden="true" className="inline-block h-[1.05em] w-2 translate-y-[3px] bg-muted" />
        </p>
      </div>
    </Card>
  );
}

/* ─── 4. Qui contacter selon le sujet ─── */

function Routing() {
  const t = useTranslations("contact.routing");
  const items = [
    { id: "pro", icon: Briefcase },
    { id: "order", icon: ShoppingBag },
    { id: "collab", icon: Handshake },
  ] as const;
  return (
    <Card
      id="routing"
      icon={Route}
      title={t("title")}
      subtitle="grep -i sujet contact.txt"
      index={3}
      next="home"
      className="md:col-span-6 lg:col-span-5"
      bodyClassName="stagger gap-2"
    >
      {items.map(({ id, icon: Icon }) => (
        <div key={id} className="tile flex gap-3 px-4 py-3.5">
          <Icon size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-accent" />
          <div>
            <p className="text-sm font-semibold">{t(`${id}.title`)}</p>
            <p className="mt-1 text-[13px] leading-relaxed text-muted">{t(`${id}.text`)}</p>
          </div>
        </div>
      ))}
      <p className="mt-2 text-xs leading-relaxed text-dim">{t("tip")}</p>
    </Card>
  );
}
