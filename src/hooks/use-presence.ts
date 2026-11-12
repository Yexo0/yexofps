// src/hooks/use-presence.ts — Statut Discord en direct (via /api/presence), partagé par tout le site.
// Une seule requête toutes les 30 s quel que soit le nombre de composants abonnés, et rien quand
// l'onglet est masqué. Inactif tant que DISCORD_USER_ID n'est pas renseigné (renvoie null).
"use client";

import { useSyncExternalStore } from "react";
import { DISCORD_USER_ID } from "@/config/site";
import type { Presence } from "@/lib/presence";

const POLL_MS = 30_000;
const listeners = new Set<() => void>();
let presence: Presence | null = null;
let timer: ReturnType<typeof setInterval> | undefined;

async function load() {
  if (document.hidden) return;
  try {
    const res = await fetch("/api/presence", { cache: "no-store" });
    const body: unknown = res.ok ? await res.json() : null;
    presence = body && typeof body === "object" && "discord" in body ? (body as Presence) : null;
  } catch {
    presence = null;
  }
  listeners.forEach((l) => l());
}

function onVisible() {
  if (!document.hidden) void load();
}

function subscribe(onChange: () => void) {
  if (!DISCORD_USER_ID) return () => {};
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

const getSnapshot = () => presence;
const getServerSnapshot = () => null;

export function usePresence(): Presence | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
