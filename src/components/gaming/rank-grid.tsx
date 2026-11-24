// src/components/gaming/rank-grid.tsx — Gaming ranks, most important first: the current rank huge,
// the peak (with the Radiant gun buddy swinging on its panel), then the other games in a row.
// The Radiant peak always stays next to the other ranks (site tone rule).
import Image from "next/image";
import type { CSSProperties } from "react";
import { useTranslations } from "next-intl";
import { RANKS, VALORANT_PEAK } from "@/config/site";
import { CountUp } from "@/components/ui/count-up";
import { cn } from "@/lib/utils";
import { PeakBuddy } from "./peak-buddy";

type Rank = (typeof RANKS)[number];

export function RankGrid({ className }: { className?: string }) {
  const t = useTranslations("gaming.ranks");
  const tTracker = useTranslations("gaming.tracker");
  const tHero = useTranslations("gaming.hero");
  const featured = RANKS.find((r) => r.featured) ?? RANKS[0];
  const others = RANKS.filter((r) => r.id !== featured.id);
  const gameLabel = (r: Rank) => (t.has(`items.${r.id}.platform`) ? `${r.game} · ${t(`items.${r.id}.platform`)}` : r.game);

  return (
    <div className={cn("flex flex-col gap-5", className)}>
      <div className="grid gap-5 lg:grid-cols-12">
        {/* Current rank: the most important information, huge */}
        <div data-reveal="" className="flex flex-col justify-end gap-4 border-t border-line-strong pt-6 lg:col-span-7">
          <p className="label">{tHero("current")}</p>
          <div className="flex items-center gap-5">
            <Image
              src="/images/ranks/valorant-immortal-3.webp"
              alt={t("alt", { rank: tHero("currentValue"), game: featured.game })}
              width={160}
              height={160}
              className="h-20 w-20 shrink-0 object-contain sm:h-32 sm:w-32"
            />
            <p className="display whitespace-nowrap text-[clamp(56px,8vw,128px)] leading-[0.85] text-fg">{tHero("currentValue")}</p>
          </div>
        </div>

        {/* Peak: Radiant, with the buddy hanging on the panel, pushed by the pointer */}
        <div data-reveal="" data-buddy-zone style={{ "--i": 1 } as CSSProperties} className="card relative min-h-[260px] justify-between overflow-hidden lg:col-span-5">
          <PeakBuddy className="pointer-events-none absolute -top-2 right-0 h-[190px] w-[170px] sm:h-[230px] sm:w-[210px]" />
          <div className="relative flex items-center gap-3">
            <Image
              src={featured.image}
              alt={t("alt", { rank: t(`items.${featured.id}.rank`), game: featured.game })}
              width={64}
              height={64}
              className="h-12 w-12 shrink-0 object-contain"
            />
            <div>
              <p className="label">{t("peak")}</p>
              <p className="display text-[40px] text-fg">{t(`items.${featured.id}.rank`)}</p>
            </div>
          </div>
          <div className="relative">
            <p className="display text-[64px] leading-none text-accent-vivid">
              <CountUp value={VALORANT_PEAK.rr} /> <span className="text-[28px]">RR</span>
            </p>
            <p className="mt-2 font-mono text-[11.5px] text-muted">{tTracker("peakSeason", { episode: VALORANT_PEAK.episode, act: VALORANT_PEAK.act })}</p>
          </div>
        </div>
      </div>

      {/* Other games */}
      <ul data-reveal="" style={{ "--i": 2 } as CSSProperties} className="stagger grid gap-x-6 sm:grid-cols-3">
        {others.map((r) => (
          <li key={r.id} className="flex items-center gap-4 border-t border-line py-5">
            <Image src={r.image} alt={t("alt", { rank: t(`items.${r.id}.rank`), game: r.game })} width={48} height={48} className="h-11 w-11 shrink-0 object-contain" />
            <div className="min-w-0">
              <p className="display truncate text-[28px] text-fg">{t(`items.${r.id}.rank`)}</p>
              <p className="mt-1 truncate font-mono text-[11px] text-muted">{gameLabel(r)}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
