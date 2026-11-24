// src/app/icon.tsx — Favicon généré : monogramme "Y" aux couleurs de l'accent (suit ACCENT_SEED).
import { ImageResponse } from "next/og";
import { brand } from "@/lib/theme";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: brand.accent,
          borderRadius: 18,
        }}
      >
        <svg width="44" height="44" viewBox="6 6 24 24">
          <path
            d="M11.5 10.5 18 18.6l6.5-8.1M18 18.6v7.4"
            fill="none"
            stroke={brand.onAccent}
            strokeWidth="3.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    ),
    size,
  );
}
