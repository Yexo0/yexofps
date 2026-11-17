// src/components/gaming/peak-buddy.tsx — Emplacement du gun buddy Radiant (tuile du peak).
// three.js chargé après l'affichage, rendu actif seulement à l'écran ; la souris qui passe au-dessus
// de la tuile lance le balancement. Sans WebGL ou en mouvement réduit : buddy immobile ou rien.
"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const BuddyStage = dynamic(() => import("@/components/three/buddy-stage"), { ssr: false });

export function PeakBuddy({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const impulse = useRef(0);
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let inView = false;
    const update = () => setActive(inView && !document.hidden);
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) setMounted(true);
      update();
    });
    io.observe(el);
    document.addEventListener("visibilitychange", update);
    // Élan : vitesse horizontale de la souris au-dessus de la tuile parente
    const zone = el.closest<HTMLElement>("[data-buddy-zone]") ?? el;
    const onMove = (e: PointerEvent) => {
      impulse.current += e.movementX;
    };
    zone.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", update);
      zone.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div ref={ref} aria-hidden="true" className={className}>
      {mounted && <BuddyStage active={active && !reduced} impulseRef={impulse} reduced={reduced} />}
    </div>
  );
}
