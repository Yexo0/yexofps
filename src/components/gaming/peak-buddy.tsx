// src/components/gaming/peak-buddy.tsx — Emplacement du gun buddy Radiant (tuile du peak).
// Même cycle de vie que les autres scènes 3D (useStage) : three.js chargé à l'approche, après le
// chargement de la page ; rendu actif seulement à l'écran ; buddy immobile en mouvement réduit,
// sans GPU ou si la cadence s'effondre ; rien sans WebGL. La souris qui passe au-dessus de la tuile
// lance le balancement.
"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { useStage } from "@/components/three/use-stage";

const BuddyStage = dynamic(() => import("@/components/three/buddy-stage"), { ssr: false });

export function PeakBuddy({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const impulse = useRef(0);
  const { ready, active } = useStage(ref);

  // Élan : vitesse horizontale de la souris au-dessus de la tuile parente
  useEffect(() => {
    const el = ref.current;
    if (!el || !ready || ready.reduced) return;
    const zone = el.closest<HTMLElement>("[data-buddy-zone]") ?? el;
    const onMove = (e: PointerEvent) => {
      impulse.current += e.movementX;
    };
    zone.addEventListener("pointermove", onMove, { passive: true });
    return () => zone.removeEventListener("pointermove", onMove);
  }, [ready]);

  return (
    <div ref={ref} aria-hidden="true" className={className}>
      {ready && <BuddyStage active={active} impulseRef={impulse} reduced={ready.reduced} />}
    </div>
  );
}
