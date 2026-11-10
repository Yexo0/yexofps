// src/app/apple-icon.tsx — Icône iOS (écran d'accueil) : monogramme sur fond sombre.
import { ImageResponse } from "next/og";
import { brand } from "@/lib/theme";

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
          background: brand.bg,
        }}
      >
        <div
          style={{
            width: 132,
            height: 132,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: brand.accent,
            borderRadius: 36,
          }}
        >
          <svg width="96" height="96" viewBox="6 6 24 24">
            <path
              d="M11.5 10.5 18 18.6l6.5-8.1M18 18.6v7.4"
              fill="none"
              stroke={brand.onAccent}
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    ),
    size,
  );
}
