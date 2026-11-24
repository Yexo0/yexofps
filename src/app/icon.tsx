// src/app/icon.tsx — Favicon généré : le Y en ruban facetté du logo, sur fond transparent
// (lisible sur les onglets clairs comme sombres). Géométrie : src/lib/logo.ts.
import { ImageResponse } from "next/og";
import { LOGO_FACETS, LOGO_MARK_VIEWBOX } from "@/lib/logo";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="62" height="64" viewBox={LOGO_MARK_VIEWBOX}>
          {LOGO_FACETS.map((f) => (
            <polygon key={f.points + f.fill} points={f.points} fill={f.fill} />
          ))}
        </svg>
      </div>
    ),
    size,
  );
}
