// src/components/creator/logo-title.tsx — Carton-titre de l'espace Création : le logo Valorant en 3D
// au-dessus d'une image de montage assombrie, comme l'ouverture d'un edit. Sans WebGL, l'image seule.
"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useRef } from "react";
import { useStage } from "@/components/three/use-stage";
import { cn } from "@/lib/utils";

const LogoStage = dynamic(() => import("@/components/three/logo-stage"), { ssr: false });

export function LogoTitle({ image, alt, className }: { image: string; alt: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { ready, active, pointer } = useStage(ref);

  return (
    <div ref={ref} className={cn("logo-title relative overflow-hidden rounded-[6px]", className)}>
      <Image src={image} alt={alt} fill sizes="(min-width: 640px) 260px, 100vw" className="object-cover opacity-40" />
      <span aria-hidden="true" className="logo-title-veil absolute inset-0" />
      <div aria-hidden="true" className="absolute inset-0">
        {ready && (
          <LogoStage active={active} accent={ready.accent} accent2={ready.accent2} reduced={ready.reduced} pointer={pointer} />
        )}
      </div>
    </div>
  );
}
