// src/components/three/use-stage.ts — Logique commune aux emplacements 3D (Vandal, logo…) :
// montage après le premier affichage si WebGL est disponible, couleurs de l'espace lues dans le CSS,
// rendu actif seulement quand l'élément est à l'écran et l'onglet visible, pointeur normalisé (-1 à 1).
"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

export interface StageReady {
  accent: string;
  accent2: string;
  reduced: boolean;
}

function hasWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") ?? c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function useStage(ref: RefObject<HTMLElement | null>) {
  const pointer = useRef({ x: 0, y: 0 });
  const [ready, setReady] = useState<StageReady | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!hasWebGL()) return;
    const id = requestAnimationFrame(() => {
      const cs = getComputedStyle(ref.current ?? document.documentElement);
      setReady({
        accent: cs.getPropertyValue("--accent").trim() || "#ff4655",
        accent2: cs.getPropertyValue("--accent-2").trim() || "#f2c14e",
        reduced: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      });
    });
    return () => cancelAnimationFrame(id);
  }, [ref]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !ready) return;
    let inView = false;
    const update = () => setActive(inView && !document.hidden && !ready.reduced);
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      update();
    });
    io.observe(el);
    document.addEventListener("visibilitychange", update);
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    if (!ready.reduced) window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", update);
      window.removeEventListener("pointermove", onMove);
    };
  }, [ref, ready]);

  return { ready, active, pointer };
}
