// src/components/creator/edit-timeline.tsx — Historique 2021 → aujourd'hui présenté comme une timeline
// de logiciel de montage : règle graduée, pistes V1 à V3, clips, tête de lecture sur "maintenant".
// Le dessin est décoratif ; une liste ordonnée équivalente est lue par les lecteurs d'écran (et affichée sur mobile).
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Gamepad2, Store, Video, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const START = 2021;

type ClipId = "competitive" | "tiktok" | "immortal" | "radiant" | "immortal3" | "services";

/**
 * Jalons réels. `year` = libellé de la liste (null = "ensuite"), `from` = début du clip sur la timeline.
 * Radiant : quelques mois en 2024, puis retour en Immortal 3 en jouant moins (date exacte inconnue,
 * le clip Radiant est donc dessiné sur une partie de 2024 seulement).
 */
const MILESTONES: { year: number | null; from: number; id: ClipId; icon?: LucideIcon; image?: string }[] = [
  { year: 2021, from: 2021, id: "competitive", icon: Gamepad2 },
  { year: 2022, from: 2022, id: "tiktok", icon: Video },
  { year: 2023, from: 2023, id: "immortal", image: "/images/ranks/valorant-immortal.png" },
  { year: 2024, from: 2024, id: "radiant", image: "/images/ranks/valorant-radiant.png" },
  { year: null, from: 2024.6, id: "immortal3", image: "/images/ranks/valorant-immortal.png" },
  { year: 2025, from: 2025, id: "services", icon: Store },
];

/** Pistes : chaque clip court de son jalon jusqu'au jalon suivant de la même piste (ou maintenant) */
const TRACKS: { id: "ranked" | "edits" | "shop"; clips: ClipId[] }[] = [
  { id: "ranked", clips: ["competitive", "immortal", "radiant", "immortal3"] },
  { id: "edits", clips: ["tiktok"] },
  { id: "shop", clips: ["services"] },
];

export function EditTimeline({ now }: { now: number }) {
  const t = useTranslations("creator.history");
  const end = Math.ceil(now + 0.15);
  const span = end - START;
  const pct = (year: number) => ((year - START) / span) * 100;
  const years = Array.from({ length: span + 1 }, (_, i) => START + i);
  const fromOf = (id: ClipId) => MILESTONES.find((m) => m.id === id)!.from;

  return (
    <>
      {/* Liste accessible (visible sur mobile) */}
      <ol className="flex flex-col gap-1.5 sm:sr-only">
        {MILESTONES.map(({ year, id, icon: Icon, image }) => (
          <li key={id} className="tile flex items-center gap-3.5 px-4 py-3">
            <span className="w-14 font-mono text-[13px] font-semibold text-accent">{year ?? t("then")}</span>
            <span className="grid h-7 w-7 place-items-center" aria-hidden="true">
              {image ? (
                <Image src={image} alt="" width={28} height={28} className="h-7 w-7 object-contain" />
              ) : Icon ? (
                <Icon size={16} className="text-muted" />
              ) : null}
            </span>
            <span className="text-sm font-medium">{t(`items.${id}`)}</span>
          </li>
        ))}
      </ol>

      {/* Timeline de montage (desktop) */}
      <div aria-hidden="true" className="hidden select-none gap-2 pb-6 sm:flex">
        {/* Noms des pistes */}
        <div className="flex w-12 shrink-0 flex-col font-mono text-[10px] leading-tight text-dim">
          <span className="flex h-6 items-start">TC</span>
          {TRACKS.map((track, ti) => (
            <span key={track.id} className="flex h-11 flex-col justify-center">
              <span className="text-muted">V{TRACKS.length - ti}</span>
              {t(`tracks.${track.id}`)}
            </span>
          ))}
        </div>

        {/* Règle, pistes et tête de lecture */}
        <div className="relative mr-4 min-w-0 flex-1">
          <div className="relative h-6 border-b border-line-strong">
            {years.map((y) => (
              <span key={y} className="absolute bottom-0 flex flex-col items-start" style={{ left: `${pct(y)}%` }}>
                <span className="-translate-x-1/2 font-mono text-[10px] text-dim">{y}</span>
                <span className="mt-0.5 h-1.5 w-px bg-line-strong" />
              </span>
            ))}
          </div>
          {TRACKS.map((track) => (
            <div key={track.id} className="relative h-11 border-b border-line">
              {track.clips.map((id, i) => {
                const from = fromOf(id);
                const next = track.clips[i + 1];
                const to = next ? fromOf(next) : now;
                const m = MILESTONES.find((x) => x.id === id)!;
                const Icon = m.icon;
                return (
                  <span
                    key={id}
                    className={cn(
                      "absolute top-1.5 flex h-8 items-center gap-1.5 overflow-hidden rounded-md border-l-2 px-2 text-[11.5px] font-semibold text-fg",
                      track.id === "ranked" ? "border-accent bg-accent-tint" : "border-accent-mid bg-surface-3",
                    )}
                    style={{ left: `calc(${pct(from)}% + 1px)`, width: `calc(${pct(to) - pct(from)}% - 3px)` }}
                  >
                    {m.image ? (
                      <Image src={m.image} alt="" width={16} height={16} className="h-4 w-4 shrink-0 object-contain" />
                    ) : Icon ? (
                      <Icon size={13} className="shrink-0 text-accent" />
                    ) : null}
                    <span className="truncate">{t(`clips.${id}`)}</span>
                  </span>
                );
              })}
            </div>
          ))}
          <span className="absolute bottom-0 top-0 w-px bg-accent" style={{ left: `${pct(now)}%` }}>
            <span className="absolute -left-1 top-4 h-2.5 w-[9px] rounded-sm bg-accent" />
            <span className="absolute -bottom-5 -translate-x-1/2 font-mono text-[10px] text-accent">{t("now")}</span>
          </span>
        </div>
      </div>
    </>
  );
}
