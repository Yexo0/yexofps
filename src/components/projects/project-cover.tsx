// src/components/projects/project-cover.tsx — A project's plate: fine grid, the project's line drawing
// (drawn stroke by stroke by anime.js when it enters the screen), and its real capture when there is
// one (image, or a muted loop that plays only on screen). The same plate is used on the grid and on
// the project page; a shared view-transition name morphs it from one to the other.
"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";
import type { Project } from "@/config/projects";
import { drawStrokes } from "@/lib/anime";
import { prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { LoopVideo } from "./loop-video";
import { MOTIFS } from "./motifs";

interface ProjectCoverProps {
  project: Project;
  /** sizes attribute for the capture */
  sizes?: string;
  /** Load the capture eagerly (project page hero) */
  priority?: boolean;
  className?: string;
}

export function ProjectCover({ project, sizes = "(min-width: 1024px) 50vw, 100vw", priority, className }: ProjectCoverProps) {
  const ref = useRef<HTMLDivElement>(null);
  const Motif = MOTIFS[project.cover.motif];
  const media = project.cover.media;
  const portrait = media ? media.height > media.width : false;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.setAttribute("data-drawn", "");
      return;
    }
    let anim: ReturnType<typeof drawStrokes> = null;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        el.setAttribute("data-drawn", "");
        anim = drawStrokes(el, { delay: 200 });
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      anim?.revert();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={cn("plate media-frame project-media", className)}
      style={{ viewTransitionName: `project-${project.id}` } as CSSProperties}
    >
      <div className="project-media-inner">
        <span aria-hidden="true" className="plate-grid" />
        <div className={cn("absolute inset-0", media && "plate-motif-side")}>
          <Motif />
        </div>
        {media && (
          <div className={cn("plate-capture", portrait ? "plate-capture-portrait" : "plate-capture-landscape")}>
            {media.type === "video" ? (
              <LoopVideo src={media.src} poster={media.poster} />
            ) : (
              <Image
                src={media.src}
                alt=""
                width={media.width}
                height={media.height}
                sizes={sizes}
                preload={priority}
                className="h-full w-full object-cover object-top"
              />
            )}
          </div>
        )}
      </div>
      <span aria-hidden="true" className="project-veil" />
    </div>
  );
}
