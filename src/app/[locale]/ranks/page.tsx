// src/app/[locale]/ranks/page.tsx — Ranks
import Image from "next/image";
import { useTranslations } from "next-intl";
import { BackButton } from "@/components/layout/back-button";
import { GlassPanel } from "@/components/shared/glass-panel";
import { RanksReveal } from "@/components/ranks/ranks-reveal";
import { RANKS, SETUP, SOCIAL_LINKS } from "@/lib/constants";
import { Link } from "lucide-react";
import { TikTokIcon } from "@/components/icons/tiktok";
import { DiscordIcon } from "@/components/icons/discord";
import { Orbitron } from "next/font/google";

const orbitron = Orbitron({ subsets: ["latin"], weight: ["700", "900"] });

const GAME_COLORS: Record<string, { accent: string; glow: string; dot: string }> = {
  Valorant: {
    accent: "rgba(255, 70, 85, 0.5)",
    glow: "0 0 20px rgba(255, 70, 85, 0.15), 0 0 50px rgba(255, 70, 85, 0.06)",
    dot: "bg-red-400/60",
  },
  "Faceit (CS:GO)": {
    accent: "rgba(255, 85, 0, 0.5)",
    glow: "0 0 20px rgba(255, 85, 0, 0.15), 0 0 50px rgba(255, 85, 0, 0.06)",
    dot: "bg-orange-400/60",
  },
  "Apex Legends": {
    accent: "rgba(34, 211, 238, 0.5)",
    glow: "0 0 20px rgba(34, 211, 238, 0.15), 0 0 50px rgba(34, 211, 238, 0.06)",
    dot: "bg-cyan-400/60",
  },
  "Clash Royale": {
    accent: "rgba(255, 215, 0, 0.5)",
    glow: "0 0 20px rgba(255, 215, 0, 0.15), 0 0 50px rgba(255, 215, 0, 0.06)",
    dot: "bg-amber-400/60",
  },
};

export default function RanksPage() {
  const t = useTranslations("ranks");

  return (
    <>
      <BackButton />
      <RanksReveal>
        <main className="relative z-[2] min-h-screen flex flex-col items-center gap-5 px-[18px] pt-[60px] pb-[100px] max-w-[1120px] mx-auto">
          {/* Header */}
          <div className="w-full section-item">
            <GlassPanel className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              <div className="flex items-center gap-4 flex-1">
                <div className="avatar-wrapper w-[72px] h-[72px] shrink-0">
                  <Image
                    src="/images/IMG_4549.png"
                    alt="Yexo avatar"
                    width={72}
                    height={72}
                    className="w-full h-full object-cover bg-[#111]"
                  />
                </div>
                <div>
                  <h1 className={`${orbitron.className} hero-title text-[1.5rem] sm:text-[1.7rem] font-black tracking-[0.06em]`}>
                    {t("name")}
                  </h1>
                  <div className="flex items-center gap-2 mt-1 text-sm text-white/55">
                    <Image src="/images/france.png" alt="France" width={18} height={13} className="rounded-sm" />
                    <span>France</span>
                  </div>
                  <p className="text-sm text-white/45 mt-1">{t("tagline")}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a href={SOCIAL_LINKS.discord} target="_blank" rel="noopener noreferrer"
                  className="social-chip social-chip-discord" title="Discord">
                  <DiscordIcon className="w-4 h-4" />
                </a>
                <a href={SOCIAL_LINKS.discordEdits} target="_blank" rel="noopener noreferrer"
                  className="social-chip social-chip-discord" title="Discord Edits">
                  <DiscordIcon className="w-4 h-4" />
                </a>
                <a href={SOCIAL_LINKS.tiktok} target="_blank" rel="noopener noreferrer"
                  className="social-chip social-chip-tiktok">
                  <TikTokIcon className="w-4 h-4" />
                </a>
                <a href={SOCIAL_LINKS.linktree} target="_blank" rel="noopener noreferrer"
                  className="social-chip social-chip-linktree">
                  <Link className="w-4 h-4" />
                </a>
              </div>
            </GlassPanel>
          </div>

          {/* Ranks */}
          <div className="w-full section-item">
            <GlassPanel>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold tracking-wide text-white">{t("ranksTitle")}</h2>
                  <div className="mt-1.5 h-[2px] w-12 rounded-full animated-line" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {RANKS.map((rank, i) => {
                  const colors = GAME_COLORS[rank.game] ?? GAME_COLORS.Valorant;
                  return (
                    <article
                      key={rank.game}
                      className="rank-card stat-card-premium text-center group"
                      style={{
                        "--stat-accent": colors.accent,
                        "--rank-glow": colors.glow,
                        "--float-delay": `${i * 0.4}s`,
                      } as React.CSSProperties}
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <span className={`rank-dot w-2 h-2 rounded-full ${colors.dot}`} />
                        <span className="text-sm font-semibold text-white/70">{rank.game}</span>
                      </div>
                      <div className="flex justify-center mb-4">
                        <Image
                          src={rank.image}
                          alt={rank.rank}
                          width={80}
                          height={80}
                          className="rank-image object-contain"
                        />
                      </div>
                      <span className="rank-name text-sm font-bold tracking-wide">{rank.rank}</span>
                    </article>
                  );
                })}
              </div>
            </GlassPanel>
          </div>

          {/* Setup */}
          <div className="w-full section-item">
            <GlassPanel>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold tracking-wide text-white">{t("setupTitle")}</h2>
                  <div className="mt-1.5 h-[2px] w-12 rounded-full animated-line-blue" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {SETUP.map((item, i) => (
                  <article
                    key={item.name}
                    className="setup-card stat-card-premium flex items-center gap-4 !p-4"
                    style={{
                      "--stat-accent": "rgba(96, 165, 250, 0.5)",
                    } as React.CSSProperties}
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-lg object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                    <div>
                      <strong className="text-sm text-white">{t(item.categoryKey)}</strong>
                      <span className="block text-xs text-white/50">{item.name}</span>
                    </div>
                  </article>
                ))}
              </div>
            </GlassPanel>
          </div>

        </main>
      </RanksReveal>
    </>
  );
}
