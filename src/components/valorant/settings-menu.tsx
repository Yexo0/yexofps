// src/components/valorant/settings-menu.tsx — Menu des settings Valorant, organisé comme en jeu :
// onglets principaux, sous-onglets, sections et lignes (libellé à gauche, réglage à droite).
// Lecture seule : les contrôles montrent l'état choisi, ils ne se manipulent pas.
// L'onglet ouvert est reflété dans l'URL (#crosshair/primary) pour partager un onglet précis.
"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type KeyboardEvent } from "react";
import { Tabs } from "radix-ui";
import { useLocale, useTranslations } from "next-intl";
import { ChevronDown, RotateCcw, Volume2, VolumeX } from "lucide-react";
import {
  CROSSHAIR,
  SETTINGS_TABS,
  type SettingRow,
  type SettingsSection,
  type SettingsTab,
} from "@/config/valorant-settings";
import { CopyButton } from "@/components/ui/copy-button";
import { cn } from "@/lib/utils";
import { CrosshairSvg } from "./crosshair";

/* ─── Onglet actif ↔ hash de l'URL ──────────────────────── */

const HASH_EVENT = "settings-hash";

function subscribe(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  window.addEventListener(HASH_EVENT, onChange);
  return () => {
    window.removeEventListener("hashchange", onChange);
    window.removeEventListener(HASH_EVENT, onChange);
  };
}
const readHash = () => window.location.hash.slice(1);
const readServerHash = () => "";

/** Met à jour l'URL sans ajouter d'entrée d'historique ni faire défiler la page */
function writeHash(value: string) {
  window.history.replaceState(window.history.state, "", `#${value}`);
  window.dispatchEvent(new Event(HASH_EVENT));
}

/** "controls/equipment" → onglet et sous-onglet existants (les premiers sinon) */
function resolve(hash: string) {
  const [tabId, subId] = hash.split("/");
  const tab = SETTINGS_TABS.find((t) => t.id === tabId) ?? SETTINGS_TABS[0];
  const sub = tab.subTabs.find((s) => s.id === subId) ?? tab.subTabs[0];
  return { tab, sub };
}

/* ─── Menu ──────────────────────────────────────────────── */

export function SettingsMenu() {
  const t = useTranslations("valoSettings.menu");
  const hash = useSyncExternalStore(subscribe, readHash, readServerHash);
  const { tab, sub } = resolve(hash);
  // Comme en jeu : revenir sur un onglet rouvre le dernier sous-onglet consulté
  const [lastSub, setLastSub] = useState<Record<string, string>>({});
  const headerRef = useRef<HTMLDivElement>(null);

  // Petits écrans : les barres d'onglets défilent, l'onglet ouvert est ramené au centre
  useEffect(() => {
    headerRef.current?.querySelectorAll<HTMLElement>('[role="tablist"]').forEach((list) => {
      const active = list.querySelector<HTMLElement>('[aria-selected="true"]');
      if (!active || list.scrollWidth <= list.clientWidth) return;
      const left = active.offsetLeft - (list.clientWidth - active.offsetWidth) / 2;
      const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      list.scrollTo({ left, behavior: smooth ? "smooth" : "auto" });
    });
  }, [tab.id, sub.id]);

  function openTab(tabId: string) {
    const target = SETTINGS_TABS.find((x) => x.id === tabId);
    const remembered = lastSub[tabId];
    writeHash(remembered && remembered !== target?.subTabs[0].id ? `${tabId}/${remembered}` : tabId);
  }

  function openSub(subId: string) {
    setLastSub((prev) => ({ ...prev, [tab.id]: subId }));
    writeHash(subId === tab.subTabs[0].id ? tab.id : `${tab.id}/${subId}`);
  }

  return (
    <Tabs.Root value={tab.id} onValueChange={openTab} className="flex flex-col">
      {/* Barre d'onglets collante : on sait toujours où on est en faisant défiler */}
      <div
        ref={headerRef}
        className="sticky top-2 z-20 -mx-2 rounded-[16px] border border-line bg-surface-solid/90 px-2 pt-2 shadow-[var(--shadow)] backdrop-blur-md md:top-3"
      >
        <Tabs.List
          aria-label={t("tabs")}
          lang="en"
          className="no-scrollbar flex gap-1 overflow-x-auto sm:justify-center"
        >
          {SETTINGS_TABS.map((x) => (
            <Tabs.Trigger key={x.id} value={x.id} className="set-tab">
              {x.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        {tab.subTabs.length > 1 ? (
          <SubTabs tab={tab} active={sub.id} onChange={openSub} label={t("subTabs", { tab: tab.label })} />
        ) : (
          <div className="h-2" />
        )}
      </div>

      {SETTINGS_TABS.map((x) => (
        <Tabs.Content key={x.id} value={x.id} className="outline-none">
          <div className="mx-auto w-full max-w-[1000px] pt-5">
            {x.crosshairPreview && <CrosshairPanel />}
            {/* key : les lignes rejouent leur apparition à chaque changement de sous-onglet */}
            <div
              key={`${x.id}/${sub.id}`}
              {...(x.subTabs.length > 1
                ? { role: "tabpanel", id: SUB_PANEL_ID, "aria-labelledby": subTabId(x.id, sub.id) }
                : {})}
            >
              <Panel tab={x} sections={x.id === tab.id ? sub.sections : []} />
            </div>
          </div>
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}

/* ─── Sous-onglets (hors Radix : la liste est dans la barre collante, le contenu plus bas) ── */

const SUB_PANEL_ID = "settings-subpanel";
const subTabId = (tabId: string, subId: string) => `settings-sub-${tabId}-${subId}`;

function SubTabs({
  tab,
  active,
  onChange,
  label,
}: {
  tab: SettingsTab;
  active: string;
  onChange: (id: string) => void;
  label: string;
}) {
  // Flèches gauche/droite, Début/Fin : même comportement que les onglets principaux
  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const ids = tab.subTabs.map((s) => s.id);
    const i = ids.indexOf(active);
    const next =
      e.key === "ArrowRight" ? ids[(i + 1) % ids.length]
      : e.key === "ArrowLeft" ? ids[(i - 1 + ids.length) % ids.length]
      : e.key === "Home" ? ids[0]
      : e.key === "End" ? ids[ids.length - 1]
      : null;
    if (!next) return;
    e.preventDefault();
    onChange(next);
    document.getElementById(subTabId(tab.id, next))?.focus();
  }

  return (
    <div
      role="tablist"
      aria-label={label}
      lang="en"
      onKeyDown={onKeyDown}
      className="no-scrollbar mt-1 flex gap-1 overflow-x-auto border-t border-line sm:justify-center"
    >
      {tab.subTabs.map((s) => {
        const selected = s.id === active;
        return (
          <button
            key={s.id}
            type="button"
            role="tab"
            id={subTabId(tab.id, s.id)}
            aria-selected={selected}
            aria-controls={selected ? SUB_PANEL_ID : undefined}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(s.id)}
            className="set-subtab"
          >
            {s.label}
          </button>
        );
      })}
    </div>
  );
}

function Panel({ tab, sections }: { tab: SettingsTab; sections: SettingsSection[] }) {
  let index = 0;
  return (
    <div className="flex flex-col gap-5" data-tab={tab.id}>
      {sections.map((section, i) => (
        <section key={section.title ?? i} aria-label={section.title ?? tab.label}>
          {section.title && (
            <h3 lang="en" className="label mb-2 px-1">
              {section.title}
            </h3>
          )}
          <ul className="flex flex-col gap-[3px]">
            {section.rows.map((row) => (
              <Row key={`${row.label}-${index}`} row={row} index={index++} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

/* ─── Lignes ────────────────────────────────────────────── */

function Row({ row, index }: { row: SettingRow; index: number }) {
  const depth = row.depth ?? 0;
  return (
    <li
      className={cn("set-row", row.disabled && "set-row-off")}
      style={{ "--ri": Math.min(index, 18) } as CSSProperties}
    >
      <div className="flex min-w-0 items-center" style={{ paddingLeft: depth ? `${(depth - 1) * 18}px` : undefined }}>
        {depth > 0 && <span aria-hidden="true" className="set-branch" />}
        <div className="min-w-0" lang="en">
          <span data-label className="block text-[13px] font-medium leading-snug text-fg">{row.label}</span>
          {row.hint && <span className="block text-[11.5px] leading-snug text-dim">{row.hint}</span>}
        </div>
      </div>
      <Control row={row} />
    </li>
  );
}

function Control({ row }: { row: SettingRow }) {
  const t = useTranslations("valoSettings.menu");
  const locale = useLocale();
  const sr = (text: string) => (
    <span className="sr-only" lang={locale}>
      {text}
    </span>
  );

  switch (row.kind) {
    case "choice": {
      const width = row.options.length === 2 ? "sm:w-[136px]" : row.options.length === 3 ? "sm:w-[118px]" : "sm:w-[98px]";
      return (
        <div className="flex w-full gap-1 sm:w-auto">
          <span className="sr-only" lang="en">
            {row.value}
          </span>
          {row.options.map((option) => (
            <span
              key={option}
              aria-hidden="true"
              lang="en"
              data-on={option === row.value || undefined}
              className={cn("set-seg flex-1 sm:flex-none", width)}
            >
              {option}
            </span>
          ))}
        </div>
      );
    }

    case "slider":
      return (
        <div className="flex w-full items-center gap-3 sm:w-[360px]">
          <span aria-hidden="true" className="set-track" style={{ "--pct": `${row.pct}%` } as CSSProperties}>
            <span className="set-fill" />
            <span className="set-thumb" />
          </span>
          {row.volume ? (
            <span aria-hidden="true" className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-inset text-muted">
              {row.pct === 0 ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </span>
          ) : (
            <span aria-hidden="true" className="set-box w-[84px] shrink-0 justify-center font-mono">
              {row.value}
            </span>
          )}
          {sr(row.value ?? (row.pct === 0 ? t("muted") : t("approx", { pct: row.pct })))}
        </div>
      );

    case "select":
      return (
        <span className="set-box w-full justify-between gap-3 sm:w-[300px]" lang="en">
          <span className="truncate">{row.value}</span>
          <ChevronDown size={15} aria-hidden="true" className="shrink-0 text-dim" />
        </span>
      );

    case "field":
      return (
        <span className="set-box w-full justify-center font-mono sm:w-[200px]">{row.value}</span>
      );

    case "color":
      return (
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <span
            aria-hidden="true"
            className="h-[34px] w-[34px] shrink-0 rounded-[8px] ring-1 ring-line-strong"
            style={{ background: row.hex }}
          />
          <span className="set-box flex-1 justify-between gap-3 sm:w-[200px] sm:flex-none" lang="en">
            {row.value}
            <ChevronDown size={15} aria-hidden="true" className="text-dim" />
          </span>
          <span className="set-box w-[96px] justify-center font-mono text-dim">{row.hex}</span>
        </div>
      );

    case "bind": {
      const [key, alt] = row.keys;
      const label = [key || t("unbound"), alt].filter(Boolean).join(", ");
      return (
        <div className="flex w-full gap-1.5 sm:w-auto">
          {sr(row.modified ? `${label} (${t("modified")})` : label)}
          {[key, alt].map((k, i) => (
            <span
              key={i}
              aria-hidden="true"
              lang="en"
              className={cn("set-box relative flex-1 justify-center sm:w-[190px] sm:flex-none", !k && "text-dim")}
            >
              {i === 0 && row.modified && (
                <RotateCcw size={13} className="absolute left-2.5 text-accent" aria-hidden="true" />
              )}
              <span className="truncate px-4">{k || "—"}</span>
            </span>
          ))}
        </div>
      );
    }
  }
}

/* ─── Aperçu du réticule (en tête de l'onglet Crosshair) ── */

const BACKGROUNDS = {
  stone: "linear-gradient(180deg, #b9b0a1 0%, #a59b8a 100%)",
  sky: "linear-gradient(180deg, #8fb6dc 0%, #cfe0ee 100%)",
  foliage: "linear-gradient(180deg, #6f8a56 0%, #48603c 100%)",
  dark: "linear-gradient(180deg, #24272d 0%, #131518 100%)",
} as const;
type Background = keyof typeof BACKGROUNDS;
const ZOOMS = [1, 4] as const;

function CrosshairPanel() {
  const t = useTranslations("valoSettings.crosshair");
  const [bg, setBg] = useState<Background>("stone");
  const [zoom, setZoom] = useState<(typeof ZOOMS)[number]>(1);

  return (
    <div className="mb-5 overflow-hidden rounded-[14px] border border-line">
      <div className="relative grid h-[170px] place-items-center" style={{ background: BACKGROUNDS[bg] }}>
        <span
          lang="en"
          className="absolute left-1/2 top-3 -translate-x-1/2 rounded-[6px] bg-black/60 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-white"
        >
          Primary
        </span>
        <CrosshairSvg zoom={zoom} size={32} />
        <span className="sr-only">
          {t("description", {
            length: CROSSHAIR.inner.length,
            thickness: CROSSHAIR.inner.thickness,
            offset: CROSSHAIR.inner.offset,
            color: CROSSHAIR.color.hex,
          })}
        </span>

        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 rounded-full bg-black/45 p-1">
          {(Object.keys(BACKGROUNDS) as Background[]).map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={bg === key}
              aria-label={t(`backgrounds.${key}`)}
              title={t(`backgrounds.${key}`)}
              onClick={() => setBg(key)}
              className={cn(
                "h-6 w-6 rounded-full ring-1 ring-white/40 transition-transform hover:scale-110",
                bg === key && "ring-2 ring-white",
              )}
              style={{ background: BACKGROUNDS[key] }}
            />
          ))}
        </div>
        <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 rounded-full bg-black/45 p-1">
          {ZOOMS.map((z) => (
            <button
              key={z}
              type="button"
              aria-pressed={zoom === z}
              aria-label={t("zoom", { zoom: z })}
              onClick={() => setZoom(z)}
              className={cn(
                "h-6 min-w-9 rounded-full px-2 font-mono text-[11px] text-white/80 hover:text-white",
                zoom === z && "bg-white text-black hover:text-black",
              )}
            >
              ×{z}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2.5 bg-surface-2 px-4 py-3 sm:flex-row sm:items-center sm:gap-4">
        <span lang="en" className="text-[13px] font-medium">
          Crosshair Profile
        </span>
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2 sm:justify-end">
          <code className="set-box min-w-0 max-w-full truncate font-mono text-[12px]">{CROSSHAIR.code}</code>
          <CopyButton value={CROSSHAIR.code} label={t("codeLabel")} />
          <span className="set-box w-full justify-between gap-3 sm:w-[200px]">
            {CROSSHAIR.profile}
            <ChevronDown size={15} aria-hidden="true" className="text-dim" />
          </span>
        </div>
      </div>
    </div>
  );
}
