// src/components/shell/credits.tsx — Credits line at the bottom of every page: authors and licenses of
// the 3D models (required by the CC BY licenses) and the "not endorsed by Riot Games" notice.
import { useTranslations } from "next-intl";
import { MODEL_CREDITS } from "@/config/site";

export function Credits() {
  const t = useTranslations("common.credits");
  return (
    <div className="flex flex-col gap-1.5 text-[11px] leading-relaxed text-dim">
      <p>
        {t("models")}{" "}
        {MODEL_CREDITS.map((m, i) => (
          <span key={m.id}>
            {i > 0 && " · "}
            <a href={m.url} target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:text-fg hover:underline">
              {m.title}
            </a>{" "}
            ({m.author},{" "}
            <a href={m.licenseUrl} target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:text-fg hover:underline">
              {t("license", { license: m.license })}
            </a>
            )
          </span>
        ))}
        {" — "}
        {t("modified")}.
      </p>
      <p>
        {t("riot")} {t("trademarks")}
      </p>
    </div>
  );
}
