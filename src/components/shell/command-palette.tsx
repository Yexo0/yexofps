// src/components/shell/command-palette.tsx — Palette de commandes (Ctrl+K) : espaces, sections,
// actions, liens, produits et tutos, avec recherche et navigation au clavier.
"use client";

import { Fragment, useId, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Dialog } from "radix-ui";
import {
  ArrowRight,
  AtSign,
  Copy,
  CornerDownLeft,
  ExternalLink,
  FileText,
  Hash,
  Keyboard,
  Languages,
  Moon,
  Search,
  ShoppingBag,
  Sun,
} from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { SPACES, spaceFromPath } from "@/config/spaces";
import { EMAILS, PRODUCTS, SOCIALS } from "@/config/site";
import { DOCS } from "@/config/career";
import { useTheme } from "@/hooks/use-theme";
import { useCopy } from "@/hooks/use-copy";
import { cn } from "@/lib/utils";
import { markNavigation } from "@/lib/nav-direction";
import { useUI } from "./ui-provider";

type Group = "spaces" | "sections" | "actions" | "links" | "products" | "docs";

interface Item {
  id: string;
  group: Group;
  label: string;
  hint?: string;
  icon: ReactNode;
  keywords?: string;
  run: () => void;
}

/** Sections accessibles directement (ancre dans un espace) */
const SECTIONS = [
  { id: "timeline", href: "/career#timeline" },
  { id: "skills", href: "/career#skills" },
  { id: "missions", href: "/career#missions" },
  { id: "infraBts", href: "/career#infra" },
  { id: "watch", href: "/career#watch" },
  { id: "docs", href: "/career#docs" },
  { id: "labMap", href: "/lab#map" },
  { id: "labMachines", href: "/lab#machines" },
  { id: "site", href: "/lab/site", keywords: "hebergement hosting vps serveur server uptime infra site" },
  { id: "ranks", href: "/gaming#ranks" },
  { id: "tracker", href: "/gaming#tracker" },
  { id: "matches", href: "/gaming#matches" },
  { id: "valoSettings", href: "/gaming/settings", keywords: "crosshair reticule sensi sensitivity binds touches config" },
  { id: "setup", href: "/gaming#setup" },
  { id: "edits", href: "/creator#edits" },
  { id: "partners", href: "/creator#partners" },
  { id: "services", href: "/creator#services" },
  { id: "reviews", href: "/creator#reviews" },
  { id: "converter", href: "/tools#converter" },
  { id: "now", href: "/now", keywords: "now maintenant dispo disponible available statut status planning" },
] as const;

const LINKS = [
  { id: "tiktok", label: "TikTok", url: SOCIALS.tiktok.url, hint: SOCIALS.tiktok.handle },
  { id: "discord", label: "Discord", url: SOCIALS.discord.url, hint: SOCIALS.discord.handle },
  { id: "discordEdits", label: "Discord Edits", url: SOCIALS.discordEdits.url, hint: SOCIALS.discordEdits.handle },
  { id: "instagram", label: "Instagram", url: SOCIALS.instagram.url, hint: SOCIALS.instagram.handle },
  { id: "instagramFps", label: "Instagram FPS", url: SOCIALS.instagramFps.url, hint: SOCIALS.instagramFps.handle },
  { id: "linktree", label: "Linktree", url: SOCIALS.linktree.url, hint: SOCIALS.linktree.handle },
  { id: "payhip", label: "Payhip", url: SOCIALS.payhip.url, hint: SOCIALS.payhip.handle },
] as const;

/** Minuscule, sans accents */
function normalize(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

const openExternal = (url: string) => window.open(url, "_blank", "noopener,noreferrer");

export function CommandPalette() {
  const { paletteOpen, setPaletteOpen } = useUI();
  return (
    <Dialog.Root open={paletteOpen} onOpenChange={setPaletteOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="overlay" />
        {/* Monté seulement à l'ouverture : la recherche repart de zéro à chaque fois */}
        {paletteOpen && <PaletteContent close={() => setPaletteOpen(false)} />}
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function PaletteContent({ close }: { close: () => void }) {
  const t = useTranslations("palette");
  const tNav = useTranslations("nav");
  const tProducts = useTranslations("creator.services.products");
  const tDocs = useTranslations("career.docs.items");
  const router = useRouter();
  const locale = useLocale();
  const { theme, toggleTheme } = useTheme();
  const { setHelpOpen, switchLocale } = useUI();
  const { copy } = useCopy();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = useId();

  const items = useMemo<Item[]>(() => {
    const go = (href: string) => () => {
      close();
      markNavigation(`/${locale}${href === "/" ? "" : href}`);
      router.push(href);
    };
    const act = (fn: () => void) => () => {
      close();
      fn();
    };

    return [
      ...SPACES.map((s, i) => ({
        id: `space-${s.id}`,
        group: "spaces" as const,
        label: tNav(`spaces.${s.id}`),
        hint: String(i + 1),
        icon: <s.icon size={16} />,
        run: go(s.href),
      })),
      ...SECTIONS.map((s) => ({
        id: `section-${s.id}`,
        group: "sections" as const,
        label: t(`sections.${s.id}`),
        hint: tNav(`spaces.${spaceFromPath(s.href.split("#")[0]).id}`),
        icon: <Hash size={16} />,
        keywords: "keywords" in s ? s.keywords : undefined,
        run: go(s.href),
      })),
      {
        id: "copy-pro",
        group: "actions",
        label: t("actions.copyPro"),
        hint: EMAILS.pro,
        icon: <Copy size={16} />,
        keywords: "email mail",
        run: act(() => copy(EMAILS.pro)),
      },
      {
        id: "copy-business",
        group: "actions",
        label: t("actions.copyBusiness"),
        hint: EMAILS.business,
        icon: <Copy size={16} />,
        keywords: "email mail",
        run: act(() => copy(EMAILS.business)),
      },
      {
        id: "theme",
        group: "actions",
        label: theme === "dark" ? t("actions.themeLight") : t("actions.themeDark"),
        icon: theme === "dark" ? <Sun size={16} /> : <Moon size={16} />,
        keywords: "theme dark light",
        run: act(toggleTheme),
      },
      {
        id: "locale",
        group: "actions",
        label: t("actions.language"),
        icon: <Languages size={16} />,
        keywords: "language langue english francais",
        run: act(switchLocale),
      },
      {
        id: "shortcuts",
        group: "actions",
        label: t("actions.shortcuts"),
        hint: "?",
        icon: <Keyboard size={16} />,
        run: act(() => setHelpOpen(true)),
      },
      ...LINKS.map((l) => ({
        id: `link-${l.id}`,
        group: "links" as const,
        label: l.label,
        hint: l.hint,
        icon: <AtSign size={16} />,
        run: act(() => openExternal(l.url)),
      })),
      ...PRODUCTS.map((p) => ({
        id: `product-${p.id}`,
        group: "products" as const,
        label: tProducts(`${p.id}.title`),
        icon: <ShoppingBag size={16} />,
        keywords: "y-services shop boutique",
        run: go("/creator#services"),
      })),
      ...DOCS.map((d) => ({
        id: `doc-${d.id}`,
        group: "docs" as const,
        label: tDocs(`${d.id}.title`),
        hint: "PDF",
        icon: <FileText size={16} />,
        keywords: "tuto pdf",
        run: act(() => openExternal(d.file)),
      })),
    ];
  }, [t, tNav, tProducts, tDocs, router, locale, theme, toggleTheme, switchLocale, setHelpOpen, copy, close]);

  const results = useMemo(() => {
    const terms = normalize(query).split(/\s+/).filter(Boolean);
    if (!terms.length) return items;
    return items.filter((item) => {
      const haystack = normalize(`${item.label} ${item.hint ?? ""} ${item.keywords ?? ""} ${t(`groups.${item.group}`)}`);
      return terms.every((term) => haystack.includes(term));
    });
  }, [items, query, t]);

  const activeIndex = Math.min(active, Math.max(results.length - 1, 0));
  const activeItem = results[activeIndex];

  function move(delta: number) {
    if (!results.length) return;
    const next = (activeIndex + delta + results.length) % results.length;
    setActive(next);
    listRef.current
      ?.querySelector(`[data-index="${next}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      move(1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      move(-1);
    } else if (e.key === "Enter" && activeItem) {
      e.preventDefault();
      activeItem.run();
    }
  }

  return (
    <Dialog.Content className="dialog dialog-top flex max-h-[min(560px,76dvh)] flex-col overflow-hidden p-0" aria-describedby={undefined}>
      <Dialog.Title className="sr-only">{t("title")}</Dialog.Title>
      <div className="flex items-center gap-3 border-b border-line px-4">
        <Search size={18} aria-hidden="true" className="shrink-0 text-dim" />
        <input
          autoFocus
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          onKeyDown={onKeyDown}
          placeholder={t("placeholder")}
          role="combobox"
          aria-expanded="true"
          aria-controls={listId}
          aria-activedescendant={activeItem ? `${listId}-${activeItem.id}` : undefined}
          aria-label={t("title")}
          className="h-14 w-full bg-transparent text-[15px] text-fg outline-none placeholder:text-dim"
        />
        <kbd className="kbd shrink-0">Esc</kbd>
      </div>

      <ul ref={listRef} id={listId} role="listbox" aria-label={t("results")} className="flex-1 overflow-y-auto p-2">
        {results.map((item, i) => {
          const showHeader = i === 0 || results[i - 1].group !== item.group;
          const selected = i === activeIndex;
          return (
            <Fragment key={item.id}>
              {showHeader && (
                <li role="presentation" className="label px-3 pb-1.5 pt-3">
                  {t(`groups.${item.group}`)}
                </li>
              )}
              <li
                id={`${listId}-${item.id}`}
                role="option"
                aria-selected={selected}
                data-index={i}
                onMouseMove={() => setActive(i)}
                onClick={() => item.run()}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm",
                  selected ? "bg-surface-3 text-fg" : "text-muted",
                )}
              >
                <span aria-hidden="true" className={selected ? "text-accent" : "text-dim"}>
                  {item.icon}
                </span>
                <span className="min-w-0 flex-1 truncate font-medium">{item.label}</span>
                {item.hint && <span className="hidden truncate font-mono text-xs text-dim sm:inline">{item.hint}</span>}
                {selected &&
                  (item.group === "links" || item.group === "docs" ? (
                    <ExternalLink size={14} aria-hidden="true" className="text-dim" />
                  ) : item.group === "actions" ? (
                    <CornerDownLeft size={14} aria-hidden="true" className="text-dim" />
                  ) : (
                    <ArrowRight size={14} aria-hidden="true" className="text-dim" />
                  ))}
              </li>
            </Fragment>
          );
        })}
        {results.length === 0 && (
          <li role="presentation" className="px-3 py-10 text-center text-sm text-dim">
            {t("empty", { query })}
          </li>
        )}
      </ul>

      <div className="hidden items-center gap-4 border-t border-line px-4 py-2.5 text-xs text-dim sm:flex">
        <span className="flex items-center gap-1.5">
          <kbd className="kbd">↑</kbd>
          <kbd className="kbd">↓</kbd> {t("footer.navigate")}
        </span>
        <span className="flex items-center gap-1.5">
          <kbd className="kbd">↵</kbd> {t("footer.open")}
        </span>
        <span className="flex items-center gap-1.5">
          <kbd className="kbd">Esc</kbd> {t("footer.close")}
        </span>
      </div>
    </Dialog.Content>
  );
}
