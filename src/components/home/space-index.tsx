// src/components/home/space-index.tsx — Bottom of the home pages: the other spaces as an editorial index.
// One row per space: number, name in the display face, one line, arrow. On hover a red line wipes
// across the row, the name slides right and the arrow turns.
import type { CSSProperties } from "react";
import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SPACES, type SpaceId } from "@/config/spaces";
import { Section } from "@/components/ui/section";

/** `order`: spaces to list, in this order (default: navigation order, without home) */
export function SpaceIndex({ order, index }: { order?: readonly SpaceId[]; index?: string }) {
  const t = useTranslations("home.explore");
  const tNav = useTranslations("nav.spaces");
  const spaces = order ? order.map((id) => SPACES.find((s) => s.id === id)!).filter(Boolean) : SPACES.filter((s) => s.id !== "home");

  return (
    <Section id="explore" index={index} title={t("title")}>
      <ul>
        {spaces.map((space, i) => {
          const n = String(SPACES.indexOf(space) + 1).padStart(2, "0");
          return (
            <li key={space.id} data-reveal="" style={{ "--i": i } as CSSProperties}>
              <Link href={space.href} className="index-row group" aria-label={`${tNav(space.id)}: ${t(`items.${space.id}`)}`}>
                <span aria-hidden="true" className="font-mono text-[12px] text-dim transition-colors group-hover:text-accent">
                  {n}
                </span>
                <span aria-hidden="true" className="display index-title text-[44px] text-fg sm:text-[64px] lg:text-[80px]">
                  {tNav(space.id)}
                </span>
                <span aria-hidden="true" className="col-start-2 text-[14px] text-muted lg:col-start-auto lg:text-[15px]">
                  {t(`items.${space.id}`)}
                </span>
                <span
                  aria-hidden="true"
                  className="row-start-1 grid h-11 w-11 place-items-center border border-line-strong text-muted transition-[transform,background-color,color,border-color] duration-500 [transition-timing-function:var(--ease-out)] group-hover:rotate-45 group-hover:border-transparent group-hover:bg-accent-vivid group-hover:text-on-accent max-lg:col-start-3 lg:row-start-auto"
                >
                  <ArrowUpRight size={18} />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
