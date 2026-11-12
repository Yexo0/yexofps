// src/components/ui/copy-button.tsx — Bouton "copier" avec confirmation lue par les lecteurs d'écran.
"use client";

import { Check, Copy } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCopy } from "@/hooks/use-copy";
import { buttonClass } from "./primitives";

export function CopyButton({
  value,
  label,
  variant = "tonal",
  compact = false,
}: {
  value: string;
  /** Ce qui est copié, pour l'aria-label (ex : "l'email pro") */
  label?: string;
  variant?: "tonal" | "ghost" | "primary";
  /** Icône seule */
  compact?: boolean;
}) {
  const t = useTranslations("common");
  const { copied, copy } = useCopy();
  const done = copied === value;
  const Icon = done ? Check : Copy;

  return (
    <button
      type="button"
      onClick={() => copy(value)}
      className={compact ? "icon-btn h-9 w-9" : buttonClass(variant, "sm")}
      aria-label={compact ? `${t("copy")}${label ? ` ${label}` : ""}` : undefined}
    >
      <Icon size={14} aria-hidden="true" className={done ? "text-accent" : undefined} />
      {!compact && <span>{done ? t("copied") : t("copy")}</span>}
      <span className="sr-only" aria-live="polite">
        {done ? t("copiedLive") : ""}
      </span>
    </button>
  );
}
