// src/components/shared/section-title.tsx
import type { ReactNode } from "react";

interface SectionTitleProps {
  title: string;
  right?: ReactNode;
}

export function SectionTitle({ title, right }: SectionTitleProps) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h2 className="text-xl font-bold tracking-wide text-white">{title}</h2>
        <div className="mt-1.5 h-[2px] w-12 bg-gradient-to-r from-purple-500/50 to-transparent rounded-full" />
      </div>
      {right}
    </div>
  );
}
