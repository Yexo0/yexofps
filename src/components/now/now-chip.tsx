// src/components/now/now-chip.tsx — Statut "en ce moment" en version courte, avec lien vers /now :
// bandeau sur la page Contact (disponibilité, avec mon avatar Discord), segment dans la barre d'état.
"use client";

import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { ACTIVITIES } from "@/config/now";
import { useLive } from "@/hooks/use-now";
import { Link } from "@/i18n/navigation";
import { Skeleton } from "@/components/ui/primitives";
import { AVAILABILITY_ICONS } from "./now-card";
import { DiscordAvatar, hasAvatar } from "./discord-avatar";

/** Bandeau de disponibilité (page Contact) */
export function NowBanner() {
  const t = useTranslations("now");
  const state = useLive();
  if (!state) return <Skeleton className="h-[62px] w-full rounded-[14px]" />;

  const { live, presence } = state;
  const activity = ACTIVITIES[live.id];
  const Icon = activity.icon;
  const AvailabilityIcon = AVAILABILITY_ICONS[activity.availability];

  return (
    <Link
      href="/now"
      className="group tile flex items-center gap-3.5 px-4 py-3 transition-colors hover:bg-surface-3"
    >
      {hasAvatar(presence) ? (
        <DiscordAvatar presence={presence} size={38} ringClassName="ring-surface-2" />
      ) : (
        <span
          aria-hidden="true"
          className="relative grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-accent-tint text-on-accent-container"
        >
          <Icon size={17} />
          <span className="live-dot absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-accent ring-2 ring-surface-2" />
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block text-[14px] font-medium text-fg">
          <span className="text-muted">{t("chip.label")} · </span>
          {t(`activities.${live.id}.title`, { name: live.name ?? "" })}
        </span>
        <span className="mt-0.5 flex items-center gap-1.5 text-[12.5px] text-muted">
          <AvailabilityIcon size={13} aria-hidden="true" className="shrink-0 text-accent" />
          {t(`availability.${activity.availability}`)}
        </span>
      </span>
      <ArrowRight
        size={16}
        aria-hidden="true"
        className="shrink-0 text-dim transition-transform group-hover:translate-x-0.5 group-hover:text-fg"
      />
    </Link>
  );
}

/** Segment de la barre d'état façon tmux : "● now: valorant" */
export function NowStatusSegment() {
  const t = useTranslations("now");
  const state = useLive();
  if (!state) return null;
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
