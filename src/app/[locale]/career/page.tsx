// src/app/[locale]/career/page.tsx — 02 Parcours : identité pro, frise, compétences, missions, infra BTS, veille, tutos.
import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  Boxes,
  Briefcase,
  ClipboardList,
  Code,
  Download,
  FileText,
  FolderTree,
  GitCommitHorizontal,
  Headphones,
  Mail,
  Network,
  Newspaper,
  Sparkles,
  SquareTerminal,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { BTS_MAP, DOCS, MISSIONS, SKILLS, TIMELINE } from "@/config/career";
import { LAB_SINCE } from "@/config/lab";
import { EMAILS } from "@/config/site";
import { pageMetadata } from "@/lib/metadata";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { NextSpace } from "@/components/ui/next-space";
import { Accordion } from "@/components/ui/accordion";
import { CopyButton } from "@/components/ui/copy-button";
import { StatTile, buttonClass } from "@/components/ui/primitives";
import { MissionTabs, type Mission } from "@/components/career/mission-tabs";
import { NetworkMap } from "@/components/network-map/network-map";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.career" });
  return pageMetadata({ locale, path: "/career", title: t("title"), description: t("description") });
}

export default async function CareerPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="bento">
      <Intro />
      <Elsewhere />
      <Timeline />
      <Skills />
      <Missions />
      <InfraBts />
      <Watch />
      <Docs />
    </div>
  );
}

/* ─── Identité pro ─── */

function Intro() {
  const t = useTranslations("career.intro");
  return (
    <Card
      id="intro"
      icon={Briefcase}
      title="Baptiste Dauvergne"
      subtitle="~/parcours"
      meta={t("meta")}
      headingLevel={1}
      index={0}
      className="md:col-span-6 lg:col-span-8"
      bodyClassName="gap-6"
    >
      <div>
        <p className="max-w-[30ch] text-[24px] font-bold leading-tight tracking-tight sm:text-[28px]">{t("role")}</p>
        <p className="mt-2 font-mono text-[12.5px] text-muted">{t("school")}</p>
      </div>
      <div className="prose-card max-w-[72ch] text-[15px] leading-relaxed text-muted">
        <p>{t("p1")}</p>
        <p>{t("p2")}</p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <StatTile value={MISSIONS.length} label={t("stats.missions")} />
        <StatTile value={DOCS.length} unit="PDF" label={t("stats.docs")} />
        <StatTile value={LAB_SINCE} label={t("stats.homelab")} />
      </div>
      <div className="flex flex-wrap items-center gap-2.5">
        <a href={`mailto:${EMAILS.pro}`} className={buttonClass("primary")}>
          <Mail size={16} aria-hidden="true" />
          {t("email")}
        </a>
        <CopyButton value={EMAILS.pro} label={t("emailLabel")} />
      </div>
    </Card>
  );
}

/* ─── Hors poste ─── */

function Elsewhere() {
  const t = useTranslations("career.elsewhere");
  const items = [
    { id: "content", icon: Sparkles },
    { id: "watch", icon: Newspaper },
    { id: "homelab", icon: Wrench },
  ] as const;
  return (
    <Card
      id="elsewhere"
      icon={Sparkles}
      title={t("title")}
      subtitle="cat ~/.plan"
      index={1}
      className="md:col-span-6 lg:col-span-4"
      bodyClassName="gap-2"
    >
      {items.map(({ id, icon: Icon }) => (
        <div key={id} className="tile flex gap-3 px-4 py-3.5">
          <Icon size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-accent" />
          <div>
            <p className="text-sm font-semibold">{t(`${id}.title`)}</p>
            <p className="mt-1 text-[13px] leading-relaxed text-muted">{t(`${id}.text`)}</p>
          </div>
        </div>
      ))}
    </Card>
  );
}

/* ─── Frise ─── */

function Timeline() {
  const t = useTranslations("career.timeline");
  return (
    <Card
      id="timeline"
      icon={GitCommitHorizontal}
      title={t("title")}
      subtitle="git log --oneline ~/parcours"
      meta={t("meta", { count: TIMELINE.length })}
      index={2}
      className="md:col-span-6 lg:col-span-7"
    >
      <ol className="relative flex flex-col gap-5 pl-6 before:absolute before:bottom-2 before:left-[5px] before:top-2 before:w-px before:bg-line-strong">
        {TIMELINE.map((item) => {
          const hasItems = t.has(`items.${item.id}.items`);
          const hasTags = t.has(`items.${item.id}.tags`);
          return (
            <li key={item.id} className="relative">
              <span
                aria-hidden="true"
                className={cn(
                  "absolute -left-6 top-1.5 h-[11px] w-[11px] rounded-full ring-4 ring-[var(--surface-solid)]",
                  item.current ? "bg-accent" : "bg-surface-hover",
                )}
              />
              <p className="flex flex-wrap items-center gap-2 font-mono text-[11.5px] text-dim">
                {t(`items.${item.id}.date`)}
                {item.current && <span className="tag border-accent/40 text-accent">{t("current")}</span>}
              </p>
              <h3 className="mt-1 text-[15px] font-bold leading-snug">{t(`items.${item.id}.title`)}</h3>
              <p className="text-[13px] text-muted">{t(`items.${item.id}.place`)}</p>
              {t.has(`items.${item.id}.text`) && (
                <p className="mt-2 max-w-[70ch] text-[13px] leading-relaxed text-muted">{t(`items.${item.id}.text`)}</p>
              )}
              {hasItems && (
                <ul className="mt-2 flex flex-col gap-1 text-[13px] text-muted">
                  {(t.raw(`items.${item.id}.items`) as string[]).map((line) => (
                    <li key={line} className="flex gap-2">
                      <span aria-hidden="true" className="text-dim">
                        ›
                      </span>
                      {line}
                    </li>
                  ))}
                </ul>
              )}
              {hasTags && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {(t.raw(`items.${item.id}.tags`) as string[]).map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              {item.anchor && (
                <a href={item.anchor} className="mt-2 inline-block text-[13px] font-semibold text-accent">
                  {t("seeMissions")}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </Card>
  );
}

/* ─── Compétences ─── */

const SKILL_ICONS: Record<(typeof SKILLS)[number]["icon"], LucideIcon> = {
  headphones: Headphones,
  directory: FolderTree,
  boxes: Boxes,
  network: Network,
  terminal: SquareTerminal,
  clipboard: ClipboardList,
  code: Code,
  users: Users,
};

function Skills() {
  const t = useTranslations("career.skills");
  return (
    <Card
      id="skills"
      icon={Wrench}
      title={t("title")}
      subtitle="ls ~/skills"
      meta={t("meta", { count: SKILLS.length })}
      index={3}
      className="md:col-span-6 lg:col-span-5"
    >
      <Accordion
        defaultOpen={SKILLS[0].id}
        items={SKILLS.map((s) => {
          const Icon = SKILL_ICONS[s.icon];
          return {
            id: s.id,
            title: t(`items.${s.id}.title`),
            icon: <Icon size={15} />,
            content: (
              <>
                <p>{t(`items.${s.id}.text`)}</p>
                {s.tags.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {s.tags.map((tag) => (
                      <span key={tag} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </>
            ),
          };
        })}
      />
    </Card>
  );
}

/* ─── Missions ─── */

function Missions() {
  const t = useTranslations("career.missions");
  const missions: Mission[] = MISSIONS.map((id) => ({
    id,
    tab: t(`items.${id}.tab`),
    title: t(`items.${id}.title`),
    intro: t(`items.${id}.intro`),
    missionLabel: t(`items.${id}.missionLabel`),
    mission: t(`items.${id}.mission`),
    context: t(`items.${id}.context`),
    objective: t(`items.${id}.objective`),
    role: t(`items.${id}.role`),
    actions: t.raw(`items.${id}.actions`) as string[],
    proofTitle: t(`items.${id}.proofTitle`),
    proofText: t(`items.${id}.proofText`),
    impacts: t.raw(`items.${id}.impacts`) as Mission["impacts"],
    tags: t.raw(`items.${id}.tags`) as string[],
  }));

  return (
    <Card
      id="missions"
      icon={ClipboardList}
      title={t("title")}
      subtitle="cat ~/stage/missions/*.md"
      meta={t("meta", { count: MISSIONS.length })}
      index={4}
      className="md:col-span-6 lg:col-span-12"
    >
      <MissionTabs
        missions={missions}
        labels={{
          tabs: t("title"),
          context: t("labels.context"),
          objective: t("labels.objective"),
          role: t("labels.role"),
          actions: t("labels.actions"),
        }}
      />
    </Card>
  );
}

/* ─── Schéma du réseau BTS ─── */

function InfraBts() {
  const t = useTranslations("career.infra");
  return (
    <Card
      id="infra"
      icon={Network}
      title={t("title")}
      subtitle="nmap -sn 192.168.0.0/16"
      meta={t("meta", { count: BTS_MAP.nodes.length })}
      index={5}
      className="md:col-span-6 lg:col-span-12"
      bodyClassName="gap-4"
    >
      <p className="max-w-[80ch] text-sm leading-relaxed text-muted">{t("intro")}</p>
      <NetworkMap
        width={BTS_MAP.width}
        height={BTS_MAP.height}
        nodes={BTS_MAP.nodes.map((n) => ({
          ...n,
          label: t(`nodes.${n.id}.label`),
          sub: t(`nodes.${n.id}.sub`),
        }))}
        links={[...BTS_MAP.links]}
        groups={BTS_MAP.groups.map((g) => ({ ...g, label: t(`groups.${g.id}`) }))}
        details={Object.fromEntries(
          BTS_MAP.nodes.map((n) => [
            n.id,
            {
              role: t(`nodes.${n.id}.role`),
              tags: t.has(`nodes.${n.id}.tags`) ? (t.raw(`nodes.${n.id}.tags`) as string[]) : undefined,
            },
          ]),
        )}
        labels={{ title: t("title"), hint: t("hint"), related: t("related"), ungrouped: t("ungrouped") }}
      />
    </Card>
  );
}

/* ─── Veille ─── */

function Watch() {
  const t = useTranslations("career.watch");
  const lists = [
    { id: "vmware", key: "benefits" },
    { id: "today", key: "features" },
  ] as const;
  return (
    <Card
      id="watch"
      icon={Newspaper}
      title={t("title")}
      subtitle="rss --topic virtualisation"
      meta="VMware"
      index={6}
      className="md:col-span-6 lg:col-span-7"
      bodyClassName="gap-3"
    >
      <p className="text-[15px] font-semibold">{t("topic")}</p>
      <div className="grid gap-2 sm:grid-cols-2">
        <section className="tile px-4 py-3.5">
          <h3 className="label mb-1.5">{t("sections.before.title")}</h3>
          <p className="text-[13px] leading-relaxed text-muted">{t("sections.before.text")}</p>
        </section>
        {lists.map(({ id, key }) => (
          <section key={id} className="tile px-4 py-3.5">
            <h3 className="label mb-1.5">{t(`sections.${id}.title`)}</h3>
            <p className="text-[13px] leading-relaxed text-muted">{t(`sections.${id}.text`)}</p>
            <ul className="mt-2 flex flex-col gap-1 text-[13px] text-muted">
              {(t.raw(`sections.${id}.${key}`) as string[]).map((line) => (
                <li key={line} className="flex gap-2">
                  <span aria-hidden="true" className="text-accent">
                    ›
                  </span>
                  {line}
                </li>
              ))}
            </ul>
          </section>
        ))}
        <section className="tile bg-accent-tint px-4 py-3.5">
          <h3 className="label mb-1.5 text-accent">{t("sections.broadcom.title")}</h3>
          <p className="text-[13px] leading-relaxed text-fg">{t("sections.broadcom.text")}</p>
        </section>
      </div>
      <section className="tile px-4 py-3.5">
        <h3 className="label mb-1.5">{t("sections.why.title")}</h3>
        <ul className="grid gap-1 text-[13px] text-muted sm:grid-cols-2">
          {(t.raw("sections.why.points") as string[]).map((line) => (
            <li key={line} className="flex gap-2">
              <span aria-hidden="true" className="text-accent">
                ›
              </span>
              {line}
            </li>
          ))}
        </ul>
      </section>
      <p className="font-mono text-[11px] text-dim">{t("sources")}</p>
    </Card>
  );
}

/* ─── Tutos PDF ─── */

function Docs() {
  const t = useTranslations("career.docs");
  return (
    <Card
      id="docs"
      icon={FileText}
      title={t("title")}
      subtitle="ls ~/docs/*.pdf"
      meta={t("meta", { count: DOCS.length })}
      index={7}
      className="md:col-span-6 lg:col-span-5"
    >
      <p className="mb-3 text-sm text-muted">{t("intro")}</p>
      <ul className="flex flex-col gap-1.5">
        {DOCS.map((d) => (
          <li key={d.id}>
            <a
              href={d.file}
              download
              className="group flex items-center gap-3 rounded-[14px] bg-surface-2 px-3.5 py-2.5 transition-colors hover:bg-surface-3"
            >
              <FileText size={16} aria-hidden="true" className="shrink-0 text-muted group-hover:text-accent" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold">{t(`items.${d.id}.title`)}</span>
                <span className="block truncate text-xs text-dim">{t(`items.${d.id}.desc`)}</span>
              </span>
              <span className="hidden font-mono text-[11px] text-dim sm:inline">
                {t(`categories.${d.category}`)} · {t("pages", { count: d.pages })}
              </span>
              <Download size={15} aria-hidden="true" className="shrink-0 text-dim group-hover:text-accent" />
              <span className="sr-only">{t("downloadLabel", { count: d.pages })}</span>
            </a>
          </li>
        ))}
      </ul>
      <div className="mt-6">
        <NextSpace to="lab" />
      </div>
    </Card>
  );
}
