// src/app/[locale]/not-found.tsx — Page 404 dans le design du site.
import { useTranslations } from "next-intl";
import { SearchX } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/primitives";

export default function NotFound() {
  const t = useTranslations("notFound");
  return (
    <div className="bento">
      <Card
        icon={SearchX}
        title={t("title")}
        subtitle="ls: cannot access: No such file or directory"
        headingLevel={1}
        className="md:col-span-6 lg:col-span-8"
        bodyClassName="gap-5"
      >
        <p className="font-mono text-[64px] font-semibold leading-none text-accent">404</p>
        <p className="max-w-[60ch] text-[15px] leading-relaxed text-muted">{t("text")}</p>
        <div className="flex flex-wrap gap-2.5">
          <ButtonLink href="/" variant="primary">
            {t("home")}
          </ButtonLink>
          <ButtonLink href="/contact" variant="tonal">
            {t("contact")}
          </ButtonLink>
        </div>
      </Card>
    </div>
  );
}
