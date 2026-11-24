// src/components/ui/page-header.tsx — Top of every page: space number and name, big title rising word
// by word, one short lead sentence, optional actions or side content. The giant outlined number on the
// right is the page's index in the navigation (decorative, desktop only).
import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { spaceIndex, type SpaceId } from "@/config/spaces";
import { cn } from "@/lib/utils";
import { Words } from "./words";

interface PageHeaderProps {
  space: SpaceId;
  /** Small text next to the space name (context: a sub-page name, a status…) */
  eyebrow?: string;
  title: string;
  lead?: ReactNode;
  /** Buttons under the lead */
  actions?: ReactNode;
  /** Content on the right on large screens (status, figures…) */
  aside?: ReactNode;
  /** Hide the giant outlined number */
  plain?: boolean;
  className?: string;
}

export function PageHeader({ space, eyebrow, title, lead, actions, aside, plain, className }: PageHeaderProps) {
  const t = useTranslations("nav.spaces");
  const n = String(spaceIndex(space)).padStart(2, "0");
  return (
    <header className={cn("page-head", className)}>
      {!plain && (
        <span aria-hidden="true" className="page-head-num hidden lg:block">
          {n}
        </span>
      )}
      <p className="label relative flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="text-accent">{n}</span>
        <span className="h-px w-8 bg-line-strong" aria-hidden="true" />
        <span>{t(space)}</span>
        {eyebrow && (
          <>
            <span aria-hidden="true">/</span>
            <span className="text-muted">{eyebrow}</span>
          </>
        )}
      </p>
      <div className="relative mt-6 grid gap-10 lg:grid-cols-12 lg:items-end">
        <div className={cn("min-w-0", aside ? "lg:col-span-8" : "lg:col-span-12")}>
          <h1 className="display t-h1 text-fg">
            <Words text={title} mode="load" />
          </h1>
          {lead && <div className="lead stagger mt-7 max-w-[46ch]">{lead}</div>}
          {actions && <div className="mt-9 flex flex-wrap items-center gap-3">{actions}</div>}
        </div>
        {aside && <div className="min-w-0 lg:col-span-4">{aside}</div>}
      </div>
    </header>
  );
}
