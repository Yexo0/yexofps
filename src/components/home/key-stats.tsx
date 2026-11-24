// src/components/home/key-stats.tsx — Bande de chiffres clés en bas des heros d'accueil.
// Yexo : rang actuel, peak, Faceit, homelab (le peak Radiant n'apparaît qu'aux côtés des autres rangs).
// Baptiste : alternance, VM, VLAN, After Effects.
import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Briefcase, Clapperboard, Network, Server } from "lucide-react";
import type { LucideIcon } from "lucide-react";
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

function StatIcon({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span className="grid h-9 w-9 place-items-center text-dim">
      <Icon size={26} strokeWidth={1.6} aria-hidden="true" />
    </span>
  );
}

function RankIcon({ src }: { src: string }) {
  return <Image src={src} alt="" width={40} height={40} className="h-9 w-9 object-contain" />;
}

/**
 * Liste de définitions valide (axe : definition-list, dlitem) : un seul div par paire directement
 * sous le <dl>, qui ne contient que <dt> puis <dd>. Le chiffre (dd) s'affiche au-dessus du libellé
 * (flex-col-reverse) ; l'icône, décorative, vit dans le <dt> mais est placée à gauche (globals.css).
 */
function KeyStatsList({ items, label, className }: { items: Stat[]; label: string; className?: string }) {
  return (
    <dl aria-label={label} className={cn("key-stats grid grid-cols-2 lg:grid-cols-4", className)}>
      {items.map((s, i) => (
        <div key={s.id} className="key-stat flex min-w-0 flex-col-reverse" style={{ "--si": i } as CSSProperties}>
          <dt className="text-[13px] leading-snug text-dim sm:truncate">
            <span aria-hidden="true" className="key-stat-icon">
              {s.visual}
            </span>
            {s.label}
          </dt>
          <dd className="display truncate text-[26px] text-fg sm:text-[36px]">{s.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Profil Yexo (univers Valorant) */
export function YexoStats({ className }: { className?: string }) {
  const t = useTranslations("home.stats");
  const lab = labStats();
  const items: Stat[] = [
    { id: "current", visual: <RankIcon src="/images/ranks/valorant-immortal-3.webp" />, value: t("currentValue"), label: t("current") },
    {
      id: "peak",
      visual: <RankIcon src={VALORANT_PEAK.image} />,
      value: (
        <>
          <CountUp value={VALORANT_PEAK.rr} /> RR
        </>
      ),
      label: t("peak", { episode: VALORANT_PEAK.episode }),
    },
    { id: "faceit", visual: <RankIcon src="/images/ranks/faceit-level-10.png" />, value: t("faceitValue"), label: t("faceit") },
    {
      id: "lab",
      visual: <StatIcon icon={Server} />,
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

/** Profil Baptiste (côté pro et After Effects) */
export function ProStats({ className }: { className?: string }) {
  const t = useTranslations("home.pro.stats");
  const lab = labStats();
  const items: Stat[] = [
    { id: "role", visual: <StatIcon icon={Briefcase} />, value: t("roleValue"), label: t("role") },
    {
      id: "vms",
      visual: <StatIcon icon={Server} />,
      value: (
        <>
          <CountUp value={lab.vms} /> VM
        </>
      ),
      label: t("vms", { machines: lab.machines }),
    },
    {
      id: "vlans",
      visual: <StatIcon icon={Network} />,
      value: (
        <>
          <CountUp value={lab.vlans} /> VLAN
        </>
      ),
      label: t("vlans"),
    },
    { id: "ae", visual: <StatIcon icon={Clapperboard} />, value: "After Effects", label: t("ae") },
  ];
  return <KeyStatsList items={items} label={t("label")} className={className} />;
}
