// src/components/now/week-schedule.tsx — Semaine type : frise de la journée (du réveil au réveil
// suivant) et liste des créneaux, par type de jour. Le jour en cours est ouvert par défaut et le
// créneau actuel est marqué (repère "maintenant" sur la frise).
// TodayStrip : la frise du jour seule, avec le prochain créneau où je réponds (page Contact).
"use client";

import { useState, type CSSProperties } from "react";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Tabs } from "radix-ui";
import { useTranslations } from "next-intl";
import { ACTIVITIES, DAY_START, DAY_TYPES, type DayType } from "@/config/now";
import { dayPosition, daySlots, formatMinutes, type Slot } from "@/lib/now";
import { useLive, useNow } from "@/hooks/use-now";
import { Link } from "@/i18n/navigation";
import { Skeleton } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

/** Repères horaires sous la frise (heures après minuit = nuit suivante) */
const TICKS = ["09:00", "12:00", "15:00", "18:00", "21:00", "00:00", "03:00"];
const START = (() => {
  const [h, m] = DAY_START.split(":").map(Number);
  return h * 60 + m;
})();
const tickMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  const v = h * 60 + m;
  return v < START ? v + 24 * 60 : v;
};

export function WeekSchedule() {
  const t = useTranslations("now");
  const now = useNow();
  const [picked, setPicked] = useState<DayType | null>(null);
  const value = picked ?? now?.dayType ?? "weekday";

  return (
    <Tabs.Root value={value} onValueChange={(v) => setPicked(v as DayType)} className="flex flex-col gap-4">
      <Tabs.List aria-label={t("week.tabs")} className="flex flex-wrap gap-1.5">
        {DAY_TYPES.map((type) => (
          <Tabs.Trigger
            key={type}
            value={type}
            className="btn btn-sm bg-surface-2 text-muted hover:bg-surface-3 hover:text-fg data-[state=active]:bg-fg data-[state=active]:text-bg"
          >
            {t(`week.${type}`)}
            {now?.dayType === type && (
              <span aria-hidden="true" className="live-dot ml-0.5 h-1.5 w-1.5 rounded-full bg-accent" />
            )}
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      {DAY_TYPES.map((type) => (
        <Tabs.Content key={type} value={type} className="tab-in flex flex-col gap-4 outline-none">
          <Day type={type} nowMinutes={now?.dayType === type ? now.minutes : null} />
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}

function Day({ type, nowMinutes }: { type: DayType; nowMinutes: number | null }) {
  const t = useTranslations("now");
  const slots = daySlots(type);
  const isCurrent = (start: number, end: number) => nowMinutes !== null && nowMinutes >= start && nowMinutes < end;

  return (
    <>
      <DayStrip slots={slots} nowMinutes={nowMinutes} />

      <ul className="stagger flex flex-col gap-1">
        {slots.map((slot) => {
          const activity = ACTIVITIES[slot.id];
          const Icon = activity.icon;
          const active = isCurrent(slot.start, slot.end);
          return (
            <li
              key={slot.start}
              aria-current={active ? "time" : undefined}
              className={cn(
                "grid grid-cols-[auto_1fr] items-center gap-x-3.5 gap-y-0.5 rounded-xl px-3 py-2.5 sm:grid-cols-[112px_auto_1fr_auto]",
                active ? "bg-accent-tint text-on-accent-container" : "hover:bg-surface-2",
              )}
            >
              <span
                className={cn(
                  "col-span-2 text-[13px] tabular-nums sm:col-span-1",
                  active ? "text-on-accent-container" : "text-dim",
                )}
              >
                {formatMinutes(slot.start)} – {formatMinutes(slot.end)}
              </span>
              <Icon size={16} aria-hidden="true" className={active ? "" : "text-muted"} />
              <span className="min-w-0 text-[14px] font-medium">
                {t(`activities.${slot.id}.title`)}
                {active && (
                  <span className="ml-2 inline-block whitespace-nowrap rounded-full px-1.5 align-[1px] text-[11px] font-medium ring-1 ring-inset ring-[var(--glow-ring)]">
                    {t("week.now")}
                  </span>
                )}
              </span>
              <span
                className={cn(
                  "col-span-2 text-[12.5px] sm:col-span-1 sm:text-right",
                  active ? "text-on-accent-container" : "text-dim",
                )}
              >
                {t(`availability.${activity.availability}`)}
              </span>
            </li>
          );
        })}
      </ul>
    </>
  );
}

/** Frise d'une journée : largeur de chaque créneau proportionnelle à sa durée, repère "maintenant" */
function DayStrip({ slots, nowMinutes }: { slots: Slot[]; nowMinutes: number | null }) {
  const isCurrent = (start: number, end: number) => nowMinutes !== null && nowMinutes >= start && nowMinutes < end;
  return (
    <div aria-hidden="true">
      <div className="relative flex h-12 gap-[3px]">
        {slots.map((slot) => {
          const Icon = ACTIVITIES[slot.id].icon;
          const active = isCurrent(slot.start, slot.end);
          return (
            <div
              key={slot.start}
              className={cn(
                "grid min-w-0 place-items-center rounded-[8px] first:rounded-l-[12px] last:rounded-r-[12px]",
                active ? "glow bg-accent-tint text-on-accent-container" : "bg-surface-3 text-muted",
              )}
              style={{ flex: `${slot.end - slot.start} 1 0` } as CSSProperties}
            >
              {slot.end - slot.start >= 120 && <Icon size={16} />}
            </div>
          );
        })}
        {nowMinutes !== null && (
          <span
            className="absolute -inset-y-1.5 w-0.5 rounded-full bg-accent shadow-[0_0_10px_var(--glow-strong)]"
            style={{ left: `${dayPosition(nowMinutes) * 100}%` }}
          />
        )}
      </div>
      <div className="relative mt-1.5 h-4 text-[11px] tabular-nums text-dim">
        {TICKS.map((tick) => (
          <span
            key={tick}
            className="absolute -translate-x-1/2"
            style={{ left: `${dayPosition(tickMinutes(tick)) * 100}%` }}
          >
            {tick.slice(0, 2)}h
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * Frise du jour en cours (page Contact), avec le prochain créneau où je réponds quand je ne suis pas
 * dispo maintenant. Statut Discord en direct pris en compte (useLive), sinon emploi du temps.
 */
export function TodayStrip() {
  const t = useTranslations("now");
  const state = useLive();
  if (!state) return <Skeleton className="h-[118px] w-full" />;

  const { now, live } = state;
  const slots = daySlots(now.dayType);
  const openNow = ACTIVITIES[live.id].availability === "open";
  const nextOpen = openNow
    ? undefined
    : slots.find((slot) => slot.start >= now.current.end && ACTIVITIES[slot.id].availability === "open");

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="label">{t("today.title")}</p>
        <Link href="/now" className="group inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-accent">
          {t("today.week")}
          <ArrowRight size={13} aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
      <DayStrip slots={slots} nowMinutes={now.minutes} />
      {nextOpen && (
        <p className="flex items-center gap-2 text-[13.5px] text-muted">
          <MessageCircle size={15} aria-hidden="true" className="shrink-0 text-accent" />
          {t("today.nextOpen", {
            time: formatMinutes(nextOpen.start),
            activity: t(`activities.${nextOpen.id}.title`, { name: "" }),
          })}
        </p>
      )}
    </div>
  );
}
