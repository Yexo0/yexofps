// src/components/ui/card.tsx — Composant carte : base de tout le site.
// Header = pastille d'icône + titre + sous-titre façon commande (mono) + méta à droite.
// En bas, lien optionnel vers l'espace suivant.
import type { CSSProperties, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SpaceId } from "@/config/spaces";
import { NextSpace } from "./next-space";

interface CardProps {
  id?: string;
  icon?: LucideIcon;
  title: string;
  /** Commande ou chemin affiché sous le titre, ex : "~/parcours" */
  subtitle?: string;
  /** Méta courte à droite, ex : "4 jeux" */
  meta?: ReactNode;
  /** h1 pour la carte principale d'un espace, h2 sinon */
  headingLevel?: 1 | 2;
  /** Masque visuellement le header (le titre reste lu par les lecteurs d'écran) */
  hideHeader?: boolean;
  next?: SpaceId;
  /** Ordre d'apparition (léger décalage du fondu) */
  index?: number;
  className?: string;
  bodyClassName?: string;
  children?: ReactNode;
}

export function Card({
  id,
  icon: Icon,
  title,
  subtitle,
  meta,
  headingLevel = 2,
  hideHeader = false,
  next,
  index = 0,
  className,
  bodyClassName,
  children,
}: CardProps) {
  const Heading = headingLevel === 1 ? "h1" : "h2";
  const headingId = id ? `${id}-title` : undefined;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cn("card", className)}
      style={{ "--i": index } as CSSProperties}
    >
      {hideHeader ? (
        <Heading id={headingId} className="sr-only">
          {title}
        </Heading>
      ) : (
        <header className="mb-5 flex items-start gap-3">
          {Icon && (
            <span className="icon-pill" aria-hidden="true">
              <Icon size={17} strokeWidth={2} />
            </span>
          )}
          <div className="min-w-0 flex-1">
            <Heading id={headingId} className="text-[15px] font-bold leading-tight text-fg">
              {title}
            </Heading>
            {subtitle && (
              <p className="mt-0.5 truncate font-mono text-[11.5px] text-dim">{subtitle}</p>
            )}
          </div>
          {meta && <div className="shrink-0 pt-0.5 font-mono text-[11.5px] text-dim">{meta}</div>}
        </header>
      )}
      <div className={cn("flex min-w-0 flex-1 flex-col", bodyClassName)}>{children}</div>
      {next && (
        <div className="mt-6">
          <NextSpace to={next} />
        </div>
      )}
    </section>
  );
}
