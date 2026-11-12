// src/hooks/use-now.ts — Statut "en ce moment", recalculé chaque minute côté visiteur, et fusion
// avec le statut Discord en direct (useLive).
// Côté serveur (pages statiques), l'heure est inconnue : le hook renvoie null et les composants
// affichent un état neutre jusqu'à l'hydratation.
"use client";

import { useMemo, useSyncExternalStore } from "react";
import { nowStatus, type NowStatus } from "@/lib/now";
import { liveActivity } from "@/lib/presence";
import { usePresence } from "./use-presence";

const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | undefined;

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  // Un seul minuteur pour tout le site (page /now, Contact, barre d'état)
  if (!timer) timer = setInterval(() => listeners.forEach((l) => l()), 15_000);
  return () => {
    listeners.delete(onChange);
    if (listeners.size === 0) {
      clearInterval(timer);
      timer = undefined;
    }
  };
}

/** Minute courante : la valeur ne change qu'une fois par minute, pas de rendu inutile */
const getMinute = () => Math.floor(Date.now() / 60_000);
const getServerMinute = () => -1;

export function useNow(): NowStatus | null {
  const minute = useSyncExternalStore(subscribe, getMinute, getServerMinute);
  return useMemo(() => (minute < 0 ? null : nowStatus(new Date(minute * 60_000))), [minute]);
}

/**
 * Statut affiché : planning + statut Discord en direct (s'il est configuré).
 * live = activité retenue (jeu reconnu sur Discord, sinon le créneau du planning).
 */
export function useLive() {
  const now = useNow();
  const presence = usePresence();
  return useMemo(() => (now ? { now, presence, live: liveActivity(now, presence) } : null), [now, presence]);
}
