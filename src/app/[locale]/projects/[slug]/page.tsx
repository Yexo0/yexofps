// src/app/[locale]/projects/[slug]/page.tsx — Page d'un projet, en bento : nom, une phrase et fiche
// (année, statut, outils, liens) à côté de la vignette (qui arrive de la grille), puis le résumé et les
// points clés, les captures, et le projet suivant. Certains projets portent leur vrai outil : le
// convertisseur de sensibilité tourne ici, les tutos PDF se téléchargent ici.
import Image from "next/image";
import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, Download, FileText, Images, ListChecks, SlidersHorizontal } from "lucide-react";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { PROJECTS, nextProject, projectBySlug, type Project } from "@/config/projects";
import { DOCS } from "@/config/career";
import { GAMES, GAME_KEYS } from "@/lib/converter-math";
import { pageMetadata } from "@/lib/metadata";
import { Card } from "@/components/ui/card";
import { ButtonLink, ExternalButton } from "@/components/ui/primitives";
import { GitHubIcon } from "@/components/icons/brands";
import { ProjectCover } from "@/components/projects/project-cover";
import { ProjectStatus } from "@/components/projects/project-card";
import { LoopVideo } from "@/components/projects/loop-video";
import { Converter } from "@/components/tools/converter";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => PROJECTS.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = projectBySlug(slug);
  if (!project) return {};
  const t = await getTranslations({ locale, namespace: "projects.items" });
  return pageMetadata({ locale, path: `/projects/${slug}`, title: t(`${project.id}.name`), description: t(`${project.id}.tagline`) });
}

export default async function ProjectPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const project = projectBySlug(slug);
  if (!project) notFound();
  return <ProjectView project={project} />;
}

function ProjectView({ project }: { project: Project }) {
  const t = useTranslations("projects");
  const tItem = useTranslations(`projects.items.${project.id}`);
  const tNav = useTranslations("nav.spaces");
  const n = String(PROJECTS.indexOf(project) + 1).padStart(2, "0");
  const highlights = tItem.raw("highlights") as string[];
  const related = project.related;

  return (
    <div className="bento">
      <Card
        id="project"
        title={tItem("name")}
        subtitle={`~/projects/${project.slug}`}
        meta={n}
        headingLevel={1}
        index={0}
        className="md:col-span-6 lg:col-span-5"
        bodyClassName="gap-6"
      >
        <Link href="/projects" className="group -mt-2 inline-flex items-center gap-2 self-start text-[13px] font-semibold text-accent">
          <ArrowLeft size={14} aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-x-0.5" />
          {t("back")}
        </Link>
        <p className="text-[22px] font-bold leading-tight tracking-tight text-fg sm:text-[24px]">{tItem("tagline")}</p>
        <dl className="stagger grid grid-cols-2 gap-2">
          <div className="tile px-4 py-3">
            <dt className="label">{t("labels.year")}</dt>
            <dd className="mt-1.5 text-[15px] font-semibold text-fg">{project.year}</dd>
          </div>
          <div className="tile px-4 py-3">
            <dt className="label">{t("labels.status")}</dt>
            <dd className="mt-1.5">
              <ProjectStatus status={project.status} />
            </dd>
          </div>
          <div className="tile col-span-2 px-4 py-3">
            <dt className="label">{tItem("kind")}</dt>
            {project.stack.length > 0 && (
              <dd className="mt-2 flex flex-wrap gap-1.5">
                {project.stack.map((s) => (
                  <span key={s} className="tag">
                    {s}
                  </span>
                ))}
              </dd>
            )}
          </div>
        </dl>
        {(project.repo || related) && (
          <div className="mt-auto flex flex-wrap gap-2.5">
            {related && (
              <ButtonLink href={`${related}${project.relatedHash ?? ""}`} variant="primary">
                {t("labels.related", { space: related === "/lab/site" ? t("labels.site") : tNav(related === "/lab" ? "lab" : "career") })}
                <ArrowRight size={15} aria-hidden="true" />
              </ButtonLink>
            )}
            {project.repo && (
              <ExternalButton href={project.repo} variant={related ? "tonal" : "primary"} showIcon>
                <GitHubIcon size={15} />
                {t("labels.source")}
              </ExternalButton>
            )}
          </div>
        )}
      </Card>

      <section aria-label={tItem("name")} data-lcp="" className="card md:col-span-6 lg:col-span-7" style={{ padding: 10 }}>
        <ProjectCover project={project} priority sizes="(min-width: 1024px) 56vw, 92vw" className="h-full !aspect-auto min-h-[280px]" />
      </section>

      <Card id="about" icon={ListChecks} title={t("about")} subtitle="cat README.md" index={2} className="group-start md:col-span-6 lg:col-span-12" bodyClassName="gap-6">
        <div className="grid gap-6 lg:grid-cols-12">
          <p className="text-[16px] leading-relaxed text-fg lg:col-span-6">{tItem("summary")}</p>
          <ol className="stagger flex flex-col gap-2 lg:col-span-6">
            {highlights.map((h, i) => (
              <li key={h} className="tile flex gap-3 px-4 py-3 text-[14px] leading-relaxed text-muted">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent-tint text-[11px] font-semibold tabular-nums text-accent">{i + 1}</span>
                {h}
              </li>
            ))}
          </ol>
        </div>
      </Card>

      {project.id === "sens" && <SensTool />}
      {project.id === "guides" && <GuidesList />}
      {project.gallery && <Gallery project={project} />}

      <NextProject project={project} />
    </div>
  );
}

/* ─── Captures ─── */

function Gallery({ project }: { project: Project }) {
  const t = useTranslations("projects");
  const media = project.gallery ?? [];
  const portrait = media.every((m) => m.height > m.width);
  const label = t("captureLabel", { name: t(`items.${project.id}.name`) });
  return (
    <Card id="captures" icon={Images} title={t("gallery")} subtitle="ls ./captures" meta={media.length} index={3} className="md:col-span-6 lg:col-span-12">
      <div className={portrait ? "stagger grid gap-2.5 sm:grid-cols-3" : "stagger grid gap-2.5 lg:grid-cols-12"}>
        {media.map((m) => {
          const wide = m.width / m.height > 2;
          return (
            <div
              key={m.src}
              className={portrait ? "media-frame" : wide ? "media-frame lg:col-span-12" : "media-frame lg:col-span-7"}
              style={{ aspectRatio: `${m.width} / ${m.height}` }}
            >
              {m.type === "video" ? (
                <LoopVideo src={m.src} poster={m.poster} label={label} />
              ) : (
                <Image src={m.src} alt={label} width={m.width} height={m.height} sizes="(min-width: 1024px) 80vw, 92vw" className="h-full w-full object-cover" />
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

/* ─── Convertisseur de sensibilité : l'outil lui-même ─── */

function SensTool() {
  const t = useTranslations("tools");
  return (
    <>
      <Card
        id="converter"
        icon={SlidersHorizontal}
        title={t("converter.title")}
        subtitle="sens --convert --keep cm/360"
        meta={t("converter.meta", { count: GAME_KEYS.length })}
        index={3}
        className="md:col-span-6 lg:col-span-8"
        bodyClassName="gap-4"
      >
        <p className="max-w-[70ch] text-sm leading-relaxed text-muted">{t("converter.intro")}</p>
        <Converter />
      </Card>
      <Card id="how" icon={BookOpen} title={t("how.title")} subtitle="man sens" index={4} className="md:col-span-6 lg:col-span-4" bodyClassName="gap-4">
        <p className="text-sm leading-relaxed text-muted">{t("how.text")}</p>
        <div className="terminal px-4 py-3.5 text-[12.5px]">
          <p className="label mb-1.5">{t("how.formula")}</p>
          <p className="text-fg">cm/360 = (360 × 2.54) / (DPI × sens × yaw)</p>
          <p className="text-fg">sens₂ = (360 × 2.54) / (DPI₂ × cm/360 × yaw₂)</p>
          <p className="mt-1.5 text-dim">eDPI = DPI × sens</p>
        </div>
        <div>
          <p className="label mb-2">{t("how.yaw")}</p>
          <dl className="stagger flex flex-col gap-1">
            {GAME_KEYS.map((k) => (
              <div key={k} className="tile flex items-center justify-between px-3.5 py-2 text-sm">
                <dt>{GAMES[k].name}</dt>
                <dd className="font-mono text-[13px] text-muted">{GAMES[k].yaw}</dd>
              </div>
            ))}
          </dl>
        </div>
        <p className="text-xs text-dim">{t("how.note")}</p>
      </Card>
    </>
  );
}

/* ─── Tutos IT : les PDF ─── */

function GuidesList() {
  const t = useTranslations("career.docs");
  return (
    <Card id="guides" icon={FileText} title={t("title")} subtitle="ls ~/docs/*.pdf" meta={t("meta", { count: DOCS.length })} index={3} className="md:col-span-6 lg:col-span-12">
      <p className="mb-3 text-sm text-muted">{t("intro")}</p>
      <ul className="stagger grid gap-1.5 lg:grid-cols-2">
        {DOCS.map((d) => (
          <li key={d.id}>
            <a href={d.file} download className="group flex items-center gap-3 rounded-[14px] bg-surface-2 px-3.5 py-2.5 transition-colors hover:bg-surface-3">
              <FileText size={16} aria-hidden="true" className="shrink-0 text-muted group-hover:text-accent" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold">{t(`items.${d.id}.title`)}</span>
                <span className="block truncate text-xs text-dim">{t(`items.${d.id}.desc`)}</span>
              </span>
              <span className="hidden text-[12px] text-dim sm:inline">
                {t(`categories.${d.category}`)} · {t("pages", { count: d.pages })}
              </span>
              <Download size={15} aria-hidden="true" className="shrink-0 text-dim group-hover:text-accent" />
              <span className="sr-only">{t("downloadLabel", { count: d.pages })}</span>
            </a>
          </li>
        ))}
      </ul>
    </Card>
  );
}

/* ─── Projet suivant ─── */

function NextProject({ project }: { project: Project }) {
  const t = useTranslations("projects");
  const next = nextProject(project.id);
  return (
    <Link href={`/projects/${next.slug}`} className="card group group-start md:col-span-6 lg:col-span-12" style={{ "--i": 5 } as CSSProperties}>
      <span className="label">{t("next")}</span>
      <span className="mt-3 flex items-end justify-between gap-6">
        <span className="display text-[44px] text-fg sm:text-[64px]">{t(`items.${next.id}.name`)}</span>
        <span className="mb-2 hidden items-center gap-3 text-right text-[14px] text-muted sm:flex">
          {t(`items.${next.id}.tagline`)}
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-surface-2 text-fg transition-[transform,background-color,color] duration-500 ease-[var(--ease-spring)] group-hover:rotate-45 group-hover:bg-accent-strong group-hover:text-on-accent">
            <ArrowUpRight size={18} aria-hidden="true" />
          </span>
        </span>
      </span>
    </Link>
  );
}
