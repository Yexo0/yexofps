// src/app/[locale]/profil/page.tsx — Profile
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link as IntlLink } from "@/i18n/navigation";
import { BackButton } from "@/components/layout/back-button";
import { Footer } from "@/components/layout/footer";
import { GlassPanel } from "@/components/shared/glass-panel";
import { PageRevealWrapper } from "@/components/profile/page-reveal-wrapper";
import { PARTNERS, SOCIAL_LINKS } from "@/lib/constants";
import { Link, Instagram, ExternalLink } from "lucide-react";
import { TikTokIcon } from "@/components/icons/tiktok";
import { DiscordIcon } from "@/components/icons/discord";

export default function ProfilPage() {
  const t = useTranslations("profile");

  return (
    <>
      <BackButton />
      <PageRevealWrapper>
        <main className="relative z-[2] min-h-screen flex flex-col items-center gap-5 px-[18px] pt-[60px] pb-[100px] max-w-[860px] mx-auto">
          {/* Avatar Card */}
          <GlassPanel className="w-full flex flex-col sm:flex-row items-center gap-5">
            <div className="avatar-wrapper w-[100px] h-[100px] shrink-0">
              <Image
                src="/images/IMG_4549.png"
                alt="Yexo avatar"
                width={100}
                height={100}
                className="w-full h-full object-cover bg-[#111]"
                priority
              />
            </div>
            <div className="text-center sm:text-left flex-1">
              <h2 className="gradient-text text-2xl font-extrabold">{t("name")}</h2>
              <div className="mt-1.5 h-[2px] w-10 bg-gradient-to-r from-purple-500/50 to-transparent rounded-full mx-auto sm:mx-0" />
              <p className="text-sm text-white/55 mt-2">{t("tagline")}</p>
            </div>
            <a
              href={SOCIAL_LINKS.linktree}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white hover:border-purple-500/30 transition-all shrink-0"
            >
              <Link className="w-4 h-4" />
            </a>
          </GlassPanel>

          {/* About */}
          <GlassPanel className="w-full">
            <h2 className="gradient-text-warm text-xl font-bold">{t("aboutTitle")}</h2>
            <div className="mt-1.5 mb-4 h-[2px] w-10 bg-gradient-to-r from-pink-500/50 to-transparent rounded-full" />
            <p className="text-white/65 leading-relaxed text-[0.95rem]">{t("aboutText")}</p>
          </GlassPanel>

          {/* Partners */}
          <GlassPanel className="w-full">
            <h2 className="gradient-text text-xl font-bold">{t("partnersTitle")}</h2>
            <div className="mt-1.5 mb-4 h-[2px] w-10 bg-gradient-to-r from-purple-500/50 to-transparent rounded-full" />
            <div className="flex flex-col gap-4">
              {PARTNERS.map((partner) => (
                <div key={partner.name} className="stat-card-premium flex items-center gap-4 !p-4">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-white text-sm">{partner.name}</h3>
                    <p className="text-xs text-white/50">
                      {t("partnerDiscount", { discount: partner.discount, code: partner.code })}
                    </p>
                  </div>
                  <a
                    href={partner.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-premium !py-2 !px-4 !text-xs"
                  >
                    {t("partnerAccess")}
                  </a>
                </div>
              ))}
            </div>
          </GlassPanel>

          {/* Social Media */}
          <GlassPanel className="w-full">
            <h2 className="gradient-text text-xl font-bold">{t("socialsTitle")}</h2>
            <div className="mt-1.5 mb-4 h-[2px] w-10 bg-gradient-to-r from-blue-500/50 to-transparent rounded-full" />
            <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
              <a
                href={SOCIAL_LINKS.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost-premium"
              >
                <TikTokIcon className="w-4 h-4" /> TikTok
              </a>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost-premium"
              >
                <Instagram className="w-4 h-4" /> Instagram
              </a>
              <a
                href={SOCIAL_LINKS.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost-premium"
              >
                <DiscordIcon className="w-4 h-4" /> Discord
              </a>
              <a
                href={SOCIAL_LINKS.discordEdits}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost-premium"
              >
                <DiscordIcon className="w-4 h-4" /> Discord Edits
              </a>
              <a
                href={SOCIAL_LINKS.linktree}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost-premium"
              >
                <Link className="w-4 h-4" /> {t("others")}
              </a>
            </div>
          </GlassPanel>

          <Footer />
        </main>
      </PageRevealWrapper>
    </>
  );
}
