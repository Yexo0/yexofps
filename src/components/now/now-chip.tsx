// src/components/now/now-chip.tsx — Short "right now" status linking to /now (footer, mobile menu).
// The Contact page shows the full status (NowCard size="lg").
"use client";

import { useTranslations } from "next-intl";
import { useLive } from "@/hooks/use-now";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function NowStatusSegment({ className }: { className?: string }) {
  const t = useTranslations("now");
  const state = useLive();
  // Before the status is computed: same footprint (no width jump on load)
  if (!state) {
    return (
      <span aria-hidden="true" className={cn("inline-flex items-center gap-2", className)}>
        <span className="h-1.5 w-1.5 rounded-full bg-surface-hover" />
        <span className="h-2.5 w-24 bg-surface-3" />
      </span>
    );
  }
  const { live } = state;
  return (
    <Link
      href="/now"
      aria-label={t("chip.aria", { activity: t(`activities.${live.id}.title`, { name: live.name ?? "" }) })}
      className={cn("group inline-flex items-center gap-2 transition-colors hover:text-fg", className)}
    >
      <span aria-hidden="true" className="live-dot h-1.5 w-1.5 rounded-full bg-accent-vivid text-accent-vivid" />
      <span className="link-line">{t(`short.${live.id}`, { name: live.name ?? "" })}</span>
    </Link>
  );
}
