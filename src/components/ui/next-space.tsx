// src/components/ui/next-space.tsx — Lien "espace suivant" : numéro dans un rond + nom + flèche.
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getSpace, spaceIndex, type SpaceId } from "@/config/spaces";

export function NextSpace({ to, label }: { to: SpaceId; label?: string }) {
  const t = useTranslations("nav");
  const space = getSpace(to);
  const n = spaceIndex(to);
  const name = label ?? t(`spaces.${to}`);

  return (
    <Link
      href={space.href}
      className="next-space group inline-flex items-center gap-2.5 py-1 text-sm font-semibold text-fg"
      aria-label={t("goToSpace", { n, name })}
    >
      <span className="font-mono text-[11px] font-medium text-accent" aria-hidden="true">
        {String(n).padStart(2, "0")}
      </span>
      <span>{name}</span>
      <span className="nudge inline-flex" aria-hidden="true">
        <ArrowRight size={16} className="text-accent transition-transform duration-300 group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
