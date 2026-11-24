// src/app/[locale]/not-found.tsx — 404 in the site's design: a huge outlined 404, one line, two ways out.
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Words } from "@/components/ui/words";
import { ButtonLink } from "@/components/ui/primitives";

export default function NotFound() {
  const t = useTranslations("notFound");
  return (
    <div className="page">
      <header className="page-head flex min-h-[60svh] flex-col justify-center">
        <p className="label">
          <span className="text-accent">404</span> / {t("title")}
        </p>
        <h1 className="display mt-6 text-[clamp(120px,26vw,380px)] leading-[0.8] text-transparent [-webkit-text-stroke:1px_var(--text-muted)]">
          <Words text="404" mode="load" />
        </h1>
        <p className="lead mt-8 max-w-[44ch]">{t("text")}</p>
        <div className="mt-9 flex flex-wrap gap-3">
          <ButtonLink href="/" variant="primary">
            {t("home")}
            <ArrowRight size={15} aria-hidden="true" />
          </ButtonLink>
          <ButtonLink href="/projects" variant="tonal">
            {t("projects")}
          </ButtonLink>
        </div>
      </header>
    </div>
  );
}
