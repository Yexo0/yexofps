// src/app/apple-icon.tsx — Icône iOS (écran d'accueil) : le Y en ruban facetté sur fond sombre
// (iOS arrondit lui-même les coins). Géométrie : src/lib/logo.ts.
import { ImageResponse } from "next/og";
import { brand } from "@/lib/theme";
import { LOGO_FACETS, LOGO_MARK_VIEWBOX } from "@/lib/logo";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: brand.surface,
        }}
      >
        <svg width="101" height="104" viewBox={LOGO_MARK_VIEWBOX}>
          {LOGO_FACETS.map((f) => (
            <polygon key={f.points + f.fill} points={f.points} fill={f.fill} />
          ))}
        </svg>
      </div>
    ),
    size,
  );
}
