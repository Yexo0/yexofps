// src/components/now/discord-avatar.tsx — Mon avatar Discord (statut en direct) : image, décoration
// de profil par-dessus et pastille de statut en bas à droite, comme sur Discord.
"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import type { Presence } from "@/lib/presence";
import { cn } from "@/lib/utils";

/** Pastille : en ligne = accent, absent = couleur atténuée, hors ligne = gris */
const DOT: Record<Presence["discord"], string> = {
  online: "bg-accent",
  idle: "bg-muted",
  offline: "bg-surface-3",
};

export function DiscordAvatar({
  presence,
  size,
  className,
  ringClassName = "ring-surface-solid",
}: {
  presence: Presence & { avatar: NonNullable<Presence["avatar"]> };
  /** Diamètre de l'avatar en px (la décoration déborde de 20 %) */
  size: number;
  className?: string;
  /** Contour de la pastille, de la couleur du fond pour la détacher de l'avatar */
  ringClassName?: string;
}) {
  const t = useTranslations("now.discord");
  const dot = Math.max(10, Math.round(size * 0.28));

  return (
    <span className={cn("relative inline-block shrink-0", className)} style={{ width: size, height: size }}>
      <Image
        src={presence.avatar.url}
        alt={t("avatar", { status: t(presence.discord) })}
        width={size}
        height={size}
        className="h-full w-full rounded-full object-cover"
      />
      {presence.avatar.decoration && (
        <Image
          src={presence.avatar.decoration}
          alt=""
          aria-hidden="true"
          width={Math.round(size * 1.2)}
          height={Math.round(size * 1.2)}
          className="pointer-events-none absolute -inset-[10%] h-[120%] w-[120%] max-w-none"
        />
      )}
      <span
        aria-hidden="true"
        className={cn(
          "absolute bottom-[2%] right-[2%] rounded-full ring-[3px]",
          ringClassName,
          DOT[presence.discord],
          presence.discord === "online" && "live-dot",
        )}
        style={{ width: dot, height: dot }}
      />
    </span>
  );
}

/** Garde de type : présence avec avatar */
export function hasAvatar(presence: Presence | null): presence is Presence & { avatar: NonNullable<Presence["avatar"]> } {
  return Boolean(presence?.avatar);
}
