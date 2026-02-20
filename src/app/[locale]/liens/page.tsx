// src/app/[locale]/liens/page.tsx — Links (Premium v2)
"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { BackButton } from "@/components/layout/back-button";
import { useCopyClipboard } from "@/hooks/use-copy-clipboard";
import { SOCIAL_LINKS, EMAILS } from "@/lib/constants";
import { ExternalLink, Mail, Briefcase, Send, Copy, Check, Sparkles } from "lucide-react";
import { TikTokIcon } from "@/components/icons/tiktok";
import { DiscordIcon } from "@/components/icons/discord";
import { Instagram } from "lucide-react";
import { useEffect, type ComponentType } from "react";
import { Orbitron } from "next/font/google";

const orbitron = Orbitron({ subsets: ["latin"], weight: ["700", "900"] });

interface LinkItem {
  icon: ComponentType<{ className?: string }>;
  label: string;
  sub: string;
  href: string;
  platform: string;
}

const LinktreeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M7.533 0A3.54 3.54 0 004 3.533V20.46A3.54 3.54 0 007.533 24h8.934A3.54 3.54 0 0020 20.467V3.533A3.54 3.54 0 0016.467 0H7.533zm4.462 3.6a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4zm0 4.8c2.267 0 4.8 1.867 4.8 4.8 0 2.933-2.533 4.8-4.8 4.8s-4.8-1.867-4.8-4.8c0-2.933 2.533-4.8 4.8-4.8zm0 2.4c-1.333 0-2.4 1.067-2.4 2.4s1.067 2.4 2.4 2.4 2.4-1.067 2.4-2.4-1.067-2.4-2.4-2.4z"/>
  </svg>
);

const SOCIAL_ITEMS: LinkItem[] = [
  { icon: TikTokIcon, label: "TikTok", sub: "@yexofps", href: SOCIAL_LINKS.tiktok, platform: "tiktok" },
  { icon: Instagram, label: "Instagram", sub: "@yexo0", href: SOCIAL_LINKS.instagram, platform: "instagram" },
  { icon: Instagram, label: "Instagram FPS", sub: "@yexofps", href: SOCIAL_LINKS.instagramFps, platform: "instagram" },
  { icon: LinktreeIcon, label: "Linktree", sub: "linktr.ee/yexo0", href: SOCIAL_LINKS.linktree, platform: "linktree" },
];

const DISCORD_ITEMS: LinkItem[] = [
  { icon: DiscordIcon, label: "Discord", sub: "joinServer", href: SOCIAL_LINKS.discord, platform: "discord" },
  { icon: DiscordIcon, label: "Discord Edits", sub: "editingServices", href: SOCIAL_LINKS.discordEdits, platform: "discord" },
];

export default function LiensPage() {
  const t = useTranslations("links");
  const { copied, copy } = useCopyClipboard();

  /* Staggered reveal */
  useEffect(() => {
    const cards = document.querySelectorAll(".lk-reveal");
    cards.forEach((card, i) => {
      const el = card as HTMLElement;
      el.style.opacity = "0";
      el.style.transform = "translateY(28px) scale(0.96)";
      setTimeout(() => {
        el.style.transition = "opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1), transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)";
        el.style.opacity = "1";
        el.style.transform = "translateY(0) scale(1)";
      }, 150 + i * 90);
    });
  }, []);

  return (
    <>
      <BackButton />
      <main className="relative z-[2] min-h-screen flex flex-col items-center px-[18px] pt-[60px] pb-[100px] max-w-[820px] mx-auto">

        {/* ── Hero ── */}
        <div className="lk-reveal flex flex-col items-center gap-4 mb-12">
          <div className="relative">
            <div className="avatar-wrapper w-[110px] h-[110px]">
              <Image src="/images/IMG_4549.png" alt="Yexo" width={110} height={110} className="w-full h-full object-cover" />
            </div>
            <span className="absolute bottom-1.5 right-1.5 w-4 h-4 rounded-full bg-emerald-400 border-[3px] border-[#0b0b0c] link-online-dot" />
          </div>
          <div className="text-center">
            <h1 className={`${orbitron.className} hero-title text-[2.2rem] sm:text-[2.8rem] font-black tracking-[0.06em]`}>
              YEXO
            </h1>
            <p className="text-white/45 text-sm mt-2 flex items-center justify-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-purple-400/70" />
              {t("subtitle")}
              <Sparkles className="w-3.5 h-3.5 text-blue-400/70" />
            </p>
            <div className="mt-3 h-[2px] w-16 mx-auto rounded-full animated-line" />
          </div>
        </div>

        {/* ── Social ── */}
        <section className="w-full mb-8">
          <h2 className="lk-reveal lk-section-label">{t("socialsTitle")}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {SOCIAL_ITEMS.map((item, i) => {
              const Icon = item.icon;
              return (
                <a
                  key={i}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`lk-reveal lk-big-card lk-big-${item.platform}`}
                >
                  <div className="lk-big-icon-ring">
                    <Icon className="w-7 h-7" />
                  </div>
                  <strong className="lk-big-name">{item.label}</strong>
                  <span className="lk-big-sub">{item.sub}</span>
                  <span className="lk-big-go">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </span>
                </a>
              );
            })}
          </div>
        </section>

        {/* ── Discord ── */}
        <section className="w-full mb-8">
          <h2 className="lk-reveal lk-section-label">{t("discordTitle")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {DISCORD_ITEMS.map((item, i) => {
              const Icon = item.icon;
              return (
                <a
                  key={i}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`lk-reveal lk-wide-card lk-wide-${item.platform}`}
                >
                  <div className="lk-wide-icon">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <strong className="lk-wide-name">{item.label}</strong>
                    <span className="lk-wide-sub">{t(item.sub)}</span>
                  </div>
                  <ExternalLink className="lk-wide-arrow" />
                </a>
              );
            })}
          </div>
        </section>

        {/* ── Contact ── */}
        <section className="w-full mb-8">
          <h2 className="lk-reveal lk-section-label">{t("contactTitle")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

            {/* Pro email */}
            <div className="lk-reveal lk-wide-card lk-wide-email">
              <div className="lk-wide-icon">
                <Mail className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <strong className="lk-wide-name">{t("emailPro")}</strong>
                <span className="lk-wide-sub truncate block">{EMAILS.pro}</span>
              </div>
              <button onClick={() => copy(EMAILS.pro)} className="lk-copy-btn">
                {copied === EMAILS.pro
                  ? <Check className="w-4 h-4 text-emerald-400" />
                  : <Copy className="w-4 h-4" />
                }
              </button>
            </div>

            {/* Business email */}
            <div className="lk-reveal lk-wide-card lk-wide-business">
              <div className="lk-wide-icon">
                <Briefcase className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <strong className="lk-wide-name">{t("emailBusiness")}</strong>
                <span className="lk-wide-sub truncate block">{EMAILS.business}</span>
              </div>
              <button onClick={() => copy(EMAILS.business)} className="lk-copy-btn">
                {copied === EMAILS.business
                  ? <Check className="w-4 h-4 text-emerald-400" />
                  : <Copy className="w-4 h-4" />
                }
              </button>
            </div>

            {/* Send mail pro */}
            <a href={`mailto:${EMAILS.pro}`} className="lk-reveal lk-wide-card lk-wide-email">
              <div className="lk-wide-icon">
                <Send className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <strong className="lk-wide-name">{t("sendMail")}</strong>
                <span className="lk-wide-sub">{t("openMail")}</span>
              </div>
              <ExternalLink className="lk-wide-arrow" />
            </a>

            {/* Send mail biz */}
            <a href={`mailto:${EMAILS.business}`} className="lk-reveal lk-wide-card lk-wide-business">
              <div className="lk-wide-icon">
                <Send className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <strong className="lk-wide-name">{t("sendMailBiz")}</strong>
                <span className="lk-wide-sub">{t("openMail")}</span>
              </div>
              <ExternalLink className="lk-wide-arrow" />
            </a>
          </div>
          <p className="lk-reveal text-[11px] text-white/25 text-center mt-4">{t("copyHint")}</p>
        </section>

      </main>
    </>
  );
}
