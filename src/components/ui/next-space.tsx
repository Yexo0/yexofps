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
      className="group inline-flex items-center gap-2.5 rounded-full py-1 pr-2 text-sm font-semibold text-accent"
      aria-label={t("goToSpace", { n, name })}
    >
      <span
        className="grid h-6 w-6 place-items-center rounded-full bg-accent-tint font-mono text-[11px] font-medium text-accent"
        aria-hidden="true"
      >
        {n}
      </span>
      <span>{name}</span>
      <ArrowRight
        size={16}
        aria-hidden="true"
        className="transition-transform duration-150 group-hover:translate-x-0.5"
      />
    </Link>
  );
}
