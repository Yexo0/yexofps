// src/components/career/mission-tabs.tsx — Missions de stage en onglets (une mission visible à la fois).
"use client";

import { Tabs } from "radix-ui";
import { Crosshair, Eye, ListChecks, UserRound } from "lucide-react";

export interface Mission {
  id: string;
  tab: string;
  title: string;
  intro: string;
  missionLabel: string;
  mission: string;
  context: string;
  objective: string;
  role: string;
  actions: string[];
  proofTitle: string;
  proofText: string;
  impacts: { title: string; text: string }[];
  tags: string[];
}

export interface MissionLabels {
  tabs: string;
  context: string;
  objective: string;
  role: string;
  actions: string;
}

export function MissionTabs({ missions, labels }: { missions: Mission[]; labels: MissionLabels }) {
  return (
    <Tabs.Root defaultValue={missions[0]?.id} className="flex flex-col gap-5">
      <Tabs.List
        aria-label={labels.tabs}
        className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 [scrollbar-width:thin]"
      >
        {missions.map((m, i) => (
          <Tabs.Trigger
            key={m.id}
            value={m.id}
            className="btn btn-sm shrink-0 bg-surface-2 text-muted hover:bg-surface-3 hover:text-fg data-[state=active]:bg-accent data-[state=active]:text-on-accent"
          >
            <span className="font-mono text-[11px]">{String(i + 1).padStart(2, "0")}</span>
            {m.tab}
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      {missions.map((m) => (
        <Tabs.Content key={m.id} value={m.id} className="tab-in grid gap-3 outline-none lg:grid-cols-12">
          <div className="flex flex-col gap-3 lg:col-span-7">
            <div>
              <h3 className="text-xl font-bold tracking-tight">{m.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{m.intro}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {m.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="tile px-4 py-3.5">
              <p className="label mb-1.5 text-accent">{m.missionLabel}</p>
              <p className="text-sm leading-relaxed text-fg">{m.mission}</p>
            </div>
            <dl className="grid gap-2 sm:grid-cols-3">
              {(
                [
                  [labels.context, m.context, Eye],
                  [labels.objective, m.objective, Crosshair],
                  [labels.role, m.role, UserRound],
                ] as const
              ).map(([label, text, Icon]) => (
                <div key={label} className="tile px-4 py-3.5">
                  <dt className="label mb-1.5 flex items-center gap-1.5">
                    <Icon size={12} aria-hidden="true" />
                    {label}
                  </dt>
                  <dd className="text-[13px] leading-relaxed text-muted">{text}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="flex flex-col gap-3 lg:col-span-5">
            <div className="tile px-4 py-4">
              <p className="label mb-3 flex items-center gap-1.5">
                <ListChecks size={12} aria-hidden="true" />
                {labels.actions}
              </p>
              <ol className="flex flex-col gap-2.5">
                {m.actions.map((a, i) => (
                  <li key={a} className="flex gap-3 text-[13px] leading-relaxed text-muted">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent-tint font-mono text-[10.5px] text-accent">
                      {i + 1}
                    </span>
                    {a}
                  </li>
                ))}
              </ol>
            </div>
            <div className="tile px-4 py-4">
              <p className="text-sm font-semibold">{m.proofTitle}</p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{m.proofText}</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {m.impacts.map((imp) => (
                  <div key={imp.title} className="rounded-xl bg-surface-3/60 px-3 py-2.5">
                    <p className="text-[13px] font-semibold">{imp.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted">{imp.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}
