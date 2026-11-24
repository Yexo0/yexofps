// src/app/[locale]/lab/site/page.tsx — "Ce site" : comment yexofps.org est hébergé sur mon VPS.
// Chiffres en direct lus sur le serveur (components/hosting/live), chemin d'une requête et pile
// technique (versions tirées de package.json au build). Rattachée à l'espace 03 Lab.
import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft, Globe, Layers, Route, Server } from "lucide-react";
import pkg from "../../../../../package.json";
import { pageMetadata } from "@/lib/metadata";
import { Card } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/primitives";
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
    { id: "i18n", value: `next-intl ${version("next-intl")}` },
    { id: "fonts", value: t("stack.fontsValue") },
    { id: "data", value: t("stack.dataValue") },
    { id: "tracking", value: t("stack.trackingValue") },
  ];

  return (
    <div className="bento">
      <Card
        id="site"
        icon={Globe}
        title={t("title")}
        subtitle="curl -I https://yexofps.org"
        meta={t("meta")}
        headingLevel={1}
        index={0}
        className="md:col-span-6 lg:col-span-12"
        bodyClassName="gap-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="max-w-[70ch] text-[15px] leading-relaxed text-muted">{t("intro")}</p>
          <ButtonLink href="/lab" variant="ghost" size="sm">
            <ArrowLeft size={14} aria-hidden="true" />
            {t("back")}
          </ButtonLink>
        </div>
        <LiveTiles />
      </Card>

      <Card
        id="path"
        icon={Route}
        title={t("path.title")}
        subtitle="traceroute yexofps.org"
        index={1}
        className="md:col-span-6 lg:col-span-12"
      >
        <RequestPath nextVersion={version("next")} />
      </Card>

      <Card
        id="server"
        icon={Server}
        title={t("server.title")}
        subtitle="uname -o && free -h"
        meta={t("meta")}
        index={2}
        className="md:col-span-6 lg:col-span-6"
      >
        <ServerSpecs />
      </Card>

      <Card
        id="stack"
        icon={Layers}
        title={t("stack.title")}
        subtitle="cat package.json"
        index={3}
        next="gaming"
        className="md:col-span-6 lg:col-span-6"
      >
        <dl className="stagger flex flex-col gap-1">
          {stack.map((row) => (
            <div key={row.id} className="flex items-center justify-between gap-4 rounded-xl px-3 py-2.5 hover:bg-surface-2">
              <dt className="shrink-0 text-[13px] text-muted">{t(`stack.${row.id}`)}</dt>
              <dd className="text-right font-mono text-[12.5px] text-fg">{row.value}</dd>
            </div>
          ))}
        </dl>
      </Card>
    </div>
  );
}
