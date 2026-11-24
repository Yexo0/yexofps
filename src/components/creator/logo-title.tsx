// src/components/creator/logo-title.tsx — Creator title card: the Valorant logo in 3D over a dimmed
// editing frame, like the opening of an edit. Without WebGL, the frame alone.
"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useRef } from "react";
import { useStage } from "@/components/three/use-stage";
import { cn } from "@/lib/utils";

const LogoStage = dynamic(() => import("@/components/three/logo-stage"), { ssr: false });

export function LogoTitle({ image, alt, className, preload }: { image: string; alt: string; className?: string; preload?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { ready, active, pointer } = useStage(ref);

  return (
    <div ref={ref} className={cn("logo-title relative overflow-hidden", className)}>
      <Image src={image} alt={alt} fill preload={preload} sizes="(min-width: 1024px) 30vw, 90vw" className="object-cover opacity-40" />
      <span aria-hidden="true" className="logo-title-veil absolute inset-0" />
      <div aria-hidden="true" className="absolute inset-0">
        {ready && (
          <LogoStage active={active} accent={ready.accent} accent2={ready.accent2} reduced={ready.reduced} pointer={pointer} />
        )}
      </div>
    </div>
  );
}
