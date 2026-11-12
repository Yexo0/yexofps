// src/components/shell/scroll-reveal.tsx — Fait apparaître les cartes quand elles entrent dans l'écran
// (fondu + léger glissement, défini dans globals.css). Une seule fois par carte, y compris après
// une navigation entre espaces. Sans effet si l'utilisateur préfère réduire les animations (CSS).
// Après une navigation avec transition de page, les cartes du premier écran arrivent avec la
// transition (data-instant) au lieu d'un second fondu.
"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "@/i18n/navigation";

export function ScrollReveal() {
  const pathname = usePathname();
  const firstPath = useRef(pathname);

  // Navigation avec transition de page : les cartes du premier écran sont affichées tout de suite
  // (avant la capture de la transition), sinon la carte principale ne pourrait pas se transformer.
  useLayoutEffect(() => {
    if (pathname === firstPath.current && !document.documentElement.dataset.navDir) return;
    // Feuille de l'apparition immédiate : ciblait les cartes de la page d'arrivée, plus celles-ci
    document.getElementById("early-reveal")?.remove();
    const supported = "startViewTransition" in document && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!supported) return;
    document.querySelectorAll<HTMLElement>(".card:not([data-in])").forEach((card) => {
      // La page s'ouvre en haut : visible si son haut est dans la hauteur de l'écran
      const top = card.getBoundingClientRect().top + window.scrollY;
      if (top < window.innerHeight) {
        card.setAttribute("data-in", "");
        card.setAttribute("data-instant", "");
      }
    });
  }, [pathname]);

  // Relais de l'apparition immédiate (earlyRevealScript) : ces cartes sont marquées comme apparues,
  // puis la feuille temporaire est retirée une fois leurs animations terminées
  useEffect(() => {
    const early = (window as Window & { __earlyCards?: Element[] }).__earlyCards;
    if (!early) return;
    delete (window as Window & { __earlyCards?: Element[] }).__earlyCards;
    early.forEach((card) => {
      card.setAttribute("data-in", "");
      card.setAttribute("data-instant", "");
    });
    const id = setTimeout(() => document.getElementById("early-reveal")?.remove(), 2_000);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    // Le script tourne : on désactive le filet de sécurité CSS (affichage forcé après 2,5 s)
    document.documentElement.setAttribute("data-reveal", "");
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
