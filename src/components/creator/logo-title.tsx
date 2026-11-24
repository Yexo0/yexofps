// src/components/creator/logo-title.tsx — Carton-titre de l'espace Création : le logo Valorant en 3D
// au-dessus d'une image de montage assombrie, comme l'ouverture d'un edit.
// Poster du logo servi avec la page, puis même relais que les heros (useStageTakeover) : sur ordinateur
// avec GPU, le logo arrive avec son animation d'entrée ; ailleurs la scène prend le relais du poster ;
// sans GPU, sans WebGL ou en mouvement réduit, three.js n'est pas chargé et le poster reste.
"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useRef } from "react";
import { useStage, useStageTakeover } from "@/components/three/use-stage";
import { cn } from "@/lib/utils";

const LogoStage = dynamic(() => import("@/components/three/logo-stage"), { ssr: false });

/** Capture de la scène figée (240 × 314, fond transparent) ; renommer (v2…) à chaque nouvelle capture */
const POSTER = "/images/hero/valorant-logo-v1.webp";

export function LogoTitle({ image, alt, className }: { image: string; alt: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { ready, active, pointer } = useStage(ref);
  const { animated, intro, onReady, attrs } = useStageTakeover(ready);

  return (
    <div ref={ref} className={cn("logo-title relative overflow-hidden rounded-[var(--r-tile)]", className)}>
      <Image src={image} alt={alt} fill sizes="(min-width: 640px) 240px, 82vw" className="object-cover opacity-40" />
      <span aria-hidden="true" className="logo-title-veil absolute inset-0" />
      <div aria-hidden="true" {...attrs} className="stage absolute inset-0">
        <Image src={POSTER} alt="" fill sizes="(min-width: 640px) 240px, 82vw" className="stage-poster object-contain" />
        {ready && animated && (
          <LogoStage
            active={active}
            accent={ready.accent}
            accent2={ready.accent2}
            reduced={false}
            intro={intro}
            onReady={onReady}
            pointer={pointer}
          />
        )}
      </div>
    </div>
  );
}
