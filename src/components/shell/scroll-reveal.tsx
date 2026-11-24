// src/components/shell/scroll-reveal.tsx — Reveals [data-reveal] elements when they enter the screen
// (fade + rise, defined in globals.css). Once per element, including after client-side navigation.
// No effect under prefers-reduced-motion (CSS). After a navigation with a page transition, what is on
// the first screen arrives with the transition (data-instant) instead of fading in a second time.
"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "@/i18n/navigation";

const SELECTOR = "[data-reveal]:not([data-in])";

export function ScrollReveal() {
  const pathname = usePathname();
  const firstPath = useRef(pathname);

  // Navigation with a page transition: first-screen elements are shown at once (before the
  // transition snapshot), so the new page slides in complete.
  useLayoutEffect(() => {
    if (pathname === firstPath.current && !document.documentElement.dataset.navDir) return;
    document.getElementById("early-reveal")?.remove();
    const supported = "startViewTransition" in document && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!supported) return;
    document.querySelectorAll<HTMLElement>(SELECTOR).forEach((el) => {
      const top = el.getBoundingClientRect().top + window.scrollY;
      if (top < window.innerHeight) {
        el.setAttribute("data-in", "");
        el.setAttribute("data-instant", "");
      }
    });
  }, [pathname]);

  // Hand-off from earlyRevealScript: those elements are marked as revealed, then the temporary
  // stylesheet is removed once their animations are over
  useEffect(() => {
    const w = window as Window & { __earlyReveal?: Element[] };
    const early = w.__earlyReveal;
    if (!early) return;
    delete w.__earlyReveal;
    early.forEach((el) => {
      el.setAttribute("data-in", "");
      el.setAttribute("data-instant", "");
    });
    const id = setTimeout(() => document.getElementById("early-reveal")?.remove(), 2_400);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    // The script runs: the CSS safety net (show everything after 2.5 s) is turned off
    document.documentElement.setAttribute("data-reveal-ready", "");
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-in", "");
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.04 },
    );
    const observe = () => document.querySelectorAll(SELECTOR).forEach((el) => io.observe(el));
    observe();

    // New elements (client navigation, content loaded later)
    const main = document.getElementById("main");
    const mo = new MutationObserver((mutations) => {
      const added = mutations.some((m) =>
        [...m.addedNodes].some((n) => n instanceof Element && (n.matches("[data-reveal]") || n.querySelector("[data-reveal]"))),
      );
      if (added) observe();
    });
    if (main) mo.observe(main, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  return null;
}
