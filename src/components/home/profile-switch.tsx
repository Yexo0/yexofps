// src/components/home/profile-switch.tsx — The two sides of the profile are two pages: Yexo (/, gaming
// and editing) and Baptiste (/baptiste, infrastructure). A compact segmented control: the bone thumb
// glides to the page being shown (Motion shared layout).
"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { EASE } from "@/lib/motion";

export const PROFILES = ["yexo", "baptiste"] as const;
export type Profile = (typeof PROFILES)[number];

export const PROFILE_HREF: Record<Profile, "/" | "/baptiste"> = { yexo: "/", baptiste: "/baptiste" };

export function ProfileSwitch({ current }: { current: Profile }) {
  const t = useTranslations("home.hero.profiles");
  return (
    <nav aria-label={t("label")} className="flex items-center gap-3">
      <span className="label hidden sm:inline">{t("hint")}</span>
      <div className="profile-switch">
        {PROFILES.map((p) => {
          const isCurrent = p === current;
          return (
            <Link key={p} href={PROFILE_HREF[p]} aria-current={isCurrent ? "page" : undefined} title={t(`${p}.tag`)}>
              {isCurrent && (
                <motion.span
                  layoutId="profile-thumb"
                  aria-hidden="true"
                  className="profile-switch-thumb -z-10"
                  transition={{ duration: 0.7, ease: EASE.out }}
                />
              )}
              {t(`${p}.name`)}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
