// src/app/[locale]/opengraph-image.tsx — Image Open Graph (1200 × 630) par langue, générée au build.
// Reprend la DA du site : fond noir, lueur rouge douce, logotype « Yexo » (Y en ruban facetté),
// phrase d'accroche, pastilles et adresse du site en gris. Geist pour le texte.
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { brand } from "@/lib/theme";
import { SITE } from "@/config/site";
import { LOGO_EXO_PATH, LOGO_FACETS, LOGO_WORDMARK_VIEWBOX } from "@/lib/logo";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Yexo · yexofps.org";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const FONTS = join(process.cwd(), "node_modules/geist/dist/fonts/geist-sans");
/** Logotype : 4429 × 1512 unités → 150 px de haut */
const WORDMARK_H = 150;
const WORDMARK_W = Math.round((WORDMARK_H * 4429) / 1512);

export default async function OpenGraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "og" });
  const [semibold, regular] = await Promise.all([
    readFile(join(FONTS, "Geist-SemiBold.ttf")),
    readFile(join(FONTS, "Geist-Regular.ttf")),
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
          padding: "84px 88px 72px",
          background: brand.bg,
          backgroundImage:
            "radial-gradient(60% 75% at 95% 0%, rgba(255,70,85,0.22), rgba(255,70,85,0) 70%), radial-gradient(45% 60% at 0% 100%, rgba(122,16,32,0.35), rgba(122,16,32,0) 70%)",
          fontFamily: "Geist",
          color: brand.text,
        }}
      >
        <svg width={WORDMARK_W} height={WORDMARK_H} viewBox={LOGO_WORDMARK_VIEWBOX}>
          {LOGO_FACETS.map((f) => (
            <polygon key={f.points + f.fill} points={f.points} fill={f.fill} />
          ))}
          <path d={LOGO_EXO_PATH} fill={brand.text} />
        </svg>

        <div style={{ display: "flex", flexDirection: "column", gap: 34 }}>
          <div style={{ fontSize: 46, fontWeight: 600, lineHeight: 1.2, maxWidth: 940, display: "flex" }}>
            {t("tagline")}
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
            <div style={{ fontSize: 24, color: brand.dim, display: "flex" }}>{SITE.url.replace("https://", "")}</div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Geist", data: semibold, weight: 600, style: "normal" },
        { name: "Geist", data: regular, weight: 400, style: "normal" },
      ],
    },
  );
}
