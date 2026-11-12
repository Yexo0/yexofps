// src/lib/now.ts — Calcule l'activité en cours à partir de l'emploi du temps (src/config/now.ts),
// à l'heure de Paris quel que soit le fuseau du visiteur. Fonctions pures, testables sans navigateur.
import { DAY_START, NOW_TIMEZONE, SCHEDULE, type ActivityId, type DayType } from "@/config/now";

const DAY = 24 * 60;

/** "06:30" → 390 */
function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

const START = toMinutes(DAY_START);

/** Minutes depuis le début de la journée "humaine" : les heures avant le réveil passent après minuit */
function dayMinutes(hhmm: string): number {
  const m = toMinutes(hhmm);
  return m < START ? m + DAY : m;
}

/** 390 → "06:30" (heures après minuit ramenées sur 24 h) */
export function formatMinutes(minutes: number): string {
  const m = ((minutes % DAY) + DAY) % DAY;
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
}

export interface Slot {
  id: ActivityId;
  /** Minutes depuis minuit le jour même, peut dépasser 1440 (nuit suivante) */
  start: number;
  end: number;
}

/** Créneaux d'un type de journée, du réveil au réveil suivant */
export function daySlots(type: DayType): Slot[] {
  const entries = SCHEDULE[type];
  return entries.map(([time, id], i) => ({
    id,
    start: dayMinutes(time),
    end: i + 1 < entries.length ? dayMinutes(entries[i + 1][0]) : START + DAY,
  }));
}

/** Lundi = 0 … dimanche = 6 */
function dayType(weekday: number): DayType {
  return weekday === 5 ? "saturday" : weekday === 6 ? "sunday" : "weekday";
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/** Jour de la semaine et minutes depuis minuit, à Paris */
export function parisClock(date: Date): { weekday: number; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: NOW_TIMEZONE,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return { weekday: WEEKDAYS.indexOf(get("weekday")), minutes: Number(get("hour")) * 60 + Number(get("minute")) };
}

export interface NowStatus {
  /** Instant du calcul (ms) */
  at: number;
  /** Type de la journée en cours (avant le réveil, c'est encore la veille) */
  dayType: DayType;
  /** Minutes depuis minuit, dans le repère de la journée en cours (peut dépasser 1440) */
  minutes: number;
  current: Slot;
  next: Slot;
  /** Minutes avant le prochain créneau */
  remaining: number;
  /** Avancement du créneau en cours, de 0 à 1 */
  progress: number;
}

export function nowStatus(date: Date): NowStatus {
  const clock = parisClock(date);
  const beforeWake = clock.minutes < START;
  const weekday = beforeWake ? (clock.weekday + 6) % 7 : clock.weekday;
  const minutes = beforeWake ? clock.minutes + DAY : clock.minutes;
  const type = dayType(weekday);
  const slots = daySlots(type);
  const index = Math.max(
    0,
    slots.findIndex((s) => minutes >= s.start && minutes < s.end),
  );
  const current = slots[index];
  const next = slots[index + 1] ?? daySlots(dayType((weekday + 1) % 7))[0];
  return {
    at: date.getTime(),
    dayType: type,
    minutes,
    current,
    next,
    remaining: current.end - minutes,
    progress: (minutes - current.start) / (current.end - current.start),
  };
}

/** Position (0 à 1) d'une heure de la journée sur la frise, du réveil au réveil suivant */
export function dayPosition(minutes: number): number {
  return (minutes - START) / DAY;
}
