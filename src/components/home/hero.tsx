// src/components/home/hero.tsx — Full-screen hero shared by both home profiles: "yexo" (/, Valorant
// world: Vandal) and "baptiste" (/baptiste, pro side: laptop).
// Top: who (first name, age, country) and the profile switch. Right: red band + 3D object. Bottom left:
// the name, huge, letter by letter; one sentence; the actions. Then the key figures.
// Only the first name is shown (never the family name).
import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { useTranslations } from "next-intl";
import { PROFILE } from "@/config/site";
import { cn } from "@/lib/utils";
import { SplitText } from "@/components/ui/split-text";
import { HeroStage } from "./hero-stage";
import { ProfileSwitch, type Profile } from "./profile-switch";

interface HeroProps {
  profile: Profile;
  /** Name shown huge */
  name: string;
  punch: string;
  scene: "vandal" | "laptop";
  /** What the 3D object is */
  caption: string;
  actions: ReactNode;
  stats: ReactNode;
  /** Smaller size for a long name */
  long?: boolean;
}

export function Hero({ profile, name, punch, scene, caption, actions, stats, long }: HeroProps) {
  const t = useTranslations("home.hero");

  return (
    // data-lcp: visible from the first paint (no script needed), its parts arrive in CSS
    <section aria-labelledby="hero-title" data-lcp="" className="hero">
      <div className="relative z-[3] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Image
            src="/images/avatar.webp"
            alt={t("avatarAlt")}
            width={72}
            height={72}
            preload
            className="h-9 w-9 object-cover grayscale-[30%]"
            style={{ clipPath: "polygon(6px 0, 100% 0, 100% 100%, 0 100%, 0 6px)" } as CSSProperties}
          />
          <p className="label text-muted">{t("realName", { age: PROFILE.age })}</p>
        </div>
        <ProfileSwitch current={profile} />
      </div>

      <HeroStage scene={scene} caption={caption} />

      <div className="relative z-[2] flex flex-col justify-end">
        <h1 id="hero-title" className={cn("display t-hero hero-name", long && "hero-name-long")}>
          <SplitText text={name} delay={120} />
        </h1>
      </div>

      <div className="relative z-[2] mt-8 grid gap-8 pb-10 lg:grid-cols-12 lg:items-end">
        <p
          className="stagger max-w-[26ch] text-[24px] font-medium leading-[1.15] tracking-[-0.02em] text-fg sm:text-[30px] lg:col-span-6"
          style={{ "--sd": "650ms" } as CSSProperties}
        >
          <span>{punch}</span>
        </p>
        <div className="stagger flex flex-wrap items-center gap-3 lg:col-span-6 lg:justify-end" style={{ "--sd": "800ms" } as CSSProperties}>
          {actions}
        </div>
      </div>

      <div className="relative z-[2]">{stats}</div>
    </section>
  );
}
