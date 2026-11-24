// src/app/[locale]/opengraph-image.tsx — Image Open Graph (1200 × 630) par langue, générée au build.
// Reprend la DA du site : fond sombre, coins de viseur, accent, Geist / Geist Mono.
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { brand } from "@/lib/theme";
import { SITE } from "@/config/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Yexo · yexofps.org";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const FONTS = join(process.cwd(), "node_modules/geist/dist/fonts");

export default async function OpenGraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "og" });
  const [bold, mono] = await Promise.all([
    readFile(join(FONTS, "geist-sans/Geist-Bold.ttf")),
    readFile(join(FONTS, "geist-mono/GeistMono-Regular.ttf")),
  ]);

  const corner = (pos: Record<string, number>, borders: Record<string, string>) => (
    <div style={{ position: "absolute", width: 34, height: 34, display: "flex", ...pos, ...borders }} />
  );
  const line = `3px solid ${brand.accent}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: brand.bg,
          padding: 72,
          position: "relative",
          fontFamily: "Geist",
          color: brand.text,
        }}
      >
        {corner({ left: 36, top: 36 }, { borderLeft: line, borderTop: line })}
        {corner({ right: 36, top: 36 }, { borderRight: line, borderTop: line })}
        {corner({ left: 36, bottom: 36 }, { borderLeft: line, borderBottom: line })}
        {corner({ right: 36, bottom: 36 }, { borderRight: line, borderBottom: line })}

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              background: brand.accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
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
          <div style={{ fontFamily: "Geist Mono", fontSize: 26, color: brand.dim, display: "flex" }}>
            <span style={{ color: brand.accent }}>$</span>&nbsp;whoami
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 156, lineHeight: 0.9, letterSpacing: -6, display: "flex" }}>Yexo</div>
          <div style={{ fontSize: 40, lineHeight: 1.2, maxWidth: 960, color: brand.text, display: "flex" }}>
            {t("tagline")}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 12 }}>
            {(["sysadmin", "fps", "video"] as const).map((k) => (
              <div
                key={k}
                style={{
                  display: "flex",
                  padding: "10px 20px",
                  borderRadius: 999,
                  background: brand.surface2,
                  color: brand.muted,
                  fontSize: 24,
                }}
              >
                {t(`chips.${k}`)}
              </div>
            ))}
          </div>
          <div style={{ fontFamily: "Geist Mono", fontSize: 24, color: brand.accent, display: "flex" }}>
            {SITE.url.replace("https://", "")}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Geist", data: bold, weight: 700, style: "normal" },
        { name: "Geist Mono", data: mono, weight: 400, style: "normal" },
      ],
    },
  );
}
