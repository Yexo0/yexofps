// src/components/shared/page-header.tsx
import Image from "next/image";
import type { ReactNode } from "react";
import { GlassPanel } from "./glass-panel";

interface PageHeaderProps {
  name: string;
  tagline: string;
  actions?: ReactNode;
}

export function PageHeader({ name, tagline, actions }: PageHeaderProps) {
  return (
    <GlassPanel className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
      <div className="flex items-center gap-4 flex-1">
        <div className="avatar-wrapper w-[72px] h-[72px] shrink-0">
          <Image
            src="/images/IMG_4549.png"
            alt="Yexo avatar"
            width={72}
            height={72}
            className="w-full h-full object-cover bg-[#111]"
          />
        </div>
        <div>
          <h1 className="gradient-text text-2xl font-extrabold">{name}</h1>
          <div className="flex items-center gap-2 mt-0.5 text-sm text-white/55">
            <Image src="/images/france.png" alt="France" width={18} height={13} className="rounded-sm" />
            <span>France</span>
          </div>
          <p className="text-sm text-white/45 mt-1">{tagline}</p>
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </GlassPanel>
  );
}
