// src/hooks/use-copy-clipboard.ts
"use client";

import { useState, useCallback } from "react";

export function useCopyClipboard(timeout = 2000) {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(text);
        setTimeout(() => setCopied(null), timeout);
      } catch {
        // Fallback for older browsers
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        setCopied(text);
        setTimeout(() => setCopied(null), timeout);
      }
    },
    [timeout]
  );

  return { copied, copy };
}
