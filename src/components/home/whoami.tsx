// src/components/home/whoami.tsx — Sélecteur "whoami --as yexo | baptiste" : les deux facettes du profil
// sont deux pages. yexo = accueil (univers Valorant), baptiste = /baptiste (côté pro, After Effects).
// Changer de profil change de page : couleurs, fond, 3D et curseur basculent avec la transition.
import { useTranslations } from "next-intl";
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

export function Whoami({ current }: { current: Profile }) {
  const t = useTranslations("home.hero.whoami");
  return (
    <div className="flex flex-col gap-3">
      <nav aria-label={t("label")} className="flex flex-wrap items-center gap-2 font-mono text-[12.5px]">
        <span className="text-accent">$</span>
        <span className="text-muted">whoami --as</span>
        <ul className="flex gap-1 rounded-[5px] bg-surface-2 p-1">
          {PROFILES.map((p) => (
            <li key={p}>
              <Link
                href={PROFILE_HREF[p]}
                aria-current={p === current ? "page" : undefined}
                className={cn(
                  "block rounded-[3px] px-3 py-1 transition-colors",
                  p === current ? "bg-accent text-on-accent" : "text-muted hover:bg-surface-3 hover:text-fg",
                )}
              >
                {p}
              </Link>
            </li>
          ))}
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
