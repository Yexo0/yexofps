// src/app/layout.tsx — Layout racine minimal : <html> est rendu par src/app/[locale]/layout.tsx.
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
