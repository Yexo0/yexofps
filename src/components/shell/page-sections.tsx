// src/components/shell/page-sections.tsx — Builds a space's "On this page" bar from the messages.
import { useTranslations } from "next-intl";
import { SectionNav } from "./section-nav";

type Page = "career" | "lab" | "gaming" | "creator";

/** Section ids, in page order (labels: messages sectionNav.<page>.<id>) */
const SECTIONS: Record<Page, string[]> = {
  career: ["timeline", "skills", "missions", "infra", "watch"],
  lab: ["map", "vlans", "machines"],
  gaming: ["ranks", "tracker", "settings", "setup"],
  creator: ["edits", "partners", "services", "reviews"],
};

export function PageSections({ page }: { page: Page }) {
  const t = useTranslations("sectionNav");
  return <SectionNav label={t("label")} items={SECTIONS[page].map((id) => ({ id, label: t(`${page}.${id}`) }))} />;
}
