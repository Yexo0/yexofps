// src/app/[locale]/profil/page.tsx — Profile
import Image from "next/image";
import { useTranslations } from "next-intl";
import { BackButton } from "@/components/layout/back-button";
import { GlassPanel } from "@/components/shared/glass-panel";
import { PARTNERS, SOCIAL_LINKS } from "@/lib/constants";
import { Link as LinkIcon, Instagram, ExternalLink, MapPin, Gamepad2, Video, Calendar } from "lucide-react";
import { TikTokIcon } from "@/components/icons/tiktok";
import { DiscordIcon } from "@/components/icons/discord";
import { Orbitron } from "next/font/google";
import type { CSSProperties } from "react";

const orbitron = Orbitron({ subsets: ["latin"], weight: ["700", "900"] });

type DelayStyle = CSSProperties & { "--pr-delay": string };

const d = (ms: number): DelayStyle => ({ "--pr-delay": `${ms}ms` });

export default function ProfilPage() {
  const t = useTranslations("profile");

  return (
    <>
      <BackButton />
      <main className="relative z-[2] flex flex-col items-center px-[18px] pt-[52px] pb-8 max-w-[860px] mx-auto">

        {/* ══════════ HERO ══════════ */}
        <section className="profile-hero w-full flex flex-col items-center text-center gap-5 pt-10 pb-8 relative">
          {/* Ambient glow */}
          <div className="profile-hero-glow" />
          <div className="profile-hero-glow profile-hero-glow--2" />

          {/* Avatar */}
          <div className="pr-item" style={d(0)}>
            <div className="avatar-wrapper w-[130px] h-[130px]">
              <Image
                src="/images/IMG_4549.png"
                alt="Yexo avatar"
                width={130}
                height={130}
                className="w-full h-full object-cover bg-[#111]"
                priority
              />
            </div>
          </div>

          {/* Name */}
          <div className="pr-item flex flex-col items-center gap-2" style={d(110)}>
            <h1 className={`${orbitron.className} hero-title text-[2.6rem] sm:text-[3.2rem] font-black tracking-[0.08em] leading-none`}>
              YEXO
            </h1>
            <p className="text-white/40 text-[0.72rem] font-semibold uppercase tracking-[0.3em]">
              {t("tagline")}
            </p>
          </div>

          {/* Social buttons */}
          <div className="pr-item flex flex-wrap gap-3 justify-center mt-1" style={d(220)}>
            <a href={SOCIAL_LINKS.tiktok} target="_blank" rel="noopener noreferrer"
              className="profile-social-btn profile-social-btn--tiktok">
              <TikTokIcon className="w-[18px] h-[18px]" />
              <span>TikTok</span>
            </a>
            <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer"
              className="profile-social-btn profile-social-btn--instagram">
              <Instagram className="w-[18px] h-[18px]" />
              <span>Instagram</span>
            </a>
            <a href={SOCIAL_LINKS.discord} target="_blank" rel="noopener noreferrer"
              className="profile-social-btn profile-social-btn--discord">
              <DiscordIcon className="w-[18px] h-[18px]" />
              <span>Discord</span>
            </a>
            <a href={SOCIAL_LINKS.discordEdits} target="_blank" rel="noopener noreferrer"
              className="profile-social-btn profile-social-btn--discord">
              <DiscordIcon className="w-[18px] h-[18px]" />
              <span>Discord Edits</span>
            </a>
            <a href={SOCIAL_LINKS.linktree} target="_blank" rel="noopener noreferrer"
              className="profile-social-btn profile-social-btn--green">
              <LinkIcon className="w-[18px] h-[18px]" />
              <span>{t("others")}</span>
            </a>
          </div>
        </section>

        {/* ══════════ ABOUT ══════════ */}
        <div className="pr-item w-full mt-2" style={d(480)}>
          <GlassPanel className="w-full profile-about-panel">
            <div className="flex items-center gap-3 mb-5">
              <h2 className="gradient-text-warm text-xl font-bold">{t("aboutTitle")}</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-pink-500/20 to-transparent" />
            </div>

            <div className="grid sm:grid-cols-[1fr_160px] gap-6 items-stretch">
              {/* Quote text + tags */}
              <div className="flex flex-col h-full">
                <div className="relative pl-5 border-l-2 border-purple-500/25">
                  <span className="profile-quote-mark">&ldquo;</span>
                  <p className="text-white/65 leading-[1.85] text-[0.95rem]">
                    {t("aboutText")}
                  </p>
                  <span className="profile-quote-mark profile-quote-mark--close">&rdquo;</span>
                </div>
                <div className="mt-auto mb-auto pt-4 flex flex-wrap gap-2.5">
                  <span className="profile-tag profile-tag--purple profile-tag--lg">
                    <Gamepad2 className="w-3.5 h-3.5" /> {t("tagRadiant")}
                  </span>
                  <span className="profile-tag profile-tag--pink profile-tag--lg">
                    <Video className="w-3.5 h-3.5" /> {t("tagEditor")}
                  </span>
                  <span className="profile-tag profile-tag--blue profile-tag--lg">
                    <Calendar className="w-3.5 h-3.5" /> {t("tagAge")}
                  </span>
                  <span className="profile-tag profile-tag--green profile-tag--lg">
                    <MapPin className="w-3.5 h-3.5" /> {t("tagLocation")}
                  </span>
                </div>
              </div>

              {/* Mini timeline */}
              <div className="profile-timeline">
                {(
                  [
                    { yearKey: "tl1year", labelKey: "tl1label", icon: Gamepad2, imgSrc: null,                    color: "purple" },
                    { yearKey: "tl2year", labelKey: "tl2label", icon: Video,    imgSrc: null,                    color: "pink"   },
                    { yearKey: "tl3year", labelKey: "tl3label", icon: null,     imgSrc: "/images/immortal.png",  color: "blue"   },
                    { yearKey: "tl4year", labelKey: "tl4label", icon: null,     imgSrc: "/images/radiant.png",   color: "purple" },
                    { yearKey: "tl5year", labelKey: "tl5label", icon: Calendar, imgSrc: null,                    color: "green"  },
                  ]
                ).map(({ yearKey, labelKey, icon: Icon, imgSrc, color }, i) => (
                  <div
                    key={yearKey}
                    className={`profile-tl-entry profile-tl-entry--${color}`}
                    style={{ "--tl-i": i } as React.CSSProperties}
                  >
                    {/* Dot + line */}
                    <div className="profile-tl-dot-col">
                      <div className="profile-tl-dot" />
                      {i < 4 && <div className="profile-tl-line" />}
                    </div>
                    {/* Content */}
                    <div className="profile-tl-content">
                      <span className="profile-tl-year">
                        {t(yearKey as Parameters<typeof t>[0])}
                      </span>
                      <span className="profile-tl-label">
                        {imgSrc ? (
                          <Image src={imgSrc} alt="" width={14} height={14} className="w-3.5 h-3.5 object-contain shrink-0 opacity-90" />
                        ) : Icon ? (
                          <Icon className="w-3 h-3 shrink-0 opacity-70" />
                        ) : null}
                        {t(labelKey as Parameters<typeof t>[0])}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </GlassPanel>
        </div>

        {/* ══════════ PARTNERS ══════════ */}
        <div className="pr-item w-full mt-4" style={d(580)}>
          <GlassPanel className="w-full">
            <div className="flex items-center gap-3 mb-5">
              <h2 className="gradient-text text-xl font-bold">{t("partnersTitle")}</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-purple-500/20 to-transparent" />
            </div>

            <div className="flex flex-col gap-3">
              {PARTNERS.map((partner) => (
                <div key={partner.name} className="profile-partner-card">
                  {/* Shimmer overlay */}
                  <div className="profile-partner-shimmer" />

                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    width={56}
                    height={56}
                    className="w-14 h-14 rounded-xl object-cover ring-1 ring-white/10 shrink-0 relative z-[1]"
                  />

                  <div className="flex-1 min-w-0 relative z-[1]">
                    <h3 className="font-bold text-white text-[0.95rem]">{partner.name}</h3>
                    <p className="text-xs text-white/40 mt-1">
                      {t("partnerDiscount", { discount: partner.discount, code: partner.code })}
                    </p>
                    <span className="profile-code-badge">{partner.code}</span>
                  </div>

                  <a
                    href={partner.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="profile-partner-btn relative z-[1]"
                  >
                    {t("partnerAccess")}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>
          </GlassPanel>
        </div>

      </main>
    </>
  );
}
