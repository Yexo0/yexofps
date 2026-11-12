// src/config/now.ts — Mon emploi du temps type, source de la page /now et du statut affiché
// sur Contact et dans la barre d'état. Le statut est calculé à l'heure de Paris, chez le visiteur :
// rien à mettre à jour à la main, il suffit de modifier ce fichier si le planning change.
import { Clapperboard, Gamepad2, Headphones, Laptop, Moon, Trees, type LucideIcon } from "lucide-react";

export const NOW_TIMEZONE = "Europe/Paris";

/**
 * Disponibilité pendant une activité :
 * open = je réponds · slow = réponse plus lente · mail = presque seulement par mail · asleep = je dors
 */
export type Availability = "open" | "slow" | "mail" | "asleep";

export type ActivityId = "music" | "work" | "valorant" | "editing" | "grass" | "offline";

export const ACTIVITIES: Record<ActivityId, { icon: LucideIcon; availability: Availability }> = {
  music: { icon: Headphones, availability: "slow" },
  work: { icon: Laptop, availability: "mail" },
  valorant: { icon: Gamepad2, availability: "open" },
  editing: { icon: Clapperboard, availability: "open" },
  grass: { icon: Trees, availability: "slow" },
  offline: { icon: Moon, availability: "asleep" },
};

export type DayType = "weekday" | "saturday" | "sunday";

/**
 * Une journée commence au réveil (DAY_START) et se termine au réveil suivant.
 * Chaque créneau dure jusqu'au début du suivant ; une heure avant DAY_START est celle de la nuit
 * suivante (ex : "01:00" = 1 h du matin, après la soirée).
 */
export const DAY_START = "06:30";

export const SCHEDULE: Record<DayType, readonly (readonly [string, ActivityId])[]> = {
  weekday: [
    ["06:30", "music"],
    ["09:00", "work"],
    ["18:00", "valorant"],
    ["22:30", "editing"],
    ["01:00", "offline"],
  ],
  // Week-end : la journée tourne entre dehors, Valorant et montage
  saturday: [
    ["06:30", "music"],
    ["09:00", "grass"],
    ["12:00", "valorant"],
    ["15:00", "editing"],
    ["18:00", "valorant"],
    ["22:30", "editing"],
    ["01:00", "offline"],
  ],
  sunday: [
    ["06:30", "music"],
    ["09:00", "editing"],
    ["12:00", "valorant"],
    ["15:00", "grass"],
    ["18:00", "valorant"],
    ["22:30", "editing"],
    ["01:00", "offline"],
  ],
};

export const DAY_TYPES: readonly DayType[] = ["weekday", "saturday", "sunday"];
