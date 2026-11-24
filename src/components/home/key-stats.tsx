// src/components/home/key-stats.tsx — Key figures under the home heroes, four columns.
// Yexo: current rank, peak, Faceit, homelab (the Radiant peak only appears next to the other ranks).
// Baptiste: work-study, VMs, VLANs, After Effects.
import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { useTranslations } from "next-intl";
import { VALORANT_PEAK } from "@/config/site";
import { labStats } from "@/config/lab";
import { CountUp } from "@/components/ui/count-up";
import { cn } from "@/lib/utils";

interface Stat {
  id: string;
  icon?: string;
  value: ReactNode;
  label: string;
}

/**
 * Valid definition list: one div per pair directly under <dl>, holding <dt> then <dd>.
 * The figure (dd) shows above its label (flex-col-reverse); the small rank icon sits in the label.
 */
function KeyStatsList({ items, label, className }: { items: Stat[]; label: string; className?: string }) {
  return (
    <dl aria-label={label} className={cn("key-stats stagger grid grid-cols-2 gap-x-6 lg:grid-cols-4", className)} style={{ "--sd": "950ms" } as CSSProperties}>
      {items.map((s) => (
        <div key={s.id} className="key-stat flex min-w-0 flex-col-reverse">
          <dt className="mt-2 flex items-center gap-2 truncate text-[12.5px] text-muted">
            {s.icon && <Image src={s.icon} alt="" width={36} height={36} className="h-[18px] w-[18px] object-contain" />}
            {s.label}
          </dt>
          <dd className="display truncate text-[34px] text-fg sm:text-[46px]">{s.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Yexo profile (Valorant world) */
export function YexoStats({ className }: { className?: string }) {
  const t = useTranslations("home.stats");
  const lab = labStats();
  const items: Stat[] = [
    { id: "current", icon: "/images/ranks/valorant-immortal-3.webp", value: t("currentValue"), label: t("current") },
    {
      id: "peak",
      icon: VALORANT_PEAK.image,
      value: (
        <>
          <CountUp value={VALORANT_PEAK.rr} /> RR
        </>
      ),
      label: t("peak", { episode: VALORANT_PEAK.episode }),
    },
    { id: "faceit", icon: "/images/ranks/faceit-level-10.png", value: t("faceitValue"), label: t("faceit") },
    {
      id: "lab",
      value: (
        <>
          <CountUp value={lab.vms} /> VM
        </>
      ),
      label: t("lab", { machines: lab.machines }),
    },
  ];
  return <KeyStatsList items={items} label={t("label")} className={className} />;
}

/** Baptiste profile (pro side) */
export function ProStats({ className }: { className?: string }) {
  const t = useTranslations("home.pro.stats");
  const lab = labStats();
  const items: Stat[] = [
    { id: "role", value: t("roleValue"), label: t("role") },
    {
      id: "vms",
      value: (
        <>
          <CountUp value={lab.vms} /> VM
        </>
      ),
      label: t("vms", { machines: lab.machines }),
    },
    {
      id: "vlans",
      value: (
        <>
          <CountUp value={lab.vlans} /> VLAN
        </>
      ),
      label: t("vlans"),
    },
    { id: "ae", value: "After Effects", label: t("ae") },
  ];
  return <KeyStatsList items={items} label={t("label")} className={className} />;
}
