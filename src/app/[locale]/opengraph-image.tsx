// src/app/[locale]/opengraph-image.tsx — Open Graph image (1200 × 630) per language, generated at build.
// Same art direction as the site: near-black page, the red band of the hero, the name huge.
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
        {/* The red band of the home hero */}
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            width: 470,
            height: 630,
            display: "flex",
            background: brand.accent,
            clipPath: "polygon(30% 0, 100% 0, 100% 100%, 0 100%)",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontFamily: "Geist Mono", fontSize: 24, color: brand.dim }}>
          <div style={{ width: 44, height: 2, background: brand.accent, display: "flex" }} />
          {t("label")}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ fontSize: 210, lineHeight: 0.82, letterSpacing: -10, display: "flex" }}>YEXO</div>
          <div style={{ fontSize: 38, lineHeight: 1.2, maxWidth: 680, color: brand.muted, display: "flex" }}>{t("tagline")}</div>
        </div>

        <div style={{ display: "flex", fontFamily: "Geist Mono", fontSize: 24, color: brand.text }}>{SITE.url.replace("https://", "")}</div>
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
