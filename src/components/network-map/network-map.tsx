// src/components/network-map/network-map.tsx — Schéma réseau interactif.
// Nœuds = petites cartes (icône, nom mono, sous-titre) reliées par des courbes fines ;
// groupes en pointillés avec label mono. Survol, focus ou clic sur un nœud : le panneau
// en dessous affiche son rôle et les nœuds qui y sont reliés.
// Desktop : SVG. Mobile : liste groupée avec le même contenu.
"use client";

import { useMemo, useState, type KeyboardEvent } from "react";
import { ChevronDown, MousePointerClick } from "lucide-react";
import { cn } from "@/lib/utils";
import { MAP_ICONS, type MapIcon } from "./icons";

export interface MapNode {
  id: string;
  label: string;
  sub: string;
  icon: MapIcon;
  x: number;
  y: number;
}
export interface MapLink {
  from: string;
  to: string;
  kind?: "solid" | "dashed" | "logical";
  label?: string;
}
export interface MapGroup {
  id: string;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
}
export interface MapDetail {
  role: string;
  tags?: readonly string[];
}
export interface MapLabels {
  /** Nom accessible du schéma */
  title: string;
  /** Texte du panneau quand rien n'est sélectionné */
  hint: string;
  related: string;
  ungrouped: string;
}

const W = 150;
const H = 46;

/** Point d'attache et tracé d'une courbe entre deux nœuds */
function linkPath(a: MapNode, b: MapNode) {
  const horizontalGap = Math.abs(b.x - a.x) >= W * 0.6;
  if (horizontalGap) {
    const leftToRight = b.x > a.x;
    const x1 = leftToRight ? a.x + W : a.x;
    const x2 = leftToRight ? b.x : b.x + W;
    const y1 = a.y + H / 2;
    const y2 = b.y + H / 2;
    const dx = (x2 - x1) / 2;
    return { d: `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`, x1, y1, x2, y2 };
  }
  const down = b.y > a.y;
  const x1 = a.x + W / 2;
  const x2 = b.x + W / 2;
  const y1 = down ? a.y + H : a.y;
  const y2 = down ? b.y : b.y + H;
  const dy = (y2 - y1) / 2;
  return { d: `M ${x1} ${y1} C ${x1} ${y1 + dy}, ${x2} ${y2 - dy}, ${x2} ${y2}`, x1, y1, x2, y2 };
}

function inGroup(n: MapNode, g: MapGroup) {
  return n.x >= g.x && n.y >= g.y && n.x + W <= g.x + g.w && n.y + H <= g.y + g.h;
}

export function NetworkMap({
  width,
  height,
  nodes,
  links,
  groups,
  details,
  labels,
}: {
  width: number;
  height: number;
  nodes: readonly MapNode[];
  links: readonly MapLink[];
  groups: readonly MapGroup[];
  details: Record<string, MapDetail>;
  labels: MapLabels;
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const active = hovered ?? pinned;

  const byId = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);

  /** Voisins de chaque nœud (tous types de liens, y compris logiques) */
  const neighbors = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const l of links) {
      if (!map.has(l.from)) map.set(l.from, new Set());
      if (!map.has(l.to)) map.set(l.to, new Set());
      map.get(l.from)!.add(l.to);
      map.get(l.to)!.add(l.from);
    }
    return map;
  }, [links]);

  const related = active ? new Set([active, ...(neighbors.get(active) ?? [])]) : null;
  const togglePin = (id: string) => setPinned((p) => (p === id ? null : id));

  const onNodeKey = (e: KeyboardEvent, id: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      togglePin(id);
    } else if (e.key === "Escape") {
      setPinned(null);
    }
  };

  /* Groupes pour la vue mobile */
  const grouped = useMemo(() => {
    const sections = groups.map((g) => ({ id: g.id, label: g.label, items: nodes.filter((n) => inGroup(n, g)) }));
    const assigned = new Set(sections.flatMap((s) => s.items.map((n) => n.id)));
    const rest = nodes.filter((n) => !assigned.has(n.id));
    return [{ id: "_", label: labels.ungrouped, items: rest }, ...sections].filter((s) => s.items.length);
  }, [groups, nodes, labels.ungrouped]);

  const activeNode = active ? byId.get(active) : null;
  const ActiveIcon = activeNode ? MAP_ICONS[activeNode.icon] : null;
  const neighborsOf = (id: string) =>
    [...(neighbors.get(id) ?? [])].map((nid) => byId.get(nid)).filter((n): n is MapNode => !!n);

  return (
    <div className="flex flex-col gap-3">
      {/* ─── Desktop : SVG ─── */}
      <div className="hidden md:block">
        <svg
          viewBox={`-6 -6 ${width + 12} ${height + 12}`}
          role="group"
          aria-label={labels.title}
          className="h-auto w-full select-none"
          onMouseLeave={() => setHovered(null)}
        >
          {groups.map((g) => (
            <g key={g.id} aria-hidden="true">
              <rect
                x={g.x}
                y={g.y}
                width={g.w}
                height={g.h}
                rx={14}
                fill="none"
                stroke="var(--line-strong)"
                strokeDasharray="4 5"
              />
              <text
                x={g.x + 12}
                y={g.y + g.h - 9}
                fill="var(--text-dim)"
                fontFamily="var(--font-mono)"
                fontSize={10}
                letterSpacing="0.12em"
              >
                {g.label.toUpperCase()}
              </text>
            </g>
          ))}

          {links
            .filter((l) => l.kind !== "logical")
            .map((l) => {
              const a = byId.get(l.from);
              const b = byId.get(l.to);
              if (!a || !b) return null;
              const p = linkPath(a, b);
              const isActive = !!active && (l.from === active || l.to === active);
              const dimmed = !!related && !isActive;
              return (
                <g key={`${l.from}-${l.to}`} aria-hidden="true" opacity={dimmed ? 0.3 : 1}>
                  <path
                    d={p.d}
                    fill="none"
                    stroke={isActive ? "var(--accent)" : "var(--text-dim)"}
                    strokeOpacity={isActive ? 1 : 0.55}
                    strokeWidth={isActive ? 1.6 : 1.1}
                    strokeDasharray={l.kind === "dashed" ? "5 5" : undefined}
                  />
                  <circle cx={p.x1} cy={p.y1} r={2.4} fill={isActive ? "var(--accent)" : "var(--text-dim)"} />
                  <circle cx={p.x2} cy={p.y2} r={2.4} fill={isActive ? "var(--accent)" : "var(--text-dim)"} />
                  {l.label && (
                    <text
                      x={(p.x1 + p.x2) / 2}
                      y={(p.y1 + p.y2) / 2 - 7}
                      textAnchor="middle"
                      fill="var(--text-muted)"
                      fontFamily="var(--font-mono)"
                      fontSize={10.5}
                      stroke="var(--surface-solid)"
                      strokeWidth={4}
                      paintOrder="stroke"
                    >
                      {l.label}
                    </text>
                  )}
                </g>
              );
            })}

          {nodes.map((n) => {
            const Icon = MAP_ICONS[n.icon];
            const isActive = n.id === active;
            const isPinned = n.id === pinned;
            const dimmed = !!related && !related.has(n.id);
            return (
              <g
                key={n.id}
                transform={`translate(${n.x} ${n.y})`}
                role="button"
                tabIndex={0}
                aria-pressed={isPinned}
                aria-label={`${n.label}, ${n.sub}`}
                onMouseEnter={() => setHovered(n.id)}
                onFocus={() => setHovered(n.id)}
                onBlur={() => setHovered(null)}
                onClick={() => togglePin(n.id)}
                onKeyDown={(e) => onNodeKey(e, n.id)}
                opacity={dimmed ? 0.35 : 1}
                className="cursor-pointer outline-none"
                style={{ transition: "opacity 150ms ease" }}
              >
                <rect
                  width={W}
                  height={H}
                  rx={12}
                  fill={isActive || isPinned ? "var(--accent-tint)" : "var(--surface-2)"}
                  stroke={isActive || isPinned ? "var(--accent)" : "var(--line-strong)"}
                  strokeWidth={isActive || isPinned ? 1.5 : 1}
                />
                <Icon
                  x={12}
                  y={13}
                  size={20}
                  strokeWidth={1.8}
                  color={isActive || isPinned ? "var(--accent)" : "var(--text-muted)"}
                  aria-hidden="true"
                />
                <text x={42} y={20} fill="var(--text)" fontFamily="var(--font-mono)" fontSize={12} fontWeight={600}>
                  {n.label}
                </text>
                <text x={42} y={35} fill="var(--text-dim)" fontFamily="var(--font-mono)" fontSize={10.5}>
                  {n.sub}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* ─── Mobile : liste groupée, détails dépliables ─── */}
      <div className="flex flex-col gap-4 md:hidden">
        {grouped.map((section) => (
          <div key={section.id}>
            <p className="label mb-2">{section.label}</p>
            <ul className="flex flex-col gap-1.5">
              {section.items.map((n) => {
                const Icon = MAP_ICONS[n.icon];
                const open = pinned === n.id;
                return (
                  <li key={n.id} className="tile overflow-hidden">
                    <button
                      type="button"
                      aria-expanded={open}
                      onClick={() => togglePin(n.id)}
                      className="flex w-full items-center gap-3 px-3.5 py-3 text-left"
                    >
                      <Icon size={18} aria-hidden="true" className={open ? "text-accent" : "text-muted"} />
                      <span className="min-w-0 flex-1">
                        <span className="block font-mono text-[13px] font-semibold">{n.label}</span>
                        <span className="block font-mono text-[11px] text-dim">{n.sub}</span>
                      </span>
                      <ChevronDown
                        size={16}
                        aria-hidden="true"
                        className={cn("text-dim transition-transform", open && "rotate-180")}
                      />
                    </button>
                    {open && (
                      <div className="border-t border-line px-3.5 pb-3.5 pt-3">
                        <NodeDetails
                          detail={details[n.id]}
                          neighbors={neighborsOf(n.id)}
                          relatedLabel={labels.related}
                          onSelect={(id) => setPinned(id)}
                        />
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* ─── Panneau de détail (desktop) ─── */}
      <div className="tile hidden min-h-[132px] flex-col justify-center px-5 py-4 md:flex" aria-live="polite">
        {activeNode && ActiveIcon ? (
          <div className="flex gap-4">
            <span className="icon-pill" aria-hidden="true">
              <ActiveIcon size={17} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-mono text-sm font-semibold">
                {activeNode.label}
                <span className="ml-2 font-normal text-dim">{activeNode.sub}</span>
              </p>
              <NodeDetails
                detail={details[activeNode.id]}
                neighbors={neighborsOf(activeNode.id)}
                relatedLabel={labels.related}
                onSelect={(id) => setPinned(id)}
              />
            </div>
          </div>
        ) : (
          <p className="flex items-center gap-3 text-sm text-muted">
            <MousePointerClick size={18} aria-hidden="true" className="shrink-0 text-dim" />
            {labels.hint}
          </p>
        )}
      </div>
    </div>
  );
}

function NodeDetails({
  detail,
  neighbors,
  relatedLabel,
  onSelect,
}: {
  detail?: MapDetail;
  neighbors: MapNode[];
  relatedLabel: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="mt-1.5 flex flex-col gap-3">
      {detail?.role && <p className="max-w-[80ch] text-sm leading-relaxed text-muted">{detail.role}</p>}
      {detail?.tags && detail.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {detail.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
      )}
      {neighbors.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="label mr-1">{relatedLabel}</span>
          {neighbors.map((nb) => {
            const Icon = MAP_ICONS[nb.icon];
            return (
              <button
                key={nb.id}
                type="button"
                onClick={() => onSelect(nb.id)}
                className="chip min-h-7 px-2.5 font-mono text-xs hover:bg-surface-hover"
              >
                <Icon size={13} aria-hidden="true" className="text-muted" />
                {nb.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
