// src/components/home/whoami.tsx — Bascule "whoami --as yexo | baptiste" : les deux facettes du profil.
// Les deux textes sont rendus dans le HTML (forceMount) ; seul l'onglet actif est visible.
"use client";

import { Tabs } from "radix-ui";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { NextSpace } from "@/components/ui/next-space";
import type { SpaceId } from "@/config/spaces";

const PROFILES = ["yexo", "baptiste"] as const;

/** Où mène chaque profil : le créateur vers ses montages, le pro vers son parcours */
const PATHS: Record<(typeof PROFILES)[number], SpaceId> = { yexo: "creator", baptiste: "career" };

export function Whoami() {
  const t = useTranslations("home.hero.whoami");
  return (
    <Tabs.Root defaultValue="yexo" className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2 font-mono text-[12.5px]">
        <span className="text-accent">$</span>
        <span className="text-muted">whoami --as</span>
        <Tabs.List aria-label={t("label")} className="flex gap-1 rounded-full bg-surface-2 p-1">
          {PROFILES.map((p) => (
            <Tabs.Trigger
              key={p}
              value={p}
              className={cn(
                "rounded-full px-3 py-1 text-muted transition-colors hover:text-fg",
                "data-[state=active]:bg-accent data-[state=active]:text-on-accent",
              )}
            >
              {p}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
      </div>
      {PROFILES.map((p) => (
        <Tabs.Content
          key={p}
          value={p}
          forceMount
          className="tab-in max-w-[68ch] text-[15px] leading-relaxed text-muted outline-none data-[state=inactive]:hidden"
        >
          <p>
            <span className="font-semibold text-fg">{t(`${p}.title`)}</span> {t(`${p}.text`)}
          </p>
          <div className="mt-3">
            <NextSpace to={PATHS[p]} label={t(`${p}.path`)} />
          </div>
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}
