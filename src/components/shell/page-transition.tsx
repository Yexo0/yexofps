// src/components/shell/page-transition.tsx — Transition between pages (View Transitions through React):
// the old page lifts away, the new one rises through a mask, leaning slightly in the direction of travel.
// Project images morph from the grid to their page (named transitions). Animations in globals.css,
// off under reduced motion. Browsers without View Transitions: plain page change.
"use client";

import { ViewTransition, useEffect, type ReactNode } from "react";
import { markNavigation } from "@/lib/nav-direction";

export function PageTransition({ children }: { children: ReactNode }) {
  // Direction of travel for internal links (header, menu, links inside pages…)
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = e.target instanceof Element ? e.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!link || link.target === "_blank" || link.hasAttribute("download")) return;
      markNavigation(link.href);
    }
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return (
    <ViewTransition name="page">
      <div className="flex flex-col">{children}</div>
    </ViewTransition>
  );
}
