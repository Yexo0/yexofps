// src/app/api/valorant/route.ts — Valorant proxy to HenrikDev API
// Limité au compte configuré dans src/config/site.ts (TRACKER) : sans ça, n'importe qui
// pouvait interroger n'importe quel joueur via ce proxy et consommer le quota de la clé.
import { NextRequest, NextResponse } from "next/server";
import { TRACKER } from "@/config/site";

const ALLOWED_MODES = ["unrated", "competitive", "swiftplay", "deathmatch", "teamdeathmatch"];
const MAX_SIZE = 10;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const region = (searchParams.get("region") || TRACKER.region).toLowerCase();
    const name = searchParams.get("name") || TRACKER.name;
    const tag = searchParams.get("tag") || TRACKER.tag;
    const mode = (searchParams.get("mode") || TRACKER.mode).toLowerCase();
    const size = String(Math.min(Math.max(parseInt(searchParams.get("size") || "", 10) || TRACKER.size, 1), MAX_SIZE));

    const isSiteAccount =
      region === TRACKER.region.toLowerCase() &&
      name.toLowerCase() === TRACKER.name.toLowerCase() &&
      tag.toLowerCase() === TRACKER.tag.toLowerCase();
    if (!isSiteAccount) {
      return NextResponse.json({ error: "Account not allowed" }, { status: 403 });
    }
    if (!ALLOWED_MODES.includes(mode)) {
      return NextResponse.json({ error: "Mode not allowed" }, { status: 400 });
    }

    const apiKey = process.env.HENRIK_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing HENRIK_API_KEY in environment variables" },
        { status: 500 }
      );
    }

    const endpoint =
      `https://api.henrikdev.xyz/valorant/v3/matches/${encodeURIComponent(region)}/${encodeURIComponent(name)}/${encodeURIComponent(tag)}` +
      `?mode=${encodeURIComponent(mode)}&size=${encodeURIComponent(size)}`;

    const res = await fetch(endpoint, {
      headers: {
        Authorization: apiKey,
        Accept: "application/json",
      },
    });

    if (res.status === 429) {
      return NextResponse.json({ error: "Rate limit reached" }, { status: 429 });
    }

    if (!res.ok) {
      // Le corps de l'erreur amont n'est pas renvoyé au navigateur
      return NextResponse.json({ error: `HenrikDev API error: ${res.status}` }, { status: res.status });
    }

    const json = await res.json();
    const meName = name.toLowerCase();
    const meTag = tag.toLowerCase();

    // Extract player-specific stats from each match
    const reduced = (json.data || [])
      .map((match: Record<string, unknown>) => {
        const matchPlayers = match.players as Record<string, unknown[]> | undefined;
        const players = (matchPlayers?.all_players || []) as Record<string, unknown>[];
        const me = players.find(
          (p) =>
            (p.name as string)?.toLowerCase() === meName &&
            (p.tag as string)?.toLowerCase() === meTag
        );

        if (!me) return null;

        const teams = match.teams as Record<string, Record<string, unknown>> | undefined;
        const redWon = teams?.red?.rounds_won as number | undefined;
        const blueWon = teams?.blue?.rounds_won as number | undefined;

        let result = "unknown";
        if (typeof redWon === "number" && typeof blueWon === "number") {
          const team = (me.team as string)?.toLowerCase();
          if (team === "red") result = redWon > blueWon ? "win" : "loss";
          if (team === "blue") result = blueWon > redWon ? "win" : "loss";
        }

        const score =
          typeof redWon === "number" && typeof blueWon === "number"
            ? `${redWon}-${blueWon}`
            : "—";

        const metadata = match.metadata as Record<string, unknown> | undefined;
        const stats = me.stats as Record<string, number> | undefined;
        const assets = me.assets as Record<string, Record<string, string>> | undefined;

        return {
          map: metadata?.map || "Unknown",
          mode: metadata?.mode || "",
          agent: me.character || "",
          agentImg: assets?.agent?.small || "",
          kills: stats?.kills || 0,
          deaths: stats?.deaths || 0,
          assists: stats?.assists || 0,
          headshots: stats?.headshots || 0,
          bodyshots: stats?.bodyshots || 0,
          legshots: stats?.legshots || 0,
          redWon: typeof redWon === "number" ? redWon : null,
          blueWon: typeof blueWon === "number" ? blueWon : null,
          score,
          ts: Number(metadata?.game_start || 0) || 0,
          result,
        };
      })
      .filter(Boolean);

    return NextResponse.json(reduced, {
      headers: {
        // Même origine uniquement (plus d'Access-Control-Allow-Origin: *)
        "Cache-Control": "public, max-age=60, s-maxage=60",
      },
    });
  } catch (e) {
    console.error("[api/valorant]", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
