// src/components/shell/rail.tsx — Navigation : rail vertical (desktop) et barre flottante en pilule (mobile).
// Desktop : une colonne d'icônes sur un panneau arrondi. Au survol (ou au clavier), le panneau s'ouvre
// vers la droite, les titres des espaces arrivent en cascade et la page s'assombrit derrière (.rail-*).
// Mobile : une pilule flottante en bas, l'espace actif marqué par une pastille qui glisse (.dock-*).
"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useTranslations } from "next-intl";
import { Dialog } from "radix-ui";
import { Ellipsis, Keyboard, Moon, Search, Sun, X } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { SPACES, spaceFromPath, type Space } from "@/config/spaces";
import { SOCIALS } from "@/config/site";
import { DiscordIcon, TikTokIcon } from "@/components/icons/brands";
import { useTheme } from "@/hooks/use-theme";
import { Wordmark } from "./logo";
import { useUI } from "./ui-provider";

/* ─── Outils (recherche, thème, raccourcis, langue, réseaux) ─── */

function useTools() {
  const t = useTranslations("nav.tools");
  const { setPaletteOpen, setHelpOpen, switchLocale, otherLocale } = useUI();
  const { theme, toggleTheme } = useTheme();

  return {
    actions: [
      { id: "search", label: t("search"), icon: <Search size={18} />, onClick: () => setPaletteOpen(true) },
      {
        id: "theme",
        label: theme === "dark" ? t("themeLight") : t("themeDark"),
        icon: theme === "dark" ? <Sun size={18} /> : <Moon size={18} />,
        onClick: toggleTheme,
      },
      { id: "shortcuts", label: t("shortcuts"), icon: <Keyboard size={18} />, onClick: () => setHelpOpen(true) },
      {
        id: "locale",
        label: t("language"),
        icon: <span className="text-[12px] font-semibold uppercase">{otherLocale}</span>,
        onClick: switchLocale,
      },
    ],
    links: [
      { id: "discord", label: "Discord", href: SOCIALS.discord.url, icon: <DiscordIcon size={18} /> },
      { id: "tiktok", label: "TikTok", href: SOCIALS.tiktok.url, icon: <TikTokIcon size={17} /> },
    ],
  };
}

/** Titre d'une ligne du rail : n'apparaît que rail ouvert, avec un léger décalage selon sa place */
function RailLabel({ children, i }: { children: string; i: number }) {
  return (
    <span className="rail-label truncate" style={{ "--ri": i } as CSSProperties}>
      {children}
    </span>
  );
}

/* ─── Rail desktop ─── */

const ROW = 48; // hauteur d'une ligne d'espace + espacement (indicateur glissant)

export function Rail() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const active = spaceFromPath(pathname);
  const activeIndex = SPACES.indexOf(active);
  const { actions, links } = useTools();
  // Ouvert "sur" une page donnée : un changement de page le referme de lui-même
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const current = useRef(pathname);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  // Après un clic sur un lien, le rail reste fermé tant que la souris ne l'a pas quitté
  const suppressed = useRef(false);
  const opening = useRef(false);
  useEffect(() => {
    current.current = pathname;
  }, [pathname]);

  const setOpen = (next: boolean) => setOpenOn(next ? current.current : null);
  const schedule = (next: boolean, delay: number) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(next), delay);
  };
  useEffect(() => () => clearTimeout(timer.current), []);

  const close = () => {
    suppressed.current = true;
    opening.current = false;
    clearTimeout(timer.current);
    setOpen(false);
  };

  return (
    <>
      {/* Voile sur la page quand le rail est ouvert (desktop seulement) */}
      <div aria-hidden="true" data-on={open || undefined} className="rail-scrim hidden md:block" />
      <nav
        aria-label={t("main")}
        data-open={open || undefined}
        className="rail no-scrollbar fixed inset-y-0 left-0 z-40 hidden flex-col px-6 py-[26px] md:flex"
        onPointerMove={(e) => {
          // Ouverture sur un vrai mouvement de souris (pas sur l'événement émis au chargement
          // quand le curseur est déjà au-dessus du rail)
          if (open || e.pointerType === "touch" || suppressed.current || (!e.movementX && !e.movementY)) return;
          if (!opening.current) {
            opening.current = true;
            schedule(true, 80);
          }
        }}
        onPointerLeave={(e) => {
          if (e.pointerType === "touch") return;
          suppressed.current = false;
          opening.current = false;
          schedule(false, 140);
        }}
        onFocus={(e) => {
          if (e.target instanceof HTMLElement && e.target.matches(":focus-visible")) schedule(true, 0);
        }}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) schedule(false, 0);
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") close();
        }}
        onClick={(e) => {
          if (e.target instanceof Element && e.target.closest("a[href]")) close();
        }}
      >
        <span aria-hidden="true" className="rail-panel" />

        {/* Le Y seul rail replié ; « exo » glisse à côté quand il s'ouvre : le logotype se forme */}
        <Link href="/" aria-label={t("homeLogo")} className="rail-link rail-brand">
          <span className="rail-icon">
            <Wordmark className="rail-wordmark text-fg" exoClassName="rail-wordmark-exo" />
          </span>
        </Link>

        <ul className="relative mt-7 flex flex-col gap-1">
          {/* Espace actif : pastille qui glisse d'une ligne à l'autre et s'allonge quand le rail s'ouvre */}
          <span
            aria-hidden="true"
            className="rail-indicator"
            style={{ transform: `translateY(${activeIndex * ROW}px)` }}
          />
          {SPACES.map((space, i) => {
            const Icon = space.icon;
            const isActive = space.id === active.id;
            const name = t(`rail.${space.id}.title`);
            return (
              <li key={space.id}>
                <Link
                  href={space.href}
                  aria-current={isActive ? "page" : undefined}
                  aria-label={`${i + 1}. ${name}`}
                  className="rail-link"
                >
                  <span className="rail-icon">
                    <Icon size={19} strokeWidth={1.9} aria-hidden="true" />
                  </span>
                  <RailLabel i={i + 1}>{name}</RailLabel>
                </Link>
              </li>
            );
          })}
        </ul>

        <span aria-hidden="true" className="min-h-6 flex-1" />

        <div className="flex flex-col gap-0.5">
          {actions.map((a, i) => (
            <button key={a.id} type="button" onClick={a.onClick} aria-label={a.label} className="rail-link rail-tool">
              <span aria-hidden="true" className="rail-icon">
                {a.icon}
              </span>
              <RailLabel i={8 + i}>{a.label}</RailLabel>
            </button>
          ))}
          {links.map((l, i) => (
            <a
              key={l.id}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={l.label}
              className="rail-link rail-tool"
            >
              <span aria-hidden="true" className="rail-icon">
                {l.icon}
              </span>
              <RailLabel i={12 + i}>{l.label}</RailLabel>
            </a>
          ))}
        </div>

        <Link href="/contact" aria-label={t("avatar")} className="rail-link mt-3">
          <span className="rail-icon">
            <Image
              src="/images/avatar.webp"
              alt=""
              width={36}
              height={36}
              loading="eager"
              className="h-9 w-9 rounded-full object-cover"
            />
          </span>
          <RailLabel i={14}>{t("avatar")}</RailLabel>
        </Link>
      </nav>

      <MobileDock active={active} />
    </>
  );
}

/* ─── Barre mobile flottante ─── */

function MobileDock({ active }: { active: Space }) {
  const t = useTranslations("nav");
  const [moreOpen, setMoreOpen] = useState(false);
  const { actions, links } = useTools();
  const primary = SPACES.filter((s) => s.mobile);
  const secondary = SPACES.filter((s) => !s.mobile);
  const moreActive = secondary.some((s) => s.id === active.id);
  const cols = primary.length + 1;
  // Place de la pastille : l'espace actif, ou « Plus » s'il est dans la feuille
  const pill = moreActive ? primary.length : primary.findIndex((s) => s.id === active.id);

  return (
    <nav aria-label={t("main")} className="dock md:hidden">
      <ul className="relative isolate grid" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        {pill >= 0 && (
          <span
            aria-hidden="true"
            className="dock-pill"
            style={{ width: `calc(100% / ${cols} - 8px)`, transform: `translateX(calc(${pill * 100}% + ${pill * 8}px))` }}
          />
        )}
        {primary.map((space) => {
          const Icon = space.icon;
          return (
            <li key={space.id}>
              <Link
                href={space.href}
                aria-current={space.id === active.id ? "page" : undefined}
                className="dock-item"
              >
                <Icon size={20} strokeWidth={1.9} aria-hidden="true" />
                <span className="max-w-full truncate">{t(`spaces.${space.id}`)}</span>
              </Link>
            </li>
          );
        })}
        <li>
          <Dialog.Root open={moreOpen} onOpenChange={setMoreOpen}>
            <Dialog.Trigger className="dock-item w-full" aria-current={moreActive ? "page" : undefined}>
              <Ellipsis size={20} aria-hidden="true" />
              <span>{t("more")}</span>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="overlay" />
              <Dialog.Content className="sheet">
                <div className="mb-4 flex items-center justify-between">
                  <Dialog.Title className="display text-[24px]">{t("more")}</Dialog.Title>
                  <Dialog.Close className="icon-btn" aria-label={t("close")}>
                    <X size={18} aria-hidden="true" />
                  </Dialog.Close>
                </div>
                <Dialog.Description className="sr-only">{t("moreDescription")}</Dialog.Description>
                <ul className="grid grid-cols-2 gap-2">
                  {secondary.map((space) => {
                    const Icon = space.icon;
                    return (
                      <li key={space.id}>
                        <Link
                          href={space.href}
                          onClick={() => setMoreOpen(false)}
                          aria-current={space.id === active.id ? "page" : undefined}
                          className="tile flex items-center gap-3 p-3 text-[15px] font-semibold aria-[current=page]:text-accent"
                        >
                          <span className="icon-pill bg-surface-3">
                            <Icon size={16} aria-hidden="true" />
                          </span>
                          {t(`spaces.${space.id}`)}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-4 flex flex-wrap gap-2">
                  {actions.map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => {
                        setMoreOpen(false);
                        a.onClick();
                      }}
                      className="btn btn-tonal btn-sm"
                    >
                      <span aria-hidden="true">{a.icon}</span>
                      {a.label}
                    </button>
                  ))}
                  {links.map((l) => (
                    <a key={l.id} href={l.href} target="_blank" rel="noopener noreferrer" className="btn btn-tonal btn-sm">
                      {l.icon}
                      {l.label}
                    </a>
                  ))}
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </li>
      </ul>
    </nav>
  );
}
