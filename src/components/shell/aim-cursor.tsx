// src/components/shell/aim-cursor.tsx — Curseur = mon vrai réticule Valorant (dessiné depuis CROSSHAIR) ;
// dans l'univers "pro" (page Baptiste), un point d'ancrage façon logiciel de montage.
// Sur un élément cliquable, quatre coins viennent l'encadrer ; les boutons sont légèrement attirés
// par le curseur (aimant) ; un clic fait "tirer" le réticule. Les champs de saisie gardent le curseur
// texte du système. Uniquement avec une souris (pointeur fin) ; en mouvement réduit, pas de lissage
// ni d'aimant. Un seul écouteur, une boucle d'animation qui s'arrête dès que tout est en place.
"use client";

import { useEffect, useRef } from "react";
import { CrosshairSvg } from "@/components/valorant/crosshair";

const TARGETS = 'a[href], button:not(:disabled), [role="button"], [role="tab"], summary, label[for], input[type="checkbox"], input[type="range"]';
const TEXT_FIELDS = 'input:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="button"]), textarea, select, [contenteditable="true"]';
const PAD = 6;

type Box = { x: number; y: number; w: number; h: number };

export function AimCursor() {
  const root = useRef<HTMLDivElement>(null);
  const cross = useRef<HTMLDivElement>(null);
  const corners = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const el = root.current;
    const ch = cross.current;
    if (!el || !ch || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const html = document.documentElement;
    html.setAttribute("data-aim", "");

    const mouse = { x: -100, y: -100 };
    let target: Element | null = null;
    let magnet: HTMLElement | null = null;
    // Position courante des 4 coins (lissée) et position visée
    const cur: Box = { x: 0, y: 0, w: 0, h: 0 };
    let goal: Box = { x: 0, y: 0, w: 0, h: 0 };
    let frame = 0;

    const goalFor = (t: Element | null): Box => {
      if (!t) return { x: mouse.x - 12, y: mouse.y - 12, w: 24, h: 24 };
      const r = t.getBoundingClientRect();
      return { x: r.left - PAD, y: r.top - PAD, w: r.width + PAD * 2, h: r.height + PAD * 2 };
    };

    const tick = () => {
      frame = 0;
      ch.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0)`;
      goal = goalFor(target);
      const k = reduced ? 1 : 0.24;
      let moving = false;
      for (const key of ["x", "y", "w", "h"] as const) {
        const d = goal[key] - cur[key];
        cur[key] = Math.abs(d) < 0.3 ? goal[key] : cur[key] + d * k;
        if (cur[key] !== goal[key]) moving = true;
      }
      const [tl, tr, bl, br] = corners.current;
      if (tl) tl.style.transform = `translate3d(${cur.x}px, ${cur.y}px, 0)`;
      if (tr) tr.style.transform = `translate3d(${cur.x + cur.w - 10}px, ${cur.y}px, 0)`;
      if (bl) bl.style.transform = `translate3d(${cur.x}px, ${cur.y + cur.h - 10}px, 0)`;
      if (br) br.style.transform = `translate3d(${cur.x + cur.w - 10}px, ${cur.y + cur.h - 10}px, 0)`;
      // Aimant : le bouton survolé glisse un peu vers le curseur
      if (magnet && !reduced) {
        const r = magnet.getBoundingClientRect();
        const dx = (mouse.x - (r.left + r.width / 2)) * 0.18;
        const dy = (mouse.y - (r.top + r.height / 2)) * 0.28;
        magnet.style.translate = `${Math.max(-8, Math.min(8, dx))}px ${Math.max(-5, Math.min(5, dy))}px`;
      }
      if (moving) frame = requestAnimationFrame(tick);
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const releaseMagnet = () => {
      if (magnet) magnet.style.translate = "";
      magnet = null;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      const t = e.target instanceof Element ? e.target : null;
      // Champs de saisie : curseur texte du système
      if (t?.closest(TEXT_FIELDS)) {
        el.setAttribute("data-hidden", "");
        return;
      }
      el.removeAttribute("data-hidden");
      const next = t?.closest(TARGETS) ?? null;
      if (next !== target) {
        target = next;
        el.toggleAttribute("data-target", !!target);
        releaseMagnet();
        if (target instanceof HTMLElement && target.matches(".btn, .icon-btn")) magnet = target;
      }
      request();
    };
    const onDown = () => {
      ch.classList.remove("aim-fire");
      // Relance l'animation de tir à chaque clic
      void ch.offsetWidth;
      ch.classList.add("aim-fire");
    };
    const onOut = (e: MouseEvent) => {
      // Sortie de la fenêtre ou entrée dans une iframe (lecteur TikTok) : on masque
      const to = e.relatedTarget;
      if (!to || (to instanceof Element && to.tagName === "IFRAME")) {
        el.setAttribute("data-hidden", "");
        target = null;
        el.removeAttribute("data-target");
        releaseMagnet();
      }
    };
    const onScroll = () => {
      if (target) request();
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerdown", onDown, { passive: true });
    document.addEventListener("mouseout", onOut);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      releaseMagnet();
      html.removeAttribute("data-aim");
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("mouseout", onOut);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div ref={root} aria-hidden="true" className="aim" data-hidden="">
      {(["tl", "tr", "bl", "br"] as const).map((c, i) => (
        <span
          key={c}
          ref={(node) => {
            corners.current[i] = node;
          }}
          className={`aim-corner aim-corner-${c}`}
        />
      ))}
      <div ref={cross} className="aim-cross">
        <span className="aim-shot">
          {/* Univers Valorant : mon réticule ; univers pro (page Baptiste) : point d'ancrage de logiciel de montage */}
          <CrosshairSvg size={48} zoom={1.25} className="aim-valo" />
          <svg width="60" height="60" viewBox="-30 -30 60 60" className="aim-anchor" aria-hidden="true">
            <circle r="7" fill="none" stroke="var(--accent)" strokeWidth="1.6" />
            <path d="M-14 0H-7M7 0H14M0 -14V-7M0 7V14" stroke="var(--accent)" strokeWidth="1.6" />
            <circle r="1.6" fill="var(--text)" />
          </svg>
        </span>
      </div>
    </div>
  );
}
