// src/components/shell/ui-provider.tsx — Global UI state: command palette, shortcuts help, mobile menu,
// language switch, keyboard shortcuts. Also sets Motion's reduced-motion policy for the whole site.
"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { MotionConfig } from "motion/react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { LOCALE_COOKIE, LOCALE_COOKIE_MAX_AGE, routing, type Locale } from "@/i18n/routing";
import { SPACES } from "@/config/spaces";
import { markNavigation } from "@/lib/nav-direction";

interface UIContextValue {
  paletteOpen: boolean;
  setPaletteOpen: (open: boolean) => void;
  helpOpen: boolean;
  setHelpOpen: (open: boolean) => void;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  switchLocale: () => void;
  otherLocale: Locale;
}

const UIContext = createContext<UIContextValue | null>(null);

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used inside <UIProvider>");
  return ctx;
}

/** True while the visitor types in a field (shortcuts are ignored then). */
function isTyping(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target.isContentEditable;
}

/** Remembers the language picked by the visitor (read by src/proxy.ts on the next visit). */
function saveLocale(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}; samesite=lax`;
}

export function UIProvider({ children }: { children: ReactNode }) {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale() as Locale;
  const otherLocale = routing.locales.find((l) => l !== locale) ?? routing.defaultLocale;

  const switchLocale = useCallback(() => {
    saveLocale(otherLocale);
    // Same page, same scroll position, other language (hash kept for in-page anchors)
    router.replace(`${pathname}${window.location.hash}`, { locale: otherLocale, scroll: false });
  }, [router, pathname, otherLocale]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      // Ctrl+K / Cmd+K: command palette (works inside fields too)
      if ((e.ctrlKey || e.metaKey) && !e.altKey && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setHelpOpen(false);
        setMenuOpen(false);
        setPaletteOpen((open) => !open);
        return;
      }
      if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey || isTyping(e.target)) return;

      // 1 to 7: go to a space
      if (/^[1-9]$/.test(e.key)) {
        const space = SPACES[Number(e.key) - 1];
        if (!space) return;
        e.preventDefault();
        setHelpOpen(false);
        setMenuOpen(false);
        markNavigation(`/${locale}${space.href === "/" ? "" : space.href}`);
        router.push(space.href);
        return;
      }
      // ?: shortcuts help
      if (e.key === "?") {
        e.preventDefault();
        setPaletteOpen(false);
        setHelpOpen(true);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [router, locale]);

  const value = useMemo(
    () => ({ paletteOpen, setPaletteOpen, helpOpen, setHelpOpen, menuOpen, setMenuOpen, switchLocale, otherLocale }),
    [paletteOpen, helpOpen, menuOpen, switchLocale, otherLocale],
  );

  return (
    <UIContext.Provider value={value}>
      {/* Motion follows the system setting: transforms are skipped under prefers-reduced-motion */}
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </UIContext.Provider>
  );
}
