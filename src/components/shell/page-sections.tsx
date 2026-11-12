// src/components/shell/page-sections.tsx — Construit la nav "sur cette page" d'un espace à partir des messages.
import { useTranslations } from "next-intl";
import { SectionNav } from "./section-nav";

type Page = "career" | "lab" | "gaming" | "creator";

/** Ids des cartes, dans l'ordre de la page (libellés : messages sectionNav.<page>.<id>) */
const SECTIONS: Record<Page, string[]> = {
  career: ["intro", "timeline", "skills", "missions", "infra", "watch", "docs"],
  lab: ["overview", "map", "vlans", "resources", "machines"],
  gaming: ["ranks", "tracker", "matches", "setup"],
  creator: ["bio", "partners", "history", "edits", "reviews", "services", "order"],
};

export function PageSections({ page }: { page: Page }) {
  const t = useTranslations("sectionNav");
  return <SectionNav label={t("label")} items={SECTIONS[page].map((id) => ({ id, label: t(`${page}.${id}`) }))} />;
}
