// src/components/home/selected-work.tsx — Three projects on the home pages, with a link to all of them.
import { useTranslations } from "next-intl";
import { PROJECTS, type ProjectId } from "@/config/projects";
import { Section } from "@/components/ui/section";
import { ArrowLink } from "@/components/ui/primitives";
import { ProjectCard } from "@/components/projects/project-card";

/** Three projects, with a link to all of them */
export function SelectedWork({ ids, index }: { ids: ProjectId[]; index: string }) {
  const t = useTranslations("home.work");
  const projects = ids.map((id) => PROJECTS.find((p) => p.id === id)!);
  return (
    <Section id="work" index={index} title={t("title")} aside={<ArrowLink href="/projects">{t("all")}</ArrowLink>}>
      <div className="grid gap-x-6 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => (
          <ProjectCard
            key={p.id}
            project={p}
            index={i}
            sizes="(min-width: 1024px) 31vw, (min-width: 768px) 46vw, 100vw"
            className={i === 0 ? "md:col-span-2 lg:col-span-1" : undefined}
          />
        ))}
      </div>
    </Section>
  );
}
