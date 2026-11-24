// src/components/now/spotify-now.tsx — Morceau en écoute sur Spotify (statut Discord en direct) :
// pochette, titre, artiste, avancement à la seconde et lien vers le morceau.
"use client";

import Image from "next/image";
import { useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { ExternalLink } from "lucide-react";
import type { Presence } from "@/lib/presence";

type Track = NonNullable<Presence["spotify"]>;

/** Horloge à la seconde, seulement tant que ce bloc est affiché */
function subscribe(onTick: () => void) {
  const id = setInterval(onTick, 1_000);
  return () => clearInterval(id);
}
const getSecond = () => Math.floor(Date.now() / 1_000);
const getServerSecond = () => 0;

const clock = (ms: number) => {
  const s = Math.max(0, Math.round(ms / 1_000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

export function SpotifyNow({ track }: { track: Track }) {
  const t = useTranslations("now.spotify");
  const second = useSyncExternalStore(subscribe, getSecond, getServerSecond);
  const duration = track.end - track.start;
  const elapsed = Math.min(Math.max(second * 1_000 - track.start, 0), duration);
  const progress = duration > 0 ? elapsed / duration : 0;

  return (
    <div className="tile flex items-center gap-3.5 p-2.5 pr-4">
      {track.art ? (
        <Image
          src={track.art}
          alt={t("cover", { album: track.album || track.song })}
          width={64}
          height={64}
          className="h-16 w-16 shrink-0 rounded-[10px] object-cover"
        />
      ) : (
        <span aria-hidden="true" className="h-16 w-16 shrink-0 rounded-[10px] bg-surface-3" />
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="label">{t("label")}</p>
        <p className="truncate text-[14px] font-semibold text-fg">{track.song}</p>
        <p className="truncate text-[12.5px] text-muted">{track.artist}</p>
        <div className="mt-1 flex items-center gap-2 font-mono text-[10.5px] text-dim">
          <span>{clock(elapsed)}</span>
          <span
            className="h-1 flex-1 overflow-hidden rounded-full bg-surface-3"
            role="progressbar"
            aria-label={t("progress")}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress * 100)}
          >
            <span className="block h-full rounded-full bg-accent" style={{ width: `${progress * 100}%` }} />
          </span>
          <span>{clock(duration)}</span>
        </div>
      </div>
      {track.url && (
        <a
          href={track.url}
          target="_blank"
          rel="noopener noreferrer"
          className="icon-btn h-9 w-9 shrink-0"
          aria-label={t("open", { song: track.song })}
        >
          <ExternalLink size={15} aria-hidden="true" />
        </a>
      )}
    </div>
  );
}
