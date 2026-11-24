// src/components/shell/backdrop.tsx — Fond animé de tout le site : une aurore de lumières rouges qui
// dérivent lentement, une lueur qui suit la souris de loin, un léger décalage au défilement et une
// composition qui glisse d'une page à l'autre. Les cartes en verre le laissent voir.
// Coût minimal : canvas 2D de ~1/10 de la taille de l'écran (agrandi par le GPU, les dégradés restent
// lisses), 30 images/s, rien quand l'onglet est caché, une seule image figée en mouvement réduit.
// Avant le premier dessin (après le chargement de la page), un dégradé CSS équivalent tient la place.
"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "@/i18n/navigation";
import { afterLoadIdle } from "@/lib/defer";

type Rgb = [number, number, number];
interface Light {
  /** Position de repos (0–1), amplitude et vitesse de la dérive, rayon (part de la diagonale), couleur, intensité */
  x: number;
  y: number;
  ax: number;
  ay: number;
  sx: number;
  sy: number;
  r: number;
  c: Rgb;
  a: number;
}

/** Lumières par thème. En sombre elles s'additionnent sur le noir ; en clair, teintes pastel posées sur le gris. */
const PALETTES: Record<"dark" | "light", { base: Rgb; add: boolean; lights: Light[]; pointer: [Rgb, number] }> = {
  dark: {
    base: [0, 0, 0],
    add: true,
    lights: [
      { x: 0.8, y: 0.1, ax: 0.14, ay: 0.1, sx: 0.11, sy: 0.08, r: 0.46, c: [255, 70, 85], a: 0.26 },
      { x: 0.1, y: 0.8, ax: 0.12, ay: 0.12, sx: 0.07, sy: 0.1, r: 0.5, c: [122, 16, 32], a: 0.38 },
      { x: 0.45, y: 0.55, ax: 0.22, ay: 0.16, sx: 0.05, sy: 0.06, r: 0.34, c: [179, 18, 42], a: 0.16 },
      { x: 0.25, y: 0.1, ax: 0.16, ay: 0.08, sx: 0.09, sy: 0.05, r: 0.36, c: [143, 163, 191], a: 0.05 },
    ],
    pointer: [[255, 70, 85], 0.1],
  },
  light: {
    base: [245, 245, 247],
    add: false,
    lights: [
      { x: 0.78, y: 0.12, ax: 0.14, ay: 0.1, sx: 0.11, sy: 0.08, r: 0.55, c: [255, 120, 130], a: 0.22 },
      { x: 0.12, y: 0.78, ax: 0.12, ay: 0.12, sx: 0.07, sy: 0.1, r: 0.6, c: [255, 196, 200], a: 0.5 },
      { x: 0.45, y: 0.55, ax: 0.22, ay: 0.16, sx: 0.05, sy: 0.06, r: 0.42, c: [255, 220, 223], a: 0.45 },
      { x: 0.25, y: 0.1, ax: 0.16, ay: 0.08, sx: 0.09, sy: 0.05, r: 0.4, c: [214, 224, 238], a: 0.55 },
    ],
    pointer: [[255, 70, 85], 0.06],
  },
};

/** Largeur du canvas en pixels réels : le GPU l'agrandit à la taille de l'écran */
const RES = 160;
const FRAME_MS = 1000 / 30;

/** Décalage de composition propre à chaque page (stable : dérivé du chemin) */
function seedOf(path: string): number {
  let h = 0;
  for (let i = 0; i < path.length; i++) h = (h * 31 + path.charCodeAt(i)) | 0;
  return ((h >>> 0) % 1000) / 1000;
}

export function Backdrop() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const pathname = usePathname();
  const seed = useRef(seedOf(pathname));

  // Nouvelle page : la composition glisse vers une autre disposition
  useEffect(() => {
    seed.current = seedOf(pathname);
  }, [pathname]);

  useEffect(() => {
    const el = canvas.current;
    const ctx = el?.getContext("2d", { alpha: false });
    if (!el || !ctx) return;
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    let last = 0;
    let time = 0;
    let running = false;
    // Valeurs lissées : décalage de page, défilement, pointeur
    const state = { seed: seed.current, scroll: 0, px: 0.5, py: 0.4, tx: 0.5, ty: 0.4, pointer: 0, pointerTarget: 0 };

    const resize = () => {
      const w = RES;
      const h = Math.max(1, Math.round((RES * window.innerHeight) / Math.max(1, window.innerWidth)));
      if (el.width !== w || el.height !== h) {
        el.width = w;
        el.height = h;
      }
    };

    const draw = (dt: number) => {
      const theme = root.getAttribute("data-theme") === "light" ? "light" : "dark";
      const pal = PALETTES[theme];
      const w = el.width;
      const h = el.height;
      const diag = Math.hypot(w, h);
      // Lissage (indépendant de la cadence)
      const k = 1 - Math.exp(-dt / 900);
      state.seed += (seed.current - state.seed) * k;
      const scrollTarget = Math.min(1, window.scrollY / Math.max(1, window.innerHeight * 3));
      state.scroll += (scrollTarget - state.scroll) * k;
      const kp = 1 - Math.exp(-dt / 600);
      state.px += (state.tx - state.px) * kp;
      state.py += (state.ty - state.py) * kp;
      state.pointer += (state.pointerTarget - state.pointer) * kp;

      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = `rgb(${pal.base.join(",")})`;
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = pal.add ? "lighter" : "source-over";

      const t = time / 1000;
      const phase = state.seed * Math.PI * 2;
      const light = (x: number, y: number, r: number, c: Rgb, a: number) => {
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, `rgba(${c.join(",")},${a})`);
        g.addColorStop(0.5, `rgba(${c.join(",")},${a * 0.45})`);
        g.addColorStop(1, `rgba(${c.join(",")},0)`);
        ctx.fillStyle = g;
        ctx.fillRect(x - r, y - r, r * 2, r * 2);
      };
      pal.lights.forEach((l, i) => {
        const x = l.x + l.ax * Math.sin(t * l.sx * 2 + phase + i * 1.7);
        const y = l.y + l.ay * Math.cos(t * l.sy * 2 + phase * 0.7 + i) - state.scroll * 0.25 * (i % 2 ? 1 : -0.6);
        light(x * w, y * h, l.r * diag, l.c, l.a);
      });
      if (state.pointer > 0.01) {
        const [c, a] = pal.pointer;
        light(state.px * w, state.py * h, 0.32 * diag, c, a * state.pointer);
      }
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (now - last < FRAME_MS) return;
      const dt = last ? Math.min(100, now - last) : FRAME_MS;
      last = now;
      time += dt;
      draw(dt);
    };
    const start = () => {
      if (running || document.hidden || reduced.matches) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    const still = () => {
      // Une image nette, sans lissage (mouvement réduit, changement de thème à l'arrêt)
      state.seed = seed.current;
      state.scroll = 0;
      draw(10_000);
    };

    const onVisibility = () => (document.hidden ? stop() : start());
    const onMotion = () => {
      if (reduced.matches) {
        stop();
        still();
      } else start();
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      state.tx = e.clientX / window.innerWidth;
      state.ty = e.clientY / window.innerHeight;
      state.pointerTarget = 1;
    };
    const onLeave = () => (state.pointerTarget = 0);
    const themeWatch = new MutationObserver(() => !running && still());

    const cancel = afterLoadIdle(() => {
      resize();
      still();
      el.setAttribute("data-on", "");
      window.addEventListener("resize", resize);
      document.addEventListener("visibilitychange", onVisibility);
      reduced.addEventListener("change", onMotion);
      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
      themeWatch.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
      start();
    });

    return () => {
      cancel();
      stop();
      themeWatch.disconnect();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      reduced.removeEventListener("change", onMotion);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div aria-hidden="true" className="backdrop">
      <div className="backdrop-base" />
      <canvas ref={canvas} className="backdrop-canvas" />
      <div className="backdrop-grain" />
    </div>
  );
}
