// src/app/[locale]/projects/[slug]/page.tsx — One project: name, one line, facts (year, status, type,
// tools, links), the plate (morphs from the grid), what it does, key points, captures, then the next
// project. Some projects carry their real tool: the sensitivity converter runs here, the IT guides
// download here.
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft, ArrowUpRight, Download, FileText } from "lucide-react";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { PROJECTS, nextProject, projectBySlug, type Project } from "@/config/projects";
import { DOCS } from "@/config/career";
import { GAMES, GAME_KEYS } from "@/lib/converter-math";
import { pageMetadata } from "@/lib/metadata";
import { Words } from "@/components/ui/words";
import { Reveal, Section } from "@/components/ui/section";
import { ButtonLink, ExternalButton } from "@/components/ui/primitives";
import { GitHubIcon } from "@/components/icons/brands";
import { ProjectCover } from "@/components/projects/project-cover";
import { ProjectStatus } from "@/components/projects/project-card";
import { LoopVideo } from "@/components/projects/loop-video";
import { Converter } from "@/components/projects/converter";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => PROJECTS.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = projectBySlug(slug);
  if (!project) return {};
  const t = await getTranslations({ locale, namespace: "projects.items" });
  return pageMetadata({
    locale,
    path: `/projects/${slug}`,
    title: t(`${project.id}.name`),
    description: t(`${project.id}.tagline`),
  });
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
  const n = String(PROJECTS.indexOf(project) + 1).padStart(2, "0");
  const highlights = tItem.raw("highlights") as string[];

  return (
    <div className="page">
      <header className="page-head">
        <Link href="/projects" className="group label inline-flex items-center gap-3 hover:text-fg">
          <ArrowLeft size={14} aria-hidden="true" className="transition-transform duration-500 [transition-timing-function:var(--ease-out)] group-hover:-translate-x-1" />
          <span className="link-line">{t("back")}</span>
        </Link>
        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="min-w-0 lg:col-span-8">
            <p className="label">
              <span className="text-accent">{n}</span> / {tItem("kind")}
            </p>
            <h1 className="display t-h1 mt-5 text-fg">
              <Words text={tItem("name")} mode="load" />
            </h1>
            <p className="lead stagger mt-7 max-w-[40ch]">
              <span>{tItem("tagline")}</span>
            </p>
          </div>
          <Facts project={project} />
        </div>
      </header>

      <div data-reveal="" className="-mt-[calc(var(--section-gap)/2)]">
        <ProjectCover project={project} priority sizes="(min-width: 1520px) 1408px, 100vw" className="!aspect-[16/9]" />
      </div>

      <Section id="about" index="01" title={t("about")}>
        <div className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-6">
            <p className="text-[19px] leading-relaxed text-fg sm:text-[21px]">{tItem("summary")}</p>
          </Reveal>
          <Reveal i={1} className="lg:col-span-5 lg:col-start-8">
            <ol className="stagger flex flex-col">
              {highlights.map((h, i) => (
                <li key={h} className="flex gap-5 border-t border-line py-4">
                  <span className="font-mono text-[11px] text-accent">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-[15px] leading-relaxed text-muted">{h}</span>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </Section>

      {project.id === "sens" && <SensTool />}
      {project.id === "guides" && <GuidesList />}
      {project.gallery && <Gallery project={project} />}

      <NextProject project={project} />
    </div>
  );
}

/* ─── Facts: year, status, type, tools, links ─── */

function Facts({ project }: { project: Project }) {
  const t = useTranslations("projects.labels");
  const tNav = useTranslations("nav.spaces");
  const related = project.related;
  return (
    <dl className="stagger grid grid-cols-2 gap-x-6 gap-y-5 text-[14px] lg:col-span-4">
      <div className="border-t border-line pt-3">
        <dt className="label">{t("year")}</dt>
        <dd className="mt-1.5 text-fg">{project.year}</dd>
      </div>
      <div className="border-t border-line pt-3">
        <dt className="label">{t("status")}</dt>
        <dd className="mt-1.5">
          <ProjectStatus status={project.status} className="!text-[12px] !tracking-[0.06em] text-fg" />
        </dd>
      </div>
      {project.stack.length > 0 && (
        <div className="col-span-2 border-t border-line pt-3">
          <dt className="label">{t("stack")}</dt>
          <dd className="mt-2 flex flex-wrap gap-1.5">
            {project.stack.map((s) => (
              <span key={s} className="tag">
                {s}
              </span>
            ))}
          </dd>
        </div>
      )}
      {(project.repo || related) && (
        <div className="col-span-2 flex flex-wrap gap-3 border-t border-line pt-4">
          {project.repo && (
            <ExternalButton href={project.repo} size="sm" variant="tonal" showIcon>
              <GitHubIcon size={14} />
              {t("source")}
            </ExternalButton>
          )}
          {related && (
            <ButtonLink href={`${related}${project.relatedHash ?? ""}`} size="sm" variant="primary">
              {t("related", { space: related === "/lab/site" ? t("site") : tNav(related === "/lab" ? "lab" : "career") })}
              <ArrowUpRight size={14} aria-hidden="true" />
            </ButtonLink>
          )}
        </div>
      )}
    </dl>
  );
}

/* ─── Captures ─── */

function Gallery({ project }: { project: Project }) {
  const t = useTranslations("projects");
  const media = project.gallery ?? [];
  const portrait = media.every((m) => m.height > m.width);
  return (
    <Section id="captures" index="02" title={t("gallery")}>
      <div className={portrait ? "grid gap-5 sm:grid-cols-3" : "grid gap-5 lg:grid-cols-12"}>
        {media.map((m, i) => {
          const wide = m.width / m.height > 2;
          return (
            <Reveal key={m.src} i={i} className={portrait ? undefined : wide ? "lg:col-span-12" : "lg:col-span-7"}>
              <div className="media-frame border border-line" style={{ aspectRatio: `${m.width} / ${m.height}` }}>
                {m.type === "video" ? (
                  <LoopVideo src={m.src} poster={m.poster} label={t("captureLabel", { name: t(`items.${project.id}.name`) })} />
                ) : (
                  <Image src={m.src} alt={t("captureLabel", { name: t(`items.${project.id}.name`) })} width={m.width} height={m.height} sizes="(min-width: 1024px) 80vw, 100vw" className="h-full w-full object-cover" />
                )}
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}

/* ─── Sensitivity converter: the tool itself ─── */

function SensTool() {
  const t = useTranslations("converter");
  return (
    <Section id="converter" index="02" title={t("title")} intro={t("intro")}>
      <Reveal>
        <Converter />
      </Reveal>
      <Reveal i={1} className="mt-12 grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <p className="label mb-3">{t("how.formula")}</p>
          <div className="terminal px-5 py-4">
            <p className="text-fg">cm/360 = (360 × 2.54) / (DPI × sens × yaw)</p>
            <p className="text-fg">sens₂ = (360 × 2.54) / (DPI₂ × cm/360 × yaw₂)</p>
            <p className="mt-1.5 text-dim">eDPI = DPI × sens</p>
          </div>
          <p className="mt-4 max-w-[60ch] text-[14px] leading-relaxed text-muted">{t("how.text")}</p>
        </div>
        <dl className="grid grid-cols-2 content-start gap-x-6 lg:col-span-5 lg:col-start-8">
          <p className="label col-span-2 mb-1">{t("how.yaw")}</p>
          {GAME_KEYS.map((k) => (
            <div key={k} className="flex items-baseline justify-between border-t border-line py-2.5 text-[14px]">
              <dt>{GAMES[k].name}</dt>
              <dd className="font-mono text-[13px] text-muted">{GAMES[k].yaw}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </Section>
  );
}

/* ─── IT guides: the PDFs ─── */

function GuidesList() {
  const t = useTranslations("career.docs");
  const tProjects = useTranslations("projects");
  return (
    <Section id="guides" index="02" title={tProjects("guides")}>
      <Reveal>
        <ul className="stagger grid gap-x-8 lg:grid-cols-2">
          {DOCS.map((d) => (
            <li key={d.id}>
              <a href={d.file} download className="group flex items-center gap-4 border-t border-line py-4 transition-colors hover:text-fg">
                <FileText size={16} aria-hidden="true" className="shrink-0 text-dim transition-colors group-hover:text-accent" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15px] font-medium text-fg">{t(`items.${d.id}.title`)}</span>
                  <span className="block truncate text-[13px] text-dim">{t(`items.${d.id}.desc`)}</span>
                </span>
                <span className="hidden font-mono text-[11px] text-dim sm:inline">
                  {t(`categories.${d.category}`)} · {t("pages", { count: d.pages })}
                </span>
                <Download size={15} aria-hidden="true" className="shrink-0 text-dim transition-transform duration-300 group-hover:translate-y-0.5 group-hover:text-accent" />
                <span className="sr-only">{t("downloadLabel", { count: d.pages })}</span>
              </a>
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}

/* ─── Next project ─── */

function NextProject({ project }: { project: Project }) {
  const t = useTranslations("projects");
  const next = nextProject(project.id);
  return (
    <Reveal>
      <Link href={`/projects/${next.slug}`} className="group block border-t border-line-strong pt-8">
        <p className="label">{t("next")}</p>
        <div className="mt-5 flex items-end justify-between gap-6">
          <span className="display t-h1 index-title text-fg transition-colors duration-500 group-hover:text-accent">{t(`items.${next.id}.name`)}</span>
          <span className="mb-3 hidden max-w-[36ch] items-center gap-3 text-right text-[14px] text-muted sm:flex">
            {t(`items.${next.id}.tagline`)}
            <ArrowUpRight size={18} aria-hidden="true" className="shrink-0 text-fg transition-transform duration-500 [transition-timing-function:var(--ease-out)] group-hover:rotate-45" />
          </span>
        </div>
      </Link>
    </Reveal>
  );
}
