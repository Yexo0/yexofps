// src/components/shell/scroll-reveal.tsx — Fait apparaître les cartes quand elles entrent dans l'écran
// (fondu + léger glissement, défini dans globals.css). Une seule fois par carte, y compris après
// une navigation entre espaces. Sans effet si l'utilisateur préfère réduire les animations (CSS).
"use client";

import { useEffect } from "react";
import { usePathname } from "@/i18n/navigation";

export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-in", "");
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.06 },
    );
    const observe = () => document.querySelectorAll(".card:not([data-in])").forEach((el) => io.observe(el));
    observe();

    // Nouvelles cartes (navigation côté client, contenu chargé après coup)
    const main = document.getElementById("main");
    const mo = new MutationObserver((mutations) => {
      const hasNewCard = mutations.some((m) =>
        [...m.addedNodes].some((n) => n instanceof Element && (n.matches(".card") || n.querySelector(".card"))),
      );
      if (hasNewCard) observe();
    });
    if (main) mo.observe(main, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  return null;
}
