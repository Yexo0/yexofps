// src/components/home/live-card.tsx — Home "Live stats" panel: the last Valorant matches (tracker)
// as big figures, with a win/loss strip. Ranks are in the hero (KeyStats).
"use client";

import { useTranslations } from "next-intl";
import { TRACKER } from "@/config/site";
import { useValorantTracker } from "@/hooks/use-valorant-tracker";
import { Card } from "@/components/ui/card";
import { ArrowLink, Skeleton } from "@/components/ui/primitives";
import { ResultDots, TrackerNotice, useStatFormat } from "@/components/gaming/tracker-parts";

export function LiveCard({ className, index }: { className?: string; index?: number }) {
  const t = useTranslations("home.gaming");
  const tTracker = useTranslations("gaming.tracker");
  const { status, data, error, refresh, canRefresh, cooldownLeft } = useValorantTracker();
  const f = useStatFormat();
  const account = `${TRACKER.name}#${TRACKER.tag} · ${TRACKER.region.toUpperCase()}`;

  const stats = data?.stats;
  const tiles = [
    { label: tTracker("stats.kd"), value: stats ? f.ratio(stats.kd) : "" },
    { label: tTracker("stats.hs"), value: stats ? f.pct(stats.avgHs) : "" },
    { label: tTracker("stats.winrate"), value: stats ? f.pct(stats.winrate) : "" },
  ];

  return (
    <Card id="gaming" title={t("title")} meta={account} index={index} className={className} bodyClassName="gap-6">
      <div className="flex items-center justify-between gap-3">
        <p className="label">{t("recent", { count: data?.matches.length ?? TRACKER.size })}</p>
        {status === "ready" && data && <ResultDots matches={data.matches} />}
      </div>

      {status === "loading" && (
        <div className="grid grid-cols-3 gap-4" aria-busy="true">
          <span className="sr-only" role="status">
            {tTracker("loading")}
          </span>
          {tiles.map((tile) => (
            <div key={tile.label} className="border-t border-line pt-4">
              <Skeleton className="h-9 w-16" />
              <Skeleton className="mt-2 h-2.5 w-10" />
            </div>
          ))}
        </div>
      )}

      {status === "ready" && (
        <dl className="stagger grid grid-cols-3 gap-4">
          {tiles.map((tile) => (
            <div key={tile.label} className="flex flex-col-reverse border-t border-line pt-4">
              <dt className="label mt-2">{tile.label}</dt>
              <dd className="display text-[44px] tabular-nums text-fg sm:text-[56px]">{tile.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {status === "empty" && <TrackerNotice kind="empty" compact />}

      {status === "error" && (
        <TrackerNotice
          kind="error"
          error={error}
          compact
          onRetry={refresh}
          canRetry={canRefresh}
          cooldownLeft={cooldownLeft}
        />
      )}
      <div className="mt-auto pt-2">
        <ArrowLink href="/gaming">{t("more")}</ArrowLink>
      </div>
    </Card>
  );
}
