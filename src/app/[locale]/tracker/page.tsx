// src/app/[locale]/tracker/page.tsx — Tracker
"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState, useEffect, useRef, useCallback } from "react";
import { BackButton } from "@/components/layout/back-button";
import { Footer } from "@/components/layout/footer";
import { PageHeader } from "@/components/shared/page-header";
import { GlassPanel } from "@/components/shared/glass-panel";
import { SectionTitle } from "@/components/shared/section-title";
import { TRACKER_CONFIG, SOCIAL_LINKS } from "@/lib/constants";
import { MatchData, TrackerStats, computeStats, fmtPct, fmtNum } from "@/lib/tracker-types";
import { MatchDetailModal } from "@/components/tracker/match-detail-modal";
import { RefreshCw, Clock, Link } from "lucide-react";
import { TikTokIcon } from "@/components/icons/tiktok";
import { DiscordIcon } from "@/components/icons/discord";

type Status = "idle" | "loading" | "ok" | "error" | "cooldown";

export default function TrackerPage() {
  const t = useTranslations("tracker");
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [stats, setStats] = useState<TrackerStats | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [autoOn, setAutoOn] = useState(true);
  const [cooldownLeft, setCooldownLeft] = useState(0);
  const [selectedMatch, setSelectedMatch] = useState<MatchData | null>(null);

  const lastFetchAt = useRef(0);
  const autoTimer = useRef<NodeJS.Timeout | null>(null);
  const cooldownTimer = useRef<NodeJS.Timeout | null>(null);

  const fetchTracker = useCallback(async (force = false) => {
    const now = Date.now();
    if (!force && now - lastFetchAt.current < 2000) return;
    if (!force && now - lastFetchAt.current < TRACKER_CONFIG.cooldownMs) {
      setStatus("cooldown");
      return;
    }

    lastFetchAt.current = now;
    setError(null);
    setStatus("loading");

    const end = now + TRACKER_CONFIG.cooldownMs;
    if (cooldownTimer.current) clearInterval(cooldownTimer.current);
    cooldownTimer.current = setInterval(() => {
      const left = Math.max(0, end - Date.now());
      setCooldownLeft(Math.ceil(left / 1000));
      if (left <= 0 && cooldownTimer.current) clearInterval(cooldownTimer.current);
    }, 250);

    try {
      const params = new URLSearchParams({
        region: TRACKER_CONFIG.region,
        name: TRACKER_CONFIG.name,
        tag: TRACKER_CONFIG.tag,
        mode: TRACKER_CONFIG.mode,
        size: String(TRACKER_CONFIG.size),
      });

      const res = await fetch(`/api/valorant?${params}`, {
        headers: { Accept: "application/json" },
      });

      if (res.status === 429) {
        setError(t("rateLimit"));
        setStatus("error");
        return;
      }
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        setError(`${t("httpError")} ${res.status}${text ? " — " + text.slice(0, 180) : ""}`);
        setStatus("error");
        return;
      }

      const json = await res.json();
      const data: MatchData[] = json?.data ?? json;

      if (!Array.isArray(data) || data.length === 0) {
        setError(t("noMatches"));
        setStatus("error");
        return;
      }

      setMatches(data);
      setStats(computeStats(data));
      setStatus("ok");
    } catch (err) {
      setError(`${t("fetchError")} (${(err as Error)?.message || err})`);
      setStatus("error");
    }
  }, [t]);

  useEffect(() => {
    if (autoTimer.current) clearInterval(autoTimer.current);
    if (autoOn) {
      autoTimer.current = setInterval(() => fetchTracker(false), TRACKER_CONFIG.autoRefreshMs);
    }
    return () => { if (autoTimer.current) clearInterval(autoTimer.current); };
  }, [autoOn, fetchTracker]);

  useEffect(() => { fetchTracker(true); }, [fetchTracker]);

  useEffect(() => {
    const sections = document.querySelectorAll(".tracker-section");
    sections.forEach((sec, i) => {
      (sec as HTMLElement).style.opacity = "0";
      (sec as HTMLElement).style.transform = "translateY(22px)";
      setTimeout(() => {
        (sec as HTMLElement).style.transition = "opacity 0.7s ease, transform 0.7s ease";
        (sec as HTMLElement).style.opacity = "1";
        (sec as HTMLElement).style.transform = "translateY(0)";
      }, 160 + i * 170);
    });
  }, []);

  const statusDotClass =
    status === "ok" ? "bg-green-400" :
    status === "loading" ? "bg-yellow-400 animate-pulse" :
    status === "error" ? "bg-red-400" :
    status === "cooldown" ? "bg-orange-400" :
    "bg-white/40";

  const statusLabel =
    status === "ok" ? t("upToDate") :
    status === "loading" ? t("loading") :
    status === "error" ? t("error") :
    status === "cooldown" ? t("cooldown") :
    t("waiting");

  const socialChips = (
    <>
      <button
        onClick={() => fetchTracker(false)}
        className="btn-ghost-premium !py-2 !px-3.5 !text-xs"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        <span>{t("refresh")}</span>
        <small className="text-white/40">{cooldownLeft > 0 ? `${cooldownLeft}s` : "—"}</small>
      </button>
      <button
        onClick={() => setAutoOn(!autoOn)}
        className="btn-ghost-premium !py-2 !px-3.5 !text-xs"
      >
        <Clock className="w-3.5 h-3.5" />
        <span>{t("auto")}</span>
        <small className={autoOn ? "text-green-400" : "text-white/40"}>{autoOn ? "ON" : "OFF"}</small>
      </button>
    </>
  );

  const STAT_ACCENTS = [
    "rgba(110, 227, 183, 0.5)",
    "rgba(96, 165, 250, 0.5)",
    "rgba(244, 114, 182, 0.5)",
    "rgba(167, 139, 250, 0.5)",
    "rgba(34, 211, 238, 0.5)",
  ];

  return (
    <>
      <BackButton />
      <main className="relative z-[2] min-h-screen flex flex-col items-center gap-5 px-[18px] pt-[60px] pb-[100px] max-w-[1120px] mx-auto">
        {/* Header */}
        <div className="w-full tracker-section">
          <PageHeader name={t("name")} tagline={t("tagline")} actions={socialChips} />
        </div>

        {/* Stats */}
        <div className="w-full tracker-section">
          <GlassPanel>
            <SectionTitle
              title={t("title")}
              right={
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${statusDotClass}`} />
                  <span className="text-xs text-white/50">{statusLabel}</span>
                </div>
              }
            />

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {/* HS% */}
              <article className="stat-card-premium" style={{ "--stat-accent": STAT_ACCENTS[0] } as React.CSSProperties}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-emerald-400/80">HS%</span>
                  <span className="text-[10px] text-white/35">{t("last10")}</span>
                </div>
                <div className="text-2xl font-extrabold text-white">{stats ? fmtPct(stats.avgHs) : "—"}</div>
                <div className="text-[10px] text-white/35 mt-1">
                  {stats && stats.hsCount > 0 ? t("hsAvg", { count: stats.hsCount }) : t("hsNa")}
                </div>
              </article>

              {/* K/D */}
              <article className="stat-card-premium" style={{ "--stat-accent": STAT_ACCENTS[1] } as React.CSSProperties}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-blue-400/80">K/D</span>
                  <span className="text-[10px] text-white/35">{t("last10")}</span>
                </div>
                <div className="text-2xl font-extrabold text-white">{stats ? fmtNum(stats.kd) : "—"}</div>
                <div className="text-[10px] text-white/35 mt-1">
                  {stats ? `${stats.totalK} ${t("kills")} / ${stats.totalD} ${t("deaths")}` : "—"}
                </div>
              </article>

              {/* Winrate */}
              <article className="stat-card-premium" style={{ "--stat-accent": STAT_ACCENTS[2] } as React.CSSProperties}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-pink-400/80">Winrate</span>
                  <span className="text-[10px] text-white/35">{t("unrated")}</span>
                </div>
                <div className="text-2xl font-extrabold text-white">{stats ? fmtPct(stats.winrate) : "—"}</div>
                <div className="text-[10px] text-white/35 mt-1">
                  {stats && stats.knownResults > 0
                    ? t("winsLosses", { wins: stats.wins, losses: stats.losses })
                    : t("resultsNa")}
                </div>
              </article>

              {/* K/D/A */}
              <article className="stat-card-premium" style={{ "--stat-accent": STAT_ACCENTS[3] } as React.CSSProperties}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-purple-400/80">K / D / A</span>
                  <span className="text-[10px] text-white/35">{t("total")}</span>
                </div>
                <div className="text-2xl font-extrabold text-white">
                  {stats ? `${stats.totalK}/${stats.totalD}/${stats.totalA}` : "—"}
                </div>
                <div className="text-[10px] text-white/35 mt-1">
                  {stats ? t("totalMatches", { count: stats.matchCount }) : "—"}
                </div>
              </article>

              {/* Peak RR */}
              <article className="stat-card-premium" style={{ "--stat-accent": STAT_ACCENTS[4] } as React.CSSProperties}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-cyan-400/80">{t("peakRr")}</span>
                  <span className="text-[10px] text-white/35">{t("ranked")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Image src="/images/radiant.png" alt="Radiant" width={32} height={32} />
                  <div>
                    <div className="text-sm font-bold text-white">RADIANT</div>
                    <div className="text-xs text-white/45">867 RR</div>
                  </div>
                </div>
                <div className="text-[10px] text-white/35 mt-1">V25 &bull; ACT 2</div>
              </article>
            </div>

            {error && (
              <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
                {error}
              </div>
            )}
            <p className="text-xs text-white/25 mt-4 text-center">{t("hint")}</p>
          </GlassPanel>
        </div>

        {/* Matches */}
        <div className="w-full tracker-section">
          <GlassPanel>
            <SectionTitle title={t("matchesTitle")} />
            <div className="flex flex-col gap-2">
              {matches.map((m, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedMatch(m)}
                  className={`match-row-premium flex items-center gap-4 p-3 rounded-xl cursor-pointer ${
                    m.result === "win"
                      ? "bg-[rgba(110,255,190,0.04)] hover:bg-[rgba(110,255,190,0.10)]"
                      : m.result === "loss"
                      ? "bg-[rgba(255,120,150,0.04)] hover:bg-[rgba(255,120,150,0.10)]"
                      : "bg-white/[0.02] hover:bg-white/[0.05]"
                  }`}
                >
                  <Image
                    src={m.agentImg || "/images/IMG_4549.png"}
                    alt={m.agent}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-lg object-cover"
                    unoptimized
                  />

                  <div className="flex-1 min-w-0">
                    <strong className="text-sm text-white block">{m.map}</strong>
                    <span className="text-xs text-white/40">{m.mode.toUpperCase()} &bull; {m.agent}</span>
                  </div>

                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                    m.result === "win"
                      ? "bg-[rgba(110,255,190,0.15)] text-emerald-400"
                      : m.result === "loss"
                      ? "bg-[rgba(255,120,150,0.15)] text-pink-400"
                      : "bg-white/[0.06] text-white/40"
                  }`}>
                    {m.result === "win" ? "WIN" : m.result === "loss" ? "LOSS" : "—"}
                  </div>

                  <div className="hidden sm:block text-center w-16">
                    <div className="text-[10px] text-white/30">Score</div>
                    <div className="text-sm font-bold text-white">{m.score}</div>
                  </div>

                  <div className="text-center w-20">
                    <div className="text-[10px] text-white/30">K/D/A</div>
                    <div className="text-sm font-bold text-white">{m.kills}/{m.deaths}/{m.assists}</div>
                  </div>

                  <div className="hidden md:block text-center w-16">
                    <div className="text-[10px] text-white/30">HS%</div>
                    <div className="text-sm font-bold text-white">
                      {(() => {
                        const shots = m.headshots + m.bodyshots + m.legshots;
                        return shots > 0 ? fmtPct(m.headshots / shots) : "—";
                      })()}
                    </div>
                  </div>
                </div>
              ))}

              {matches.length === 0 && status !== "loading" && (
                <div className="text-center text-white/35 py-8 text-sm">{t("waiting")}</div>
              )}
            </div>
          </GlassPanel>
        </div>

        <Footer />
      </main>

      <MatchDetailModal match={selectedMatch} onClose={() => setSelectedMatch(null)} />
    </>
  );
}
