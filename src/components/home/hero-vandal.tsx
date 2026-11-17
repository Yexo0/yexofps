// src/components/home/hero-vandal.tsx — Emplacement de la Vandal 3D dans le hero de l'accueil.
// Charge three.js après le premier affichage (import dynamique, client seulement), suit la souris
// et le défilement, et ne fait tourner le rendu que lorsque le hero est à l'écran et l'onglet visible.
// Sans WebGL : le hero reste complet (bande colorée et repères), simplement sans l'arme.
"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const VandalStage = dynamic(() => import("@/components/three/vandal-stage"), { ssr: false });

function hasWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") ?? c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function HeroVandal({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const progress = useRef(0);
  const [ready, setReady] = useState<{ accent: string; accent2: string; reduced: boolean } | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!hasWebGL()) return;
    const cs = getComputedStyle(document.documentElement);
    // Montage après le premier affichage : ne retarde pas le contenu
    const id = requestAnimationFrame(() =>
      setReady({
        accent: cs.getPropertyValue("--accent").trim() || "#ff4655",
        accent2: cs.getPropertyValue("--accent-2").trim() || "#f2c14e",
        reduced: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      }),
    );
    return () => cancelAnimationFrame(id);
  }, []);

  // Rendu actif seulement si visible à l'écran et onglet au premier plan
  useEffect(() => {
    const el = ref.current;
    if (!el || !ready) return;
    let inView = false;
    const update = () => setActive(inView && !document.hidden && !ready.reduced);
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      update();
    });
    io.observe(el);
    document.addEventListener("visibilitychange", update);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, [ready]);

  // Souris (sur toute la page) et défilement à travers le hero
  useEffect(() => {
    const el = ref.current;
    if (!el || !ready || ready.reduced) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onScroll = () => {
      const r = el.getBoundingClientRect();
      progress.current = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height)));
    };
    onScroll();
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
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
