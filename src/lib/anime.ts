// src/lib/anime.ts — anime.js helpers for imperative animations: figures that count up and SVG strokes
// that draw themselves. Same curves and durations as src/lib/motion.ts. Client only.
import { animate, cubicBezier, stagger, svg, type JSAnimation } from "animejs";
import { DUR, EASE } from "./motion";

const outCurve = cubicBezier(...EASE.out);
const inOutCurve = cubicBezier(...EASE.inOut);

/** Counts an element's text from 0 to `value`, formatted with `format`. Returns the animation. */
export function countTo(
  el: HTMLElement,
  value: number,
  format: (n: number) => string,
  duration = DUR.hero * 1000 + 400,
): JSAnimation {
  const state = { n: 0 };
  el.textContent = format(0);
  return animate(state, {
    n: value,
    duration,
    ease: outCurve,
    onUpdate: () => {
      el.textContent = format(state.n);
    },
    onComplete: () => {
      el.textContent = format(value);
    },
  });
}

/** Draws every `[data-draw]` stroke inside `root`, one after the other. Returns the animation. */
export function drawStrokes(root: Element, { delay = 120, each = 90, duration = 1400 } = {}): JSAnimation | null {
  const paths = root.querySelectorAll<SVGGeometryElement>("[data-draw]");
  if (!paths.length) return null;
  const drawables = svg.createDrawable(Array.from(paths));
  return animate(drawables, {
    draw: ["0 0", "0 1"],
    duration,
    delay: stagger(each, { start: delay }),
    ease: inOutCurve,
  });
}
