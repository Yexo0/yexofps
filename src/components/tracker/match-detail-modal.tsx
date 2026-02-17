// src/components/tracker/match-detail-modal.tsx
"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { MatchData, fmtPct } from "@/lib/tracker-types";

interface Props {
  match: MatchData | null;
  onClose: () => void;
}

export function MatchDetailModal({ match, onClose }: Props) {
  const t = useTranslations("tracker");

  if (!match) return null;

  const shots = match.headshots + match.bodyshots + match.legshots;
  const hsPct = shots > 0 ? match.headshots / shots : NaN;
  const bsPct = shots > 0 ? match.bodyshots / shots : NaN;
  const lsPct = shots > 0 ? match.legshots / shots : NaN;

  const date = new Date(match.ts * 1000).toLocaleString();

  const circumference = 2 * Math.PI * 45; // ~282.7

  return (
    <Dialog open={!!match} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="bg-[#111010] border-white/10 text-white max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className={`flex items-center gap-4 p-4 rounded-xl mb-4 ${
          match.result === "win" ? "bg-[rgba(110,255,190,0.08)]" : match.result === "loss" ? "bg-[rgba(255,120,150,0.08)]" : "bg-white/5"
        }`}>
          <Image
            src={match.agentImg || "/images/IMG_4549.png"}
            alt={match.agent}
            width={56}
            height={56}
            className="w-14 h-14 rounded-xl object-cover"
            unoptimized
          />
          <div className="flex-1">
            <div className="font-bold text-lg">{match.map}</div>
            <div className="text-xs text-white/55">{match.mode.toUpperCase()} &bull; {match.agent}</div>
            <div className="text-xs text-white/40 mt-0.5">{date}</div>
          </div>
          <div className={`px-3 py-1.5 rounded-full text-sm font-bold ${
            match.result === "win"
              ? "bg-[rgba(110,255,190,0.2)] text-[rgba(110,255,190,1)]"
              : "bg-[rgba(255,120,150,0.2)] text-[rgba(255,120,150,1)]"
          }`}>
            {match.result === "win" ? "WIN" : "LOSS"}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-white/5 rounded-xl p-3 text-center">
            <div className="text-[10px] text-white/40 mb-1">{t("modalKills")}</div>
            <div className="text-xl font-extrabold">{match.kills}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 text-center">
            <div className="text-[10px] text-white/40 mb-1">{t("modalDeaths")}</div>
            <div className="text-xl font-extrabold">{match.deaths}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 text-center">
            <div className="text-[10px] text-white/40 mb-1">{t("modalAssists")}</div>
            <div className="text-xl font-extrabold">{match.assists}</div>
          </div>
        </div>

        {/* Score */}
        <div className="bg-white/5 rounded-xl p-3 text-center mb-4">
          <div className="text-[10px] text-white/40 mb-1">{t("modalScore")}</div>
          <div className="text-xl font-extrabold">{match.score}</div>
        </div>

        {/* Shots */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-white/5 rounded-xl p-3 text-center">
            <div className="text-[10px] text-white/40 mb-1">{t("modalHeadshots")}</div>
            <div className="text-xl font-extrabold">{match.headshots}</div>
            <div className="text-[10px] text-white/40">{fmtPct(hsPct)} &bull; {shots} {t("modalTotalShots")}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 text-center">
            <div className="text-[10px] text-white/40 mb-1">{t("modalBodyshots")}</div>
            <div className="text-xl font-extrabold">{match.bodyshots}</div>
            <div className="text-[10px] text-white/40">{fmtPct(bsPct)}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 text-center">
            <div className="text-[10px] text-white/40 mb-1">{t("modalLegshots")}</div>
            <div className="text-xl font-extrabold">{match.legshots}</div>
            <div className="text-[10px] text-white/40">{fmtPct(lsPct)}</div>
          </div>
        </div>

        {/* Accuracy Pie Chart */}
        <div className="bg-white/5 rounded-xl p-4 text-center">
          <div className="text-[10px] text-white/40 mb-3">{t("modalAccuracy")}</div>
          <div className="flex items-center justify-center gap-6">
            <div className="relative">
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle
                  className="pie-segment hs-seg"
                  cx="60" cy="60" r="45"
                  style={{
                    strokeDasharray: `${isFinite(hsPct) ? hsPct * circumference : 0} ${circumference}`,
                    strokeDashoffset: 0,
                  }}
                />
                <circle
                  className="pie-segment bs-seg"
                  cx="60" cy="60" r="45"
                  style={{
                    strokeDasharray: `${isFinite(bsPct) ? bsPct * circumference : 0} ${circumference}`,
                    strokeDashoffset: isFinite(hsPct) ? -hsPct * circumference : 0,
                  }}
                />
                <circle
                  className="pie-segment ls-seg"
                  cx="60" cy="60" r="45"
                  style={{
                    strokeDasharray: `${isFinite(lsPct) ? lsPct * circumference : 0} ${circumference}`,
                    strokeDashoffset: isFinite(hsPct) && isFinite(bsPct) ? -(hsPct + bsPct) * circumference : 0,
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-lg font-bold text-white">
                {shots}
              </div>
            </div>
            <div className="flex flex-col gap-2 text-left text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[rgba(110,255,190,0.85)]" />
                HS: {fmtPct(hsPct)}
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[rgba(120,170,255,0.85)]" />
                BS: {fmtPct(bsPct)}
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[rgba(255,140,180,0.85)]" />
                LS: {fmtPct(lsPct)}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
