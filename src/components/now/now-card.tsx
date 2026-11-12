// src/components/now/now-card.tsx — Activité en cours (heure de Paris) : titre, disponibilité,
// avancement du créneau (ou durée si vue en direct sur Discord), activité suivante, morceau Spotify
// en écoute et actions utiles (mail, Discord, Spotify…).
"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight, Clock, ExternalLink, Mail, MessageCircle, Moon, type LucideIcon } from "lucide-react";
import { ACTIVITIES, type ActivityId, type Availability } from "@/config/now";
import { EMAILS, SOCIALS, SPOTIFY_URL } from "@/config/site";
import { formatMinutes } from "@/lib/now";
import { useLive } from "@/hooks/use-now";
import { SpotifyNow } from "./spotify-now";
import { DiscordAvatar, hasAvatar } from "./discord-avatar";
import { ButtonLink, ExternalButton, Skeleton, buttonClass } from "@/components/ui/primitives";
import { CopyButton } from "@/components/ui/copy-button";

export const AVAILABILITY_ICONS: Record<Availability, LucideIcon> = {
  open: MessageCircle,
  slow: Clock,
  mail: Mail,
  asleep: Moon,
};

/** Clé et valeurs du message de durée : "45 min", "2 h", "2 h 15 min" */
export function durationParts(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return { key: h === 0 ? "m" : m === 0 ? "h" : "hm", values: { h, m } } as const;
}

export function NowCard() {
  const t = useTranslations("now");
  const state = useLive();

  if (!state) {
    return (
      <div className="flex flex-col gap-4" aria-busy="true">
        <span className="sr-only">{t("loading")}</span>
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-2 w-full" />
      </div>
    );
  }

  const { now, presence, live } = state;
  const { current, next } = now;
  const activity = ACTIVITIES[live.id];
  const Icon = activity.icon;
  const AvailabilityIcon = AVAILABILITY_ICONS[activity.availability];
  const NextIcon = ACTIVITIES[next.id].icon;
  const fromDiscord = live.source === "discord";
  const remaining = durationParts(now.remaining);
  const since = fromDiscord && live.since ? durationParts(Math.max(1, Math.floor((now.at - live.since) / 60_000))) : null;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 font-mono text-[11.5px] text-muted">
        <span className="flex items-center gap-2">
          <span aria-hidden="true" className="live-dot h-2 w-2 rounded-full bg-accent" />
          {t("parisTime", { time: formatMinutes(now.minutes) })}
        </span>
        {presence && <span className="text-dim">{t("discord.label", { status: t(`discord.${presence.discord}`) })}</span>}
        <span className="tag ml-auto">{t(`source.${live.source}`)}</span>
      </div>

      <div className="flex items-start gap-4">
        {/* Avatar Discord quand le statut en direct est disponible, sinon l'icône de l'activité */}
        {hasAvatar(presence) ? (
          <DiscordAvatar presence={presence} size={56} className="m-1.5" />
        ) : (
          <span
            aria-hidden="true"
            className="glow grid h-14 w-14 shrink-0 place-items-center rounded-[16px] bg-accent-tint text-on-accent-container"
          >
            <Icon size={26} strokeWidth={1.75} />
          </span>
        )}
        <div className="min-w-0">
          <h2 className="text-[26px] font-bold leading-tight tracking-tight">
            {t(`activities.${live.id}.title`, { name: live.name ?? "" })}
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-muted">{t(`activities.${live.id}.text`)}</p>
        </div>
      </div>

      <p className="tile flex items-center gap-2.5 px-4 py-3 text-[14px] font-medium">
        <AvailabilityIcon size={16} aria-hidden="true" className="shrink-0 text-accent" />
        {t(`availability.${activity.availability}`)}
      </p>

      {fromDiscord ? (
        since && (
          <p className="font-mono text-[11.5px] text-muted">
            {t("since", { duration: t(`duration.${since.key}`, since.values) })}
          </p>
        )
      ) : (
        <>
          {/* Avancement du créneau */}
          <div className="flex flex-col gap-2">
            <div
              className="h-1.5 overflow-hidden rounded-full bg-surface-3"
              role="progressbar"
              aria-label={t("progressLabel")}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(now.progress * 100)}
            >
              <div className="h-full rounded-full bg-accent" style={{ width: `${now.progress * 100}%` }} />
            </div>
            <div className="flex justify-between font-mono text-[11.5px] text-dim">
              <span>{formatMinutes(current.start)}</span>
              <span className="text-muted">
                {t("remaining", { duration: t(`duration.${remaining.key}`, remaining.values) })}
              </span>
              <span>{formatMinutes(current.end)}</span>
            </div>
          </div>

          <p className="flex items-center gap-2 text-[13.5px] text-muted">
            <NextIcon size={15} aria-hidden="true" className="shrink-0 text-dim" />
            {t("next", { activity: t(`activities.${next.id}.title`, { name: "" }), time: formatMinutes(next.start) })}
          </p>
        </>
      )}

      {presence?.spotify && <SpotifyNow track={presence.spotify} />}

      <Actions id={live.id} availability={activity.availability} />
    </div>
  );
}

/** Boutons adaptés : comment me joindre maintenant + lien lié à l'activité */
function Actions({ id, availability }: { id: ActivityId; availability: Availability }) {
  const t = useTranslations("now.actions");
  const mailFirst = availability === "mail" || availability === "asleep";
  const buttons: ReactNode[] = [];

  const mail = (
    <a key="mail" href={`mailto:${EMAILS.pro}`} className={buttonClass(mailFirst ? "primary" : "tonal", "sm")}>
      <Mail size={14} aria-hidden="true" />
      {t("mail")}
    </a>
  );
  const discord = (
    <ExternalButton key="discord" href={SOCIALS.discord.url} variant={mailFirst ? "tonal" : "primary"} size="sm" showIcon>
      {t("discord")}
    </ExternalButton>
  );

  if (mailFirst) buttons.push(mail, <CopyButton key="copy" value={EMAILS.pro} label={t("mailLabel")} />);
  else buttons.push(discord, mail);

  if (id === "music" && SPOTIFY_URL)
    buttons.push(
      <ExternalButton key="spotify" href={SPOTIFY_URL} variant="ghost" size="sm">
        {t("spotify")}
        <ExternalLink size={13} aria-hidden="true" className="opacity-70" />
      </ExternalButton>,
    );
  const internal = { valorant: "/gaming#tracker", editing: "/creator#edits", work: "/career" } as const;
  if (id in internal)
    buttons.push(
      <ButtonLink key="internal" href={internal[id as keyof typeof internal]} variant="ghost" size="sm">
        {t(id as keyof typeof internal)}
        <ArrowRight size={14} aria-hidden="true" />
      </ButtonLink>,
    );

  return <div className="flex flex-wrap gap-2">{buttons}</div>;
}
