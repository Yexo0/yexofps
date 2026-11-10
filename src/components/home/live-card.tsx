// src/components/home/live-card.tsx — Carte "valorant --live" de l'accueil : peak + résumé des dernières parties.
"use client";

import { useTranslations } from "next-intl";
import { Activity } from "lucide-react";
import { TRACKER } from "@/config/site";
import { useValorantTracker } from "@/hooks/use-valorant-tracker";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/primitives";
import { PeakTile, ResultDots, TrackerNotice, useStatFormat } from "@/components/gaming/tracker-parts";

export function LiveCard({ className, index }: { className?: string; index?: number }) {
  const t = useTranslations("gaming.tracker");
  const { status, data, error, refresh, canRefresh, cooldownLeft } = useValorantTracker();
  const f = useStatFormat();
  const account = `${TRACKER.name}#${TRACKER.tag} · ${TRACKER.region.toUpperCase()}`;

  const stats = data?.stats;
  const tiles = [
    { label: t("stats.kd"), value: stats ? f.ratio(stats.kd) : "" },
    { label: t("stats.hs"), value: stats ? f.pct(stats.avgHs) : "" },
    { label: t("stats.winrate"), value: stats ? f.pct(stats.winrate) : "" },
  ];

  return (
    <Card
      id="live"
      icon={Activity}
      title={t("title")}
      subtitle="valorant --live"
      meta={account}
      next="gaming"
      index={index}
      className={className}
      bodyClassName="gap-3"
    >
      <PeakTile />

      <div className="mt-1 flex items-center justify-between gap-3">
        <p className="label">{t("recent", { count: TRACKER.size })}</p>
        {status === "ready" && data && <ResultDots matches={data.matches} />}
      </div>

      {status === "loading" && (
        <div className="grid grid-cols-3 gap-2" aria-busy="true">
          <span className="sr-only" role="status">
            {t("loading")}
          </span>
          {tiles.map((tile) => (
            <div key={tile.label} className="tile px-3 py-3">
              <Skeleton className="h-6 w-14" />
              <Skeleton className="mt-2 h-2.5 w-10" />
            </div>
          ))}
        </div>
      )}

      {status === "ready" && (
        <dl className="grid grid-cols-3 gap-2">
          {tiles.map((tile) => (
            <div key={tile.label} className="tile flex flex-col-reverse px-3 py-3">
              <dt className="label mt-1">{tile.label}</dt>
              <dd className="text-[22px] font-bold leading-none tabular-nums">{tile.value}</dd>
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
    </Card>
  );
}
