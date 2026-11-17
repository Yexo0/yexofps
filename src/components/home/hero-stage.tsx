// src/components/home/hero-stage.tsx — Emplacement de la scène 3D des heros d'accueil :
// "vandal" (Yexo, univers Valorant) ou "laptop" (Baptiste, PC + logo After Effects).
// Charge three.js après le premier affichage (import dynamique, client seulement), suit la souris
// et le défilement, et ne fait tourner le rendu que lorsque le hero est à l'écran et l'onglet visible.
// Sans WebGL : le hero reste complet (bande colorée et repères), simplement sans la 3D.
"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { useStage } from "@/components/three/use-stage";

const STAGES = {
  vandal: dynamic(() => import("@/components/three/vandal-stage"), { ssr: false }),
  laptop: dynamic(() => import("@/components/three/laptop-stage"), { ssr: false }),
};

export function HeroStage({ scene, className }: { scene: keyof typeof STAGES; className?: string }) {
  const Stage = STAGES[scene];
  const ref = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const { ready, active, pointer } = useStage(ref);

  // Défilement à travers le hero : l'objet pivote et remonte en sortant
  useEffect(() => {
    const el = ref.current;
    if (!el || !ready || ready.reduced) return;
    const onScroll = () => {
      const r = el.getBoundingClientRect();
      progress.current = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [ready]);

  return (
    <div ref={ref} aria-hidden="true" className={className}>
      {ready && (
        <Stage
          active={active}
          accent={ready.accent}
          accent2={ready.accent2}
          reduced={ready.reduced}
          pointer={pointer}
          progress={progress}
        />
      )}
    </div>
  );
}
