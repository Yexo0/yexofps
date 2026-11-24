// src/components/home/fastfetch.tsx — fastfetch-style terminal panel, fed by src/config/lab.ts.
import { useTranslations } from "next-intl";
import { HOSTS, VMS, labStats } from "@/config/lab";
import { RANKS, SOCIALS } from "@/config/site";
import { Card } from "@/components/ui/card";

/** Petit logo ASCII façon distribution Linux, dessiné avec la lettre du pseudo */
const LOGO = ["yy    yy", " yy  yy ", "  yyyy  ", "   yy   ", "   yy   "].join("\n");

/** Palette strip at the bottom of the terminal: the site's own colors */
const SWATCHES = ["var(--accent-vivid)", "var(--surface-3)", "var(--text-dim)", "var(--text-muted)", "var(--text)"];

/** `pro` : version de la page Baptiste, sans les rangs (on reste hors univers Valorant) */
export function Fastfetch({ className, index, pro = false }: { className?: string; index?: number; pro?: boolean }) {
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
    ...(pro ? [] : ([[t("keys.ranks"), RANKS.map((r) => tRanks(`${r.id}.rank`)).join(" · ")]] as [string, string][])),
    [t("keys.edits"), pro ? `After Effects · TikTok ${SOCIALS.tiktok.handle}` : `TikTok ${SOCIALS.tiktok.handle}`],
  ];

  return (
    <Card id="fastfetch" title="fastfetch" meta="ssh yexo@homelab" index={index} className={className}>
      <div className="terminal flex-1 overflow-x-auto p-4 text-[12.5px] sm:p-5">
        <p>
          <span className="prompt">yexo@homelab</span> <span className="text-dim">~ $</span>{" "}
          <span className="text-fg">fastfetch</span>
        </p>
        <div className="mt-3 flex items-center gap-4">
          <pre aria-hidden="true" className="select-none text-[10px] font-semibold leading-[1.3] text-accent-vivid">
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
            <span key={c} className="h-3 w-6" style={{ backgroundColor: c }} />
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
