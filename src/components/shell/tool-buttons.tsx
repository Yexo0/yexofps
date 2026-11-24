// src/components/shell/tool-buttons.tsx — Header tools shared with the mobile menu: language and theme.
"use client";

import { useTranslations } from "next-intl";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { useUI } from "./ui-provider";

/** Language button: shows the other language (FR on the English site, EN on the French one) */
export function LocaleButton({ className }: { className?: string }) {
  const t = useTranslations("nav.tools");
  const { switchLocale, otherLocale } = useUI();
  return (
    <button type="button" onClick={switchLocale} aria-label={t("language")} className={className ?? "tool-btn"}>
      <span className="font-mono text-[11px] font-semibold uppercase tracking-wide">{otherLocale}</span>
    </button>
  );
}

export function ThemeButton({ className }: { className?: string }) {
  const t = useTranslations("nav.tools");
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? t("themeLight") : t("themeDark")}
      className={className ?? "tool-btn"}
    >
      {theme === "dark" ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
    </button>
  );
}
