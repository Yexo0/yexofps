// src/components/ui/section.tsx — Page section: a hairline that draws itself, an index number, a big
// title rising word by word, optional meta or action on the right, then the content.
// The head is revealed on scroll; put [data-reveal] blocks (Card, Reveal) in the content for the rest.
import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Words } from "./words";

interface SectionProps {
  id: string;
  /** Number shown before the title, e.g. "01" */
  index?: string;
  title: string;
  /** One short sentence under the title */
  intro?: ReactNode;
  /** Right side of the head: a count, a link… */
  aside?: ReactNode;
  className?: string;
  children?: ReactNode;
}

export function Section({ id, index, title, intro, aside, className, children }: SectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={cn("relative scroll-mt-28", className)}>
      <div data-reveal="" className="section-head relative">
        <span aria-hidden="true" className="section-rule" />
        <div className="min-w-0">
          {index && <p className="label mb-4 text-accent">{index}</p>}
          <h2 id={`${id}-title`} className="display t-h2 text-fg">
            <Words text={title} />
          </h2>
          {intro && <div className="mt-5 max-w-[58ch] text-[15px] leading-relaxed text-muted">{intro}</div>}
        </div>
        {aside && <div className="self-end pb-1 text-right">{aside}</div>}
      </div>
      {children}
    </section>
  );
}

/** Block revealed on scroll; `i` delays it slightly after its siblings */
export function Reveal({
  i = 0,
  className,
  children,
  as: Tag = "div",
}: {
  i?: number;
  className?: string;
  children: ReactNode;
  as?: "div" | "li" | "article" | "aside";
}) {
  return (
    <Tag data-reveal="" className={className} style={{ "--i": i } as CSSProperties}>
      {children}
    </Tag>
  );
}
