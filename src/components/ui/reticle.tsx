// src/components/ui/reticle.tsx — Coins de viseur : quatre équerres fines aux angles d'un élément.
// Motif du site, à mi-chemin entre le réticule d'un FPS et le cadre d'un viseur de caméra.
// Purement décoratif (aria-hidden). Le parent doit être en position relative.
import { cn } from "@/lib/utils";

export function Reticle({
  size = 10,
  inset = 6,
  className,
}: {
  /** Longueur des branches, en px */
  size?: number;
  /** Distance au bord, en px */
  inset?: number;
  className?: string;
}) {
  const corners = [
    "left-0 top-0 border-l border-t",
    "right-0 top-0 border-r border-t",
    "bottom-0 left-0 border-b border-l",
    "bottom-0 right-0 border-b border-r",
  ];
  return (
    <span aria-hidden="true" className={cn("pointer-events-none absolute", className)} style={{ inset }}>
      {corners.map((c) => (
        <span key={c} className={cn("absolute border-accent/70", c)} style={{ width: size, height: size }} />
      ))}
    </span>
  );
}
