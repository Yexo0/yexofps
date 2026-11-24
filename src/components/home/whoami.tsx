// src/components/home/whoami.tsx — Sélecteur de profil : les deux facettes sont deux pages.
// yexo = accueil (jeu et montage), baptiste = /baptiste (côté pro, infra).
// Deux options dans une pilule : le profil affiché est plein (blanc), l'autre invite à y aller
// (flèche qui avance au survol). En dessous : qui je suis de ce côté-là et où aller ensuite.
import { useTranslations } from "next-intl";
import { ArrowRight, Crosshair, ServerCog, type LucideIcon } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { NextSpace } from "@/components/ui/next-space";
import type { SpaceId } from "@/config/spaces";

export const PROFILES = ["yexo", "baptiste"] as const;
export type Profile = (typeof PROFILES)[number];

/** Page de chaque profil */
export const PROFILE_HREF: Record<Profile, "/" | "/baptiste"> = { yexo: "/", baptiste: "/baptiste" };

/** Où mène chaque profil : le créateur vers ses montages, le pro vers son parcours */
const PATHS: Record<Profile, SpaceId> = { yexo: "creator", baptiste: "career" };

/** Icône de chaque profil */
const ICONS: Record<Profile, LucideIcon> = { yexo: Crosshair, baptiste: ServerCog };

export function Whoami({ current }: { current: Profile }) {
  const t = useTranslations("home.hero.whoami");
  return (
    <div className="flex flex-col gap-5">
      <nav aria-label={t("label")} className="flex flex-col gap-2.5">
        <p className="label">{t("hint")}</p>
        <ul className="whoami-switch">
          {PROFILES.map((p) => {
            const isCurrent = p === current;
            const Icon = ICONS[p];
            return (
              <li key={p} className="flex min-w-0">
                <Link
                  href={PROFILE_HREF[p]}
                  aria-current={isCurrent ? "page" : undefined}
                  className={cn("whoami-option", isCurrent ? "whoami-current" : "whoami-other")}
                >
                  <span aria-hidden="true" className="whoami-icon">
                    <Icon size={17} />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[15px] font-semibold leading-tight">{t(`${p}.name`)}</span>
                    <span className="whoami-sub block truncate text-[12px] leading-tight">
                      {isCurrent ? t(`${p}.tag`) : t(`${p}.go`)}
                    </span>
                  </span>
                  {!isCurrent && <ArrowRight size={16} aria-hidden="true" className="whoami-arrow shrink-0" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="max-w-[60ch] text-[15px] leading-relaxed text-muted">
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
