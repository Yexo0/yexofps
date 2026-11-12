// src/components/shell/card-spotlight.tsx — Pose la position de la souris sur la carte survolée
// (--mx / --my), utilisée par le halo de bordure défini dans globals.css. Un seul écouteur pour
// tout le site, limité à une mise à jour par image. Inactif sur les écrans tactiles.
"use client";

import { useEffect } from "react";

export function CardSpotlight() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover)").matches) return;
    let frame = 0;
    let last: PointerEvent | null = null;

    const update = () => {
      frame = 0;
      if (!last || !(last.target instanceof Element)) return;
      const card = last.target.closest<HTMLElement>(".card");
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${last.clientX - rect.left}px`);
      card.style.setProperty("--my", `${last.clientY - rect.top}px`);
    };

    const onMove = (e: PointerEvent) => {
      last = e;
      if (!frame) frame = requestAnimationFrame(update);
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
