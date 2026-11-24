// src/components/ui/words.tsx — Title that rises word by word from behind a mask (CSS only, globals.css).
// mode "load": plays as soon as the page is painted (page titles); "reveal": when the parent
// [data-reveal] enters the screen (section titles). Screen readers read the plain text once.
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface WordsProps {
  text: string;
  mode?: "load" | "reveal";
  /** Delay before the first word, in ms (mode "load") */
  delay?: number;
  className?: string;
}

export function Words({ text, mode = "reveal", delay, className }: WordsProps) {
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <span
      className={cn("words", mode === "load" ? "words-load" : "words-reveal", className)}
      style={delay !== undefined ? ({ "--wd": `${delay}ms` } as CSSProperties) : undefined}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((w, i) => (
          <span key={i}>
            <span className="w">
              <span style={{ "--wi": i } as CSSProperties}>{w}</span>
            </span>
            {i < words.length - 1 && " "}
          </span>
        ))}
      </span>
    </span>
  );
}
