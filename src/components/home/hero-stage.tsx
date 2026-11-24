// src/components/home/hero-stage.tsx — Objet 3D des heros d'accueil : "vandal" (Yexo) ou "laptop" (Baptiste).
// 1. Poster : image fixe de l'objet dans sa pose de repos, servie avec la page (rien à attendre, aucun JS).
// 2. Sur un appareil avec un vrai GPU, three.js est chargé après le premier affichage (import dynamique,
//    client seulement) ; la scène part de la même pose, puis le poster s'efface : l'objet s'anime
//    (flottement, souris, défilement) sans saut. Le rendu ne tourne que hero à l'écran et onglet visible.
// Sans GPU (rendu logiciel), sans WebGL ou en mouvement réduit, la 3D n'apporterait qu'une image figée :
// three.js n'est pas chargé du tout et le poster reste.
"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { useStage } from "@/components/three/use-stage";

const STAGES = {
  vandal: dynamic(() => import("@/components/three/vandal-stage"), { ssr: false }),
  laptop: dynamic(() => import("@/components/three/laptop-stage"), { ssr: false }),
};

/**
 * Posters capturés depuis la scène figée (fond transparent, 1616 × 1206 pour un emplacement de
 * 808 × 603). L'objet est à l'échelle de la largeur de la scène : le poster prend toute la largeur ;
 * `y` = hauteur de son centre (part de la hauteur), pour le placer comme la caméra le place.
 * Fichiers renommés (v2…) à chaque nouvelle capture.
 */
const POSTERS = {
  vandal: { src: "/images/hero/vandal-v1.webp", y: "50%" },
  laptop: { src: "/images/hero/laptop-v1.webp", y: "80%" },
} as const;

export function HeroStage({ scene, className }: { scene: keyof typeof STAGES; className?: string }) {
  const Stage = STAGES[scene];
  const poster = POSTERS[scene];
  const ref = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const { ready, active, pointer } = useStage(ref);
  const [live, setLive] = useState(false);
  const onReady = useCallback(() => setLive(true), []);
  const animated = Boolean(ready && !ready.reduced);

  // Défilement à travers le hero : l'objet pivote et remonte en sortant
  useEffect(() => {
    const el = ref.current;
    if (!el || !animated) return;
    const onScroll = () => {
      const r = el.getBoundingClientRect();
      progress.current = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [animated]);

  return (
    <div ref={ref} aria-hidden="true" data-live={live || undefined} className={className}>
      <Image
        src={poster.src}
        alt=""
        width={1616}
        height={1206}
        sizes="(min-width: 1024px) 54vw, 100vw"
        preload
        className="hero-poster"
        style={{ "--py": poster.y } as CSSProperties}
      />
      {ready && animated && (
        <Stage
          active={active}
          accent={ready.accent}
          accent2={ready.accent2}
          reduced={false}
          intro={false}
          onReady={onReady}
          pointer={pointer}
          progress={progress}
        />
      )}
    </div>
  );
}
