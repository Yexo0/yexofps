// src/components/valorant/summary.tsx — Résumé de la config (sensi, eDPI, cm/360, réticule),
// partagé par la page settings et la carte de l'espace Gaming.
import { useFormatter, useTranslations } from "next-intl";
import { MY_SENS } from "@/config/site";
import { CROSSHAIR } from "@/config/valorant-settings";
import { GAMES, cm360 } from "@/lib/converter-math";
import { StatTile } from "@/components/ui/primitives";
import { CopyButton } from "@/components/ui/copy-button";
import { cn } from "@/lib/utils";
import { CrosshairSvg } from "./crosshair";

/** Sensi, DPI, eDPI et cm/360 calculés depuis MY_SENS */
export function SensTiles({ className }: { className?: string }) {
  const t = useTranslations("valoSettings.summary");
  const format = useFormatter();
  const sens = Number(MY_SENS.sens);
  const dpi = Number(MY_SENS.dpi);
  const tiles = [
    { label: t("sens"), value: MY_SENS.sens },
    { label: t("dpi"), value: MY_SENS.dpi },
    { label: t("edpi"), value: format.number(Math.round(sens * dpi)) },
    {
      label: t("cm360"),
      value: format.number(cm360(dpi, sens, GAMES.valo.yaw), { maximumFractionDigits: 1, minimumFractionDigits: 1 }),
      unit: "cm",
    },
  ];
  return (
    <div className={cn("stagger grid grid-cols-2 gap-2.5 sm:grid-cols-4", className)}>
      {tiles.map((tile) => (
        <StatTile key={tile.label} label={tile.label} value={tile.value} unit={tile.unit} />
      ))}
    </div>
  );
}

/** Aperçu agrandi du réticule sur fond sombre, avec le code à copier (compact : bouton icône seule) */
export function CrosshairTile({ className, compact = false }: { className?: string; compact?: boolean }) {
  const t = useTranslations("valoSettings");
  return (
    <div className={cn("tile flex min-w-0 items-center gap-3.5 p-2.5 pr-4", className)}>
      <div
        className="grid h-[72px] w-[72px] shrink-0 place-items-center rounded-[10px]"
        style={{ background: "linear-gradient(180deg, #24272d 0%, #131518 100%)" }}
      >
        <CrosshairSvg zoom={3} size={24} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <p className="label">{t("summary.crosshair")}</p>
        <code className="truncate font-mono text-[12px] text-muted">{CROSSHAIR.code}</code>
        <span className="sr-only">
          {t("crosshair.description", {
            length: CROSSHAIR.inner.length,
            thickness: CROSSHAIR.inner.thickness,
            offset: CROSSHAIR.inner.offset,
            color: CROSSHAIR.color.hex,
          })}
        </span>
      </div>
      <CopyButton value={CROSSHAIR.code} label={t("crosshair.codeLabel")} compact={compact} />
    </div>
  );
}
