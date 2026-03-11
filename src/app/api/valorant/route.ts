// src/app/api/valorant/route.ts — Valorant proxy to HenrikDev API
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const region = searchParams.get("region") || "eu";
    const name = searchParams.get("name") || "tanjiro";
    const tag = searchParams.get("tag") || "33333";
    const mode = searchParams.get("mode") || "unrated";
    const size = searchParams.get("size") || "10";

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
      const text = await res.text().catch(() => "");
      return NextResponse.json(
        { error: `HenrikDev API error: ${res.status} ${text.slice(0, 200)}` },
        { status: res.status }
      );
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
        "Cache-Control": "public, max-age=60",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (e) {
    return NextResponse.json(
      { error: (e as Error)?.message || String(e) },
      { status: 500 }
    );
  }
}
