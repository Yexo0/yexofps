// src/components/ui/accordion.tsx — Accordéon : pastille d'icône par entrée, entrée ouverte surlignée en tonal.
"use client";

import type { ReactNode } from "react";
import { Accordion as Radix } from "radix-ui";
import { ChevronDown } from "lucide-react";

export interface AccordionEntry {
  id: string;
  title: string;
  icon: ReactNode;
  content: ReactNode;
}

export function Accordion({ items, defaultOpen }: { items: AccordionEntry[]; defaultOpen?: string }) {
  return (
    <Radix.Root type="single" collapsible defaultValue={defaultOpen} className="flex flex-col gap-1.5">
      {items.map((item) => (
        <Radix.Item
          key={item.id}
          value={item.id}
          className="overflow-hidden rounded-[14px] bg-surface-2 transition-colors duration-150 data-[state=open]:bg-accent-tint"
        >
          <Radix.Header>
            <Radix.Trigger className="group flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm font-semibold hover:bg-surface-3/50 data-[state=open]:hover:bg-transparent">
              <span
                aria-hidden="true"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-surface-3 text-muted group-data-[state=open]:bg-accent group-data-[state=open]:text-on-accent"
              >
                {item.icon}
              </span>
              <span className="flex-1">{item.title}</span>
              <ChevronDown
                size={16}
                aria-hidden="true"
                className="text-dim transition-transform duration-150 group-data-[state=open]:rotate-180"
              />
            </Radix.Trigger>
          </Radix.Header>
          <Radix.Content className="px-3 pb-3.5 pl-14 text-sm leading-relaxed text-muted">
            {item.content}
          </Radix.Content>
        </Radix.Item>
      ))}
    </Radix.Root>
  );
}
