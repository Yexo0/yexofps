// src/app/[locale]/contact/page.tsx — 07 Contact : tous les liens dans une carte façon "cat contact.txt".
import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Briefcase, ExternalLink, Handshake, Mail, ShoppingBag, SquareTerminal, Route } from "lucide-react";
import { EMAILS, SOCIALS, type SocialId } from "@/config/site";
import { pageMetadata } from "@/lib/metadata";
import { Card } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import { buttonClass } from "@/components/ui/primitives";
import { NowBanner } from "@/components/now/now-chip";

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
      <ContactFile />
      <Routing />
    </div>
  );
}

type Line =
  | { id: "proEmail" | "businessEmail"; kind: "email"; value: string; subject: "pro" | "business" }
  | { id: SocialId; kind: "link"; value: string; url: string };

const LINES: Line[] = [
  { id: "proEmail", kind: "email", value: EMAILS.pro, subject: "pro" },
  { id: "businessEmail", kind: "email", value: EMAILS.business, subject: "business" },
  { id: "discord", kind: "link", value: SOCIALS.discord.handle, url: SOCIALS.discord.url },
  { id: "discordEdits", kind: "link", value: SOCIALS.discordEdits.handle, url: SOCIALS.discordEdits.url },
  { id: "tiktok", kind: "link", value: SOCIALS.tiktok.handle, url: SOCIALS.tiktok.url },
  { id: "instagram", kind: "link", value: SOCIALS.instagram.handle, url: SOCIALS.instagram.url },
  { id: "instagramFps", kind: "link", value: SOCIALS.instagramFps.handle, url: SOCIALS.instagramFps.url },
  { id: "linktree", kind: "link", value: SOCIALS.linktree.handle, url: SOCIALS.linktree.url },
];

function ContactFile() {
  const t = useTranslations("contact");
  return (
    <Card
      id="contact"
      icon={SquareTerminal}
      title={t("title")}
      subtitle="cat ~/contact.txt"
      meta={t("meta", { count: LINES.length })}
      headingLevel={1}
      index={0}
      className="md:col-span-6 lg:col-span-8"
      bodyClassName="gap-4"
    >
      <p className="max-w-[70ch] text-[15px] leading-relaxed text-muted">{t("intro")}</p>
      <NowBanner />
      <div className="terminal px-3 py-3 sm:px-4 sm:py-4">
        <p className="px-2 pb-2">
          <span className="prompt">yexo@homelab</span> <span className="text-dim">~ $</span>{" "}
          <span className="text-fg">cat contact.txt</span>
        </p>
        <ul className="stagger flex flex-col">
          {LINES.map((line) => {
            const name = t(`keys.${line.id}`);
            return (
              <li
                key={line.id}
                className="grid grid-cols-1 items-center gap-x-4 gap-y-1.5 rounded-xl px-2 py-2.5 hover:bg-surface-2 sm:grid-cols-[150px_1fr_auto]"
              >
                <span className="key">{name}</span>
                <span className="min-w-0">
                  <span className="block truncate text-[13.5px] text-fg">{line.value}</span>
                  <span className="block truncate text-[11.5px] text-dim"># {t(`comments.${line.id}`)}</span>
                </span>
                <span className="flex gap-1.5 font-sans">
                  {line.kind === "email" ? (
                    <>
                      <CopyButton value={line.value} label={name} />
                      <a
                        href={`mailto:${line.value}?subject=${encodeURIComponent(t(`subjects.${line.subject}`))}`}
                        className={buttonClass("tonal", "sm")}
                        aria-label={t("writeLabel", { email: line.value })}
                      >
                        <Mail size={14} aria-hidden="true" />
                        {t("write")}
                      </a>
                    </>
                  ) : (
                    <a
                      href={line.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={buttonClass("tonal", "sm")}
                      aria-label={t("openLabel", { name: line.value })}
                    >
                      {t("open")}
                      <ExternalLink size={13} aria-hidden="true" className="opacity-70" />
                    </a>
                  )}
                </span>
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
      index={1}
      next="home"
      className="md:col-span-6 lg:col-span-4"
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
