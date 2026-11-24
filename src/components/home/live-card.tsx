// src/components/home/live-card.tsx — Carte "Stats en direct" de l'accueil : résumé des dernières
// parties Valorant (tracker) en gros chiffres. Les rangs sont dans le hero (KeyStats).
"use client";

import { useTranslations } from "next-intl";
import { Gamepad2 } from "lucide-react";
import { TRACKER } from "@/config/site";
import { useValorantTracker } from "@/hooks/use-valorant-tracker";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/primitives";
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
    <Card
      id="gaming"
      icon={Gamepad2}
      title={t("title")}
      subtitle="valorant --live"
      meta={account}
      next="gaming"
      index={index}
      className={className}
      bodyClassName="gap-4"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="label">{t("recent", { count: data?.matches.length ?? TRACKER.size })}</p>
        {status === "ready" && data && <ResultDots matches={data.matches} />}
      </div>

      {status === "loading" && (
        <div className="grid grid-cols-3 gap-2" aria-busy="true">
          <span className="sr-only" role="status">
            {tTracker("loading")}
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
        <dl className="stagger grid grid-cols-3 gap-2">
          {tiles.map((tile) => (
            <div key={tile.label} className="tile flex flex-col-reverse px-3.5 py-4">
              <dt className="label mt-2">{tile.label}</dt>
              <dd className="display text-[40px] tabular-nums text-fg">{tile.value}</dd>
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
