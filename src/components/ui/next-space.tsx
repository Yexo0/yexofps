// src/components/ui/next-space.tsx — Lien "espace suivant" : nom + flèche dans un rond qui devient rouge au survol.
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
      className="next-space group inline-flex items-center gap-3 py-1 text-[14.5px] font-semibold text-fg"
      aria-label={t("goToSpace", { n, name })}
    >
      <span>{name}</span>
      <span
        aria-hidden="true"
        className="grid h-7 w-7 place-items-center rounded-full bg-surface-2 transition-[background-color,color,transform] duration-300 ease-[var(--ease-out)] group-hover:translate-x-1 group-hover:bg-accent-strong group-hover:text-on-accent"
      >
        <ArrowRight size={15} />
      </span>
    </Link>
  );
}
