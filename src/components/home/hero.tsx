// src/components/home/hero.tsx — Hero plein écran commun aux deux profils de l'accueil :
// "yexo" (/, univers Valorant : Vandal) et "baptiste" (/baptiste, côté pro : PC portable).
// Haut : avatar + prénom, nom affiché en très grand (lettre par lettre), une phrase, le sélecteur de
// profil, les actions. Droite : halo rouge doux, scène 3D, deux repères. Bas : chiffres clés.
// Seul le prénom apparaît (jamais le nom de famille).
import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { useTranslations } from "next-intl";
import { PROFILE } from "@/config/site";
import { cn } from "@/lib/utils";
import { SplitText } from "@/components/ui/split-text";
import { HeroStage } from "./hero-stage";
import { Whoami, type Profile } from "./whoami";

interface HeroProps {
  profile: Profile;
  /** Nom affiché en très grand */
  name: string;
  punch: string;
  scene: "vandal" | "laptop";
  /** Repères autour de l'objet 3D : [en haut à droite, en bas] */
  callouts: [string, string];
  actions: ReactNode;
  stats: ReactNode;
  /** Taille du nom (un nom long demande une taille plus petite) */
  nameClassName?: string;
}

export function Hero({ profile, name, punch, scene, callouts, actions, stats, nameClassName }: HeroProps) {
  const t = useTranslations("home.hero");

  return (
    <section
      aria-labelledby="hero-title"
      // data-lcp : visible dès le premier affichage (sans fondu ni script), voir globals.css
      data-lcp=""
      data-scene={scene}
      className="card hero-card md:col-span-6 lg:col-span-12"
      style={{ "--i": 0, viewTransitionName: "lead-card" } as CSSProperties}
    >
      {/* Décor : halo rouge doux sous l'objet 3D, deux repères discrets */}
      <span aria-hidden="true" className="hero-band" />
      <HeroStage scene={scene} className="hero-3d" />
      <span aria-hidden="true" className="hero-callout hero-callout-a">
        <span className="hero-callout-dot" />
        <span className="text-[13px] font-medium text-fg">{callouts[0]}</span>
      </span>
      <span aria-hidden="true" className="hero-callout hero-callout-b">
        <span className="hero-callout-dot" />
        <span className="text-[13px] text-dim">{callouts[1]}</span>
      </span>

      <div className="relative z-[2] flex max-w-[560px] flex-col">
        <div className="flex items-center gap-3">
          <Image
            src="/images/avatar.webp"
            alt={t("avatarAlt")}
            width={88}
            height={88}
            preload
            className="h-10 w-10 rounded-full object-cover"
          />
          <p className="text-[14px] text-muted">{t("realName", { age: PROFILE.age })}</p>
        </div>

        <h1 id="hero-title" className={cn("display hero-name mt-6 text-fg", nameClassName)}>
          <SplitText text={name} delay={120} />
        </h1>

        <p className="hero-punch mt-5 max-w-[24ch] font-display text-[24px] font-semibold leading-[1.15] tracking-[-0.025em] sm:text-[30px]">
          {punch}
        </p>
        <div className="stagger mt-8 flex flex-wrap items-center gap-2.5">{actions}</div>

        <div className="mt-9 max-w-[56ch]">
          <Whoami current={profile} />
        </div>
      </div>

      <div className="relative z-[2] mt-10 lg:mt-auto lg:pt-10">{stats}</div>
    </section>
  );
}
