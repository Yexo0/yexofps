// src/components/shell/mobile-menu.tsx — Full-screen menu on small screens (under 1024 px).
// The panel slides down from the top, the spaces arrive one by one in the display face, then the
// tools and the live status. Radix Dialog handles focus, Escape and scroll lock; Motion animates the
// entrance and the exit. Navigating closes it.
"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Dialog } from "radix-ui";
import { useTranslations } from "next-intl";
import { ArrowUpRight, Search } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { SPACES, spaceFromPath } from "@/config/spaces";
import { SOCIALS } from "@/config/site";
import { DUR, EASE, STAGGER } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { NowStatusSegment } from "@/components/now/now-chip";
import { Wordmark } from "./logo";
import { LocaleButton, ThemeButton } from "./tool-buttons";
import { useUI } from "./ui-provider";

export function MobileMenu() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const active = spaceFromPath(pathname);
  const { menuOpen, setMenuOpen, setPaletteOpen } = useUI();

  // Closes when the page changes (link followed, keyboard shortcut…)
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname, setMenuOpen]);

  return (
    <Dialog.Root open={menuOpen} onOpenChange={setMenuOpen}>
      <AnimatePresence>
        {menuOpen && (
          <Dialog.Portal forceMount>
            <Dialog.Content forceMount asChild aria-describedby={undefined}>
              <motion.div
                className="fixed inset-0 z-[55] flex flex-col overflow-y-auto bg-bg lg:hidden"
                initial={{ y: "-100%" }}
                animate={{ y: 0, transition: { duration: DUR.long, ease: EASE.out } }}
                exit={{ y: "-100%", transition: { duration: 0.55, ease: EASE.inOut, delay: 0.08 } }}
              >
                <Dialog.Title className="sr-only">{t("more")}</Dialog.Title>
                <div className="container-x flex h-[var(--header-h)] shrink-0 items-center justify-between">
                  <Link href="/" aria-label={t("homeLogo")}>
                    <Wordmark />
                  </Link>
                  <Dialog.Close className="tool-btn" aria-label={t("close")} data-open="">
                    <span className="menu-lines" aria-hidden="true" />
                  </Dialog.Close>
                </div>

                <motion.nav
                  aria-label={t("main")}
                  className="container-x flex-1 pt-6"
                  initial="hidden"
                  animate="shown"
                  exit="hidden"
                  variants={{
                    hidden: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
                    shown: { transition: { delayChildren: 0.25, staggerChildren: STAGGER.items } },
                  }}
                >
                  <ul>
                    {SPACES.map((space, i) => {
                      const current = space.id === active.id;
                      return (
                        <li key={space.id} className="overflow-hidden border-b border-line">
                          <motion.div
                            variants={{
                              hidden: { y: "100%", transition: { duration: DUR.short, ease: EASE.in } },
                              shown: { y: 0, transition: { duration: DUR.long, ease: EASE.out } },
                            }}
                          >
                            <Link
                              href={space.href}
                              onClick={() => setMenuOpen(false)}
                              aria-current={current ? "page" : undefined}
                              className="flex items-baseline gap-4 py-3.5"
                            >
                              <span className={cn("font-mono text-[11px]", current ? "text-accent" : "text-dim")}>
                                {String(i + 1).padStart(2, "0")}
                              </span>
                              <span className={cn("display text-[clamp(40px,11vw,64px)]", current ? "text-fg" : "text-muted")}>
                                {t(`spaces.${space.id}`)}
                              </span>
                            </Link>
                          </motion.div>
                        </li>
                      );
                    })}
                  </ul>
                </motion.nav>

                <motion.div
                  className="container-x flex flex-col gap-6 py-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { delay: 0.6, duration: DUR.base } }}
                  exit={{ opacity: 0, transition: { duration: DUR.micro } }}
                >
                  <div className="flex flex-wrap items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        setPaletteOpen(true);
                      }}
                      className="tool-btn gap-2"
                    >
                      <Search size={16} aria-hidden="true" />
                      <span className="text-[13px]">{t("tools.search")}</span>
                    </button>
                    <ThemeButton />
                    <LocaleButton />
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-4 text-[13px] text-muted">
                    <NowStatusSegment />
                    <span className="flex gap-5">
                      {(["tiktok", "discord"] as const).map((id) => (
                        <a key={id} href={SOCIALS[id].url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-fg">
                          {id === "tiktok" ? "TikTok" : "Discord"}
                          <ArrowUpRight size={13} aria-hidden="true" />
                        </a>
                      ))}
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
