// src/components/gaming/peak-buddy.tsx — Emplacement du gun buddy Radiant (tuile du peak).
// Poster (image fixe du buddy) servi avec la page, puis même relais que les heros (useStageTakeover) :
// sur ordinateur avec GPU, la scène arrive directement en se balançant ; ailleurs elle prend le relais
// du poster ; sans GPU, sans WebGL ou en mouvement réduit, three.js n'est pas chargé et le poster reste.
// La souris qui passe au-dessus de la tuile relance le balancement.
"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { useStage, useStageTakeover } from "@/components/three/use-stage";
import { cn } from "@/lib/utils";

const BuddyStage = dynamic(() => import("@/components/three/buddy-stage"), { ssr: false });

/** Capture de la scène figée (200 × 210, fond transparent) ; renommer (v2…) à chaque nouvelle capture */
const POSTER = "/images/hero/buddy-v1.webp";

export function PeakBuddy({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const impulse = useRef(0);
  const { ready, active } = useStage(ref);
  const { animated, onReady, attrs } = useStageTakeover(ready);

  // Élan : vitesse horizontale de la souris au-dessus de la tuile parente
  useEffect(() => {
    const el = ref.current;
    if (!el || !animated) return;
    const zone = el.closest<HTMLElement>("[data-buddy-zone]") ?? el;
    const onMove = (e: PointerEvent) => {
      impulse.current += e.movementX;
    };
    zone.addEventListener("pointermove", onMove, { passive: true });
    return () => zone.removeEventListener("pointermove", onMove);
  }, [animated]);

  return (
    <div ref={ref} aria-hidden="true" {...attrs} className={cn("stage", className)}>
      <Image src={POSTER} alt="" fill sizes="200px" className="stage-poster object-contain" />
      {animated && <BuddyStage active={active} impulseRef={impulse} reduced={false} onReady={onReady} />}
    </div>
  );
}
