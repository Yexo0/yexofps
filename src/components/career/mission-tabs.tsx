// src/components/career/mission-tabs.tsx — Internship assignments as tabs (one visible at a time).
// Left: the assignment in one sentence, context, goal and role. Right: the steps, numbered.
// The selected tab is marked by a bone thumb that glides from tab to tab (Motion shared layout).
"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Tabs } from "radix-ui";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface Mission {
  id: string;
  tab: string;
  title: string;
  intro: string;
  context: string;
  objective: string;
  role: string;
  actions: string[];
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
  const [value, setValue] = useState(missions[0]?.id);
  return (
    <Tabs.Root value={value} onValueChange={setValue} className="flex flex-col gap-10">
      <Tabs.List aria-label={labels.tabs} className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto border-b border-line px-1">
        {missions.map((m, i) => (
          <Tabs.Trigger
            key={m.id}
            value={m.id}
            className={cn(
              "relative flex h-12 shrink-0 items-center gap-2.5 px-4 text-[13px] font-medium transition-colors duration-300",
              m.id === value ? "text-fg" : "text-muted hover:text-fg",
            )}
          >
            <span className={cn("font-mono text-[10.5px]", m.id === value ? "text-accent" : "text-dim")}>{String(i + 1).padStart(2, "0")}</span>
            {m.tab}
            {m.id === value && (
              <motion.span
                layoutId="mission-current"
                aria-hidden="true"
                className="absolute inset-x-0 -bottom-px h-[2px] bg-accent-vivid"
                transition={{ duration: 0.6, ease: EASE.out }}
              />
            )}
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      {missions.map((m) => (
        <Tabs.Content key={m.id} value={m.id} className="tab-in grid gap-10 outline-none lg:grid-cols-12">
          <div className="flex flex-col gap-8 lg:col-span-7">
            <div>
              <h3 className="display text-[34px] leading-[0.95] text-fg sm:text-[44px]">{m.title}</h3>
              <p className="mt-4 max-w-[60ch] text-[16px] leading-relaxed text-muted">{m.intro}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {m.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <dl className="grid gap-6 sm:grid-cols-3">
              {(
                [
                  [labels.context, m.context],
                  [labels.objective, m.objective],
                  [labels.role, m.role],
                ] as const
              ).map(([label, text]) => (
                <div key={label} className="border-t border-line pt-3">
                  <dt className="label mb-2">{label}</dt>
                  <dd className="text-[14px] leading-relaxed text-muted">{text}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="lg:col-span-5">
            <p className="label mb-3">{labels.actions}</p>
            <ol className="flex flex-col">
              {m.actions.map((a, i) => (
                <li key={a} className="flex gap-4 border-t border-line py-3.5 text-[14px] leading-relaxed text-muted">
                  <span className="font-mono text-[11px] text-accent">{String(i + 1).padStart(2, "0")}</span>
                  {a}
                </li>
              ))}
            </ol>
          </div>
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}
