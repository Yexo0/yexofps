// src/components/shell/site-footer.tsx — Footer of every page: a closing call to action (hidden on the
// Contact page, where it would repeat), the spaces, elsewhere, the live status, the deploy date
// (links to /lab/site), copyright and the 3D model credits.
"use client";

import { useTranslations } from "next-intl";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { SPACES, spaceFromPath } from "@/config/spaces";
import { EMAILS, SITE, SOCIALS } from "@/config/site";
import { CopyButton } from "@/components/ui/copy-button";
import { Words } from "@/components/ui/words";
import { NowStatusSegment } from "@/components/now/now-chip";
import type { ReactNode } from "react";

const ELSEWHERE = [
  { id: "tiktok", label: "TikTok" },
  { id: "discord", label: "Discord" },
  { id: "instagramFps", label: "Instagram" },
] as const;

export function SiteFooter({ year, deployedAt, credits }: { year: number; deployedAt: string; credits: ReactNode }) {
  const t = useTranslations("common.footer");
  const tNav = useTranslations("nav.spaces");
  const tStatus = useTranslations("common.status");
  const pathname = usePathname();
  const onContact = spaceFromPath(pathname).id === "contact";

  return (
    <footer className="container-x mt-auto">
      {!onContact && (
        <div data-reveal="" className="relative border-t border-line-strong pb-16 pt-14 sm:pb-24 sm:pt-20">
          <p className="label mb-6">{t("cta.label")}</p>
          <Link href="/contact" className="group inline-flex items-end gap-4 sm:gap-6">
            <span className="display t-h1 text-fg transition-colors duration-500 group-hover:text-accent">
              <Words text={t("cta.title")} />
            </span>
            <span
              aria-hidden="true"
              className="mb-[0.6em] grid h-12 w-12 shrink-0 place-items-center border border-line-strong transition-[transform,background-color,border-color] duration-500 [transition-timing-function:var(--ease-out)] group-hover:-rotate-45 group-hover:border-transparent group-hover:bg-accent-vivid group-hover:text-on-accent sm:h-16 sm:w-16"
            >
              <ArrowUpRight size={22} className="rotate-45" />
            </span>
          </Link>
          <div className="mt-8 flex flex-wrap items-center gap-3 text-[14px] text-muted">
            <span>{t("cta.text")}</span>
            <a href={`mailto:${EMAILS.pro}`} className="link-line text-fg">
              {EMAILS.pro}
            </a>
            <CopyButton value={EMAILS.pro} label={t("cta.copy")} compact />
          </div>
        </div>
      )}

      <div className="grid gap-10 border-t border-line py-12 text-[13px] sm:grid-cols-2 lg:grid-cols-4">
        <nav aria-label={t("spaces")}>
          <p className="label mb-4">{t("spaces")}</p>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2">
            {SPACES.map((s, i) => (
              <li key={s.id}>
                <Link href={s.href} className="group inline-flex items-baseline gap-2 text-muted hover:text-fg">
                  <span className="font-mono text-[10px] text-dim">{String(i + 1).padStart(2, "0")}</span>
                  <span className="link-line">{tNav(s.id)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="label mb-4">{t("elsewhere")}</p>
          <ul className="flex flex-col gap-2">
            {ELSEWHERE.map((s) => (
              <li key={s.id}>
                <a href={SOCIALS[s.id].url} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-1.5 text-muted hover:text-fg">
                  <span className="link-line">{s.label}</span>
                  <ArrowUpRight size={12} aria-hidden="true" className="text-dim" />
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="label mb-4">{t("now")}</p>
          <NowStatusSegment className="text-muted" />
          <Link href="/lab/site" className="group mt-3 block text-muted hover:text-fg">
            <span className="link-line">{tStatus("deployed", { date: deployedAt })}</span>
          </Link>
        </div>
        <div className="flex flex-col items-start gap-4 lg:items-end">
          <p className="text-muted">{t("copyright", { year, name: SITE.name, author: SITE.displayName })}</p>
          <a href="#main" className="group inline-flex items-center gap-2 text-muted hover:text-fg">
            <span className="link-line">{t("top")}</span>
            <ArrowUp size={13} aria-hidden="true" />
          </a>
        </div>
      </div>
      <div className="border-t border-line py-6">{credits}</div>
    </footer>
  );
}
