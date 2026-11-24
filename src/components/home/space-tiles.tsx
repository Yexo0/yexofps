// src/components/home/space-tiles.tsx — Bas de l'accueil : les six autres espaces en grandes tuiles.
// Survol : la tuile se soulève, son image (s'il y en a une) reprend un peu de couleur, la flèche
// tourne dans un rond qui devient rouge.
import Image from "next/image";
import type { CSSProperties } from "react";
import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SPACES, type SpaceId } from "@/config/spaces";

/** Visuel de fond des tuiles qui en ont un (les autres gardent leur grande icône).
 *  `sizes` des images : largeur réelle des tuiles (mesurée de 360 à 1920 px), marges et rail déduits. */
const IMAGES: Partial<Record<(typeof SPACES)[number]["id"], string>> = {
  gaming: "/videos/featured-edit.jpg",
  creator: "/images/creator/editing-setup.webp",
};

/** `order` : ordre des espaces affichés (par défaut celui du rail, sans l'accueil) */
export function SpaceTiles({ className, order }: { className?: string; order?: readonly SpaceId[] }) {
  const t = useTranslations("nav.rail");
  const tHome = useTranslations("home.explore");
  const spaces = order
    ? order.map((id) => SPACES.find((s) => s.id === id)!).filter(Boolean)
    : SPACES.filter((s) => s.id !== "home");

  return (
    <section aria-labelledby="explore-title" className={className}>
      <h2 id="explore-title" className="display mb-4 mt-10 px-2 text-[30px] text-fg sm:text-[40px]">
        {tHome("title")}
      </h2>
      <ul className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-3">
        {spaces.map((space, i) => {
          const Icon = space.icon;
          const n = SPACES.indexOf(space) + 1;
          const image = IMAGES[space.id];
          return (
            <li key={space.id} className="flex">
              <Link
                href={space.href}
                className="card space-tile group"
                style={{ "--i": i } as CSSProperties}
                aria-label={`${n}. ${t(`${space.id}.title`)} : ${t(`${space.id}.desc`)}`}
              >
                {image && (
                  <Image src={image} alt="" fill sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 90vw" className="space-tile-image" />
                )}
                <Icon aria-hidden="true" className="space-tile-icon" strokeWidth={1.2} />
                <span aria-hidden="true" className="relative flex items-start justify-between">
                  <span className="space-tile-num text-[13px] font-medium tabular-nums">{String(n).padStart(2, "0")}</span>
                  <span className="space-tile-arrow grid h-10 w-10 place-items-center rounded-full bg-surface-2 text-fg">
                    <ArrowUpRight size={18} />
                  </span>
                </span>
                <span aria-hidden="true" className="relative mt-auto block pt-6">
                  <span className="display block text-[34px] text-fg">{t(`${space.id}.title`)}</span>
                  <span className="mt-2 block text-[14.5px] text-muted">{t(`${space.id}.desc`)}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
