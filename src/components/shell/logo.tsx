// src/components/shell/logo.tsx — Logo : le Y en ruban facetté (LogoMark) et le logotype « Yexo »
// dont le Y est ce ruban (Wordmark). Géométrie dans src/lib/logo.ts ; « exo » suit la couleur du texte.
import type { SVGProps } from "react";
import { LOGO_EXO_PATH, LOGO_FACETS, LOGO_MARK_VIEWBOX, LOGO_WORDMARK_VIEWBOX } from "@/lib/logo";

type Props = Omit<SVGProps<SVGSVGElement>, "viewBox"> & {
  /** Classe du groupe « exo » (ex : l'apparition dans le rail) */
  exoClassName?: string;
};

function Facets() {
  return (
    <>
      {LOGO_FACETS.map((f) => (
        <polygon key={f.points + f.fill} points={f.points} fill={f.fill} />
      ))}
    </>
  );
}

/** Le Y seul */
export function LogoMark(props: Omit<Props, "exoClassName">) {
  return (
    <svg viewBox={LOGO_MARK_VIEWBOX} aria-hidden="true" focusable="false" {...props}>
      <Facets />
    </svg>
  );
}

/** « Yexo » : le ruban + « exo » vectorisé */
export function Wordmark({ exoClassName, ...props }: Props) {
  return (
    <svg viewBox={LOGO_WORDMARK_VIEWBOX} aria-hidden="true" focusable="false" {...props}>
      <Facets />
      <path className={exoClassName} d={LOGO_EXO_PATH} fill="currentColor" />
    </svg>
  );
}
