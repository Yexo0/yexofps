// src/components/shell/rail.tsx — Navigation : rail vertical extensible (desktop) et barre en bas (mobile).
"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Dialog } from "radix-ui";
import { Ellipsis, Keyboard, Moon, Search, Sun, X } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { SPACES, spaceFromPath, type Space } from "@/config/spaces";
import { SOCIALS } from "@/config/site";
import { DiscordIcon, TikTokIcon } from "@/components/icons/brands";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
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
        icon: (
          <span className="font-mono text-[11px] font-semibold uppercase tracking-wide">{otherLocale}</span>
        ),
        onClick: switchLocale,
      },
    ],
    links: [
      { id: "discord", label: "Discord", href: SOCIALS.discord.url, icon: <DiscordIcon size={18} /> },
      { id: "tiktok", label: "TikTok", href: SOCIALS.tiktok.url, icon: <TikTokIcon size={17} /> },
    ],
  };
}

/* ─── Rail desktop ─── */
// Replié : une colonne d'icônes. Au survol (ou au clavier), il s'élargit vers la droite et montre
// le titre et une courte description de chaque espace ; la page ne passe pas dessous : elle se
// réduit légèrement vers la droite (transform sur .shell, voir useRailSpace), puis reprend sa place.

const RAIL_CLOSED = 72;
const RAIL_OPEN = 264;
const ROW = 46; // hauteur d'une ligne d'espace + espacement (indicateur glissant)

/** Applique ou retire la réduction de la page quand le rail s'ouvre ou se ferme */
function useRailSpace(open: boolean) {
  useEffect(() => {
    const root = document.documentElement;
    const shell = document.querySelector<HTMLElement>(".shell");
    if (!shell) return;
    if (!open) {
      root.removeAttribute("data-rail");
      return;
    }
    // Le cadre (de 84 px à la largeur - 12 px) doit commencer après le rail ouvert, ancré à droite
    const place = () => {
      const w = window.innerWidth;
      const scale = Math.min(1, (w - 12 - (RAIL_OPEN + 12)) / (w - 12 - (RAIL_CLOSED + 12)));
      shell.style.setProperty("--rail-s", scale.toFixed(4));
      shell.style.setProperty("--rail-oy", `${window.scrollY + window.innerHeight / 2}px`);
    };
    place();
    root.setAttribute("data-rail", "open");
    window.addEventListener("scroll", place, { passive: true });
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("scroll", place);
      window.removeEventListener("resize", place);
    };
  }, [open]);
}

function RailLabel({ title, desc, i }: { title: string; desc?: string; i: number }) {
  return (
    <span className="rail-label min-w-0" style={{ ["--ri" as string]: i }}>
      <span className="block truncate text-[13.5px] font-semibold leading-tight text-fg">{title}</span>
      {desc && <span className="block truncate text-[11px] leading-tight text-dim">{desc}</span>}
    </span>
  );
}

export function Rail() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const active = spaceFromPath(pathname);
  const activeIndex = SPACES.indexOf(active) + 1;
  const { actions, links } = useTools();
  // Ouvert "sur" une page donnée : un changement de page le referme de lui-même
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const current = useRef(pathname);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  // Après un clic sur un lien, le rail reste fermé tant que la souris ne l'a pas quitté
  const suppressed = useRef(false);
  const opening = useRef(false);
  useRailSpace(open);
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
      <nav
        aria-label={t("main")}
        data-open={open || undefined}
        className="rail fixed inset-y-0 left-0 z-40 hidden flex-col py-4 md:flex"
        onPointerMove={(e) => {
          // Ouverture sur un vrai mouvement de souris (pas sur l'événement émis au chargement
          // quand le curseur est déjà au-dessus du rail)
          if (open || e.pointerType === "touch" || suppressed.current || (!e.movementX && !e.movementY)) return;
          if (!opening.current) {
            opening.current = true;
            schedule(true, 90);
          }
        }}
        onPointerLeave={(e) => {
          if (e.pointerType === "touch") return;
          suppressed.current = false;
          opening.current = false;
          schedule(false, 160);
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

        <Link href="/" aria-label={t("homeLogo")} className="rail-row relative pl-[18px]">
          <Logo size={36} />
          <span className="rail-label" style={{ ["--ri" as string]: 0 }}>
            <span className="display block text-[22px] text-fg">Yexo</span>
            <span className="block font-mono text-[10px] text-dim">yexofps.org</span>
          </span>
        </Link>

        <ul className="relative mt-6 flex flex-col gap-1.5 px-4">
          {/* Indicateur "vous êtes ici" : glisse d'un espace à l'autre, s'étire quand le rail s'ouvre */}
          <span
            aria-hidden="true"
            className="rail-indicator pointer-events-none absolute left-4 top-0 h-10"
            style={{ transform: `translateY(${(activeIndex - 1) * ROW}px)` }}
          >
            <span className="rail-indicator-row" />
            <span className="relative block h-10 w-10 rounded-[5px] bg-accent-tint shadow-[inset_0_0_0_1px_var(--glow-ring)]" />
          </span>
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
                  className={cn("rail-link group", isActive ? "text-accent" : "text-muted hover:text-fg")}
                >
                  <span className="relative z-[1] grid h-10 w-10 shrink-0 place-items-center">
                    <Icon size={18} aria-hidden="true" />
                  </span>
                  <span className="rail-num" style={{ ["--ri" as string]: i + 1 }} aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <RailLabel title={name} desc={t(`rail.${space.id}.desc`)} i={i + 1} />
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Espace actif : numéro + nom à la verticale (rail replié) */}
        <div className="rail-current mt-6 flex min-h-0 flex-1 flex-col items-center gap-3 overflow-hidden" aria-hidden="true">
          <span
            key={`n-${active.id}`}
            className="grid h-6 w-6 animate-[fade-in_400ms_ease_both] place-items-center rounded-[4px] bg-accent-tint font-mono text-[11px] text-accent"
          >
            {activeIndex}
          </span>
          <span
            key={`l-${active.id}`}
            className="vertical-label display animate-[fade-up_600ms_cubic-bezier(.16,1,.3,1)_both] text-[18px] tracking-wide text-fg"
          >
            {t(`spaces.${active.id}`)}
          </span>
        </div>

        <div className="flex flex-col gap-0.5 px-4">
          {actions.map((a, i) => (
            <button key={a.id} type="button" onClick={a.onClick} aria-label={a.label} className="rail-link rail-tool">
              <span aria-hidden="true" className="grid h-10 w-10 shrink-0 place-items-center">
                {a.icon}
              </span>
              <RailLabel title={a.label} i={8 + i} />
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
              <span aria-hidden="true" className="grid h-10 w-10 shrink-0 place-items-center">
                {l.icon}
              </span>
              <RailLabel title={l.label} i={12 + i} />
            </a>
          ))}
        </div>

        <Link href="/contact" aria-label={t("avatar")} className="rail-row relative mt-3 pl-[18px]">
          <span className="block shrink-0 overflow-hidden rounded-[5px] ring-1 ring-line">
            <Image src="/images/avatar.webp" alt="" width={36} height={36} loading="eager" className="h-9 w-9 object-cover" />
          </span>
          <RailLabel title={t("avatar")} desc="Baptiste · Yexo" i={14} />
        </Link>
      </nav>

      <MobileBar active={active} />
    </>
  );
}

/* ─── Barre mobile ─── */

function MobileBar({ active }: { active: Space }) {
  const t = useTranslations("nav");
  const [moreOpen, setMoreOpen] = useState(false);
  const { actions, links } = useTools();
  const primary = SPACES.filter((s) => s.mobile);
  const secondary = SPACES.filter((s) => !s.mobile);
  const moreActive = secondary.some((s) => s.id === active.id);

  return (
    <nav
      aria-label={t("main")}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface-solid/[0.97] pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <ul className="mx-auto grid max-w-lg grid-cols-6 px-1">
        {primary.map((space) => {
          const Icon = space.icon;
          const isActive = space.id === active.id;
          return (
            <li key={space.id}>
              <Link
                href={space.href}
                aria-current={isActive ? "page" : undefined}
                className="flex flex-col items-center gap-1 py-2 text-[10.5px] font-medium text-muted"
              >
                <span
                  className={cn(
                    "grid h-7 w-12 place-items-center rounded-full transition-[background-color,box-shadow] duration-300",
                    isActive && "glow bg-accent text-on-accent",
                  )}
                >
                  <Icon size={18} aria-hidden="true" />
                </span>
                <span className={cn("max-w-full truncate", isActive && "text-fg")}>{t(`spaces.${space.id}`)}</span>
              </Link>
            </li>
          );
        })}
        <li>
          <Dialog.Root open={moreOpen} onOpenChange={setMoreOpen}>
            <Dialog.Trigger className="flex w-full flex-col items-center gap-1 py-2 text-[10.5px] font-medium text-muted">
              <span
                className={cn(
                  "grid h-7 w-12 place-items-center rounded-full",
                  moreActive && "glow bg-accent text-on-accent",
                )}
              >
                <Ellipsis size={18} aria-hidden="true" />
              </span>
              <span className={cn(moreActive && "text-fg")}>{t("more")}</span>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="overlay" />
              <Dialog.Content className="fixed inset-x-2 bottom-2 z-[61] rounded-3xl border border-line-strong bg-surface-solid p-4 pb-[calc(16px+env(safe-area-inset-bottom))] shadow-2xl">
                <div className="mb-3 flex items-center justify-between">
                  <Dialog.Title className="text-base font-bold">{t("more")}</Dialog.Title>
                  <Dialog.Close className="icon-btn" aria-label={t("close")}>
                    <X size={18} aria-hidden="true" />
                  </Dialog.Close>
                </div>
                <Dialog.Description className="sr-only">{t("moreDescription")}</Dialog.Description>
                <ul className="grid grid-cols-2 gap-2">
                  {secondary.map((space) => {
                    const Icon = space.icon;
                    const n = SPACES.indexOf(space) + 1;
                    return (
                      <li key={space.id}>
                        <Link
                          href={space.href}
                          onClick={() => setMoreOpen(false)}
                          aria-current={space.id === active.id ? "page" : undefined}
                          className="tile flex items-center gap-3 px-3 py-3 text-sm font-semibold"
                        >
                          <span className="icon-pill h-8 w-8">
                            <Icon size={16} aria-hidden="true" />
                          </span>
                          <span>
                            <span className="mr-1.5 font-mono text-xs text-dim">{n}</span>
                            {t(`spaces.${space.id}`)}
                          </span>
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
                    <a
                      key={l.id}
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-tonal btn-sm"
                    >
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
