// src/components/projects/project-card.tsx — Un projet dans la grille : vignette (badge « Voir » au survol),
// numéro, nom, une phrase, statut, année, type. Toute la carte est le lien vers la page du projet.
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
    <span className={cn("tag inline-flex items-center gap-1.5", className)}>
      <span
        aria-hidden="true"
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          status === "inProgress" ? "border border-accent" : status === "school" ? "bg-dim" : "live-dot bg-accent",
        )}
      />
      {t(status)}
    </span>
  );
}

export function ProjectCard({ project, index, sizes, className }: { project: Project; index: number; sizes?: string; className?: string }) {
  const t = useTranslations("projects");
  const n = String(PROJECTS.indexOf(project) + 1).padStart(2, "0");
  const name = t(`items.${project.id}.name`);
  return (
    <Link
      href={`/projects/${project.slug}`}
      className={cn("card project-card group gap-5", className)}
      style={{ "--i": index } as CSSProperties}
      aria-label={`${name} : ${t(`items.${project.id}.tagline`)}`}
    >
      <div className="relative">
        <ProjectCover project={project} sizes={sizes} />
        <span aria-hidden="true" className="view-badge">
          {t("view")}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3">
        <div className="flex items-start justify-between gap-4">
          <p className="flex min-w-0 items-baseline gap-3">
            <span className="font-mono text-[11px] text-accent">{n}</span>
            <span className="display truncate text-[30px] text-fg sm:text-[34px]">{name}</span>
          </p>
          <span
            aria-hidden="true"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-[4px] bg-accent-tint text-accent transition-transform duration-500 group-hover:rotate-45"
          >
            <ArrowUpRight size={17} />
          </span>
        </div>
        <p className="max-w-[52ch] text-[14.5px] leading-relaxed text-muted">{t(`items.${project.id}.tagline`)}</p>
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
          <ProjectStatus status={project.status} />
          <span className="tag">{project.year}</span>
          <span className="tag">{t(`items.${project.id}.kind`)}</span>
        </div>
      </div>
    </Link>
  );
}
