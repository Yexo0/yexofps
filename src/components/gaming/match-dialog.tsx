// src/components/gaming/match-dialog.tsx — Détail d'une partie : K/D/A, score, tirs et répartition.
"use client";

import { useFormatter, useTranslations } from "next-intl";
import { Dialog } from "radix-ui";
import { X } from "lucide-react";
import type { MatchData } from "@/lib/tracker-types";
import { AgentAvatar, ResultTag, playerScore, useStatFormat } from "./tracker-parts";

const R = 44;
const CIRC = 2 * Math.PI * R;

export function MatchDialog({ match, onClose }: { match: MatchData | null; onClose: () => void }) {
  const t = useTranslations("gaming.matches.detail");
  const format = useFormatter();
  const f = useStatFormat();

  const shots = match ? match.headshots + match.bodyshots + match.legshots : 0;
  const parts = match
    ? [
        { key: "headshots", value: match.headshots, color: "var(--accent)" },
        { key: "bodyshots", value: match.bodyshots, color: "var(--accent-mid)" },
        { key: "legshots", value: match.legshots, color: "var(--surface-hover)" },
      ]
    : [];

  // Segments du donut (offsets cumulés calculés sans mutation pendant le rendu)
  const segments = parts.map((p, i) => {
    const before = parts.slice(0, i).reduce((sum, q) => sum + q.value, 0);
    const ratio = shots > 0 ? p.value / shots : 0;
    const offset = shots > 0 ? (before / shots) * CIRC : 0;
    return { ...p, ratio, dash: ratio * CIRC, offset };
  });

  return (
    <Dialog.Root open={!!match} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="overlay" />
        <Dialog.Content className="dialog p-5 sm:p-6">
          {match && (
            <>
              <div className="flex items-start gap-4">
                <AgentAvatar src={match.agentImg} agent={match.agent} size={56} />
                <div className="min-w-0 flex-1">
                  <Dialog.Title className="text-lg font-bold leading-tight">{match.map}</Dialog.Title>
                  <Dialog.Description className="font-mono text-[11.5px] text-dim">
                    {match.mode} · {match.agent}
                    {match.ts > 0 &&
                      ` · ${format.dateTime(new Date(match.ts * 1000), { dateStyle: "medium", timeStyle: "short" })}`}
                  </Dialog.Description>
                  <div className="mt-2">
                    <ResultTag result={match.result} />
                  </div>
                </div>
                <Dialog.Close className="icon-btn -mr-2 -mt-2" aria-label={t("close")}>
                  <X size={18} aria-hidden="true" />
                </Dialog.Close>
              </div>

              <dl className="mt-5 grid grid-cols-4 gap-2">
                {(
                  [
                    ["kills", match.kills],
                    ["deaths", match.deaths],
                    ["assists", match.assists],
                    ["score", playerScore(match)],
                  ] as const
                ).map(([k, v]) => (
                  <div key={k} className="tile flex flex-col px-3 py-3">
                    <dd className="order-1 text-xl font-bold tabular-nums">{v}</dd>
                    <dt className="label order-2 mt-1">{t(k)}</dt>
                  </div>
                ))}
              </dl>

              <div className="tile mt-2 flex flex-col items-center gap-5 px-4 py-4 sm:flex-row">
                <svg width="120" height="120" viewBox="0 0 120 120" role="img" aria-label={t("accuracy")}>
                  <circle cx="60" cy="60" r={R} fill="none" stroke="var(--surface-3)" strokeWidth="12" />
                  {segments.map((s) => (
                    <circle
                      key={s.key}
                      cx="60"
                      cy="60"
                      r={R}
                      fill="none"
                      stroke={s.color}
                      strokeWidth="12"
                      strokeDasharray={`${s.dash} ${CIRC}`}
                      strokeDashoffset={-s.offset}
                      transform="rotate(-90 60 60)"
                    />
                  ))}
                  <text x="60" y="58" textAnchor="middle" fill="var(--text)" fontSize="20" fontWeight="700">
                    {shots}
                  </text>
                  <text x="60" y="76" textAnchor="middle" fill="var(--text-dim)" fontSize="10" fontFamily="var(--font-mono)">
                    {t("shots")}
                  </text>
                </svg>
                <div className="w-full flex-1">
                  <p className="label mb-2">{t("accuracy")}</p>
                  <dl className="flex flex-col gap-1.5">
                    {segments.map((s) => (
                      <div key={s.key} className="flex items-center gap-2.5 text-sm">
                        <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
                        <dt className="flex-1 text-muted">{t(s.key)}</dt>
                        <dd className="font-mono text-xs text-dim">{s.value}</dd>
                        <dd className="w-14 text-right font-semibold tabular-nums">
                          {f.pct(shots > 0 ? s.ratio : NaN)}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
