// src/components/ui/dot-digits.tsx — Chiffres en matrice de points 5 × 7, façon tableau de score.
// Réservé aux chiffres-clés (peak RR, sensibilité convertie). Le texte réel est fourni aux
// lecteurs d'écran via sr-only ; le dessin est aria-hidden. Pas de lueur : points pleins, c'est tout.
import { cn } from "@/lib/utils";

/** Glyphes 5 × 7 : chaque ligne est un masque de 5 bits (bit fort à gauche) */
const GLYPHS: Record<string, number[]> = {
  "0": [0b01110, 0b10001, 0b10011, 0b10101, 0b11001, 0b10001, 0b01110],
  "1": [0b00100, 0b01100, 0b00100, 0b00100, 0b00100, 0b00100, 0b01110],
  "2": [0b01110, 0b10001, 0b00001, 0b00010, 0b00100, 0b01000, 0b11111],
  "3": [0b11110, 0b00001, 0b00001, 0b01110, 0b00001, 0b00001, 0b11110],
  "4": [0b00010, 0b00110, 0b01010, 0b10010, 0b11111, 0b00010, 0b00010],
  "5": [0b11111, 0b10000, 0b11110, 0b00001, 0b00001, 0b10001, 0b01110],
  "6": [0b00110, 0b01000, 0b10000, 0b11110, 0b10001, 0b10001, 0b01110],
  "7": [0b11111, 0b00001, 0b00010, 0b00100, 0b01000, 0b01000, 0b01000],
  "8": [0b01110, 0b10001, 0b10001, 0b01110, 0b10001, 0b10001, 0b01110],
  "9": [0b01110, 0b10001, 0b10001, 0b01111, 0b00001, 0b00010, 0b01100],
  ".": [0, 0, 0, 0, 0, 0b01100, 0b01100],
  ",": [0, 0, 0, 0, 0b01100, 0b00100, 0b01000],
  "-": [0, 0, 0, 0b11111, 0, 0, 0],
  "%": [0b11001, 0b11010, 0b00010, 0b00100, 0b01000, 0b01011, 0b10011],
  " ": [0, 0, 0, 0, 0, 0, 0],
};

export function DotDigits({
  value,
  dot = 5,
  gap = 2,
  className,
}: {
  value: string;
  /** Diamètre d'un point en px */
  dot?: number;
  /** Espace entre deux points en px */
  gap?: number;
  className?: string;
}) {
  const step = dot + gap;
  const chars = value.split("").filter((c) => c in GLYPHS);
  // Les séparateurs sont plus étroits que les chiffres
  const widths = chars.map((c) => (c === "." || c === "," ? 3 : 5));
  const totalCols = widths.reduce((a, b) => a + b, 0) + (chars.length - 1);
  const width = totalCols * step - gap;
  const height = 7 * step - gap;

  let col = 0;
  const dots: { x: number; y: number; on: boolean; c: number }[] = [];
  chars.forEach((c, i) => {
    const glyph = GLYPHS[c];
    const w = widths[i];
    const shift = w === 3 ? 1 : 0; // recentre les glyphes étroits
    for (let row = 0; row < 7; row++) {
      for (let j = 0; j < w; j++) {
        const bit = (glyph[row] >> (4 - (j + shift))) & 1;
        dots.push({ x: (col + j) * step + dot / 2, y: row * step + dot / 2, on: bit === 1, c: col + j });
      }
    }
    col += w + 1;
  });

  return (
    <span className={cn("inline-flex", className)}>
      <span className="sr-only">{value}</span>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true" className="block h-auto max-w-full">
        {dots.map((d, i) => (
          <circle
            key={i}
            cx={d.x}
            cy={d.y}
            r={dot / 2}
            fill={d.on ? "currentColor" : "var(--text-dim)"}
            opacity={d.on ? 1 : 0.13}
            className={d.on ? "dot-on" : undefined}
            style={d.on ? { ["--dc" as string]: d.c } : undefined}
          />
        ))}
      </svg>
    </span>
  );
}
