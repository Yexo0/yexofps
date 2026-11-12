// src/lib/nav-direction.ts — Sens d'une navigation entre pages, pour orienter la transition :
// vers un espace plus loin dans le rail (ou une sous-page) = "forward", plus haut = "back".
// Posé sur <html data-nav-dir> juste avant la navigation, lu par le CSS des View Transitions.
import { SPACES, spaceFromPath } from "@/config/spaces";
import { routing } from "@/i18n/routing";

/** "/fr/gaming/settings" → "/gaming/settings" */
function stripLocale(pathname: string): string {
  const [, first, ...rest] = pathname.split("/");
  return (routing.locales as readonly string[]).includes(first) ? `/${rest.join("/")}` : pathname;
}

export function markNavigation(href: string) {
  if (typeof window === "undefined") return;
  const url = new URL(href, window.location.href);
  if (url.origin !== window.location.origin) return;
  const from = stripLocale(window.location.pathname).replace(/\/$/, "") || "/";
  const to = stripLocale(url.pathname).replace(/\/$/, "") || "/";
  if (from === to) return;
  const a = SPACES.indexOf(spaceFromPath(from));
  const b = SPACES.indexOf(spaceFromPath(to));
  // Même espace : plus profond (sous-page) = en avant
  const dir = b !== a ? (b > a ? "forward" : "back") : to.startsWith(`${from}/`) ? "forward" : "back";
  document.documentElement.dataset.navDir = dir;
}
