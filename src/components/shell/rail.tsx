// src/components/shell/rail.tsx — Navigation : rail vertical (desktop) et barre en bas (mobile).
"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
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

/* ─── Bulle d'aide au survol / focus (desktop) ─── */

function Tip({ children }: { children: ReactNode }) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute left-[calc(100%+10px)] top-1/2 z-50 -translate-y-1/2 whitespace-nowrap rounded-lg bg-surface-3 px-2.5 py-1 text-xs font-medium text-fg opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
    >
      {children}
    </span>
  );
}

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

function RailItem({ space, active, n, name }: { space: Space; active: boolean; n: number; name: string }) {
  const Icon = space.icon;
  return (
    <li>
      <Link
        href={space.href}
        aria-current={active ? "page" : undefined}
        aria-label={`${n}. ${name}`}
        className={cn(
          "group relative grid h-10 w-10 place-items-center rounded-full transition-colors duration-150",
          active
            ? "bg-accent text-on-accent"
            : "text-muted hover:bg-surface-3 hover:text-fg",
        )}
      >
        <Icon size={18} aria-hidden="true" />
        <Tip>
          <span className="mr-1.5 font-mono text-dim">{n}</span>
          {name}
        </Tip>
      </Link>
    </li>
  );
}

export function Rail() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const active = spaceFromPath(pathname);
  const activeIndex = SPACES.indexOf(active) + 1;
  const { actions, links } = useTools();

  return (
    <>
      <nav
        aria-label={t("main")}
        className="fixed inset-y-0 left-0 z-40 hidden w-[72px] flex-col items-center py-4 md:flex"
      >
        <Link href="/" aria-label={t("homeLogo")} className="rounded-xl">
          <Logo size={36} />
        </Link>

        <ul className="mt-6 flex flex-col items-center gap-1.5">
          {SPACES.map((space, i) => (
            <RailItem
              key={space.id}
              space={space}
              n={i + 1}
              name={t(`spaces.${space.id}`)}
              active={space.id === active.id}
            />
          ))}
        </ul>

        {/* Espace actif : numéro + nom à la verticale */}
        <div className="mt-6 flex min-h-0 flex-1 flex-col items-center gap-3 overflow-hidden" aria-hidden="true">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-surface-3 font-mono text-[11px] text-muted">
            {activeIndex}
          </span>
          <span className="vertical-label text-[13px] font-semibold tracking-wide text-fg">
            {t(`spaces.${active.id}`)}
          </span>
        </div>

        <div className="flex flex-col items-center gap-0.5">
          {actions.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={a.onClick}
              aria-label={a.label}
              className="icon-btn group relative"
            >
              <span aria-hidden="true">{a.icon}</span>
              <Tip>{a.label}</Tip>
            </button>
          ))}
          {links.map((l) => (
            <a
              key={l.id}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={l.label}
              className="icon-btn group relative"
            >
              {l.icon}
              <Tip>{l.label}</Tip>
            </a>
          ))}
        </div>

        <Link
          href="/contact"
          aria-label={t("avatar")}
          className="mt-3 block overflow-hidden rounded-full ring-1 ring-line"
        >
          <Image src="/images/avatar.webp" alt="" width={36} height={36} className="h-9 w-9 object-cover" />
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
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface-solid/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
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
                    "grid h-7 w-12 place-items-center rounded-full transition-colors",
                    isActive && "bg-accent text-on-accent",
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
                  moreActive && "bg-accent text-on-accent",
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
