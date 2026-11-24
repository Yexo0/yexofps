// src/app/[locale]/lab/page.tsx — 04 Lab: the homelab, generated from src/config/lab.ts.
// Header (one sentence, key figures, tools), the interactive map with replayed traffic paths,
// the VLAN plan and its three rules (access, backups, monitoring), then every machine.
import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { useFormatter, useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { HOSTS, LAB_MAP, LAB_SCENARIOS, LAB_SINCE, TECHNOLOGIES, VLANS, labStats, vmsOf, type Host } from "@/config/lab";
import { pageMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal, Section } from "@/components/ui/section";
import { PageSections } from "@/components/shell/page-sections";
import { ArrowLink } from "@/components/ui/primitives";
import { CountUp } from "@/components/ui/count-up";
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
  return <Lab />;
}

function Lab() {
  const t = useTranslations("lab");
  return (
    <div className="page">
      <PageHeader
        space="lab"
        eyebrow={t("overview.eyebrow", { year: LAB_SINCE })}
        title={t("overview.title")}
        lead={<p>{t("overview.text")}</p>}
        actions={<ArrowLink href="/lab/site">{t("overview.siteLink")}</ArrowLink>}
        aside={<Figures />}
      />
      <PageSections page="lab" />
      <MapSection />
      <Vlans />
      <Machines />
    </div>
  );
}

/* ─── Key figures and tools ─── */

function Figures() {
  const t = useTranslations("lab");
  const s = labStats();
  const figures = [
    { value: s.machines, label: t("stats.machines") },
    { value: s.vms, label: t("stats.guests") },
    { value: s.threads, label: t("stats.threads") },
    { value: s.ramGb, label: `${t("stats.memory")} (${t("units.gb")})` },
  ];
  return (
    <div className="flex flex-col gap-6">
      <dl className="stagger grid grid-cols-2 gap-x-6">
        {figures.map((f) => (
          <div key={f.label} className="flex flex-col-reverse border-t border-line py-3">
            <dt className="label mt-1">{f.label}</dt>
            <dd className="display text-[44px] text-fg">
              <CountUp value={f.value} />
            </dd>
          </div>
        ))}
      </dl>
      <ul className="flex flex-wrap gap-1.5" aria-label={t("overview.technologies")}>
        {TECHNOLOGIES.map((tech) => (
          <li key={tech.label} className="tag">
            {tech.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ─── Map ─── */

function MapSection() {
  const t = useTranslations("lab");
  const label = (id: string) => (t.has(`nodes.${id}.label`) ? t(`nodes.${id}.label`) : id);

  return (
    <Section id="map" index="01" title={t("map.title")} intro={t("map.intro")}>
      <Reveal>
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
            scenarios: { title: t("map.scenarios.title"), play: t("map.scenarios.play"), pause: t("map.scenarios.pause") },
          }}
          root="internet"
          scenarios={LAB_SCENARIOS.map((s) => ({ id: s.id, label: t(`map.scenarios.items.${s.id}`), path: s.path }))}
        />
      </Reveal>
    </Section>
  );
}

/* ─── VLANs and the three rules ─── */

function Vlans() {
  const t = useTranslations("lab.vlans");
  const tRules = useTranslations("lab.resources");
  return (
    <Section id="vlans" index="02" title={t("title")} intro={tRules("text")}>
      <div className="grid gap-12 lg:grid-cols-12">
        <Reveal className="lg:col-span-8">
          <ul>
            {VLANS.map((v) => {
              const members = [
                ...HOSTS.filter((h) => h.kind !== "switch" && h.kind !== "firewall" && h.vlans.includes(v.id)).map((h) => h.id),
                ...HOSTS.flatMap((h) => vmsOf(h.id)).filter((vm) => vm.vlan === v.id).map((vm) => vm.id),
              ];
              return (
                <li key={v.id} className="grid gap-2 border-t border-line py-5 sm:grid-cols-[120px_1fr] sm:gap-6">
                  <div>
                    <p className="display text-[30px] leading-none text-fg">
                      <span className="text-accent">{v.id}</span> {v.name}
                    </p>
                    <p className="mt-1.5 font-mono text-[11px] text-dim">{v.subnet}</p>
                  </div>
                  <div>
                    <p className="text-[14px] leading-relaxed text-muted">{t(`items.${v.key}`)}</p>
                    {members.length > 0 && (
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {members.map((m) => (
                          <span key={m} className="tag">
                            {m}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </Reveal>
        <Reveal i={1} className="lg:col-span-4">
          <ul className="stagger flex flex-col">
            {(["access", "backups", "monitoring"] as const).map((id, i) => (
              <li key={id} className="border-t border-line py-5">
                <p className="font-mono text-[11px] text-accent">{String(i + 1).padStart(2, "0")}</p>
                <p className="mt-2 text-[16px] font-semibold text-fg">{tRules(`${id}.title`)}</p>
                <p className="mt-1.5 text-[14px] leading-relaxed text-muted">{tRules(`${id}.text`)}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
}

/* ─── Machines ─── */

function HostTile({ host, i }: { host: Host; i: number }) {
  const t = useTranslations("lab.machines");
  const tUnits = useTranslations("lab.units");
  const format = useFormatter();
  const Icon = MAP_ICONS[host.icon];
  const vms = vmsOf(host.id);
  const size = (tb: number) => (tb < 1 ? `${Math.round(tb * 1000)} ${tUnits("gb")}` : `${format.number(tb)} ${tUnits("tb")}`);
  const storage = host.storage?.map((d) => `${size(d.tb)} ${d.label}`);

  const specs: [string, string][] = [
    [t("os"), host.os],
    ...(host.cpu ? ([[t("cpu"), `${host.cpu.model} · ${t("coresThreads", { cores: host.cpu.cores, threads: host.cpu.threads })}`]] as [string, string][]) : []),
    ...(host.ramGb ? ([[t("ram"), `${host.ramGb} ${tUnits("gb")}`]] as [string, string][]) : []),
    ...(storage ? ([[t("storage"), storage.join(" + ")]] as [string, string][]) : []),
  ];

  return (
    <li data-reveal="" style={{ "--i": i % 4 } as CSSProperties} className="card flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <span className="icon-pill" aria-hidden="true">
          <Icon size={15} />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-mono text-[14px] font-semibold text-fg">{host.id}</h3>
          <p className="truncate text-[12.5px] text-muted">{host.hardware}</p>
        </div>
        <span className="label shrink-0">{t(`kinds.${host.kind}`)}</span>
      </div>
      <dl className="flex flex-col gap-1.5 text-[12.5px]">
        {specs.map(([k, v]) => (
          <div key={k} className="flex gap-2">
            <dt className="w-[64px] shrink-0 font-mono text-[10.5px] uppercase tracking-wider text-dim">{k}</dt>
            <dd className="min-w-0 text-fg">{v}</dd>
          </div>
        ))}
      </dl>
      {vms.length > 0 && (
        <div>
          <p className="label mb-1.5">{t("vms", { count: vms.length })}</p>
          <ul className="flex flex-col">
            {vms.map((vm) => (
              <li key={vm.id} className="flex items-baseline justify-between gap-3 border-t border-line py-1.5 text-[12px]">
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
    <Section id="machines" index="03" title={t("title")} aside={<span className="label">{t("meta", { count: HOSTS.length })}</span>}>
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {HOSTS.map((h, i) => (
          <HostTile key={h.id} host={h} i={i} />
        ))}
      </ul>
    </Section>
  );
}
