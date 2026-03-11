// src/app/[locale]/convert/page.tsx — Sensitivity Converter
"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState, useCallback, useEffect, useRef } from "react";
import { BackButton } from "@/components/layout/back-button";
import { GlassPanel } from "@/components/shared/glass-panel";
import { SOCIAL_LINKS } from "@/lib/constants";
import { GAMES, GameKey, GAME_KEYS, cm360, sensFromCm360, round } from "@/lib/converter-math";
import { ArrowLeftRight, Zap, Link } from "lucide-react";
import { TikTokIcon } from "@/components/icons/tiktok";
import { DiscordIcon } from "@/components/icons/discord";
import { Orbitron } from "next/font/google";

const orbitron = Orbitron({ subsets: ["latin"], weight: ["700", "900"] });

type ConvertStatus = "neutral" | "ok" | "err";

export default function ConvertPage() {
  const t = useTranslations("converter");

  const [fromGame, setFromGame] = useState<GameKey>("valo");
  const [toGame, setToGame] = useState<GameKey>("apex");
  const [fromSens, setFromSens] = useState("0.35");
  const [fromDpi, setFromDpi] = useState("800");
  const [toDpi, setToDpi] = useState("800");
  const [sameDpi, setSameDpi] = useState(true);
  const [toSens, setToSens] = useState("—");
  const [cmVal, setCmVal] = useState("—");
  const [inVal, setInVal] = useState("—");
  const [edpiFrom, setEdpiFrom] = useState("—");
  const [edpiTo, setEdpiTo] = useState("—");
  const [statusType, setStatusType] = useState<ConvertStatus>("neutral");
  const [statusText, setStatusText] = useState("");
  const [flashResult, setFlashResult] = useState(false);
  const swapBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setStatusText(t("ready"));
  }, [t]);

  const convert = useCallback(() => {
    const fg = GAMES[fromGame];
    const tg = GAMES[toGame];

    const s = parseFloat(fromSens.replace(",", "."));
    const d1 = parseFloat(fromDpi.replace(",", "."));
    const d2 = parseFloat((sameDpi ? fromDpi : toDpi).replace(",", "."));

    if (!s || s <= 0) { setStatusType("err"); setStatusText(t("invalidSens")); return; }
    if (!d1 || d1 <= 0) { setStatusType("err"); setStatusText(t("invalidDpi")); return; }
    if (!d2 || d2 <= 0) { setStatusType("err"); setStatusText(t("invalidTargetDpi")); return; }

    const cm = cm360(d1, s, fg.yaw);
    const out = sensFromCm360(d2, cm, tg.yaw);

    setToSens(round(out, 4).toString());
    setCmVal(`${round(cm, 2)} cm`);
    setInVal(t("in360", { value: round(cm / 2.54, 2).toString() }));

    const ef = d1 * s;
    const et = d2 * out;
    setEdpiFrom(round(ef, 0).toString());
    setEdpiTo(t("edpiTo", { value: round(et, 0).toString() }));

    setStatusType("ok");
    setStatusText(t("converted"));

    // Flash the result
    setFlashResult(true);
    setTimeout(() => setFlashResult(false), 600);
  }, [fromGame, toGame, fromSens, fromDpi, toDpi, sameDpi, t]);

  useEffect(() => { convert(); }, [convert]);

  useEffect(() => {
    if (sameDpi) setToDpi(fromDpi);
  }, [sameDpi, fromDpi]);

  function swap() {
    setFromGame(toGame);
    setToGame(fromGame);
    if (!sameDpi) {
      const d1 = fromDpi;
      setFromDpi(toDpi);
      setToDpi(d1);
    }
    // Spin the swap button
    if (swapBtnRef.current) {
      swapBtnRef.current.classList.add("convert-swap-spin");
      setTimeout(() => swapBtnRef.current?.classList.remove("convert-swap-spin"), 400);
    }
  }

  useEffect(() => {
    const sections = document.querySelectorAll(".convert-section");
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

  const statusDot =
    statusType === "ok" ? "bg-green-400" :
    statusType === "err" ? "bg-red-400" :
    "bg-white/40";

  const statusRing =
    statusType === "ok" ? "ring-green-400/30" :
    statusType === "err" ? "ring-red-400/30" :
    "ring-white/10";

  return (
    <>
      <BackButton />
      <main className="relative z-[2] min-h-screen flex flex-col items-center gap-5 px-[18px] pt-[60px] pb-[100px] max-w-[1120px] mx-auto">
        {/* Header */}
        <div className="w-full convert-section">
          <GlassPanel className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="flex items-center gap-4 flex-1">
              <div className="avatar-wrapper w-[72px] h-[72px] shrink-0">
                <Image
                  src="/images/IMG_4549.png"
                  alt="Yexo avatar"
                  width={72}
                  height={72}
                  className="w-full h-full object-cover bg-[#111]"
                />
              </div>
              <div>
                <h1 className={`${orbitron.className} hero-title text-[1.5rem] sm:text-[1.7rem] font-black tracking-[0.06em]`}>
                  {t("name")}
                </h1>
                <div className="flex items-center gap-2 mt-1 text-sm text-white/55">
                  <Image src="/images/france.png" alt="France" width={18} height={13} className="rounded-sm" />
                  <span>France</span>
                </div>
                <p className="text-sm text-white/45 mt-1">{t("tagline")}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a href={SOCIAL_LINKS.discord} target="_blank" rel="noopener noreferrer"
                className="social-chip social-chip-discord" title="Discord">
                <DiscordIcon className="w-4 h-4" />
              </a>
              <a href={SOCIAL_LINKS.tiktok} target="_blank" rel="noopener noreferrer"
                className="social-chip social-chip-tiktok">
                <TikTokIcon className="w-4 h-4" />
              </a>
              <a href={SOCIAL_LINKS.linktree} target="_blank" rel="noopener noreferrer"
                className="social-chip social-chip-linktree">
                <Link className="w-4 h-4" />
              </a>
            </div>
          </GlassPanel>
        </div>

        {/* Converter */}
        <div className="w-full convert-section">
          <GlassPanel className="convert-panel">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold tracking-wide text-white">{t("title")}</h2>
                <div className="mt-1.5 h-[2px] w-12 rounded-full animated-line" />
              </div>
              {/* Status indicator */}
              <div className="flex items-center gap-2">
                <span className="relative flex items-center justify-center w-4 h-4">
                  <span className={`absolute inset-0 rounded-full ${statusRing} ring-2 animate-ping opacity-40`} />
                  <span className={`relative w-2 h-2 rounded-full ${statusDot}`} />
                </span>
                <span className="text-xs text-white/45">{statusText}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 items-end">
              {/* From */}
              <div className="convert-side flex flex-col gap-4">
                <div>
                  <label className="convert-label text-xs text-white/50 block mb-1.5">{t("fromGame")}</label>
                  <select
                    value={fromGame}
                    onChange={(e) => setFromGame(e.target.value as GameKey)}
                    className="convert-input w-full h-11 rounded-xl bg-white/[0.06] text-white border border-white/[0.08] px-3 text-sm outline-none focus:border-green-500/40 transition-all"
                  >
                    {GAME_KEYS.map((k) => <option key={k} value={k} className="bg-[#0d0d12] text-white">{GAMES[k].name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="convert-label text-xs text-white/50 block mb-1.5">{t("fromSens")}</label>
                  <input
                    type="number"
                    step="0.0001"
                    min="0"
                    value={fromSens}
                    onChange={(e) => setFromSens(e.target.value)}
                    className="convert-input w-full h-11 rounded-xl bg-white/[0.06] text-white border border-white/[0.08] px-3 text-sm outline-none focus:border-green-500/40 transition-all"
                    placeholder="ex: 0.35"
                  />
                </div>
                <div>
                  <label className="convert-label text-xs text-white/50 block mb-1.5">{t("fromDpi")}</label>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    value={fromDpi}
                    onChange={(e) => setFromDpi(e.target.value)}
                    className="convert-input w-full h-11 rounded-xl bg-white/[0.06] text-white border border-white/[0.08] px-3 text-sm outline-none focus:border-green-500/40 transition-all"
                    placeholder="ex: 800"
                  />
                </div>
              </div>

              {/* Middle controls */}
              <div className="flex flex-col items-center gap-3">
                <button
                  ref={swapBtnRef}
                  onClick={swap}
                  className="convert-swap w-11 h-11 rounded-full bg-white/[0.06] border border-white/[0.08] text-white flex items-center justify-center cursor-pointer hover:bg-white/10 hover:border-emerald-500/30 hover:shadow-[0_0_15px_rgba(110,227,183,0.12)] transition-all"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                </button>
                <label className="flex items-center gap-2 text-xs text-white/50 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={sameDpi}
                    onChange={(e) => setSameDpi(e.target.checked)}
                    className="accent-emerald-400"
                  />
                  {t("sameDpi")}
                </label>
                <button
                  onClick={convert}
                  className="convert-cta btn-premium !text-sm"
                >
                  <Zap className="w-4 h-4" /> {t("convert")}
                </button>
              </div>

              {/* To */}
              <div className="convert-side flex flex-col gap-4">
                <div>
                  <label className="convert-label text-xs text-white/50 block mb-1.5">{t("toGame")}</label>
                  <select
                    value={toGame}
                    onChange={(e) => setToGame(e.target.value as GameKey)}
                    className="convert-input w-full h-11 rounded-xl bg-white/[0.06] text-white border border-white/[0.08] px-3 text-sm outline-none focus:border-purple-500/40 transition-all"
                  >
                    {GAME_KEYS.map((k) => <option key={k} value={k} className="bg-[#0d0d12] text-white">{GAMES[k].name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="convert-label text-xs text-white/50 block mb-1.5">{t("toDpi")}</label>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    value={sameDpi ? fromDpi : toDpi}
                    onChange={(e) => setToDpi(e.target.value)}
                    disabled={sameDpi}
                    className="convert-input w-full h-11 rounded-xl bg-white/[0.06] text-white border border-white/[0.08] px-3 text-sm outline-none focus:border-purple-500/40 transition-all disabled:opacity-30"
                    placeholder="ex: 800"
                  />
                </div>
                <div>
                  <label className="convert-label text-xs text-white/50 block mb-1.5">{t("resultSens")}</label>
                  <div className={`convert-result-box relative w-full h-11 rounded-xl bg-white/[0.03] text-white border px-3 text-sm flex items-center font-bold ${flashResult ? "convert-flash" : "border-white/[0.08]"}`}>
                    {toSens}
                  </div>
                </div>
              </div>
            </div>
          </GlassPanel>
        </div>

        {/* Details */}
        <div className="w-full convert-section">
          <GlassPanel>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold tracking-wide text-white">{t("detailsTitle")}</h2>
                <div className="mt-1.5 h-[2px] w-12 rounded-full animated-line-blue" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* cm/360 */}
              <article className="convert-detail stat-card-premium" style={{ "--stat-accent": "rgba(110, 227, 183, 0.5)" } as React.CSSProperties}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="convert-detail-dot w-2 h-2 rounded-full bg-emerald-400/50" />
                  <span className="text-xs font-semibold text-white/70">{t("cm360Label")}</span>
                </div>
                <div className="text-2xl font-extrabold text-white mb-1">{cmVal}</div>
                <div className="text-[10px] text-white/35">{t("cm360Sub")}</div>
                <div className="text-[10px] text-white/25 mt-1">{inVal}</div>
              </article>

              {/* eDPI */}
              <article className="convert-detail stat-card-premium" style={{ "--stat-accent": "rgba(96, 165, 250, 0.5)" } as React.CSSProperties}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="convert-detail-dot w-2 h-2 rounded-full bg-blue-400/50" />
                  <span className="text-xs font-semibold text-white/70">{t("edpiLabel")}</span>
                </div>
                <div className="text-2xl font-extrabold text-white mb-1">{edpiFrom}</div>
                <div className="text-[10px] text-white/35">{t("edpiSub")}</div>
                <div className="text-[10px] text-white/25 mt-1">{edpiTo}</div>
              </article>

              {/* Yaw Values */}
              <article className="convert-detail stat-card-premium" style={{ "--stat-accent": "rgba(167, 139, 250, 0.5)" } as React.CSSProperties}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="convert-detail-dot w-2 h-2 rounded-full bg-purple-400/50" />
                  <span className="text-xs font-semibold text-white/70">{t("yawLabel")}</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  {GAME_KEYS.map((k) => (
                    <div key={k} className="convert-yaw-row flex justify-between text-xs">
                      <span className="text-white/60">{GAMES[k].name}</span>
                      <span className="text-white/35 font-mono">{GAMES[k].yaw}</span>
                    </div>
                  ))}
                </div>
                <div className="text-[10px] text-white/25 mt-2">{t("yawSub")}</div>
              </article>
            </div>
          </GlassPanel>
        </div>

      </main>
    </>
  );
}
