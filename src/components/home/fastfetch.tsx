// src/components/home/fastfetch.tsx — Carte terminal façon fastfetch, alimentée par src/config/lab.ts.
import { useTranslations } from "next-intl";
import { SquareTerminal } from "lucide-react";
import { HOSTS, VMS, labStats } from "@/config/lab";
import { RANKS, SOCIALS } from "@/config/site";
import { Card } from "@/components/ui/card";

/** Petit logo ASCII façon distribution Linux, dessiné avec la lettre du pseudo */
const LOGO = ["yy    yy", " yy  yy ", "  yyyy  ", "   yy   ", "   yy   "].join("\n");

/** Nuancier en bas du terminal : tons de l'accent puis neutres */
const SWATCHES = [
  "var(--accent-low)",
  "var(--accent-mid)",
  "var(--accent)",
  "var(--on-accent-container)",
  "var(--surface-3)",
  "var(--text-dim)",
  "var(--text-muted)",
  "var(--text)",
];

export function Fastfetch({ className, index }: { className?: string; index?: number }) {
  const t = useTranslations("home.fastfetch");
  const tUnits = useTranslations("lab.units");
  const tRanks = useTranslations("gaming.ranks.items");
  const s = labStats();
  const os = (id: string) => HOSTS.find((h) => h.id === id)?.os ?? "";
  const monitoring = VMS.find((vm) => vm.id === "zbx01")?.services[0] ?? "Zabbix";

  // Version courte (accueil) : l'essentiel de l'infra, puis les rangs et le montage
  const lines: [string, string][] = [
    [t("keys.hosts"), t("values.hosts", { machines: s.machines, vms: s.vms })],
    [t("keys.firewall"), os("fw01")],
    [t("keys.hypervisors"), `${os("esxi01")} · Hyper-V`],
    [t("keys.network"), t("values.network", { vlans: s.vlans })],
    [t("keys.memory"), `${s.ramGb} ${tUnits("gb")} · ${t("values.threads", { threads: s.threads })}`],
    [t("keys.monitoring"), monitoring],
    [t("keys.site"), `Next.js · ${os("vps01")}`],
    [t("keys.ranks"), RANKS.map((r) => tRanks(`${r.id}.rank`)).join(" · ")],
    [t("keys.edits"), `TikTok ${SOCIALS.tiktok.handle}`],
  ];

  return (
    <Card
      id="fastfetch"
      icon={SquareTerminal}
      title="fastfetch"
      subtitle="ssh yexo@homelab"
      meta="zsh"
      next="lab"
      index={index}
      className={className}
    >
      <div className="terminal flex-1 overflow-x-auto p-4 text-[12.5px] sm:p-5">
        <p>
          <span className="prompt">yexo@homelab</span> <span className="text-dim">~ $</span>{" "}
          <span className="text-fg">fastfetch</span>
        </p>
        <div className="mt-3 flex items-center gap-4">
          <pre aria-hidden="true" className="select-none text-[10px] font-semibold leading-[1.3] text-accent">
            {LOGO}
          </pre>
          <div>
            <p className="text-fg">
              <span className="prompt">yexo</span>@<span className="prompt">homelab</span>
            </p>
            <p aria-hidden="true" className="text-dim">
              ────────────
            </p>
          </div>
        </div>
        <dl className="stagger mt-2">
          {lines.map(([k, v]) => (
            <div key={k} className="flex min-w-0 flex-wrap gap-x-2 sm:flex-nowrap">
              <dt className="key shrink-0">{k}:</dt>
              <dd className="min-w-0 text-fg sm:truncate">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-3 flex" aria-hidden="true">
          {SWATCHES.map((c) => (
            <span key={c} className="h-3 w-5 first:rounded-l last:rounded-r" style={{ backgroundColor: c }} />
          ))}
        </div>
        <p className="mt-4">
          <span className="prompt">yexo@homelab</span> <span className="text-dim">~ $</span>{" "}
          <span aria-hidden="true" className="inline-block h-[1.05em] w-2 translate-y-[3px] bg-muted" />
        </p>
      </div>
    </Card>
  );
}
