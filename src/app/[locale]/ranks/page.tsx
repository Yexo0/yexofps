// src/app/[locale]/ranks/page.tsx — Ranks
import Image from "next/image";
import { useTranslations } from "next-intl";
import { BackButton } from "@/components/layout/back-button";
import { Footer } from "@/components/layout/footer";
import { PageHeader } from "@/components/shared/page-header";
import { GlassPanel } from "@/components/shared/glass-panel";
import { SectionTitle } from "@/components/shared/section-title";
import { RanksReveal } from "@/components/ranks/ranks-reveal";
import { RANKS, SETUP, SOCIAL_LINKS } from "@/lib/constants";
import { Link } from "lucide-react";
import { TikTokIcon } from "@/components/icons/tiktok";
import { DiscordIcon } from "@/components/icons/discord";

export default function RanksPage() {
  const t = useTranslations("ranks");

  const socialChips = (
    <>
      <a href={SOCIAL_LINKS.discord} target="_blank" rel="noopener noreferrer"
        className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white hover:border-purple-500/30 transition-all"
        title="Discord">
        <DiscordIcon className="w-4 h-4" />
      </a>
      <a href={SOCIAL_LINKS.discordEdits} target="_blank" rel="noopener noreferrer"
        className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white hover:border-purple-500/30 transition-all"
        title="Discord Edits">
        <DiscordIcon className="w-4 h-4" />
      </a>
      <a href={SOCIAL_LINKS.tiktok} target="_blank" rel="noopener noreferrer"
        className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white hover:border-purple-500/30 transition-all">
        <TikTokIcon className="w-4 h-4" />
      </a>
      <a href={SOCIAL_LINKS.linktree} target="_blank" rel="noopener noreferrer"
        className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white hover:border-purple-500/30 transition-all">
        <Link className="w-4 h-4" />
      </a>
    </>
  );

  return (
    <>
      <BackButton />
      <RanksReveal>
        <main className="relative z-[2] min-h-screen flex flex-col items-center gap-5 px-[18px] pt-[60px] pb-[100px] max-w-[1120px] mx-auto">
          {/* Header */}
          <div className="w-full section-item">
            <PageHeader name={t("name")} tagline={t("tagline")} actions={socialChips} />
          </div>

          {/* Ranks */}
          <div className="w-full section-item">
            <GlassPanel>
              <SectionTitle title={t("ranksTitle")} />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {RANKS.map((rank) => (
                  <article key={rank.game} className="stat-card-premium text-center group" style={{ "--stat-accent": "rgba(167, 139, 250, 0.5)" } as React.CSSProperties}>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="w-2 h-2 rounded-full bg-purple-400/50" />
                      <span className="text-sm font-semibold text-white/70">{rank.game}</span>
                    </div>
                    <div className="flex justify-center mb-4">
                      <Image src={rank.image} alt={rank.rank} width={80} height={80} className="object-contain group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <span className="text-sm font-bold text-white tracking-wide">{rank.rank}</span>
                  </article>
                ))}
              </div>
            </GlassPanel>
          </div>

          {/* Setup */}
          <div className="w-full section-item">
            <GlassPanel>
              <SectionTitle title={t("setupTitle")} />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {SETUP.map((item) => (
                  <article key={item.name} className="stat-card-premium flex items-center gap-4 !p-4" style={{ "--stat-accent": "rgba(96, 165, 250, 0.5)" } as React.CSSProperties}>
                    <Image src={item.image} alt={item.name} width={48} height={48} className="w-12 h-12 rounded-lg object-contain" />
                    <div>
                      <strong className="text-sm text-white">{t(item.categoryKey)}</strong>
                      <span className="block text-xs text-white/50">{item.name}</span>
                    </div>
                  </article>
                ))}
              </div>
            </GlassPanel>
          </div>

          <Footer />
        </main>
      </RanksReveal>
    </>
  );
}
