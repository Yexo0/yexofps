// src/components/layout/footer.tsx
"use client";

import { usePathname, Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Mail, Instagram, Home } from "lucide-react";
import { TikTokIcon } from "@/components/icons/tiktok";
import { DiscordIcon } from "@/components/icons/discord";
import { SOCIAL_LINKS, EMAILS } from "@/lib/constants";

export function Footer() {
  const t = useTranslations("footer");
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <footer className="footer-root relative z-[2] w-full max-w-[860px] mx-auto mt-6 mb-7 px-5">
      {/* Gradient top divider */}
      <div className="footer-divider h-px w-full mb-4" />

      {/* Single row */}
      <div className="flex items-center justify-between gap-4">
        {/* Copyright */}
        <span className="text-white/30 text-[0.68rem]">{t("copyright")}</span>

        {/* Center — contact label + subtle social icons */}
        <div className="flex items-center gap-2.5">
          <span className="text-white/25 text-[0.68rem]">{t("contactLabel")}</span>
          <a
            href={SOCIAL_LINKS.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok"
            className="text-white/25 hover:text-white/55 transition-colors duration-200"
          >
            <TikTokIcon className="w-3.5 h-3.5" />
          </a>
          <a
            href={SOCIAL_LINKS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-white/25 hover:text-white/55 transition-colors duration-200"
          >
            <Instagram className="w-3.5 h-3.5" />
          </a>
          <a
            href={SOCIAL_LINKS.discord}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Discord"
            className="text-white/25 hover:text-white/55 transition-colors duration-200"
          >
            <DiscordIcon className="w-3.5 h-3.5" />
          </a>
          <a
            href={`mailto:${EMAILS.business}`}
            aria-label="Email"
            className="text-white/25 hover:text-white/55 transition-colors duration-200"
          >
            <Mail className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Right — home link (only on non-home pages) */}
        {!isHome && (
          <Link
            href="/"
            className="flex items-center gap-1 text-white/30 hover:text-white/55 transition-colors duration-200 text-[0.68rem] no-underline"
          >
            <Home className="w-3 h-3" />
            {t("home")}
          </Link>
        )}
      </div>
    </footer>
  );
}
