// src/components/ui/split-text.tsx — Texte qui arrive lettre par lettre (montée + fondu, en CSS pur).
// Lecteurs d'écran : le texte entier est lu une fois (copie masquée), les lettres sont ignorées.
// `reveal="load"` : au chargement ; `reveal="card"` : quand la carte parente apparaît (ScrollReveal).
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface SplitTextProps {
  text: string;
  reveal?: "load" | "card";
  /** Délai avant la première lettre (ms) */
  delay?: number;
  className?: string;
}

export function SplitText({ text, reveal = "load", delay = 0, className }: SplitTextProps) {
  return (
    <span className={cn("split", reveal === "card" && "split-card", className)} style={{ "--split-delay": `${delay}ms` } as CSSProperties}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {[...text].map((ch, i) => (
          <span key={i} className="split-char" style={{ "--ci": i } as CSSProperties}>
            {ch === " " ? " " : ch}
          </span>
        ))}
      </span>
    </span>
  );
}
