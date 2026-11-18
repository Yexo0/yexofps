// src/components/now/now-chip.tsx — Statut "en ce moment" en version courte, avec lien vers /now :
// segment dans la barre d'état. (La page Contact affiche le statut complet, NowCard size="lg".)
"use client";

import { useTranslations } from "next-intl";
import { useLive } from "@/hooks/use-now";
import { Link } from "@/i18n/navigation";

/** Segment de la barre d'état façon tmux : "● now: valorant" */
export function NowStatusSegment() {
  const t = useTranslations("now");
  const state = useLive();
  // Avant le calcul du statut : même emplacement réservé (sinon la barre change de largeur au chargement)
  if (!state) {
    return (
      <span aria-hidden="true" className="hidden items-center gap-1.5 px-3 sm:flex">
        <span className="h-1.5 w-1.5 rounded-full bg-surface-hover" />
        now: <span className="h-2.5 w-16 rounded bg-surface-3" />
      </span>
    );
  }
  const { live } = state;
  return (
    <Link
      href="/now"
      aria-label={t("chip.aria", { activity: t(`activities.${live.id}.title`, { name: live.name ?? "" }) })}
      className="hidden items-center gap-1.5 px-3 transition-colors hover:text-fg sm:flex"
    >
      <span aria-hidden="true" className="live-dot h-1.5 w-1.5 rounded-full bg-accent" />
      now: <span className="text-fg">{t(`short.${live.id}`, { name: live.name?.toLowerCase() ?? "" })}</span>
    </Link>
  );
}
