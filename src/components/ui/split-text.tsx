// src/components/ui/split-text.tsx — Text that arrives letter by letter (rise + fade, CSS only), on load.
// Used for the hero name. Screen readers read the whole text once (hidden copy); letters are ignored.
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface SplitTextProps {
  text: string;
  /** Delay before the first letter (ms) */
  delay?: number;
  className?: string;
}

export function SplitText({ text, delay = 0, className }: SplitTextProps) {
  return (
    <span className={cn("split", className)} style={{ "--split-delay": `${delay}ms` } as CSSProperties}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {[...text].map((ch, i) => (
          <span key={i} className="split-char" style={{ "--ci": i } as CSSProperties}>
            {ch === " " ? " " : ch}
          </span>
        ))}
      </span>
    </span>
  );
}
