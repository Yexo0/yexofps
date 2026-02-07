// src/components/profile/page-reveal-wrapper.tsx
"use client";

import { useEffect, type ReactNode } from "react";

export function PageRevealWrapper({ children }: { children: ReactNode }) {
  useEffect(() => {
    const panels = document.querySelectorAll(".glass-panel");
    panels.forEach((panel, i) => {
      const el = panel.parentElement || panel;
      (el as HTMLElement).style.opacity = "0";
      (el as HTMLElement).style.transform = "translateY(22px)";
      setTimeout(() => {
        (el as HTMLElement).style.transition = "opacity 0.7s ease, transform 0.7s ease";
        (el as HTMLElement).style.opacity = "1";
        (el as HTMLElement).style.transform = "translateY(0)";
      }, 160 + i * 170);
    });
  }, []);

  return <>{children}</>;
}
