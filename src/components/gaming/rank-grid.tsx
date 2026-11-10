// src/components/gaming/rank-grid.tsx — Grille des rangs : une grande tuile pour le rang principal,
// des petites tuiles pour les autres. Chaque tuile porte un liseré fin de la couleur du jeu.
import Image from "next/image";
import { useTranslations } from "next-intl";
import { RANKS } from "@/config/site";
import { cn } from "@/lib/utils";
import { Reticle } from "@/components/ui/reticle";

type Rank = (typeof RANKS)[number];

function GameStripe({ color }: { color: string }) {
  return (
    <span
      aria-hidden="true"
      className="absolute left-4 top-0 h-[2px] w-9 rounded-b-full"
      style={{ backgroundColor: color }}
    />
  );
}

export function RankGrid({ className }: { className?: string }) {
  const t = useTranslations("gaming.ranks");
  const featured = RANKS.find((r) => r.featured) ?? RANKS[0];
  const others = RANKS.filter((r) => r.id !== featured.id);

  const gameLabel = (r: Rank) =>
    t.has(`items.${r.id}.platform`) ? `${r.game} · ${t(`items.${r.id}.platform`)}` : r.game;

  return (
    <ul className={cn("grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:grid-rows-3", className)}>
      <li className="tile relative flex flex-col items-center justify-center gap-3 px-4 py-6 text-center sm:row-span-3">
        <GameStripe color={featured.color} />
        <Reticle size={10} inset={8} />
        <Image
          src={featured.image}
          alt={t("alt", { rank: t(`items.${featured.id}.rank`), game: featured.game })}
          width={112}
          height={112}
          className="h-24 w-24 object-contain sm:h-28 sm:w-28"
        />
        <div>
          <p className="text-2xl font-bold tracking-tight">{t(`items.${featured.id}.rank`)}</p>
          <p className="mt-0.5 font-mono text-xs text-muted">{gameLabel(featured)}</p>
        </div>
        <p className="label">{t("peak")}</p>
      </li>
      {others.map((r) => (
        <li key={r.id} className="tile relative flex items-center gap-3.5 px-4 py-3.5">
          <GameStripe color={r.color} />
          <Image
            src={r.image}
            alt={t("alt", { rank: t(`items.${r.id}.rank`), game: r.game })}
            width={44}
            height={44}
            className="h-11 w-11 shrink-0 object-contain"
          />
          <div className="min-w-0">
            <p className="truncate text-[15px] font-bold leading-tight">{t(`items.${r.id}.rank`)}</p>
            <p className="mt-0.5 truncate font-mono text-[11.5px] text-muted">{gameLabel(r)}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
