// src/app/[locale]/projects/page.tsx — 02 Projects: everything built so far, as a studio portfolio.
// Two featured projects first (large, offset), then the rest on an asymmetric grid. Each card opens
// the project's own page; its plate morphs into the page header (view transition).
import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PROJECTS } from "@/config/projects";
import { pageMetadata } from "@/lib/metadata";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/ui/page-header";
import { ProjectCard } from "@/components/projects/project-card";

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

/** Column spans on large screens, in order: 7/5, 4/4/4, 5/7, 6/6 (the rhythm of the grid) */
const LAYOUT = [
  "lg:col-span-7",
  "lg:col-span-5 lg:mt-32",
  "lg:col-span-4",
  "lg:col-span-4 lg:mt-16",
  "lg:col-span-4",
  "lg:col-span-5",
  "lg:col-span-7 lg:mt-24",
  "lg:col-span-6",
  "lg:col-span-6 lg:mt-16",
];

const SIZES: Record<string, string> = {
  "7": "(min-width: 1024px) 56vw, (min-width: 768px) 92vw, 100vw",
  "6": "(min-width: 1024px) 48vw, (min-width: 768px) 92vw, 100vw",
  "5": "(min-width: 1024px) 40vw, (min-width: 768px) 92vw, 100vw",
  "4": "(min-width: 1024px) 32vw, (min-width: 768px) 46vw, 100vw",
};

function Projects() {
  const t = useTranslations("projects");
  return (
    <div className="page">
      <PageHeader space="projects" eyebrow={t("count", { count: PROJECTS.length })} title={t("title")} lead={<p>{t("lead")}</p>} />
      <div className="grid gap-x-5 gap-y-16 md:grid-cols-2 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-24">
        {PROJECTS.map((project, i) => {
          const layout = LAYOUT[i % LAYOUT.length];
          const span = layout.match(/col-span-(\d+)/)?.[1] ?? "6";
          return (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              sizes={SIZES[span]}
              className={cn(layout, i === 0 && "md:col-span-2")}
            />
          );
        })}
      </div>
    </div>
  );
}
