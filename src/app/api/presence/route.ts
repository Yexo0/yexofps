// src/app/api/presence/route.ts — Statut Discord en direct, lu sur Lanyard côté serveur :
// les visiteurs ne contactent pas Lanyard, la réponse est réduite (lib/presence) et mise en cache
// 15 s en mémoire pour limiter les appels quel que soit le nombre de visiteurs.
// Lanyard indisponible : réponse 200 { unavailable: true } (le site revient au planning sans
// afficher d'erreur réseau dans la console du visiteur).
import { NextResponse } from "next/server";
import { DISCORD_USER_ID } from "@/config/site";
import { reducePresence, type Presence } from "@/lib/presence";

export const dynamic = "force-dynamic";

const TTL_MS = 15_000;
type Body = Presence | { unavailable: true } | { error: string };
let cache: { at: number; body: Body } | null = null;

const reply = (status: number, body: Body) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function GET() {
  if (!DISCORD_USER_ID) return reply(404, { error: "disabled" });
  if (cache && Date.now() - cache.at < TTL_MS) return reply(200, cache.body);

  let body: Body;
  try {
    const res = await fetch(`https://api.lanyard.rest/v1/users/${encodeURIComponent(DISCORD_USER_ID)}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(5_000),
    });
    const json: unknown = await res.json().catch(() => null);
    const ok = res.ok && typeof json === "object" && json !== null && (json as { success?: unknown }).success === true;
    if (ok) {
      body = reducePresence((json as { data?: unknown }).data);
    } else {
      // Compte non suivi par Lanyard (serveur Discord pas rejoint) ou erreur du service
      body = { unavailable: true };
    }
  } catch {
    body = { unavailable: true };
  }

  cache = { at: Date.now(), body };
  return reply(200, body);
}
