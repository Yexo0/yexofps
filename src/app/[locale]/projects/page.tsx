// src/app/[locale]/projects/page.tsx — 02 Projets : tout ce que j'ai construit (applis, outils, infra),
// en grille bento. Chaque carte ouvre la page du projet ; sa vignette s'y transforme (transition de page).
import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LayoutGrid } from "lucide-react";
import { PROJECTS } from "@/config/projects";
import { pageMetadata } from "@/lib/metadata";
import { Card } from "@/components/ui/card";
import { ProjectCard } from "@/components/projects/project-card";
import { cn } from "@/lib/utils";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.projects" });
  return pageMetadata({ locale, path: "/projects", title: t("title"), description: t("description") });
}

export default async function ProjectsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Projects />;
}

/** Largeur de chaque carte sur grand écran, dans l'ordre : 7/5, 4/4/4, 5/7, 6/6 */
const SPANS = ["lg:col-span-7", "lg:col-span-5", "lg:col-span-4", "lg:col-span-4", "lg:col-span-4", "lg:col-span-5", "lg:col-span-7", "lg:col-span-6", "lg:col-span-6"];

const SIZES: Record<string, string> = {
  "7": "(min-width: 1024px) 52vw, (min-width: 768px) 90vw, 92vw",
  "6": "(min-width: 1024px) 44vw, (min-width: 768px) 90vw, 92vw",
  "5": "(min-width: 1024px) 37vw, (min-width: 768px) 90vw, 92vw",
  "4": "(min-width: 1024px) 29vw, (min-width: 768px) 44vw, 92vw",
};

function Projects() {
  const t = useTranslations("projects");
  return (
    <div className="bento">
      <Card
        id="projects"
        icon={LayoutGrid}
        title={t("title")}
        subtitle="ls ~/projects"
        meta={t("count", { count: PROJECTS.length })}
        headingLevel={1}
        index={0}
        className="md:col-span-6 lg:col-span-12"
      >
        <p className="max-w-[70ch] text-[17px] leading-relaxed text-muted">{t("lead")}</p>
      </Card>
      {PROJECTS.map((project, i) => {
        const span = SPANS[i % SPANS.length];
        const n = span.split("-").pop() ?? "6";
        return (
          <ProjectCard
            key={project.id}
            project={project}
            index={i + 1}
            sizes={SIZES[n]}
            className={cn(i === 0 ? `md:col-span-6 ${span}` : `md:col-span-3 ${span}`, i === 0 && "group-start", i === 1 && "group-start-lg")}
          />
        );
      })}
    </div>
  );
}
