// src/components/shell/credits.tsx — Ligne de crédits en bas de chaque page : auteurs et licences des
// modèles 3D (obligatoire pour les licences CC BY), et mention "non approuvé par Riot Games".
import { useTranslations } from "next-intl";
import { MODEL_CREDITS } from "@/config/site";

export function Credits() {
  const t = useTranslations("common.credits");
  return (
    <div className="mt-2 flex flex-col gap-1 px-1 text-[10.5px] leading-relaxed text-dim">
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
