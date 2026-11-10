// src/lib/utils.ts — Utilitaires partagés.
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Fusionne des classes Tailwind sans doublons conflictuels */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Formate un prix en euros (nombre ou fourchette) selon la langue */
export function formatPrice(price: number | readonly [number, number], locale: string): string {
  const fmt = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });
  if (typeof price === "number") return fmt.format(price);
  return fmt.formatRange(price[0], price[1]);
}
