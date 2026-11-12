// src/hooks/use-host.ts — Chiffres du serveur en direct (/api/host) pour la page /lab/site, relus
// toutes les 10 s tant que la page est ouverte et visible. Chaque appel mesure aussi le temps de
// réponse vu depuis le navigateur du visiteur (aller-retour complet).
"use client";

import { useSyncExternalStore } from "react";
import type { HostInfo } from "@/lib/host";

const POLL_MS = 10_000;
const HISTORY = 24;

export interface HostState {
  info: HostInfo | null;
  /** Temps de réponse mesurés (ms), du plus ancien au plus récent */
  rtt: number[];
  /** Instant de la dernière réponse (ms), pour faire avancer les durées entre deux appels */
  at: number;
  failed: boolean;
}

const listeners = new Set<() => void>();
let state: HostState = { info: null, rtt: [], at: 0, failed: false };
let timer: ReturnType<typeof setInterval> | undefined;

async function load() {
  if (document.hidden) return;
  const start = performance.now();
  try {
    const res = await fetch("/api/host", { cache: "no-store" });
    if (!res.ok) throw new Error(String(res.status));
    const info = (await res.json()) as HostInfo;
    const rtt = Math.round(performance.now() - start);
    state = { info, rtt: [...state.rtt, rtt].slice(-HISTORY), at: Date.now(), failed: false };
  } catch {
    state = { ...state, failed: true };
  }
  listeners.forEach((l) => l());
}

function onVisible() {
  if (!document.hidden) void load();
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  if (listeners.size === 1) {
    void load();
    timer = setInterval(load, POLL_MS);
    document.addEventListener("visibilitychange", onVisible);
  }
  return () => {
    listeners.delete(onChange);
    if (listeners.size === 0) {
      clearInterval(timer);
      timer = undefined;
      document.removeEventListener("visibilitychange", onVisible);
    }
  };
}

const getSnapshot = () => state;
const SERVER_STATE: HostState = { info: null, rtt: [], at: 0, failed: false };
const getServerSnapshot = () => SERVER_STATE;

export function useHost(): HostState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
