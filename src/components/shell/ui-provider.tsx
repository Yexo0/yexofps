// src/components/shell/ui-provider.tsx — État global de l'interface : palette, aide, raccourcis clavier.
"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { SPACES } from "@/config/spaces";
import { markNavigation } from "@/lib/nav-direction";

interface UIContextValue {
  paletteOpen: boolean;
  setPaletteOpen: (open: boolean) => void;
  helpOpen: boolean;
  setHelpOpen: (open: boolean) => void;
  switchLocale: () => void;
  otherLocale: Locale;
}

const UIContext = createContext<UIContextValue | null>(null);

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI doit être utilisé dans <UIProvider>");
  return ctx;
}

/** Vrai si l'utilisateur est en train de saisir du texte (on ignore alors les raccourcis). */
function isTyping(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target.isContentEditable;
}

export function UIProvider({ children }: { children: ReactNode }) {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale() as Locale;
  const otherLocale = routing.locales.find((l) => l !== locale) ?? routing.defaultLocale;

  const switchLocale = useCallback(() => {
    router.replace(pathname, { locale: otherLocale, scroll: false });
  }, [router, pathname, otherLocale]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      // Ctrl+K / Cmd+K : palette de commandes (fonctionne même dans un champ)
      if ((e.ctrlKey || e.metaKey) && !e.altKey && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setHelpOpen(false);
        setPaletteOpen((open) => !open);
        return;
      }
      if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey || isTyping(e.target)) return;

      // 1 à 7 : changer d'espace
      if (/^[1-9]$/.test(e.key)) {
        const space = SPACES[Number(e.key) - 1];
        if (!space) return;
        e.preventDefault();
        setHelpOpen(false);
        markNavigation(`/${locale}${space.href === "/" ? "" : space.href}`);
        router.push(space.href);
        return;
      }
      // ? : aide aux raccourcis
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
    () => ({ paletteOpen, setPaletteOpen, helpOpen, setHelpOpen, switchLocale, otherLocale }),
    [paletteOpen, helpOpen, switchLocale, otherLocale],
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}
