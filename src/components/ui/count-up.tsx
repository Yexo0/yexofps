// src/components/ui/count-up.tsx — Nombre qui défile jusqu'à sa valeur quand il arrive à l'écran.
// Le HTML contient déjà la valeur finale (sans JavaScript, ou en mouvement réduit, rien ne bouge).
"use client";

import { useEffect, useRef } from "react";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";

interface CountUpProps {
  value: number;
  decimals?: number;
  /** Durée en millisecondes */
  duration?: number;
  className?: string;
}

export function CountUp({ value, decimals = 0, duration = 1500, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const locale = useLocale();
  const fmt = new Intl.NumberFormat(locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  const final = fmt.format(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const format = new Intl.NumberFormat(locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    let frame = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        let start = 0;
        const step = (now: number) => {
          if (!start) start = now;
          const k = Math.min(1, (now - start) / duration);
          el.textContent = format.format(value * (1 - Math.pow(1 - k, 4)));
          if (k < 1) frame = requestAnimationFrame(step);
        };
        el.textContent = format.format(0);
        frame = requestAnimationFrame(step);
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, decimals, duration, locale]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {final}
    </span>
  );
}
