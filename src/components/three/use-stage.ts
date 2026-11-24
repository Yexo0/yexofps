// src/components/three/use-stage.ts — Logique commune aux emplacements 3D (Vandal, PC, logo…) :
// montage à l'approche de l'écran, une fois la page chargée et le navigateur au repos (three.js et le
// modèle ne passent pas avant le premier affichage), si WebGL est disponible ; couleurs de l'espace lues
// dans le CSS ; rendu actif seulement quand l'élément est à l'écran et l'onglet visible ; pointeur
// normalisé (-1 à 1). Scène figée (une seule image, comme en mouvement réduit) si WebGL tourne sans GPU
// ou si la cadence s'effondre pendant le rendu.
"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { afterLoadIdle, cadenceWatch, isSoftwareRenderer } from "@/lib/defer";

export interface StageReady {
  accent: string;
  accent2: string;
  /** Scène figée : mouvement réduit demandé, WebGL sans GPU ou appareil trop lent */
  reduced: boolean;
}

/** WebGL disponible ? `software` : rendu sans GPU. Le contexte de test est libéré aussitôt. */
function probeWebGL(): { software: boolean } | null {
  try {
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl2") ?? c.getContext("webgl");
    if (!gl) return null;
    const software = isSoftwareRenderer(gl);
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return { software };
  } catch {
    return null;
  }
}

export function useStage(ref: RefObject<HTMLElement | null>) {
  const pointer = useRef({ x: 0, y: 0 });
  const [ready, setReady] = useState<StageReady | null>(null);
  const [active, setActive] = useState(false);

  // Montage : à l'approche de l'écran, puis après le chargement de la page (navigateur au repos)
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let cancelIdle: (() => void) | undefined;
    const near = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        near.disconnect();
        cancelIdle = afterLoadIdle(() => {
          const gl = probeWebGL();
          if (!gl) return;
          const cs = getComputedStyle(el);
          setReady({
            accent: cs.getPropertyValue("--accent").trim() || "#ff4655",
            accent2: cs.getPropertyValue("--accent-2").trim() || "#f2c14e",
            reduced: gl.software || window.matchMedia("(prefers-reduced-motion: reduce)").matches,
          });
        });
      },
      { rootMargin: "200px" },
    );
    near.observe(el);
    return () => {
      near.disconnect();
      cancelIdle?.();
    };
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

  // Garde-fou : pendant le rendu continu, sous 20 i/s sur la durée → scène figée là où elle en est
  useEffect(() => {
    if (!active) return;
    const watch = cadenceWatch(20);
    const tick = (now: number) => {
      if (watch.tick(now)) setReady((r) => r && { ...r, reduced: true });
      else frame = requestAnimationFrame(tick);
    };
    let frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active]);

  return { ready, active, pointer };
}
