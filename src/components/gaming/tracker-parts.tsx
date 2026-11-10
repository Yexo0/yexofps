// src/components/gaming/tracker-parts.tsx — Éléments partagés du tracker (accueil + gaming) :
// tuile du peak, message d'état, pastilles de résultats, formatage des stats.
"use client";

import Image from "next/image";
import { useFormatter, useTranslations } from "next-intl";
import { CircleAlert, RefreshCw, SearchX } from "lucide-react";
import { VALORANT_PEAK } from "@/config/site";
import type { MatchData } from "@/lib/tracker-types";
import type { TrackerError } from "@/hooks/use-valorant-tracker";
import { cn } from "@/lib/utils";
import { DotDigits } from "@/components/ui/dot-digits";
import { Reticle } from "@/components/ui/reticle";

/** Formatage localisé des stats (NaN → tiret) */
export function useStatFormat() {
  const format = useFormatter();
  return {
    pct: (x: number) =>
      Number.isFinite(x) ? format.number(x, { style: "percent", maximumFractionDigits: 1 }) : "—",
    ratio: (x: number) =>
      Number.isFinite(x)
        ? format.number(x, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        : "—",
  };
}

/** HS% d'une partie (NaN si aucun tir enregistré) */
export function matchHs(m: MatchData) {
  const shots = m.headshots + m.bodyshots + m.legshots;
  return shots > 0 ? m.headshots / shots : NaN;
}

/* ─── Peak : toujours affiché, même sans API ─── */

export function PeakTile({ size = "md" }: { size?: "md" | "lg" }) {
  const t = useTranslations("gaming.tracker");
  return (
    <div className={cn("tile relative flex items-center gap-4", size === "lg" ? "px-5 py-5" : "px-4 py-3.5")}>
      {size === "lg" && <Reticle size={9} inset={7} />}
      <Image
        src={VALORANT_PEAK.image}
        alt=""
        width={64}
        height={64}
        className={cn("shrink-0 object-contain", size === "lg" ? "h-16 w-16" : "h-12 w-12")}
      />
      <div className="min-w-0 flex-1">
        <p className="label">{t("peak")}</p>
        <p className={cn("font-bold leading-tight tracking-tight", size === "lg" ? "text-3xl" : "text-xl")}>
          {VALORANT_PEAK.rank}
        </p>
      </div>
      <div className="text-right">
        <p className="flex items-end justify-end gap-1.5 leading-none">
          <DotDigits value={String(VALORANT_PEAK.rr)} dot={size === "lg" ? 4.5 : 3.5} gap={1.5} className="text-accent" />
          <span className="font-mono text-[11px] text-muted">RR</span>
        </p>
        <p className="mt-1 font-mono text-[11px] text-dim">
          {t("peakSeason", { episode: VALORANT_PEAK.episode, act: VALORANT_PEAK.act })}
        </p>
      </div>
    </div>
  );
}

/* ─── Message d'état (erreur / aucune donnée) ─── */

export function TrackerNotice({
  kind,
  error,
  onRetry,
  canRetry,
  cooldownLeft,
  compact = false,
}: {
  kind: "error" | "empty";
  error?: TrackerError | null;
  onRetry?: () => void;
  canRetry?: boolean;
  cooldownLeft?: number;
  compact?: boolean;
}) {
  const t = useTranslations("gaming.tracker");
  const Icon = kind === "error" ? CircleAlert : SearchX;
  const message = kind === "error" ? t(`errors.${error ?? "unavailable"}`) : t("empty");

  return (
    <div
      role={kind === "error" ? "alert" : "status"}
      className={cn("tile flex items-start gap-3", compact ? "px-4 py-3.5" : "px-5 py-4")}
    >
      <Icon size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-accent" />
      <div className="min-w-0 flex-1">
        <p className="text-sm text-fg">{message}</p>
        {kind === "error" && <p className="mt-0.5 text-xs text-dim">{t("peakStillHere")}</p>}
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            disabled={!canRetry}
            className="btn btn-tonal btn-sm mt-3"
          >
            <RefreshCw size={13} aria-hidden="true" />
            {cooldownLeft ? t("retryIn", { seconds: cooldownLeft }) : t("retry")}
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── Pastilles de résultats (V / D) ─── */

export function ResultDots({ matches }: { matches: MatchData[] }) {
  const t = useTranslations("gaming.tracker");
  const wins = matches.filter((m) => m.result === "win").length;
  const losses = matches.filter((m) => m.result === "loss").length;
  return (
    <div>
      <p className="sr-only">{t("resultsSummary", { wins, losses })}</p>
      <ul className="flex flex-wrap gap-1.5" aria-hidden="true">
        {matches.map((m, i) => (
          <li
            key={`${m.ts}-${i}`}
            title={t(`result.${m.result}`)}
            className={cn(
              "h-2.5 w-2.5 rounded-full",
              m.result === "win" && "bg-accent",
              m.result === "loss" && "ring-1 ring-inset ring-line-strong",
              m.result === "unknown" && "bg-surface-3",
            )}
          />
        ))}
      </ul>
    </div>
  );
}

/* ─── Étiquette de résultat (Victoire / Défaite) ─── */

export function ResultTag({ result }: { result: MatchData["result"] }) {
  const t = useTranslations("gaming.tracker.result");
  return (
    <span
      className={cn(
        "inline-flex justify-center rounded-full px-2.5 py-1 text-xs font-semibold",
        result === "win" && "bg-accent-tint text-on-accent-container",
        result === "loss" && "bg-surface-3 text-muted",
        result === "unknown" && "bg-surface-3 text-dim",
      )}
    >
      {t(result)}
    </span>
  );
}
