// src/app/[locale]/career/page.tsx — 03 Career: role and school, timeline, skills, internship
// assignments, the BTS training network, tech watch. The PDF guides live on their project page.
import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Mail } from "lucide-react";
import { BTS_MAP, BTS_SCENARIOS, DOCS, MISSIONS, SKILLS, TIMELINE } from "@/config/career";
import { LAB_SINCE } from "@/config/lab";
import { EMAILS } from "@/config/site";
import { pageMetadata } from "@/lib/metadata";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal, Section } from "@/components/ui/section";
import { PageSections } from "@/components/shell/page-sections";
import { CopyButton } from "@/components/ui/copy-button";
import { ArrowLink, buttonClass } from "@/components/ui/primitives";
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
  return <Career />;
}

function Career() {
  const t = useTranslations("career.intro");
  return (
    <div className="page">
      <PageHeader
        space="career"
        eyebrow={t("eyebrow")}
        title={t("title")}
        lead={
          <>
            <p>
              <strong>{t("role")}</strong> {t("lead")}
            </p>
          </>
        }
        actions={
          <>
            <a href={`mailto:${EMAILS.pro}`} className={buttonClass("primary")}>
              <Mail size={15} aria-hidden="true" />
              {t("email")}
            </a>
            <CopyButton value={EMAILS.pro} label={t("emailLabel")} />
          </>
        }
        aside={<Facts />}
      />
      <PageSections page="career" />
      <Timeline />
      <Skills />
      <Missions />
      <InfraBts />
      <Watch />
    </div>
  );
}

/* ─── Key facts next to the title ─── */

function Facts() {
  const t = useTranslations("career.intro.facts");
  const facts = [
    { value: String(MISSIONS.length), label: t("missions"), href: "#missions" },
    { value: String(DOCS.length), label: t("docs"), href: "/projects/it-guides" },
    { value: String(LAB_SINCE), label: t("homelab"), href: "/lab" },
  ];
  return (
    <dl className="stagger grid grid-cols-3 gap-4 lg:grid-cols-1 lg:gap-0">
      {facts.map((f) => (
        <div key={f.label} className="flex flex-col-reverse border-t border-line py-3 lg:flex-row-reverse lg:items-baseline lg:justify-between">
          <dt className="label mt-1">
            <ArrowLink href={f.href} className="!text-[11px] !font-normal !text-dim">
              {f.label}
            </ArrowLink>
          </dt>
          <dd className="display text-[40px] text-fg lg:text-[44px]">{f.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/* ─── Timeline ─── */

function Timeline() {
  const t = useTranslations("career.timeline");
  return (
    <Section id="timeline" index="01" title={t("title")}>
      <ol>
        {TIMELINE.map((item, i) => (
          <li
            key={item.id}
            data-reveal=""
            style={{ "--i": i % 3 } as CSSProperties}
            className="grid gap-3 border-t border-line py-7 sm:grid-cols-[180px_1fr] lg:grid-cols-[220px_minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-8"
          >
            <p className="flex items-center gap-2 font-mono text-[12px] text-dim">
              {item.current && <span aria-hidden="true" className="live-dot h-1.5 w-1.5 rounded-full bg-accent-vivid text-accent-vivid" />}
              {t(`items.${item.id}.date`)}
            </p>
            <div>
              <h3 className="display text-[28px] leading-[0.95] text-fg sm:text-[36px]">{t(`items.${item.id}.title`)}</h3>
              <p className="mt-2 text-[14px] text-muted">{t(`items.${item.id}.place`)}</p>
            </div>
            {t.has(`items.${item.id}.text`) && (
              <p className="text-[14px] leading-relaxed text-muted sm:col-start-2 lg:col-start-auto">
                {t(`items.${item.id}.text`)}
                {item.anchor && (
                  <>
                    {" "}
                    <a href={item.anchor} className="link-line text-fg">
                      {t("seeMissions")}
                    </a>
                  </>
                )}
              </p>
            )}
          </li>
        ))}
      </ol>
    </Section>
  );
}

/* ─── Skills: one line and the tools for each area ─── */

function Skills() {
  const t = useTranslations("career.skills");
  return (
    <Section id="skills" index="02" title={t("title")}>
      <ul className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
        {SKILLS.map((s, i) => (
          <li key={s.id} data-reveal="" style={{ "--i": i % 4 } as CSSProperties} className="flex flex-col gap-3 border-t border-line py-6">
            <span className="font-mono text-[11px] text-accent">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="text-[17px] font-semibold leading-snug text-fg">{t(`items.${s.id}.title`)}</h3>
            <p className="text-[14px] leading-relaxed text-muted">{t(`items.${s.id}.text`)}</p>
            {s.tags.length > 0 && (
              <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
                {s.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </Section>
  );
}

/* ─── Internship assignments ─── */

function Missions() {
  const t = useTranslations("career.missions");
  const missions: Mission[] = MISSIONS.map((id) => ({
    id,
    tab: t(`items.${id}.tab`),
    title: t(`items.${id}.title`),
    intro: t(`items.${id}.intro`),
    context: t(`items.${id}.context`),
    objective: t(`items.${id}.objective`),
    role: t(`items.${id}.role`),
    actions: t.raw(`items.${id}.actions`) as string[],
    tags: t.raw(`items.${id}.tags`) as string[],
  }));

  return (
    <Section id="missions" index="03" title={t("title")} intro={t("intro")}>
      <Reveal>
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
      </Reveal>
    </Section>
  );
}

/* ─── BTS training network ─── */

function InfraBts() {
  const t = useTranslations("career.infra");
  return (
    <Section id="infra" index="04" title={t("title")} intro={t("intro")}>
      <Reveal>
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
          labels={{
            title: t("title"),
            hint: t("hint"),
            related: t("related"),
            ungrouped: t("ungrouped"),
            trace: "traceroute",
            scenarios: { title: t("scenarios.title"), play: t("scenarios.play"), pause: t("scenarios.pause") },
          }}
          root="school"
          scenarios={BTS_SCENARIOS.map((s) => ({ id: s.id, label: t(`scenarios.items.${s.id}`), path: s.path }))}
        />
      </Reveal>
    </Section>
  );
}

/* ─── Tech watch: the topic in one line, the details folded ─── */

function Watch() {
  const t = useTranslations("career.watch");
  const lists = [
    { id: "vmware", key: "benefits" },
    { id: "today", key: "features" },
  ] as const;
  return (
    <Section id="watch" index="05" title={t("title")} intro={t("topic")}>
      <Reveal>
        <details className="watch-details group border-t border-line">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-[15px] font-medium text-fg">
            {t("more")}
            <span aria-hidden="true" className="grid h-9 w-9 place-items-center border border-line-strong text-[18px] leading-none transition-transform duration-500 [transition-timing-function:var(--ease-out)] group-open:rotate-45">
              +
            </span>
          </summary>
          <div className="grid gap-8 pb-8 pt-2 lg:grid-cols-2">
            <section>
              <h3 className="label mb-2">{t("sections.before.title")}</h3>
              <p className="text-[14px] leading-relaxed text-muted">{t("sections.before.text")}</p>
            </section>
            {lists.map(({ id, key }) => (
              <section key={id}>
                <h3 className="label mb-2">{t(`sections.${id}.title`)}</h3>
                <p className="text-[14px] leading-relaxed text-muted">{t(`sections.${id}.text`)}</p>
                <ul className="mt-3 flex flex-col gap-1.5 text-[14px] text-muted">
                  {(t.raw(`sections.${id}.${key}`) as string[]).map((line) => (
                    <li key={line} className="flex gap-2.5">
                      <span aria-hidden="true" className="text-accent">
                        —
                      </span>
                      {line}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
            <section className={cn("border-l-2 border-accent-vivid pl-4")}>
              <h3 className="label mb-2 text-fg">{t("sections.broadcom.title")}</h3>
              <p className="text-[14px] leading-relaxed text-fg">{t("sections.broadcom.text")}</p>
            </section>
            <p className="font-mono text-[11px] text-dim lg:col-span-2">{t("sources")}</p>
          </div>
        </details>
      </Reveal>
    </Section>
  );
}
