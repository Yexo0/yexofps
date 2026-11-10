// src/components/shell/statusline.tsx — Barre d'état façon tmux en bas du cadre (remplace le footer).
// Gauche : session + liste des "fenêtres" (les espaces, cliquables). Droite : langue, thème, copyright, date de déploiement.
"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { SPACES, spaceFromPath } from "@/config/spaces";
import { SITE } from "@/config/site";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

export function Statusline({ deployedAt, year }: { deployedAt: string; year: number }) {
  const t = useTranslations("common");
  const tNav = useTranslations("nav");
  const pathname = usePathname();
  const locale = useLocale();
  const { theme } = useTheme();
  const active = spaceFromPath(pathname);

  return (
    <footer className="flex min-h-8 flex-wrap items-stretch overflow-hidden rounded-xl bg-surface-2 font-mono text-[11px] text-muted">
      <span className="flex items-center bg-accent px-3 font-semibold text-on-accent">[{t("status.session")}]</span>

      <nav aria-label={t("status.nav")} className="hidden items-center md:flex">
        <ul className="flex items-center">
          {SPACES.map((s, i) => {
            const isActive = s.id === active.id;
            return (
              <li key={s.id}>
                <Link
                  href={s.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex h-8 items-center px-2.5 transition-colors hover:text-fg",
                    isActive ? "text-fg" : "text-dim",
                  )}
                >
                  {i + 1}:{tNav(`spaces.${s.id}`).toLowerCase()}
                  <span className={isActive ? "text-accent" : "invisible"}>*</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <span className="flex items-center px-2.5 text-fg md:hidden">
        {SPACES.indexOf(active) + 1}:{tNav(`spaces.${active.id}`).toLowerCase()}
        <span className="text-accent">*</span>
      </span>

      <span className="ml-auto hidden items-center px-3 lg:flex">
        {locale} · {t(`status.theme.${theme}`)} · <kbd className="ml-1 text-fg">Ctrl+K</kbd>
      </span>
      <span className="flex items-center px-3">{t("footer.copyright", { year, name: SITE.name, author: SITE.author })}</span>
      <span className="hidden items-center bg-surface-3 px-3 text-fg sm:flex">
        {t("status.deployed", { date: deployedAt })}
      </span>
    </footer>
  );
}
