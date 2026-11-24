// src/components/shell/aim-cursor.tsx — Cursor = my real Valorant crosshair (drawn from CROSSHAIR);
// on the Baptiste page (pro side), an editing-software anchor point instead.
// Over something clickable, the crosshair turns 45° and shrinks inside a thin ring; buttons are
// gently pulled toward the pointer (magnet). Text fields keep the system text cursor.
// Mouse only (fine pointer). Under reduced motion: no magnet. One listener, one animation frame per move.
"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "@/i18n/navigation";
import { CrosshairSvg } from "@/components/valorant/crosshair";

const TARGETS = 'a[href], button:not(:disabled), [role="button"], [role="tab"], summary, label[for], input[type="checkbox"], input[type="range"]';
const TEXT_FIELDS = 'input:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="button"]), textarea, select, [contenteditable="true"]';
const MAGNETIC = ".btn, .icon-btn, .tool-btn";

export function AimCursor() {
  const root = useRef<HTMLDivElement>(null);
  const cross = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const variant = pathname === "/baptiste" ? "pro" : "valo";

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
    let frame = 0;

    const tick = () => {
      frame = 0;
      ch.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0)`;
      if (magnet && !reduced) {
        const r = magnet.getBoundingClientRect();
        const dx = (mouse.x - (r.left + r.width / 2)) * 0.2;
        const dy = (mouse.y - (r.top + r.height / 2)) * 0.3;
        magnet.style.translate = `${Math.max(-7, Math.min(7, dx))}px ${Math.max(-4, Math.min(4, dy))}px`;
      }
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const releaseMagnet = () => {
      if (magnet) {
        magnet.style.transition = "translate 600ms cubic-bezier(0.16, 1, 0.3, 1)";
        magnet.style.translate = "";
        const m = magnet;
        setTimeout(() => (m.style.transition = ""), 620);
      }
      magnet = null;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      const t = e.target instanceof Element ? e.target : null;
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
        if (target instanceof HTMLElement && target.matches(MAGNETIC)) magnet = target;
      }
      request();
    };
    const onOut = (e: MouseEvent) => {
      // Leaving the window or entering an iframe (TikTok player): hide
      const to = e.relatedTarget;
      if (!to || (to instanceof Element && to.tagName === "IFRAME")) {
        el.setAttribute("data-hidden", "");
        target = null;
        el.removeAttribute("data-target");
        releaseMagnet();
      }
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("mouseout", onOut);
    return () => {
      cancelAnimationFrame(frame);
      releaseMagnet();
      html.removeAttribute("data-aim");
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseout", onOut);
    };
  }, []);

  return (
    <div ref={root} aria-hidden="true" className="aim" data-hidden="" data-variant={variant}>
      <div ref={cross} className="aim-cross">
        <span className="aim-ring" />
        <span className="aim-shape">
          <CrosshairSvg size={44} zoom={1.2} className="aim-valo" />
          <svg width="56" height="56" viewBox="-28 -28 56 56" className="aim-anchor" aria-hidden="true">
            <circle r="7" fill="none" stroke="var(--accent-vivid)" strokeWidth="1.5" />
            <path d="M-14 0H-7M7 0H14M0 -14V-7M0 7V14" stroke="var(--accent-vivid)" strokeWidth="1.5" />
            <circle r="1.5" fill="var(--text)" />
          </svg>
        </span>
      </div>
    </div>
  );
}
