// src/components/ranks/ranks-reveal.tsx
"use client";

import { useEffect, type ReactNode } from "react";

export function RanksReveal({ children }: { children: ReactNode }) {
  useEffect(() => {
    const sections = document.querySelectorAll(".section-item");
    sections.forEach((sec, i) => {
      (sec as HTMLElement).style.opacity = "0";
      (sec as HTMLElement).style.transform = "translateY(22px)";
      setTimeout(() => {
        (sec as HTMLElement).style.transition = "opacity 0.7s ease, transform 0.7s ease";
        (sec as HTMLElement).style.opacity = "1";
        (sec as HTMLElement).style.transform = "translateY(0)";
      }, 160 + i * 170);
    });
  }, []);

  return <>{children}</>;
}
