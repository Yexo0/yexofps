// src/components/shell/section-nav.tsx — Navigation "sur cette page", collée en haut des espaces longs.
// Surligne la section en cours de lecture (scrollspy) et affiche la progression dans la page,
// pour que le visiteur sache toujours où il est et ce qui reste.
"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface SectionItem {
  id: string;
  label: string;
}

export function SectionNav({ items, label }: { items: SectionItem[]; label: string }) {
  const [active, setActive] = useState(items[0]?.id);
  const barRef = useRef<HTMLSpanElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Section active : la première (dans l'ordre de la page) qui traverse le haut de l'écran
  useEffect(() => {
    const visible = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target.id);
          else visible.delete(e.target.id);
        }
        const first = items.find((i) => visible.has(i.id));
        if (first) setActive(first.id);
      },
      { rootMargin: "-25% 0px -60% 0px" },
    );
    items.forEach((i) => {
      const el = document.getElementById(i.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [items]);

  // Barre de progression de lecture (sans re-rendu : on écrit directement le style)
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  // Sur mobile, garde la puce active visible dans la rangée défilante
  useEffect(() => {
    const list = listRef.current;
    const chip = list?.querySelector<HTMLElement>(`[data-id="${active}"]`);
    if (!list || !chip) return;
    const left = chip.offsetLeft - list.clientWidth / 2 + chip.clientWidth / 2;
    list.scrollTo({ left, behavior: "smooth" });
  }, [active]);

  return (
    <nav aria-label={label} className="sticky top-2 z-30 mb-2.5 md:top-3 md:mb-3">
      <div className="relative flex items-center overflow-hidden rounded-full border border-line bg-surface-solid/85 p-1 shadow-[var(--shadow)] backdrop-blur-md">
        <span className="label hidden shrink-0 pl-3.5 pr-2 lg:inline">{label}</span>
        <ul ref={listRef} className="no-scrollbar flex min-w-0 gap-1 overflow-x-auto">
          {items.map((item) => {
            const isActive = item.id === active;
            return (
              <li key={item.id} data-id={item.id} className="shrink-0">
                <a
                  href={`#${item.id}`}
                  onClick={() => setActive(item.id)}
                  aria-current={isActive ? "location" : undefined}
                  className={cn(
                    "flex h-8 items-center rounded-full px-3.5 text-[13px] font-medium transition-[background-color,color,box-shadow] duration-300",
                    isActive ? "glow bg-accent-tint text-on-accent-container" : "text-muted hover:bg-surface-3 hover:text-fg",
                  )}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
        <span
          ref={barRef}
          aria-hidden="true"
          className="absolute inset-x-5 bottom-0 h-px origin-left bg-accent"
          style={{ transform: "scaleX(0)" }}
        />
      </div>
    </nav>
  );
}
