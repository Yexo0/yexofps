// src/components/home/key-stats.tsx — Bande de chiffres clés en bas du hero : rang actuel, peak,
// Faceit et homelab. Le peak Radiant n'apparaît qu'aux côtés des autres rangs (règle de ton du site).
import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Server } from "lucide-react";
import { VALORANT_PEAK } from "@/config/site";
import { labStats } from "@/config/lab";
import { CountUp } from "@/components/ui/count-up";
import { cn } from "@/lib/utils";

interface Stat {
  id: string;
  visual: ReactNode;
  value: ReactNode;
  label: string;
}

export function KeyStats({ className }: { className?: string }) {
  const t = useTranslations("home.stats");
  const lab = labStats();

  const stats: Stat[] = [
    {
      id: "current",
      visual: <Image src="/images/ranks/valorant-immortal.png" alt="" width={40} height={40} className="h-9 w-9 object-contain" />,
      value: t("currentValue"),
      label: t("current"),
    },
    {
      id: "peak",
      visual: <Image src={VALORANT_PEAK.image} alt="" width={40} height={40} className="h-9 w-9 object-contain" />,
      value: (
        <>
          <CountUp value={VALORANT_PEAK.rr} /> RR
        </>
      ),
      label: t("peak", { episode: VALORANT_PEAK.episode }),
    },
    {
      id: "faceit",
      visual: <Image src="/images/ranks/faceit-level-10.png" alt="" width={40} height={40} className="h-9 w-9 object-contain" />,
      value: t("faceitValue"),
      label: t("faceit"),
    },
    {
      id: "lab",
      visual: (
        <span className="grid h-9 w-9 place-items-center text-accent">
          <Server size={26} strokeWidth={1.6} aria-hidden="true" />
        </span>
      ),
      value: (
        <>
          <CountUp value={lab.vms} /> VM
        </>
      ),
      label: t("lab", { machines: lab.machines }),
    },
  ];

  return (
    <dl aria-label={t("label")} className={cn("key-stats grid grid-cols-2 lg:grid-cols-4", className)}>
      {stats.map((s, i) => (
        <div key={s.id} className="key-stat flex items-center gap-3.5" style={{ "--si": i } as CSSProperties}>
          <span aria-hidden="true" className="shrink-0">
            {s.visual}
          </span>
          <div className="flex min-w-0 flex-col-reverse">
            <dt className="truncate text-[12px] text-muted">{s.label}</dt>
            <dd className="display truncate text-[30px] text-fg sm:text-[38px]">{s.value}</dd>
          </div>
        </div>
      ))}
    </dl>
  );
}
