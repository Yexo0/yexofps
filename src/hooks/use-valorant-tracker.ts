// src/hooks/use-valorant-tracker.ts — Récupère les dernières parties via /api/valorant (route inchangée)
// et expose des états clairs : chargement, prêt, vide, erreur. Même logique de rafraîchissement
// qu'avant : délai de 25 s entre deux appels, rafraîchissement auto toutes les 90 s.
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { TRACKER } from "@/config/site";
import { computeStats, type MatchData, type TrackerStats } from "@/lib/tracker-types";

export type TrackerStatus = "loading" | "ready" | "empty" | "error";
/** rateLimit = 429 ; unavailable = API ou clé indisponible ; network = requête impossible */
export type TrackerError = "rateLimit" | "unavailable" | "network";

export interface TrackerData {
  matches: MatchData[];
  stats: TrackerStats;
  updatedAt: number;
}

const QUERY = new URLSearchParams({
  region: TRACKER.region,
  name: TRACKER.name,
  tag: TRACKER.tag,
  mode: TRACKER.mode,
  size: String(TRACKER.size),
}).toString();

export function useValorantTracker({ autoRefresh = false }: { autoRefresh?: boolean } = {}) {
  const [status, setStatus] = useState<TrackerStatus>("loading");
  const [data, setData] = useState<TrackerData | null>(null);
  const [error, setError] = useState<TrackerError | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [autoOn, setAutoOn] = useState(autoRefresh);
  const [cooldownLeft, setCooldownLeft] = useState(0);

  const lastFetchAt = useRef(0);
  const cooldownTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  /** Compte à rebours affiché sur le bouton "Rafraîchir" */
  const startCooldown = useCallback(() => {
    const end = lastFetchAt.current + TRACKER.cooldownMs;
    if (cooldownTimer.current) clearInterval(cooldownTimer.current);
    cooldownTimer.current = setInterval(() => {
      const left = Math.max(0, end - Date.now());
      setCooldownLeft(Math.ceil(left / 1000));
      if (left <= 0 && cooldownTimer.current) clearInterval(cooldownTimer.current);
    }, 250);
  }, []);

  const load = useCallback(async () => {
    lastFetchAt.current = Date.now();
    startCooldown();
    try {
      const res = await fetch(`/api/valorant?${QUERY}`, { headers: { Accept: "application/json" } });
      if (res.status === 429) {
        setError("rateLimit");
        setStatus((s) => (s === "ready" ? s : "error"));
        return;
      }
      if (!res.ok) {
        setError("unavailable");
        setStatus((s) => (s === "ready" ? s : "error"));
        return;
      }
      const json = await res.json();
      const matches: unknown = json?.data ?? json;
      if (!Array.isArray(matches) || matches.length === 0) {
        setError(null);
        setData(null);
        setStatus("empty");
        return;
      }
      const list = matches as MatchData[];
      setData({ matches: list, stats: computeStats(list), updatedAt: Date.now() });
      setError(null);
      setStatus("ready");
    } catch {
      setError("network");
      setStatus((s) => (s === "ready" ? s : "error"));
    }
  }, [startCooldown]);

  /** Rafraîchit si le délai minimum est écoulé */
  const refresh = useCallback(() => {
    if (Date.now() - lastFetchAt.current < TRACKER.cooldownMs) return;
    setRefreshing(true);
    load().finally(() => setRefreshing(false));
  }, [load]);

  // Premier chargement (différé d'un tick : annulé proprement si le composant est démonté)
  useEffect(() => {
    const first = setTimeout(load, 0);
    return () => {
      clearTimeout(first);
      if (cooldownTimer.current) clearInterval(cooldownTimer.current);
    };
  }, [load]);

  // Rafraîchissement automatique
  useEffect(() => {
    if (!autoOn) return;
    const id = setInterval(refresh, TRACKER.autoRefreshMs);
    return () => clearInterval(id);
  }, [autoOn, refresh]);

  return {
    status,
    data,
    error,
    refreshing,
    refresh,
    autoOn,
    setAutoOn,
    cooldownLeft,
    canRefresh: cooldownLeft === 0 && !refreshing,
  };
}
