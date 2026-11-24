// src/components/now/now-chip.tsx — Statut "en ce moment" en version courte, avec lien vers /now :
// pastille du pied de page. (La page Contact affiche le statut complet, NowCard size="lg".)
"use client";

import { useTranslations } from "next-intl";
import { useLive } from "@/hooks/use-now";
import { Link } from "@/i18n/navigation";

/** Pastille "● En ce moment · Sur Valorant" */
export function NowChip() {
  const t = useTranslations("now");
  const state = useLive();
  // Avant le calcul du statut : même emplacement réservé (sinon la pastille change de largeur au chargement)
  if (!state) {
    return (
      <span aria-hidden="true" className="chip w-56 gap-2.5">
        <span className="h-2 w-2 rounded-full bg-surface-3" />
        <span className="h-2.5 flex-1 rounded-full bg-surface-3" />
      </span>
    );
  }
  const { live } = state;
  const activity = t(`activities.${live.id}.title`, { name: live.name ?? "" });
  return (
    <Link
      href="/now"
      aria-label={t("chip.aria", { activity })}
      className="chip gap-2.5 transition-colors hover:bg-surface-3"
    >
      <span aria-hidden="true" className="live-dot h-2 w-2 rounded-full bg-accent" />
      <span className="text-dim">{t("chip.label")}</span>
      <span className="truncate">{activity}</span>
    </Link>
  );
}
