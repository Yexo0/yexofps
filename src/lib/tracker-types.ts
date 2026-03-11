// src/lib/tracker-types.ts

export interface MatchData {
  map: string;
  mode: string;
  agent: string;
  agentImg: string;
  kills: number;
  deaths: number;
  assists: number;
  headshots: number;
  bodyshots: number;
  legshots: number;
  redWon: number | null;
  blueWon: number | null;
  score: string;
  ts: number;
  result: "win" | "loss" | "unknown";
}

export interface TrackerStats {
  avgHs: number;
  kd: number;
  winrate: number;
  totalK: number;
  totalD: number;
  totalA: number;
  wins: number;
  losses: number;
  knownResults: number;
  hsCount: number;
  matchCount: number;
}

export function computeStats(matches: MatchData[]): TrackerStats {
  let totalHS = 0;
  let hsCount = 0;
  let totalK = 0;
  let totalD = 0;
  let totalA = 0;
  let wins = 0;
  let knownResults = 0;

  for (const m of matches) {
    totalK += m.kills;
    totalD += m.deaths;
    totalA += m.assists;

    const shots = m.headshots + m.bodyshots + m.legshots;
    if (shots > 0) {
      totalHS += m.headshots / shots;
      hsCount++;
    }

    if (m.result === "win" || m.result === "loss") {
      knownResults++;
      if (m.result === "win") wins++;
    }
  }

  return {
    avgHs: hsCount > 0 ? totalHS / hsCount : NaN,
    kd: totalD > 0 ? totalK / totalD : NaN,
    winrate: knownResults > 0 ? wins / knownResults : NaN,
    totalK,
    totalD,
    totalA,
    wins,
    losses: knownResults - wins,
    knownResults,
    hsCount,
    matchCount: matches.length,
  };
}

export function fmtPct(x: number): string {
  if (!isFinite(x)) return "—";
  return (x * 100).toFixed(1) + "%";
}

export function fmtNum(x: number, digits = 2): string {
  if (!isFinite(x)) return "—";
  return Number(x).toFixed(digits);
}
