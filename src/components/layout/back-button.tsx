// src/components/layout/back-button.tsx
import { Link } from "@/i18n/navigation";
import { ArrowLeft } from "lucide-react";

export function BackButton() {
  return (
    <Link
      href="/"
      className="fixed top-[22px] left-7 z-20 text-white/90 no-underline hover:scale-[1.08] hover:text-white transition-transform"
      aria-label="Back"
    >
      <ArrowLeft className="w-8 h-8" strokeWidth={2.5} />
    </Link>
  );
}
