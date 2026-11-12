// src/components/shell/logo.tsx — Monogramme "Y" (rail, favicon). Couleurs = tokens d'accent.
export function Logo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" aria-hidden="true" focusable="false">
      <rect width="36" height="36" rx="11" fill="var(--accent)" />
      <path
        d="M11.5 10.5 18 18.6l6.5-8.1M18 18.6v7.4"
        fill="none"
        stroke="var(--on-accent)"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
