// src/components/valorant/crosshair.tsx — Dessin du réticule à partir des réglages (CROSSHAIR).
// 1 unité = 1 pixel à l'écran en jeu ; `zoom` agrandit sans lisser (crispEdges).
// Purement décoratif : la description texte est donnée à côté (aria-hidden).
import { CROSSHAIR, type CrosshairLines } from "@/config/valorant-settings";

type Rect = { x: number; y: number; w: number; h: number };

/** Les 4 branches d'un groupe de lignes, centrées sur (0, 0) */
function arms({ length: l, thickness: t, offset: o }: CrosshairLines): Rect[] {
  const half = Math.floor(t / 2);
  return [
    { x: -o - l, y: -half, w: l, h: t },
    { x: o, y: -half, w: l, h: t },
    { x: -half, y: -o - l, w: t, h: l },
    { x: -half, y: o, w: t, h: l },
  ];
}

export function CrosshairSvg({ zoom = 1, size = 64, className }: { zoom?: number; size?: number; className?: string }) {
  const c = CROSSHAIR;
  const groups: { rects: Rect[]; opacity: number }[] = [];
  if (c.inner.on) groups.push({ rects: arms(c.inner), opacity: c.inner.opacity });
  if (c.outer.on) groups.push({ rects: arms(c.outer), opacity: c.outer.opacity });
  if (c.centerDot.on) {
    const z = c.centerDot.thickness;
    const half = Math.floor(z / 2);
    groups.push({ rects: [{ x: -half, y: -half, w: z, h: z }], opacity: c.centerDot.opacity });
  }
  const ot = c.outlines.thickness;
  const half = size / 2;

  return (
    <svg
      width={size * zoom}
      height={size * zoom}
      viewBox={`${-half} ${-half} ${size} ${size}`}
      shapeRendering="crispEdges"
      aria-hidden="true"
      className={className}
    >
      {groups.map((g, i) => (
        <g key={i} opacity={g.opacity}>
          {c.outlines.on &&
            g.rects.map((r, j) => (
              <rect
                key={`o${j}`}
                x={r.x - ot}
                y={r.y - ot}
                width={r.w + ot * 2}
                height={r.h + ot * 2}
                fill="#000"
                opacity={c.outlines.opacity}
              />
            ))}
          {g.rects.map((r, j) => (
            <rect key={j} x={r.x} y={r.y} width={r.w} height={r.h} fill={c.color.hex} />
          ))}
        </g>
      ))}
    </svg>
  );
}
