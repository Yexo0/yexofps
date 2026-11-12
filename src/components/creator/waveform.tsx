// src/components/creator/waveform.tsx — Forme d'onde décorative (piste audio d'un edit). Statique.
export function Waveform({ seed = 1, bars = 56, played = 0.35 }: { seed?: number; bars?: number; played?: number }) {
  const heights = Array.from({ length: bars }, (_, i) => {
    const v = Math.abs(Math.sin(i * 0.61 * seed + seed) * Math.cos(i * 0.23 + seed * 1.7));
    return 0.18 + 0.82 * v;
  });
  const w = 3;
  const gap = 2;
  const h = 22;
  return (
    <svg
      viewBox={`0 0 ${bars * (w + gap) - gap} ${h}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      className="block h-[22px] w-full"
    >
      {heights.map((v, i) => {
        const bh = Math.max(2, v * h);
        return (
          <rect
            key={i}
            x={i * (w + gap)}
            y={(h - bh) / 2}
            width={w}
            height={bh}
            rx={1}
            fill={i / bars < played ? "var(--accent)" : "var(--text-dim)"}
            opacity={i / bars < played ? 0.9 : 0.35}
          />
        );
      })}
    </svg>
  );
}
