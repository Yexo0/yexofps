// src/components/ui/card.tsx — Panel: flat surface with a hairline border, revealed on scroll.
// Optional head: title (display face) and a short meta on the right. Used for interactive blocks
// (tracker, maps, players…); text content lives in Sections, not in boxes.
import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  id?: string;
  title?: string;
  /** Short meta on the right, e.g. "4 games" */
  meta?: ReactNode;
  /** Keep the title for screen readers only */
  hideHeader?: boolean;
  /** Reveal order (small delay after siblings) */
  index?: number;
  /** No surface, no border: only the reveal and the head */
  plain?: boolean;
  className?: string;
  bodyClassName?: string;
  children?: ReactNode;
}

export function Card({ id, title, meta, hideHeader = false, index = 0, plain, className, bodyClassName, children }: CardProps) {
  const headingId = id && title ? `${id}-title` : undefined;
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      data-reveal=""
      className={cn("card", plain && "card-plain", className)}
      style={{ "--i": index } as CSSProperties}
    >
      {title &&
        (hideHeader ? (
          <h3 id={headingId} className="sr-only">
            {title}
          </h3>
        ) : (
          <header className="mb-6 flex items-baseline justify-between gap-4">
            <h3 id={headingId} className="display text-[26px] text-fg sm:text-[30px]">
              {title}
            </h3>
            {meta && <div className="label shrink-0">{meta}</div>}
          </header>
        ))}
      <div className={cn("flex min-w-0 flex-1 flex-col", bodyClassName)}>{children}</div>
    </section>
  );
}
