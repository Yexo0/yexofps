// src/components/gaming/tracker-section.tsx — Full Valorant tracker (stats panel + matches panel).
// One instance of the hook: both panels share the same API call.
"use client";

import { useState } from "react";
import { useFormatter, useTranslations } from "next-intl";
import { RefreshCw } from "lucide-react";
import { TRACKER } from "@/config/site";
import { useValorantTracker } from "@/hooks/use-valorant-tracker";
import type { MatchData } from "@/lib/tracker-types";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/primitives";
import { AgentAvatar, ResultDots, ResultTag, TrackerNotice, matchHs, playerScore, useStatFormat } from "./tracker-parts";
import { MatchDialog } from "./match-dialog";

export function TrackerSection() {
  const t = useTranslations("gaming.tracker");
  const tm = useTranslations("gaming.matches");
  const format = useFormatter();
  const f = useStatFormat();
  const tracker = useValorantTracker({ autoRefresh: true });
  const { status, data, error, refresh, refreshing, autoOn, setAutoOn, cooldownLeft, canRefresh } = tracker;
  const [selected, setSelected] = useState<MatchData | null>(null);
  const account = `${TRACKER.name}#${TRACKER.tag} · ${TRACKER.region.toUpperCase()}`;
  const s = data?.stats;

  const statusLabel =
    status === "loading"
      ? t("status.loading")
      : refreshing
        ? t("refreshing")
        : status === "ready" && data
          ? t("status.ready", { time: format.dateTime(new Date(data.updatedAt), { timeStyle: "short" }) })
          : status === "empty"
            ? t("status.empty")
            : t("status.error");

  const tiles = s
    ? [
        {
          label: t("stats.hs"),
          value: f.pct(s.avgHs),
          sub: s.hsCount > 0 ? t("stats.hsSub", { count: s.hsCount }) : t("stats.hsNa"),
        },
        { label: t("stats.kd"), value: f.ratio(s.kd), sub: t("stats.kdSub", { kills: s.totalK, deaths: s.totalD }) },
        {
          label: t("stats.winrate"),
          value: f.pct(s.winrate),
          sub: s.knownResults > 0 ? t("stats.winSub", { wins: s.wins, losses: s.losses }) : t("stats.winNa"),
        },
        {
          label: t("stats.kda"),
          value: `${s.totalK}/${s.totalD}/${s.totalA}`,
          sub: t("stats.kdaSub", { count: s.matchCount }),
        },
      ]
    : [];

  return (
    <>
      <Card id="tracker-stats" title={t("trackerTitle")} meta={account} index={0} className="lg:col-span-5" bodyClassName="gap-5">
        {/* Barre d'état et commandes */}
        <div className="flex flex-wrap items-center gap-2">
          <p className="mr-auto flex items-center gap-2 font-mono text-[11.5px] text-muted" role="status">
            <span
              aria-hidden="true"
              className={cn(
                "h-2 w-2 rounded-full",
                status === "ready" && "live-dot bg-accent-vivid text-accent-vivid",
                status === "loading" && "bg-surface-hover",
                (status === "error" || status === "empty") && "ring-1 ring-inset ring-line-strong",
              )}
            />
            {statusLabel}
          </p>
          <button
            type="button"
            onClick={refresh}
            disabled={!canRefresh || status === "loading"}
            className="btn btn-tonal btn-sm"
          >
            <RefreshCw size={13} aria-hidden="true" />
            {t("refresh")}
            {cooldownLeft > 0 && <span className="font-mono text-[11px] text-dim">{cooldownLeft} s</span>}
          </button>
          <button
            type="button"
            role="switch"
            aria-checked={autoOn}
            aria-label={t("autoLabel")}
            onClick={() => setAutoOn(!autoOn)}
            className="btn btn-tonal btn-sm"
          >
            <span
              aria-hidden="true"
              className={cn(
                "relative h-4 w-7 transition-colors",
                autoOn ? "bg-accent-vivid" : "bg-surface-hover",
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 h-3 w-3 bg-bg transition-[left] duration-300",
                  autoOn ? "left-3.5" : "left-0.5",
                )}
              />
            </span>
            {t("auto")}
          </button>
        </div>

        {status === "loading" && (
          <div className="grid grid-cols-2 gap-x-6" aria-hidden="true">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="border-t border-line py-4">
                <Skeleton className="h-7 w-16" />
                <Skeleton className="mt-2.5 h-2.5 w-12" />
                <Skeleton className="mt-2 h-2.5 w-20" />
              </div>
            ))}
          </div>
        )}

        {status === "ready" && (
          <dl className="stagger grid grid-cols-2 gap-x-6">
            {tiles.map((tile) => (
              <div key={tile.label} className="flex flex-col border-t border-line py-4">
                <dd className="display order-1 text-[44px] tabular-nums text-fg">{tile.value}</dd>
                <dt className="label order-2 mt-2">{tile.label}</dt>
                <dd className="order-3 mt-1 text-[11.5px] text-dim">{tile.sub}</dd>
              </div>
            ))}
          </dl>
        )}

        {status === "error" && (
          <TrackerNotice kind="error" error={error} onRetry={refresh} canRetry={canRefresh} cooldownLeft={cooldownLeft} />
        )}
        {status === "empty" && <TrackerNotice kind="empty" />}
        {status === "ready" && error && (
          <TrackerNotice kind="error" error={error} compact onRetry={refresh} canRetry={canRefresh} cooldownLeft={cooldownLeft} />
        )}
      </Card>

      <Card id="matches" title={tm("title")} meta={tm("meta")} index={1} className="lg:col-span-7" bodyClassName="gap-4">
        {status === "ready" && data && (
          <div className="flex items-center justify-between gap-3">
            <ResultDots matches={data.matches} />
          </div>
        )}

        {status === "loading" && (
          <ul className="flex flex-col" aria-hidden="true">
            {[0, 1, 2, 3, 4].map((i) => (
              <li key={i} className="flex items-center gap-4 border-t border-line py-2.5">
                <Skeleton className="h-10 w-10" />
                <div className="flex-1">
                  <Skeleton className="h-3.5 w-28" />
                  <Skeleton className="mt-2 h-2.5 w-20" />
                </div>
                <Skeleton className="h-6 w-20" />
              </li>
            ))}
          </ul>
        )}

        {status === "ready" && data && (
          <ul className="stagger flex flex-col">
            {data.matches.map((m, i) => {
              const hs = matchHs(m);
              return (
                <li key={`${m.ts}-${i}`}>
                  <button
                    type="button"
                    aria-haspopup="dialog"
                    onClick={() => setSelected(m)}
                    className="grid w-full grid-cols-[40px_1fr_auto] items-center gap-x-4 border-t border-line px-1 py-2.5 text-left transition-colors hover:bg-surface-2 sm:grid-cols-[40px_1fr_96px_72px_88px_64px]"
                  >
                    <AgentAvatar src={m.agentImg} agent={m.agent} />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold">{m.map}</span>
                      <span className="block truncate font-mono text-[11px] text-dim">
                        {m.mode} · {m.agent}
                      </span>
                    </span>
                    <ResultTag result={m.result} />
                    <Cell label={tm("columns.score")} value={playerScore(m)} className="hidden sm:block" />
                    <Cell label={tm("columns.kda")} value={`${m.kills}/${m.deaths}/${m.assists}`} className="hidden sm:block" />
                    <Cell label={tm("columns.hs")} value={f.pct(hs)} className="hidden sm:block" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {status === "error" && <p className="text-sm text-dim">{tm("unavailable")}</p>}
        {status === "empty" && <TrackerNotice kind="empty" />}

        <p className="mt-auto pt-2 text-[12px] text-dim">{tm("note")}</p>
      </Card>

      <MatchDialog match={selected} onClose={() => setSelected(null)} />
    </>
  );
}

function Cell({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <span className={cn("text-right", className)}>
      <span className="block font-mono text-[10px] uppercase tracking-wider text-dim">{label}</span>
      <span className="block text-sm font-semibold tabular-nums">{value}</span>
    </span>
  );
}
