// src/components/shell/space-sync.tsx — Tient html[data-space] à jour pendant la navigation :
// la couleur de l'espace (ou de l'univers, ex : "pro" pour /baptiste) suit la page affichée. Le premier rendu est déjà
// coloré par themeScript ; ici on suit seulement les navigations côté client.
"use client";

import { useEffect } from "react";
import { usePathname } from "@/i18n/navigation";
import { themeKeyFromPath } from "@/config/theme";

export function SpaceSync() {
  const pathname = usePathname();
  useEffect(() => {
    document.documentElement.setAttribute("data-space", themeKeyFromPath(pathname));
  }, [pathname]);
  return null;
}
