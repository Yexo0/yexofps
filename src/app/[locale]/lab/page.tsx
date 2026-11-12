// src/app/[locale]/lab/page.tsx — 03 Lab : homelab entièrement généré depuis src/config/lab.ts.
import type { Metadata } from "next";
import { useFormatter, useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Archive, Activity, ArrowRight, Globe, Layers, KeyRound, Network, ScrollText, Server } from "lucide-react";
import { HOSTS, LAB_MAP, LAB_SINCE, TECHNOLOGIES, VLANS, labStats, vmsOf, type Host } from "@/config/lab";
import { pageMetadata } from "@/lib/metadata";
import { Card } from "@/components/ui/card";
import { PageSections } from "@/components/shell/page-sections";
import { Accordion } from "@/components/ui/accordion";
import { ButtonLink, Chip, StatTile } from "@/components/ui/primitives";
import { NetworkMap } from "@/components/network-map/network-map";
import { MAP_ICONS } from "@/components/network-map/icons";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.lab" });
  return pageMetadata({ locale, path: "/lab", title: t("title"), description: t("description") });
}

export default async function LabPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <PageSections page="lab" />
      <div className="bento">
        <Overview />
        <MapCard />
        <Vlans />
        <Resources />
        <Machines />
      </div>
    </>
  );
}

/* ─── Intro, stats, technos ─── */

function Overview() {
  const t = useTranslations("lab");
  const s = labStats();
  return (
    <Card
      id="overview"
      icon={Server}
      title={t("overview.title")}
      subtitle="~/homelab"
      meta={t("overview.meta", { year: LAB_SINCE })}
      headingLevel={1}
      index={0}
      className="md:col-span-6 lg:col-span-12"
    >
      <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
        <p className="max-w-[62ch] text-[17px] leading-relaxed text-muted lg:col-span-6">{t("overview.text")}</p>
        <div className="flex flex-col gap-3 lg:col-span-6">
          <div className="stagger grid grid-cols-2 gap-2 sm:grid-cols-4">
            <StatTile value={s.machines} label={t("stats.machines")} />
            <StatTile value={s.vms} unit="VM" label={t("stats.guests")} />
            <StatTile value={s.threads} label={t("stats.threads")} />
            <StatTile value={s.ramGb} unit={t("units.gb")} label={t("stats.memory")} />
          </div>
          <ul className="stagger flex flex-wrap gap-1.5" aria-label={t("overview.technologies")}>
            {TECHNOLOGIES.map((tech) => (
              <li key={tech.label}>
                <Chip icon={MAP_ICONS[tech.icon]}>{tech.label}</Chip>
              </li>
            ))}
          </ul>
          <ButtonLink href="/lab/site" variant="tonal" size="sm" className="self-start">
            <Globe size={14} aria-hidden="true" />
            {t("overview.siteLink")}
            <ArrowRight size={14} aria-hidden="true" />
          </ButtonLink>
        </div>
      </div>
    </Card>
  );
}

/* ─── Schéma ─── */

function MapCard() {
  const t = useTranslations("lab");
  const label = (id: string) => (t.has(`nodes.${id}.label`) ? t(`nodes.${id}.label`) : id);

  return (
    <Card
      id="map"
      icon={Network}
      title={t("map.title")}
      subtitle="nmap -sn 10.10.0.0/16"
      meta={t("map.meta", { count: LAB_MAP.nodes.length })}
      index={1}
      className="md:col-span-6 lg:col-span-12"
    >
      <NetworkMap
        width={LAB_MAP.width}
        height={LAB_MAP.height}
        nodes={LAB_MAP.nodes.map((n) => ({ ...n, label: label(n.id), sub: t(`nodes.${n.id}.sub`) }))}
        links={LAB_MAP.links.map((l) => ({
          from: l.from,
          to: l.to,
          kind: "kind" in l ? l.kind : undefined,
          label: "label" in l ? t(`map.links.${l.label}`) : undefined,
        }))}
        groups={[...LAB_MAP.groups]}
        details={Object.fromEntries(
          LAB_MAP.nodes.map((n) => {
            const host = HOSTS.find((h) => h.id === n.id);
            return [n.id, { role: t(`nodes.${n.id}.role`), tags: host?.tags }];
          }),
        )}
        labels={{
          title: t("map.title"),
          hint: t("map.hint"),
          related: t("map.related"),
          ungrouped: t("map.ungrouped"),
          trace: "traceroute",
        }}
        root="internet"
      />
    </Card>
  );
}

/* ─── VLAN ─── */

function Vlans() {
  const t = useTranslations("lab.vlans");
  return (
    <Card
      id="vlans"
      icon={Layers}
      title={t("title")}
      subtitle="show vlan brief"
      meta={t("meta", { count: VLANS.length })}
      index={2}
      className="md:col-span-6 lg:col-span-5"
    >
      <Accordion
        defaultOpen={String(VLANS[0].id)}
        items={VLANS.map((v) => {
          const members = [
            ...HOSTS.filter((h) => h.kind !== "switch" && h.kind !== "firewall" && h.vlans.includes(v.id)).map((h) => h.id),
            ...HOSTS.flatMap((h) => vmsOf(h.id)).filter((vm) => vm.vlan === v.id).map((vm) => vm.id),
          ];
          return {
            id: String(v.id),
            title: `${v.id} · ${v.name}`,
            icon: <span className="font-mono text-[11px] font-semibold">{v.id}</span>,
            content: (
              <>
                <p className="font-mono text-xs text-muted">{v.subnet}</p>
                <p className="mt-1.5">{t(`items.${v.key}`)}</p>
                {members.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {members.map((m) => (
                      <span key={m} className="tag">
                        {m}
                      </span>
                    ))}
                  </div>
                )}
              </>
            ),
          };
        })}
      />
    </Card>
  );
}

/* ─── Machines ─── */

function HostTile({ host }: { host: Host }) {
  const t = useTranslations("lab.machines");
  const tUnits = useTranslations("lab.units");
  const format = useFormatter();
  const Icon = MAP_ICONS[host.icon];
  const vms = vmsOf(host.id);
  const size = (tb: number) =>
    tb < 1 ? `${Math.round(tb * 1000)} ${tUnits("gb")}` : `${format.number(tb)} ${tUnits("tb")}`;
  const storage = host.storage?.map((d) => `${size(d.tb)} ${d.label}`);

  const specs: [string, string][] = [
    [t("os"), host.os],
    ...(host.cpu
      ? ([[t("cpu"), `${host.cpu.model} · ${t("coresThreads", { cores: host.cpu.cores, threads: host.cpu.threads })}`]] as [string, string][])
      : []),
    ...(host.ramGb ? ([[t("ram"), `${host.ramGb} ${tUnits("gb")}`]] as [string, string][]) : []),
    ...(storage ? ([[t("storage"), storage.join(" + ")]] as [string, string][]) : []),
  ];

  return (
    <li className="tile flex flex-col gap-3 px-4 py-4">
      <div className="flex items-start gap-3">
        <span className="icon-pill h-9 w-9" aria-hidden="true">
          <Icon size={16} />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-mono text-sm font-semibold">{host.id}</h3>
          <p className="truncate text-xs text-muted">{host.hardware}</p>
        </div>
        <span className="tag shrink-0">{t(`kinds.${host.kind}`)}</span>
      </div>
      <dl className="flex flex-col gap-1 text-[12.5px]">
        {specs.map(([k, v]) => (
          <div key={k} className="flex gap-2">
            <dt className="w-[68px] shrink-0 font-mono text-[11px] uppercase tracking-wider text-dim">{k}</dt>
            <dd className="min-w-0 text-fg">{v}</dd>
          </div>
        ))}
      </dl>
      {vms.length > 0 && (
        <div>
          <p className="label mb-1.5">{t("vms", { count: vms.length })}</p>
          <ul className="flex flex-col gap-1">
            {vms.map((vm) => (
              <li key={vm.id} className="flex items-baseline justify-between gap-3 rounded-lg bg-surface-3/60 px-2.5 py-1.5 text-[12px]">
                <span className="font-mono font-semibold">{vm.id}</span>
                <span className="truncate text-right text-muted">{vm.services.join(" · ")}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="mt-auto flex flex-wrap gap-1.5">
        {host.vlans.length > 0 && <span className="tag">VLAN {host.vlans.join(", ")}</span>}
        {host.tags.map((tag) => (
          <span key={tag} className="tag">
            {tag}
          </span>
        ))}
      </div>
    </li>
  );
}

function Machines() {
  const t = useTranslations("lab.machines");
  return (
    <Card
      id="machines"
      icon={Server}
      title={t("title")}
      subtitle="inventory --hosts --vms"
      meta={t("meta", { count: HOSTS.length })}
      index={4}
      next="gaming"
      className="md:col-span-6 lg:col-span-12"
    >
      <ul className="stagger grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
        {HOSTS.map((h) => (
          <HostTile key={h.id} host={h} />
        ))}
      </ul>
    </Card>
  );
}

/* ─── Ressources ─── */

function Resources() {
  const t = useTranslations("lab.resources");
  const items = [
    { id: "access", icon: KeyRound },
    { id: "backups", icon: Archive },
    { id: "monitoring", icon: Activity },
  ] as const;
  return (
    <Card
      id="resources"
      icon={ScrollText}
      title={t("title")}
      subtitle="cat ~/homelab/README.md"
      index={3}
      className="md:col-span-6 lg:col-span-7"
    >
      <div className="flex flex-col gap-5">
        <p className="max-w-[70ch] text-[15px] leading-relaxed text-muted">{t("text")}</p>
        <ul className="stagger grid gap-2 sm:grid-cols-3">
          {items.map(({ id, icon: Icon }) => (
            <li key={id} className="tile px-4 py-3.5">
              <Icon size={16} aria-hidden="true" className="text-accent" />
              <p className="mt-2 text-sm font-semibold">{t(`${id}.title`)}</p>
              <p className="mt-1 text-[13px] leading-relaxed text-muted">{t(`${id}.text`)}</p>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
