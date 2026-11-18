// src/components/home/whoami.tsx — Sélecteur "whoami --as yexo | baptiste" : les deux facettes du profil
// sont deux pages. yexo = accueil (univers Valorant), baptiste = /baptiste (côté pro, infra).
// Deux grandes options côte à côte : le profil affiché est coché ; l'autre s'affiche dans les couleurs
// de son propre univers (data-accent), avec un appel à l'action, un reflet qui le traverse une fois après
// l'intro et une flèche qui fait signe, pour donner envie d'y aller (CSS seul, voir .whoami-*).
// Changer de profil change de page : couleurs, fond, 3D et curseur basculent avec la transition.
import { useTranslations } from "next-intl";
import { ArrowRight, Check, Crosshair, ServerCog, type LucideIcon } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { NextSpace } from "@/components/ui/next-space";
import type { SpaceId } from "@/config/spaces";
import type { ThemeKey } from "@/config/theme";

export const PROFILES = ["yexo", "baptiste"] as const;
export type Profile = (typeof PROFILES)[number];

/** Page de chaque profil */
export const PROFILE_HREF: Record<Profile, "/" | "/baptiste"> = { yexo: "/", baptiste: "/baptiste" };

/** Où mène chaque profil : le créateur vers ses montages, le pro vers son parcours */
const PATHS: Record<Profile, SpaceId> = { yexo: "creator", baptiste: "career" };

/** Icône et univers de couleur de chaque profil */
const LOOK: Record<Profile, { icon: LucideIcon; accent: ThemeKey }> = {
  yexo: { icon: Crosshair, accent: "home" },
  baptiste: { icon: ServerCog, accent: "pro" },
};

export function Whoami({ current }: { current: Profile }) {
  const t = useTranslations("home.hero.whoami");
  return (
    <div className="flex flex-col gap-4">
      <nav aria-label={t("label")} className="flex flex-col gap-2">
        <p className="font-mono text-[12px] text-muted">
          <span className="text-accent">$</span> whoami --as <span className="text-dim">· {t("hint")}</span>
        </p>
        <ul className="grid max-w-[460px] grid-cols-2 gap-2">
          {PROFILES.map((p) => {
            const isCurrent = p === current;
            const Icon = LOOK[p].icon;
            return (
              <li key={p} data-accent={LOOK[p].accent} className="flex min-w-0">
                <Link
                  href={PROFILE_HREF[p]}
                  aria-current={isCurrent ? "page" : undefined}
                  className={cn("whoami-option", isCurrent ? "whoami-current" : "whoami-other")}
                >
                  <span aria-hidden="true" className="whoami-icon">
                    <Icon size={18} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="display block truncate text-[21px] leading-none text-fg">{t(`${p}.name`)}</span>
                    <span className={cn("mt-1 block text-[11.5px] font-medium leading-tight", isCurrent ? "text-muted" : "text-accent")}>
                      {isCurrent ? t(`${p}.tag`) : t(`${p}.go`)}
                    </span>
                  </span>
                  {isCurrent ? (
                    <Check size={16} aria-hidden="true" className="shrink-0 text-accent" />
                  ) : (
                    <ArrowRight size={17} aria-hidden="true" className="whoami-arrow shrink-0 text-accent" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="max-w-[68ch] text-[15px] leading-relaxed text-muted">
        <p>
          <span className="font-semibold text-fg">{t(`${current}.title`)}</span> {t(`${current}.text`)}
        </p>
        <div className="mt-3">
          <NextSpace to={PATHS[current]} label={t(`${current}.path`)} />
        </div>
      </div>
    </div>
  );
}
