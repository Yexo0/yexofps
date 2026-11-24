// src/components/shell/section-nav.tsx — "On this page" bar, sticky under the header on long pages.
// Marks the section being read (scrollspy, red bar gliding between links) and shows reading progress.
// Slides up with the header when it hides (html[data-header-hidden], set by SiteHeader).
"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface SectionItem {
  id: string;
  label: string;
}

export function SectionNav({ items, label }: { items: SectionItem[]; label: string }) {
  const [active, setActive] = useState(items[0]?.id);
  const barRef = useRef<HTMLSpanElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Active section: the first one (in page order) crossing the upper part of the screen
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

  // Reading progress (no re-render: the style is written directly)
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

  // On phones, keep the active link visible in the scrolling row
  useEffect(() => {
    const list = listRef.current;
    const link = list?.querySelector<HTMLElement>(`[data-id="${active}"]`);
    if (!list || !link) return;
    list.scrollTo({ left: link.offsetLeft - list.clientWidth / 2 + link.clientWidth / 2, behavior: "smooth" });
  }, [active]);

  return (
    <nav aria-label={label} className="section-nav">
      <div className="relative flex items-center gap-6">
        <span className="label hidden shrink-0 lg:inline">{label}</span>
        <ul ref={listRef} className="no-scrollbar flex min-w-0 gap-6 overflow-x-auto">
          {items.map((item, i) => {
            const isActive = item.id === active;
            return (
              <li key={item.id} data-id={item.id} className="relative shrink-0">
                <a
                  href={`#${item.id}`}
                  onClick={() => setActive(item.id)}
                  aria-current={isActive ? "location" : undefined}
                  className={cn("flex h-12 items-center gap-2 text-[13px] transition-colors", isActive ? "text-fg" : "text-muted hover:text-fg")}
                >
                  <span className={cn("font-mono text-[10px]", isActive ? "text-accent" : "text-dim")}>{String(i + 1).padStart(2, "0")}</span>
                  {item.label}
                </a>
                {isActive && (
                  <motion.span
                    layoutId="section-current"
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-[2px] bg-accent-vivid"
                    transition={{ duration: 0.6, ease: EASE.out }}
                  />
                )}
              </li>
            );
          })}
        </ul>
      </div>
      <span ref={barRef} aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px origin-left bg-line-strong" style={{ transform: "scaleX(0)" }} />
    </nav>
  );
}
