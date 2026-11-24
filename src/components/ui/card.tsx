// src/components/ui/card.tsx — Composant carte : base de tout le site.
// Header = pastille d'icône + titre + méta à droite (le sous-titre façon commande n'est plus affiché).
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
  /** Commande ou chemin façon terminal, ex : "~/parcours". N'est plus affiché (en-tête épuré) ;
   *  gardé pour mémoire dans les pages. */
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
      // Carte principale (h1) : se transforme en celle de la page suivante lors d'une navigation
      style={{ "--i": index, viewTransitionName: headingLevel === 1 ? "lead-card" : undefined } as CSSProperties}
    >
      {hideHeader ? (
        <Heading id={headingId} className="sr-only">
          {title}
        </Heading>
      ) : (
        <header className="mb-6 flex items-center gap-3">
          {Icon && (
            <span className="icon-pill" aria-hidden="true">
              <Icon size={15} strokeWidth={2} />
            </span>
          )}
          <div className="min-w-0 flex-1">
            <Heading id={headingId} className="display text-[22px] leading-none text-fg sm:text-[24px]">
              {title}
            </Heading>

          </div>
          {meta && <div className="shrink-0 font-mono text-[11px] uppercase tracking-[0.08em] text-dim">{meta}</div>}
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
