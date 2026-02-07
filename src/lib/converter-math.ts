// src/lib/converter-math.ts

export const GAMES = {
  cs2: { name: "CS2", yaw: 0.022 },
  valo: { name: "Valorant", yaw: 0.07 },
  apex: { name: "Apex Legends", yaw: 0.022 },
  ow2: { name: "Overwatch 2", yaw: 0.0066 },
} as const;

export type GameKey = keyof typeof GAMES;

export const GAME_KEYS = Object.keys(GAMES) as GameKey[];

/** cm/360 = (360 * 2.54) / (DPI * Sens * Yaw) */
export function cm360(dpi: number, sens: number, yaw: number): number {
  return (360 * 2.54) / (dpi * sens * yaw);
}

/** Sens = (360 * 2.54) / (DPI * cm360 * Yaw) */
export function sensFromCm360(dpi: number, cm: number, yaw: number): number {
  return (360 * 2.54) / (dpi * cm * yaw);
}

export function round(n: number, d = 4): number {
  return Number(n.toFixed(d));
}
