// src/components/dashboard/dashboard-reveal.tsx
"use client";

import { useEffect, type ReactNode } from "react";

export function DashboardReveal({ children }: { children: ReactNode }) {
  useEffect(() => {
    const avatar = document.querySelector(".dashboard-avatar");
    const cards = document.querySelectorAll(".dashboard-card");

    if (avatar) {
      setTimeout(() => {
        (avatar as HTMLElement).style.transition = "opacity 0.75s ease, transform 0.75s ease";
        (avatar as HTMLElement).style.opacity = "1";
        (avatar as HTMLElement).style.transform = "translateY(0)";
      }, 120);
    }

    cards.forEach((card, i) => {
      setTimeout(() => {
        (card as HTMLElement).style.transition = "opacity 0.7s ease, transform 0.7s ease";
        (card as HTMLElement).style.opacity = "1";
        (card as HTMLElement).style.transform = "translateY(0)";
      }, 260 + i * 170);
    });
  }, []);

  return (
    <>
      <style>{`
        .dashboard-avatar,
        .dashboard-card {
          opacity: 0;
          transform: translateY(26px);
        }
      `}</style>
      {children}
    </>
  );
}
