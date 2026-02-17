// src/components/layout/language-switcher.tsx
"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const targetLocale = locale === "en" ? "fr" : "en";
  const label = locale === "en" ? "FR" : "EN";

  function handleSwitch() {
    router.replace(pathname, { locale: targetLocale });
  }

  return (
    <button
      onClick={handleSwitch}
      className="fixed top-[18px] right-[18px] z-20 border-none cursor-pointer
        px-3.5 py-2.5 rounded-xl text-[#030303] bg-[#f9f9fa] font-semibold
        shadow-[0_10px_30px_rgba(0,0,0,0.55)]
        hover:scale-105 hover:bg-[#e0e0e0] transition-all duration-200
        flex items-center gap-2 text-sm"
    >
      <Globe className="w-4 h-4" />
      {label}
    </button>
  );
}
