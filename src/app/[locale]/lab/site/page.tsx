// src/app/[locale]/lab/site/page.tsx — "This site": how yexofps.org is hosted on my VPS.
// Live figures read on the server (components/hosting/live), the path of a request and the stack
// (versions taken from package.json at build time). Belongs to the Lab space.
import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import pkg from "../../../../../package.json";
import { pageMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal, Section } from "@/components/ui/section";
import { ArrowLink } from "@/components/ui/primitives";
import { LiveTiles, RequestPath, ServerSpecs } from "@/components/hosting/live";

type Props = { params: Promise<{ locale: string }> };

const DEPS: Record<string, string> = { ...pkg.dependencies, ...pkg.devDependencies };
/** "^4.8.2" → "4.8" ; "^4" → "4" */
const version = (name: string) => DEPS[name]?.replace(/^[^\d]*/, "").split(".").slice(0, 2).join(".") ?? "";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.labSite" });
  return pageMetadata({ locale, path: "/lab/site", title: t("title"), description: t("description") });
}

export default async function SitePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Site />;
}

function Site() {
  const t = useTranslations("hosting");
  const stack = [
    { id: "framework", value: `Next.js ${version("next")} · React ${version("react")}` },
    { id: "language", value: `TypeScript ${version("typescript")}` },
    { id: "styles", value: `Tailwind CSS ${version("tailwindcss")} · Radix` },
    { id: "motion", value: `Motion ${version("motion")} · anime.js ${version("animejs")}` },
    { id: "i18n", value: `next-intl ${version("next-intl")}` },
    { id: "fonts", value: t("stack.fontsValue") },
    { id: "data", value: t("stack.dataValue") },
    { id: "tracking", value: t("stack.trackingValue") },
  ];

  return (
    <div className="page">
      <PageHeader
        space="lab"
        eyebrow={t("eyebrow")}
        title={t("title")}
        lead={<p>{t("intro")}</p>}
        actions={<ArrowLink href="/projects/yexofps-org">{t("project")}</ArrowLink>}
      />
      <Reveal>
        <LiveTiles />
      </Reveal>
      <Section id="path" index="01" title={t("path.title")}>
        <Reveal>
          <RequestPath nextVersion={version("next")} />
        </Reveal>
      </Section>
      <div className="grid gap-[var(--section-gap)] lg:grid-cols-2 lg:gap-12">
        <Section id="server" index="02" title={t("server.title")}>
          <Reveal>
            <ServerSpecs />
          </Reveal>
        </Section>
        <Section id="stack" index="03" title={t("stack.title")}>
          <Reveal>
            <dl className="stagger flex flex-col">
              {stack.map((row) => (
                <div key={row.id} className="flex items-baseline justify-between gap-4 border-t border-line py-3">
                  <dt className="shrink-0 text-[14px] text-muted">{t(`stack.${row.id}`)}</dt>
                  <dd className="text-right font-mono text-[12.5px] text-fg">{row.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </Section>
      </div>
    </div>
  );
}
