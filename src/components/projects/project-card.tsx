// src/components/projects/project-card.tsx — One project on the grid: plate (with a "View" badge that
// grows on hover), number, name, status, one line, year and main tools. The whole card is the link.
import type { CSSProperties } from "react";
import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { PROJECTS, type Project } from "@/config/projects";
import { cn } from "@/lib/utils";
import { ProjectCover } from "./project-cover";

export function ProjectStatus({ status, className }: { status: Project["status"]; className?: string }) {
  const t = useTranslations("projects.status");
  return (
    <span className={cn("label inline-flex items-center gap-2", className)}>
      <span
        aria-hidden="true"
        className={cn("h-1.5 w-1.5 rounded-full", status === "inProgress" ? "border border-accent-vivid" : status === "school" ? "bg-dim" : "bg-accent-vivid")}
      />
      {t(status)}
    </span>
  );
}

export function ProjectCard({ project, index, sizes, className }: { project: Project; index: number; sizes?: string; className?: string }) {
  const t = useTranslations("projects");
  const n = String(PROJECTS.indexOf(project) + 1).padStart(2, "0");
  return (
    <article data-reveal="" className={cn("project-card", className)} style={{ "--i": index % 3 } as CSSProperties}>
      <Link href={`/projects/${project.slug}`} className="group block" aria-label={`${t(`items.${project.id}.name`)}: ${t(`items.${project.id}.tagline`)}`}>
        <div className="relative">
          <ProjectCover project={project} sizes={sizes} />
          <span aria-hidden="true" className="view-badge">
            {t("view")}
          </span>
        </div>
        <div className="mt-5 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="flex items-center gap-3">
              <span className="font-mono text-[11px] text-accent">{n}</span>
              <span className="display index-title text-[34px] text-fg sm:text-[40px]">{t(`items.${project.id}.name`)}</span>
            </p>
            <p className="mt-2 max-w-[48ch] text-[15px] leading-snug text-muted">{t(`items.${project.id}.tagline`)}</p>
          </div>
          <span
            aria-hidden="true"
            className="mt-2 grid h-9 w-9 shrink-0 place-items-center border border-line-strong text-muted transition-[transform,color,border-color] duration-500 [transition-timing-function:var(--ease-out)] group-hover:rotate-45 group-hover:border-fg group-hover:text-fg"
          >
            <ArrowUpRight size={16} />
          </span>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line pt-3">
          <ProjectStatus status={project.status} />
          <span className="label">{project.year}</span>
          <span className="label hidden truncate sm:inline">{t(`items.${project.id}.kind`)}</span>
        </div>
      </Link>
    </article>
  );
}
