// src/components/gaming/rank-grid.tsx — Rangs de l'espace Gaming, du plus important au moins important :
// le rang actuel en très grand, le peak (avec le gun buddy Radiant qui se balance), puis les autres jeux.
// Le peak Radiant reste aux côtés des autres rangs (règle de ton du site). Chaque tuile de jeu porte
// un liseré fin de la couleur du jeu.
import Image from "next/image";
import type { CSSProperties } from "react";
import { useTranslations } from "next-intl";
import { RANKS, VALORANT_PEAK } from "@/config/site";
import { CountUp } from "@/components/ui/count-up";
import { cn } from "@/lib/utils";
import { PeakBuddy } from "./peak-buddy";

type Rank = (typeof RANKS)[number];

function GameStripe({ color }: { color: string }) {
  return <span aria-hidden="true" className="absolute left-0 top-3 h-8 w-[3px]" style={{ backgroundColor: color }} />;
}

export function RankGrid({ className }: { className?: string }) {
  const t = useTranslations("gaming.ranks");
  const tTracker = useTranslations("gaming.tracker");
  const tHero = useTranslations("gaming.hero");
  const featured = RANKS.find((r) => r.featured) ?? RANKS[0];
  const others = RANKS.filter((r) => r.id !== featured.id);

  const gameLabel = (r: Rank) =>
    t.has(`items.${r.id}.platform`) ? `${r.game} · ${t(`items.${r.id}.platform`)}` : r.game;

  return (
    <div className={cn("grid gap-3 lg:grid-cols-12 lg:gap-4", className)}>
      {/* Rang actuel : l'info la plus importante, en très grand */}
      <div className="rank-current relative flex flex-col justify-end gap-2 overflow-hidden px-1 py-2 lg:col-span-5">
        <p className="label">{tHero("current")}</p>
        <div className="flex items-center gap-4">
          <Image
            src="/images/ranks/valorant-immortal-3.webp"
            alt={t("alt", { rank: tHero("currentValue"), game: featured.game })}
            width={140}
            height={140}
            className="rank-current-icon h-16 w-16 shrink-0 object-contain sm:h-28 sm:w-28 lg:h-32 lg:w-32"
          />
          <p className="display whitespace-nowrap text-[44px] text-fg sm:text-[60px] lg:text-[clamp(46px,4.9vw,86px)]">{tHero("currentValue")}</p>
        </div>
      </div>

      {/* Peak : Radiant, avec le buddy suspendu qui réagit à la souris */}
      <div data-buddy-zone className="tile relative flex min-h-[220px] flex-col justify-between overflow-hidden px-5 py-5 lg:col-span-4">
        <GameStripe color={featured.color} />
        {/* Canvas assez large pour le balancement maximal (inclinaison bornée dans BuddyStage) ;
            un peu plus petit sur téléphone pour ne pas passer sur le titre */}
        <PeakBuddy className="pointer-events-none absolute -top-2 right-0 h-[170px] w-[160px] sm:h-[210px] sm:w-[200px]" />
        <div className="relative flex items-center gap-3">
          <Image
            src={featured.image}
            alt={t("alt", { rank: t(`items.${featured.id}.rank`), game: featured.game })}
            width={64}
            height={64}
            className="h-14 w-14 shrink-0 object-contain"
          />
          <div>
            <p className="label">{t("peak")}</p>
            <p className="display text-[40px] text-fg">{t(`items.${featured.id}.rank`)}</p>
          </div>
        </div>
        <div className="relative">
          <p className="display text-[52px] text-accent-2">
            <CountUp value={VALORANT_PEAK.rr} /> <span className="text-[26px]">RR</span>
          </p>
          <p className="text-[13px] text-muted">
            {tTracker("peakSeason", { episode: VALORANT_PEAK.episode, act: VALORANT_PEAK.act })}
          </p>
        </div>
      </div>

      {/* Autres jeux */}
      <ul className="stagger flex flex-col gap-2 lg:col-span-3">
        {others.map((r, i) => (
          <li key={r.id} className="tile relative flex flex-1 items-center gap-3.5 px-4 py-3.5" style={{ "--si": i } as CSSProperties}>
            <GameStripe color={r.color} />
            <Image
              src={r.image}
              alt={t("alt", { rank: t(`items.${r.id}.rank`), game: r.game })}
              width={44}
              height={44}
              className="h-11 w-11 shrink-0 object-contain"
            />
            <div className="min-w-0">
              <p className="display truncate text-[24px] text-fg">{t(`items.${r.id}.rank`)}</p>
              <p className="mt-1 truncate text-[12.5px] text-dim">{gameLabel(r)}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
