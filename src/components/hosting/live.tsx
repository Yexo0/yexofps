// src/components/hosting/live.tsx — Page /lab/site : chiffres en direct (temps de réponse, durées de
// fonctionnement, dernier déploiement), chemin d'une requête jusqu'à l'appli et fiche du serveur.
// Tout vient de /api/host (useHost) : ce qui n'est pas détecté n'est pas affiché.
"use client";

import { Fragment, type CSSProperties, type ReactNode } from "react";
import { useFormatter, useTranslations } from "next-intl";
import {
  Cloud,
  FileCode2,
  Gamepad2,
  Image as ImageIcon,
  Monitor,
  Radio,
  Server,
  ShieldCheck,
  Activity,
  type LucideIcon,
} from "lucide-react";
import { HOSTING } from "@/config/site";
import { useHost } from "@/hooks/use-host";
import { Skeleton } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

const BUILD_TIME = process.env.BUILD_TIME;
const BUILD_COMMIT = process.env.BUILD_COMMIT;
const GB = 1024 ** 3;

/** Durée (secondes) → clé et valeurs du message : "3 j 4 h", "4 h 12 min", "12 min", "moins d'1 min" */
function durationParts(seconds: number) {
  const d = Math.floor(seconds / 86_400);
  const h = Math.floor((seconds % 86_400) / 3_600);
  const m = Math.floor((seconds % 3_600) / 60);
  return { key: d > 0 ? "d" : h > 0 ? "h" : m > 0 ? "m" : "lt", values: { d, h, m } } as const;
}

/* ─── Chiffres en direct ─── */

export function LiveTiles() {
  const t = useTranslations("hosting");
  const format = useFormatter();
  const { info, rtt, at, failed } = useHost();
  const last = rtt.at(-1);
  const duration = (s: number) => {
    const p = durationParts(s);
    return t(`duration.${p.key}`, p.values);
  };
  const deployed = BUILD_TIME ? new Date(BUILD_TIME) : null;

  return (
    <div className="stagger grid grid-cols-2 gap-2.5 lg:grid-cols-4">
      <Tile label={t("tiles.rtt")} sub={t("tiles.rttSub")} live={Boolean(last) && !failed}>
        {last ? (
          <span className="flex items-end justify-between gap-3">
            <span>
              {last}
              <span className="ml-1 font-mono text-[11px] font-normal text-muted">ms</span>
            </span>
            <Sparkline values={rtt} />
          </span>
        ) : (
          <Placeholder failed={failed} />
        )}
      </Tile>
      <Tile label={t("tiles.system")}>{info ? duration(info.uptime.system) : <Placeholder failed={failed} />}</Tile>
      <Tile label={t("tiles.app")} sub={t("tiles.appSub")}>
        {info ? duration(info.uptime.app) : <Placeholder failed={failed} />}
      </Tile>
      <Tile label={t("tiles.deploy")} sub={BUILD_COMMIT ? `commit ${BUILD_COMMIT}` : undefined}>
        {deployed ? (at ? format.relativeTime(deployed, at) : format.dateTime(deployed, { dateStyle: "medium" })) : "—"}
      </Tile>
    </div>
  );
}

function Tile({ label, sub, live, children }: { label: string; sub?: string; live?: boolean; children: ReactNode }) {
  return (
    <div className="tile flex min-w-0 flex-col justify-between gap-2 px-4 py-3.5">
      <div className="text-[22px] font-bold leading-none tracking-tight tabular-nums text-fg">{children}</div>
      <div>
        <p className="label flex items-center gap-1.5">
          {live && <span aria-hidden="true" className="live-dot h-1.5 w-1.5 rounded-full bg-accent" />}
          {label}
        </p>
        {sub && <p className="mt-0.5 truncate font-mono text-[11px] text-dim">{sub}</p>}
      </div>
    </div>
  );
}

function Placeholder({ failed }: { failed: boolean }) {
  const t = useTranslations("hosting");
  return failed ? <span className="text-[15px] font-medium text-dim">{t("unavailable")}</span> : <Skeleton className="h-6 w-20" />;
}

/** Petite courbe des derniers temps de réponse */
function Sparkline({ values }: { values: number[] }) {
  if (values.length < 2) return null;
  const w = 72;
  const h = 22;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = Math.max(max - min, 1);
  const points = values
    .map((v, i) => `${((i / (values.length - 1)) * w).toFixed(1)},${(h - 2 - ((v - min) / span) * (h - 4)).toFixed(1)}`)
    .join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true" className="shrink-0 text-accent">
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

/* ─── Chemin d'une requête ─── */

interface PathNode {
  id: string;
  icon: LucideIcon;
  title: string;
  sub: string;
}

export function RequestPath({ nextVersion }: { nextVersion: string }) {
  const t = useTranslations("hosting.path");
  const { info, rtt } = useHost();
  const last = rtt.at(-1);
  const edge = info?.edge;
  const cert = info?.certificate;
  const manager = info?.manager ? t(`managers.${info.manager}`) : null;

  const outside: PathNode[] = [
    { id: "visitor", icon: Monitor, title: t("visitor"), sub: last ? `${last} ms` : edge?.https ? "HTTPS" : "…" },
  ];
  if (edge?.cloudflare) outside.push({ id: "cloudflare", icon: Cloud, title: "Cloudflare", sub: t("cloudflareSub") });

  const inside: PathNode[] = [];
  if (edge?.proxy) {
    inside.push({
      id: "proxy",
      icon: ShieldCheck,
      title: HOSTING.reverseProxy ?? t("proxy"),
      sub: [edge.https && "HTTPS", cert?.issuer].filter(Boolean).join(" · ") || t("proxySub"),
    });
  }
  inside.push({
    id: "app",
    icon: Server,
    title: `Next.js ${nextVersion}`,
    sub: info ? [`Node ${info.node}`, manager].filter(Boolean).join(" · ") : "…",
  });

  const branches: { id: string; icon: LucideIcon }[] = [
    { id: "pages", icon: FileCode2 },
    { id: "valorant", icon: Gamepad2 },
    { id: "presence", icon: Radio },
    { id: "host", icon: Activity },
    { id: "images", icon: ImageIcon },
  ];

  const vpsLabel = [HOSTING.provider, t("vps"), info?.os].filter(Boolean).join(" · ");

  return (
    <div className="flex flex-col gap-5">
      {/* Chaîne principale : du navigateur jusqu'à l'appli */}
      <ol className="flex flex-col items-stretch md:flex-row md:items-center" aria-label={t("chain")}>
        {outside.map((node, i) => (
          <Fragment key={node.id}>
            {i > 0 && <PathLink index={i} />}
            <li className="md:w-[200px] md:shrink-0">
              <NodeBox node={node} />
            </li>
          </Fragment>
        ))}
        <PathLink index={outside.length} />
        <li className="min-w-0 flex-1">
          <div className="relative rounded-[18px] border border-dashed border-line-strong p-3 pt-7">
            <span className="label absolute left-3.5 top-2.5">{vpsLabel}</span>
            <ol className="flex flex-col md:flex-row md:items-center">
              {inside.map((node, i) => (
                <Fragment key={node.id}>
                  {i > 0 && <PathLink index={outside.length + i} />}
                  <li className="min-w-0 md:flex-1">
                    <NodeBox node={node} highlight={node.id === "app"} />
                  </li>
                </Fragment>
              ))}
            </ol>
          </div>
        </li>
      </ol>

      {/* Ce que fait l'appli */}
      <div>
        <p className="label mb-2">{t("branches")}</p>
        <ul className="stagger grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {branches.map(({ id, icon: Icon }) => (
            <li key={id} className="tile flex items-start gap-3 px-3.5 py-3">
              <Icon size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-accent" />
              <span className="min-w-0">
                <span className="block text-[13.5px] font-semibold text-fg">{t(`items.${id}.title`)}</span>
                <span className="block text-[12px] leading-snug text-muted">{t(`items.${id}.sub`)}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function NodeBox({ node, highlight }: { node: PathNode; highlight?: boolean }) {
  const Icon = node.icon;
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-[14px] px-3.5 py-3",
        highlight ? "glow bg-accent-tint text-on-accent-container" : "bg-surface-2",
      )}
    >
      <Icon size={18} aria-hidden="true" className={highlight ? "" : "text-muted"} />
      <span className="min-w-0">
        <span className="block truncate text-[13.5px] font-semibold">{node.title}</span>
        <span className={cn("block truncate font-mono text-[11px]", highlight ? "" : "text-dim")}>{node.sub}</span>
      </span>
    </div>
  );
}

/** Liaison entre deux étapes : un trait et un paquet qui circule (sens de la requête) */
function PathLink({ index }: { index: number }) {
  return (
    <li aria-hidden="true" className="path-link" style={{ "--pi": index } as CSSProperties}>
      <span className="path-packet" />
    </li>
  );
}

/* ─── Fiche du serveur ─── */

export function ServerSpecs() {
  const t = useTranslations("hosting.server");
  const format = useFormatter();
  const { info, failed } = useHost();

  if (!info) {
    return failed ? (
      <p className="text-sm text-dim">{t("unavailable")}</p>
    ) : (
      <div className="flex flex-col gap-2" aria-busy="true">
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} className="h-9 w-full" />
        ))}
      </div>
    );
  }

  const gb = (bytes: number) => format.number(bytes / GB, { maximumFractionDigits: 1 });
  const memoryShare = info.memory.used / info.memory.total;
  const rows: { label: string; value: ReactNode }[] = [
    ...(HOSTING.provider ? [{ label: t("provider"), value: HOSTING.provider }] : []),
    { label: t("os"), value: info.os ?? "—" },
    { label: t("cpu"), value: t("cpuValue", { n: info.cpus }) },
    {
      label: t("memory"),
      value: (
        <span className="flex items-center gap-3">
          <span
            className="h-1.5 w-24 overflow-hidden rounded-full bg-surface-3"
            role="meter"
            aria-label={t("memory")}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(memoryShare * 100)}
          >
            <span className="block h-full rounded-full bg-accent" style={{ width: `${memoryShare * 100}%` }} />
          </span>
          {t("memoryValue", { used: gb(info.memory.used), total: gb(info.memory.total) })}
        </span>
      ),
    },
    { label: t("load"), value: format.number(info.load, { maximumFractionDigits: 2 }) },
    { label: t("node"), value: `v${info.node}` },
    { label: t("manager"), value: info.manager ? t(`managers.${info.manager}`) : t("managers.none") },
    ...(info.certificate
      ? [{ label: t("certificate"), value: t("certificateValue", { issuer: info.certificate.issuer, days: info.certificate.daysLeft }) }]
      : []),
  ];

  return (
    <dl className="stagger flex flex-col gap-1">
      {rows.map((row) => (
        <div key={row.label} className="flex items-center justify-between gap-4 rounded-xl px-3 py-2.5 hover:bg-surface-2">
          <dt className="text-[13px] text-muted">{row.label}</dt>
          <dd className="text-right font-mono text-[12.5px] text-fg">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
