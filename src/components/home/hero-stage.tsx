// src/components/home/hero-stage.tsx — Visual side of the home heroes: the red band and the 3D object
// ("vandal" for Yexo, "laptop" for Baptiste), with one caption saying what is shown.
// three.js loads after the first paint (dynamic import, client only); the object follows the pointer
// and the scroll, and renders only while the hero is on screen and the tab visible. While scrolling
// out, the band drifts up a little faster than the object (parallax). Without WebGL: band only.
"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useStage } from "@/components/three/use-stage";
import { prefersReducedMotion } from "@/lib/motion";

const STAGES = {
  vandal: dynamic(() => import("@/components/three/vandal-stage"), { ssr: false }),
  laptop: dynamic(() => import("@/components/three/laptop-stage"), { ssr: false }),
};

export function HeroStage({ scene, caption }: { scene: keyof typeof STAGES; caption: string }) {
  const Stage = STAGES[scene];
  const ref = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const { ready, active, pointer } = useStage(ref);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bandY = useTransform(scrollYProgress, [0, 1], [0, prefersReducedMotion() ? 0 : -90]);

  // Scrolling through the hero: the object turns and rises as it leaves
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
    <div ref={ref} className="hero-stage">
      <motion.span aria-hidden="true" className="hero-band" style={{ y: bandY }} />
      <div aria-hidden="true" className="hero-3d lcp-fade">
        {ready && (
          <Stage active={active} accent={ready.accent} accent2={ready.accent2} reduced={ready.reduced} pointer={pointer} progress={progress} />
        )}
      </div>
      <p aria-hidden="true" className="label absolute bottom-[4%] right-0 z-[1] text-fg/80">
        {caption}
      </p>
    </div>
  );
}
