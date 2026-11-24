// src/components/shell/page-transition.tsx — Transition entre pages (View Transitions via React) :
// le contenu glisse dans le sens de la navigation et la carte principale se transforme d'une page
// à l'autre (nom "lead-card", voir Card). Animations dans globals.css, coupées en mouvement réduit.
// Navigateurs sans View Transitions : changement de page normal.
"use client";

import { ViewTransition, useEffect, type ReactNode } from "react";
import { markNavigation } from "@/lib/nav-direction";

export function PageTransition({ children }: { children: ReactNode }) {
  // Sens de la navigation pour les liens internes (rail, barre mobile, liens dans les cartes…)
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
