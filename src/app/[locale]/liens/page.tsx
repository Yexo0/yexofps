// src/app/[locale]/liens/page.tsx — Links
"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { BackButton } from "@/components/layout/back-button";
import { Footer } from "@/components/layout/footer";
import { SectionTitle } from "@/components/shared/section-title";
import { useCopyClipboard } from "@/hooks/use-copy-clipboard";
import { SOCIAL_LINKS, EMAILS } from "@/lib/constants";
import { Link, ExternalLink, Mail, Briefcase, Send, Copy, Check } from "lucide-react";
import { TikTokIcon } from "@/components/icons/tiktok";
import { DiscordIcon } from "@/components/icons/discord";
import { Instagram } from "lucide-react";
import { useEffect } from "react";

const SOCIAL_ITEMS = [
  { icon: TikTokIcon, label: "TikTok", sub: "@yexofps", href: SOCIAL_LINKS.tiktok },
  { icon: Instagram, label: "Instagram", sub: "@yexo0", href: SOCIAL_LINKS.instagram },
  { icon: Instagram, label: "Instagram", sub: "@yexofps", href: SOCIAL_LINKS.instagramFps },
  { icon: Link, label: "Linktree", sub: "linktr.ee/yexo0", href: SOCIAL_LINKS.linktree },
];

const DISCORD_ITEMS = [
  { label: "Discord", sub: "joinServer", href: SOCIAL_LINKS.discord },
  { label: "Discord Edits", sub: "editingServices", href: SOCIAL_LINKS.discordEdits },
];

export default function LiensPage() {
  const t = useTranslations("links");
  const { copied, copy } = useCopyClipboard();

  useEffect(() => {
    const sections = document.querySelectorAll(".links-section");
    sections.forEach((sec, i) => {
      (sec as HTMLElement).style.opacity = "0";
      (sec as HTMLElement).style.transform = "translateY(22px)";
      setTimeout(() => {
        (sec as HTMLElement).style.transition = "opacity 0.7s ease, transform 0.7s ease";
        (sec as HTMLElement).style.opacity = "1";
        (sec as HTMLElement).style.transform = "translateY(0)";
      }, 160 + i * 170);
    });
  }, []);

  return (
    <>
      <BackButton />
      <main className="relative z-[2] min-h-screen flex flex-col items-center px-[18px] pt-[60px] pb-[100px] max-w-[700px] mx-auto">
        {/* Hero */}
        <div className="links-section flex flex-col items-center gap-4 mb-8">
          <div className="avatar-wrapper w-[90px] h-[90px]">
            <Image src="/images/IMG_4549.png" alt="Yexo" width={90} height={90} className="w-full h-full object-cover" />
          </div>
          <div className="text-center">
            <h1 className="gradient-text text-3xl font-extrabold">{t("title")}</h1>
            <p className="text-white/50 text-sm mt-1">{t("subtitle")}</p>
          </div>
        </div>

        {/* Social Media */}
        <section className="links-section w-full mb-6">
          <SectionTitle title={t("socialsTitle")} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SOCIAL_ITEMS.map((item, i) => {
              const Icon = item.icon;
              return (
                <a
                  key={i}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-card-premium glass-panel !p-4 flex items-center gap-4 no-underline"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white/60 shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <strong className="text-sm text-white block">{item.label}</strong>
                    <span className="text-xs text-white/45">{item.sub}</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-white/30 shrink-0" />
                </a>
              );
            })}
          </div>
        </section>

        {/* Discord */}
        <section className="links-section w-full mb-6">
          <SectionTitle title={t("discordTitle")} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {DISCORD_ITEMS.map((item, i) => (
              <a
                key={i}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="link-card-premium glass-panel !p-4 flex items-center gap-4 no-underline"
              >
                <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white/60 shrink-0">
                  <DiscordIcon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <strong className="text-sm text-white block">{item.label}</strong>
                  <span className="text-xs text-white/45">{t(item.sub)}</span>
                </div>
                <ExternalLink className="w-4 h-4 text-white/30 shrink-0" />
              </a>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section className="links-section w-full mb-6">
          <SectionTitle title={t("contactTitle")} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Pro email */}
            <div className="glass-panel !p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white/60 shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <strong className="text-sm text-white block">{t("emailPro")}</strong>
                <span className="text-xs text-white/45 truncate block">{EMAILS.pro}</span>
              </div>
              <button
                onClick={() => copy(EMAILS.pro)}
                className="w-9 h-9 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white/50 hover:bg-white/10 hover:border-purple-500/30 transition-all shrink-0 cursor-pointer"
              >
                {copied === EMAILS.pro ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Business email */}
            <div className="glass-panel !p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white/60 shrink-0">
                <Briefcase className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <strong className="text-sm text-white block">{t("emailBusiness")}</strong>
                <span className="text-xs text-white/45 truncate block">{EMAILS.business}</span>
              </div>
              <button
                onClick={() => copy(EMAILS.business)}
                className="w-9 h-9 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white/50 hover:bg-white/10 hover:border-purple-500/30 transition-all shrink-0 cursor-pointer"
              >
                {copied === EMAILS.business ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Send mail */}
            <a
              href={`mailto:${EMAILS.pro}`}
              className="link-card-premium glass-panel !p-4 flex items-center gap-4 no-underline"
            >
              <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white/60 shrink-0">
                <Send className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <strong className="text-sm text-white block">{t("sendMail")}</strong>
                <span className="text-xs text-white/45">{t("openMail")}</span>
              </div>
              <ExternalLink className="w-4 h-4 text-white/30 shrink-0" />
            </a>

            {/* Send mail business */}
            <a
              href={`mailto:${EMAILS.business}`}
              className="link-card-premium glass-panel !p-4 flex items-center gap-4 no-underline"
            >
              <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white/60 shrink-0">
                <Send className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <strong className="text-sm text-white block">{t("sendMailBiz")}</strong>
                <span className="text-xs text-white/45">{t("openMail")}</span>
              </div>
              <ExternalLink className="w-4 h-4 text-white/30 shrink-0" />
            </a>
          </div>
          <p className="text-xs text-white/35 mt-3 text-center">{t("copyHint")}</p>
        </section>

        <Footer />
      </main>
    </>
  );
}
