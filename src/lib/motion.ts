// src/lib/motion.ts — Motion tokens shared by every animation on the site, in JS (Motion, anime.js)
// and mirrored in CSS (globals.css, --ease-* / --dur-*). Change a value here and in globals.css together.
//
// Rules:
// - arrivals use EASE.out (fast start, long soft landing); exits use EASE.in; state changes EASE.inOut;
// - micro (hover, press) ≤ 200 ms, component changes ~350–600 ms, reveals ~0.9–1.2 s;
// - only transform and opacity are animated; everything is skipped under prefers-reduced-motion.
import type { Transition, Variants } from "motion/react";

export const EASE = {
  /** Arrivals: reveals, entrances, panels opening */
  out: [0.16, 1, 0.3, 1] as const,
  /** Movements between two states (tabs, indicators, layout) */
  inOut: [0.65, 0, 0.35, 1] as const,
  /** Exits: what leaves the screen */
  in: [0.7, 0, 0.84, 0] as const,
};

/** Durations in seconds */
export const DUR = {
  micro: 0.18,
  short: 0.35,
  base: 0.6,
  long: 0.9,
  hero: 1.2,
};

/** Delay between siblings, in seconds */
export const STAGGER = {
  items: 0.06,
  words: 0.05,
  letters: 0.035,
};

/** Spring used for anything that follows the pointer (magnetic buttons, tilt) */
export const SPRING = { type: "spring", stiffness: 260, damping: 22, mass: 0.6 } as const satisfies Transition;

/** Container that staggers its children */
export function stagger(delayChildren = 0, each = STAGGER.items): Variants {
  return { hidden: {}, shown: { transition: { delayChildren, staggerChildren: each } } };
}

/** Child that rises and fades in */
export const riseIn: Variants = {
  hidden: { opacity: 0, y: 28 },
  shown: { opacity: 1, y: 0, transition: { duration: DUR.long, ease: EASE.out } },
};

/** Child that rises from behind a mask (parent needs overflow: hidden) */
export const maskUp: Variants = {
  hidden: { y: "110%" },
  shown: { y: "0%", transition: { duration: DUR.hero, ease: EASE.out } },
};

/** True when the visitor asked for less motion (client only) */
export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
