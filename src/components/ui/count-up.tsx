// src/components/ui/count-up.tsx — Number that counts up to its value when it reaches the screen (anime.js).
// The HTML already holds the final value (no JavaScript or reduced motion: nothing moves).
"use client";

import { useEffect, useRef } from "react";
import { useLocale } from "next-intl";
import { countTo } from "@/lib/anime";
import { prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface CountUpProps {
  value: number;
  decimals?: number;
  /** Duration in milliseconds */
  duration?: number;
  className?: string;
}

export function CountUp({ value, decimals = 0, duration, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const locale = useLocale();
  const final = new Intl.NumberFormat(locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const fmt = new Intl.NumberFormat(locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    let anim: ReturnType<typeof countTo> | undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        anim = countTo(el, value, (n) => fmt.format(n), duration);
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      anim?.revert();
      el.textContent = fmt.format(value);
    };
  }, [value, decimals, duration, locale]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {final}
    </span>
  );
}
