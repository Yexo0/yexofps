// src/components/shell/site-footer.tsx — Pied de page de toutes les pages : marque et statut en direct,
// les espaces, les réseaux, ce site (hébergement, déploiement, langue, thème), puis copyright et crédits
// (passés en enfants : modèles 3D et mention Riot Games).
"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { ArrowUp } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SPACES } from "@/config/spaces";
import { SITE, SOCIALS } from "@/config/site";
import { useTheme } from "@/hooks/use-theme";
import { NowChip } from "@/components/now/now-chip";
import { Logo } from "./logo";
import { useUI } from "./ui-provider";

const ELSEWHERE = [
  { label: "TikTok", href: SOCIALS.tiktok.url },
  { label: "Discord", href: SOCIALS.discord.url },
  { label: "Instagram", href: SOCIALS.instagram.url },
  { label: "Linktree", href: SOCIALS.linktree.url },
] as const;

const linkClass = "text-[14.5px] text-muted hover:text-fg";

function Column({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <h2 className="label mb-4">{title}</h2>
      <ul className="flex flex-col gap-2.5">{children}</ul>
    </div>
  );
}

export function SiteFooter({ year, deployedAt, children }: { year: number; deployedAt: string; children?: ReactNode }) {
  const t = useTranslations("common.footer");
  const tNav = useTranslations("nav");
  const { switchLocale } = useUI();
  const { theme, toggleTheme } = useTheme();

  return (
    <footer className="site-footer glass mt-3 rounded-[var(--r-card)] px-6 pb-6 pt-9 md:px-10 md:pt-12">
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.6fr)_repeat(3,minmax(0,1fr))]">
        <div className="flex flex-col items-start gap-5 sm:col-span-2 lg:col-span-1">
          <Link href="/" className="flex items-center gap-3">
            <Logo size={34} />
            <span className="display text-[24px] text-fg">{SITE.name}</span>
          </Link>
          <p className="max-w-[38ch] text-[14.5px] leading-relaxed text-muted">{t("tagline")}</p>
          <NowChip />
        </div>

        <Column title={t("spaces")}>
          {SPACES.map((s) => (
            <li key={s.id}>
              <Link href={s.href} className={linkClass}>
                {tNav(`spaces.${s.id}`)}
              </Link>
            </li>
          ))}
        </Column>

        <Column title={t("elsewhere")}>
          {ELSEWHERE.map((l) => (
            <li key={l.label}>
              <a href={l.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                {l.label}
              </a>
            </li>
          ))}
        </Column>

        <Column title={t("site")}>
          <li>
            <Link href="/lab/site" className={linkClass}>
              {t("hosting")}
            </Link>
          </li>
          <li className="text-[14.5px] text-dim">{t("deployed", { date: deployedAt })}</li>
          <li>
            <button type="button" onClick={switchLocale} className={linkClass}>
              {tNav("tools.language")}
            </button>
          </li>
          <li>
            <button type="button" onClick={toggleTheme} className={linkClass}>
              {theme === "dark" ? tNav("tools.themeLight") : tNav("tools.themeDark")}
            </button>
          </li>
        </Column>
      </div>

      <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
        <p className="text-[13px] text-dim">{t("copyright", { year, name: SITE.name, author: SITE.displayName })}</p>
        <a href="#main" className="btn btn-ghost btn-sm -mr-2">
          {t("top")}
          <ArrowUp size={15} aria-hidden="true" />
        </a>
      </div>
      {children}
    </footer>
  );
}
