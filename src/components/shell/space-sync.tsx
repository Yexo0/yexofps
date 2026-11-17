// src/components/shell/space-sync.tsx — Tient html[data-space] à jour pendant la navigation :
// la couleur de l'espace (accent, fond, fumée) suit la page affichée. Le premier rendu est déjà
// coloré par themeScript ; ici on suit seulement les navigations côté client.
"use client";

import { useEffect } from "react";
import { usePathname } from "@/i18n/navigation";
import { spaceFromPath } from "@/config/spaces";

export function SpaceSync() {
  const pathname = usePathname();
  useEffect(() => {
    document.documentElement.setAttribute("data-space", spaceFromPath(pathname).id);
  }, [pathname]);
  return null;
}
