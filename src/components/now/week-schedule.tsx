// src/components/now/week-schedule.tsx — Semaine type : frise de la journée (du réveil au réveil
// suivant) et liste des créneaux, par type de jour. Le jour en cours est ouvert par défaut et le
// créneau actuel est marqué (repère "maintenant" sur la frise).
"use client";

import { useState, type CSSProperties } from "react";
import { Tabs } from "radix-ui";
import { useTranslations } from "next-intl";
import { ACTIVITIES, DAY_START, DAY_TYPES, type DayType } from "@/config/now";
import { dayPosition, daySlots, formatMinutes } from "@/lib/now";
import { useNow } from "@/hooks/use-now";
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
            className="btn btn-sm bg-surface-2 text-muted hover:bg-surface-3 hover:text-fg data-[state=active]:bg-accent-tint data-[state=active]:text-on-accent-container"
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
      {/* Frise : largeur de chaque créneau proportionnelle à sa durée */}
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
        <div className="relative mt-1.5 h-4 font-mono text-[10.5px] text-dim">
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
                  "col-span-2 font-mono text-[12px] sm:col-span-1",
                  active ? "text-on-accent-container" : "text-dim",
                )}
              >
                {formatMinutes(slot.start)} – {formatMinutes(slot.end)}
              </span>
              <Icon size={16} aria-hidden="true" className={active ? "" : "text-muted"} />
              <span className="min-w-0 text-[14px] font-medium">
                {t(`activities.${slot.id}.title`)}
                {active && (
                  <span className="ml-2 inline-block whitespace-nowrap rounded-full px-1.5 align-[1px] font-mono text-[10.5px] font-normal ring-1 ring-inset ring-[var(--glow-ring)]">
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
