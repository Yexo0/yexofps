// src/components/shell/site-header.tsx — Fixed top bar: wordmark, the six spaces (numbered), tools
// (search, theme, language), menu button on small screens.
// Transparent at the top of the page, solid with a hairline once scrolled; slides away when scrolling
// down and comes back when scrolling up. The current space is marked by a red bar that glides from
// one link to the next (Motion layout animation).
"use client";

import { useEffect, useRef, type RefObject } from "react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { Search } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { SPACES, spaceFromPath } from "@/config/spaces";
import { EASE } from "@/lib/motion";
import { Wordmark } from "./logo";
import { MobileMenu } from "./mobile-menu";
import { LocaleButton, ThemeButton } from "./tool-buttons";
import { useUI } from "./ui-provider";

/** Hides the bar while scrolling down, shows it again on the way up */
function useScrollState(ref: RefObject<HTMLElement | null>, locked: boolean) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let last = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      el.toggleAttribute("data-scrolled", y > 8);
      const delta = y - last;
      if (locked || y < 120 || delta < -6) el.removeAttribute("data-hidden");
      else if (delta > 6) el.setAttribute("data-hidden", "");
      // Exposed to sticky elements (in-page nav) so they sit under the bar when it is shown
      document.documentElement.toggleAttribute("data-header-hidden", el.hasAttribute("data-hidden"));
      if (Math.abs(delta) > 6) last = y;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [ref, locked]);
}

export function SiteHeader() {
  const t = useTranslations("nav");
  const tTools = useTranslations("nav.tools");
  const pathname = usePathname();
  const active = spaceFromPath(pathname);
  const { setPaletteOpen, menuOpen, setMenuOpen } = useUI();
  const ref = useRef<HTMLElement>(null);
  useScrollState(ref, menuOpen);

  return (
    <header ref={ref} className="site-header">
      <div className="container-x flex h-full items-center justify-between gap-6">
        <Link href="/" aria-label={t("homeLogo")} className="shrink-0">
          <Wordmark />
        </Link>

        <nav aria-label={t("main")} className="hidden lg:block">
          <ul className="flex items-center gap-7 xl:gap-9">
            {SPACES.filter((s) => s.id !== "home").map((space) => {
              const n = SPACES.indexOf(space) + 1;
              const current = space.id === active.id;
              return (
                <li key={space.id} className="relative">
                  <Link href={space.href} aria-current={current ? "page" : undefined} className="nav-link">
                    <span className="nav-num" aria-hidden="true">
                      {String(n).padStart(2, "0")}
                    </span>
                    {t(`spaces.${space.id}`)}
                  </Link>
                  {current && (
                    <motion.span
                      layoutId="nav-current"
                      aria-hidden="true"
                      className="absolute inset-x-0 -bottom-[3px] h-[2px] bg-accent-vivid"
                      transition={{ duration: 0.6, ease: EASE.out }}
                    />
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <button type="button" onClick={() => setPaletteOpen(true)} aria-label={tTools("search")} className="tool-btn hidden gap-2 sm:inline-flex">
            <Search size={16} aria-hidden="true" />
            <span className="kbd hidden xl:inline-grid">⌘K</span>
          </button>
          <ThemeButton />
          <LocaleButton />
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? t("close") : t("more")}
            data-open={menuOpen || undefined}
            className="tool-btn ml-1 lg:hidden"
          >
            <span className="menu-lines" aria-hidden="true" />
          </button>
        </div>
      </div>
      <MobileMenu />
    </header>
  );
}
