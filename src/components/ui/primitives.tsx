// src/components/ui/primitives.tsx — Petits blocs visuels réutilisés : stat, chip, tag, bouton, skeleton.
import type { AnchorHTMLAttributes, ComponentProps, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";

/* ─── Tuile de stat : gros chiffre, petite unité, label mono ─── */

export function StatTile({
  value,
  unit,
  label,
  className,
  size = "md",
}: {
  value: ReactNode;
  unit?: string;
  label: string;
  className?: string;
  size?: "md" | "lg";
}) {
  return (
    <div className={cn("tile flex min-w-0 flex-col justify-between gap-1 px-4 py-3.5", className)}>
      <p className="flex items-baseline gap-1.5 leading-none">
        <span
          className={cn(
            "font-bold tracking-tight text-fg tabular-nums",
            size === "lg" ? "text-[40px]" : "text-[30px]",
          )}
        >
          {value}
        </span>
        {unit && <span className="font-mono text-[11px] text-muted">{unit}</span>}
      </p>
      <p className="label">{label}</p>
    </div>
  );
}

/* ─── Chip en pilule avec icône (technos) ─── */

export function Chip({
  icon: Icon,
  children,
  className,
}: {
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("chip", className)}>
      {Icon && <Icon size={14} aria-hidden="true" className="text-muted" />}
      {children}
    </span>
  );
}

/* ─── Petit tag mono avec contour (mots-clés) ─── */

export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("tag", className)}>{children}</span>;
}

/* ─── Boutons pilule ─── */

type Variant = "primary" | "tonal" | "ghost";
type Size = "md" | "sm";

export function buttonClass(variant: Variant = "tonal", size: Size = "md", className?: string) {
  return cn("btn", `btn-${variant}`, size === "sm" && "btn-sm", className);
}

/** Lien interne (localisé) en forme de bouton */
export function ButtonLink({
  variant,
  size,
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant; size?: Size }) {
  return <Link className={buttonClass(variant, size, className)} {...props} />;
}

/** Lien externe en forme de bouton (nouvel onglet) */
export function ExternalButton({
  variant,
  size,
  className,
  children,
  showIcon = false,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: Variant;
  size?: Size;
  showIcon?: boolean;
}) {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      className={buttonClass(variant, size, className)}
      {...props}
    >
      {children}
      {showIcon && <ExternalLink size={13} aria-hidden="true" className="opacity-70" />}
    </a>
  );
}

/* ─── Skeleton (chargement) ─── */

export function Skeleton({ className }: { className?: string }) {
  return <span aria-hidden="true" className={cn("skeleton block", className)} />;
}
