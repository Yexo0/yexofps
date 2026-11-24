// src/components/projects/loop-video.tsx — Short muted loop (project captures): plays only while on screen
// and the tab is visible, poster only under reduced motion. The source is attached when the video
// approaches the viewport, so nothing downloads for loops the visitor never scrolls to.
"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function LoopVideo({ src, poster, className, label }: { src: string; poster?: string; className?: string; label?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: "300px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || !near || prefersReducedMotion()) return;
    let visible = false;
    const sync = () => {
      if (visible && document.visibilityState === "visible") el.play().catch(() => {});
      else el.pause();
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      sync();
    });
    io.observe(el);
    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [near]);

  return (
    <video
      ref={ref}
      src={near ? src : undefined}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn("block h-full w-full object-cover", className)}
    />
  );
}
