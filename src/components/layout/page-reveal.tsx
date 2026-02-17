// src/components/layout/page-reveal.tsx
"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface PageRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function PageReveal({ children, className = "", delay = 0 }: PageRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      ref.current?.classList.add("visible");
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div ref={ref} className={`reveal-item ${className}`}>
      {children}
    </div>
  );
}
