// src/components/home/hero-vandal.tsx — Emplacement de la Vandal 3D dans le hero de l'accueil.
// Charge three.js après le premier affichage (import dynamique, client seulement), suit la souris
// et le défilement, et ne fait tourner le rendu que lorsque le hero est à l'écran et l'onglet visible.
// Sans WebGL : le hero reste complet (bande colorée et repères), simplement sans l'arme.
"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { useStage } from "@/components/three/use-stage";

const VandalStage = dynamic(() => import("@/components/three/vandal-stage"), { ssr: false });

export function HeroVandal({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const { ready, active, pointer } = useStage(ref);

  // Défilement à travers le hero : l'arme pivote et remonte en sortant
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
        <VandalStage
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
