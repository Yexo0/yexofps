// src/components/ui/primitives.tsx — Small building blocks: stat, chip, tag, buttons, arrow link, skeleton.
import type { AnchorHTMLAttributes, ComponentProps, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { CountUp } from "./count-up";

/* ─── Stat: big figure, small unit, mono label ─── */

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
    <div className={cn("flex min-w-0 flex-col justify-between gap-3 border-t border-line pt-4", className)}>
      <p className="flex items-baseline gap-1.5 leading-none">
        <span className={cn("display text-fg tabular-nums", size === "lg" ? "text-[64px]" : "text-[46px]")}>
          {/* Numbers count up to their value when they reach the screen */}
          {typeof value === "number" ? <CountUp value={value} /> : value}
        </span>
        {unit && <span className="font-mono text-[11px] text-muted">{unit}</span>}
      </p>
      <p className="label">{label}</p>
    </div>
  );
}

/* ─── Chip with an icon (technologies) ─── */

export function Chip({ icon: Icon, children, className }: { icon?: LucideIcon; children: ReactNode; className?: string }) {
  return (
    <span className={cn("chip", className)}>
      {Icon && <Icon size={14} aria-hidden="true" className="text-muted" />}
      {children}
    </span>
  );
}

/* ─── Small mono tag (keywords) ─── */

export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("tag", className)}>{children}</span>;
}

/* ─── Buttons ─── */

type Variant = "primary" | "tonal" | "ghost";
type Size = "md" | "sm";

export function buttonClass(variant: Variant = "tonal", size: Size = "md", className?: string) {
  return cn("btn", `btn-${variant}`, size === "sm" && "btn-sm", className);
}

/** Internal (localized) link shaped as a button */
export function ButtonLink({
  variant,
  size,
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant; size?: Size }) {
  return <Link className={buttonClass(variant, size, className)} {...props} />;
}

/** External link shaped as a button (new tab) */
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
    <a target="_blank" rel="noopener noreferrer" className={buttonClass(variant, size, className)} {...props}>
      {children}
      {showIcon && <ArrowUpRight size={14} aria-hidden="true" className="opacity-70" />}
    </a>
  );
}

/* ─── Text link with an arrow that slides through on hover ─── */

export function ArrowLink({
  href,
  children,
  external,
  className,
}: {
  href: ComponentProps<typeof Link>["href"] | string;
  children: ReactNode;
  external?: boolean;
  className?: string;
}) {
  const Arrow = external ? ArrowUpRight : ArrowRight;
  const inner = (
    <>
      <span className="link-line">{children}</span>
      <span aria-hidden="true" className={cn("arrow-swap", !external && "arrow-swap-x")}>
        <Arrow size={15} />
        <Arrow size={15} className="text-accent" />
      </span>
    </>
  );
  const cls = cn("group inline-flex items-center gap-2 text-[14px] font-medium text-fg", className);
  if (external || (href as string).startsWith("#")) {
    if (!external) {
      return (
        <a href={href as string} className={cls}>
          {inner}
        </a>
      );
    }
    return (
      <a href={href as string} target="_blank" rel="noopener noreferrer" className={cls}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href as ComponentProps<typeof Link>["href"]} className={cls}>
      {inner}
    </Link>
  );
}

/* ─── Skeleton (loading) ─── */

export function Skeleton({ className }: { className?: string }) {
  return <span aria-hidden="true" className={cn("skeleton block", className)} />;
}
