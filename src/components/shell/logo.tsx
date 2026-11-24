// src/components/shell/logo.tsx — "Y" monogram on a red square with the signature cut corner (header, favicon).
export function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <path d="M0 0H32V24L24 32H0Z" fill="var(--accent-vivid)" />
      <path d="M9.5 8.5 16 16.8l6.5-8.3M16 16.8V24" fill="none" stroke="var(--on-accent)" strokeWidth="2.6" strokeLinecap="square" />
    </svg>
  );
}

/** Logo + "YEXO" wordmark */
export function Wordmark() {
  return (
    <span className="inline-flex items-center gap-2.5">
      <Logo size={26} />
      <span className="display text-[22px] leading-none tracking-[0.02em] text-fg">Yexo</span>
    </span>
  );
}
