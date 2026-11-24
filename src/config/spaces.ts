// src/config/spaces.ts — The 7 spaces of the site: order, URL, icon.
// The number shown (01…07) and the keyboard shortcut (1…7) follow the array order.
import { Briefcase, Clapperboard, Gamepad2, House, LayoutGrid, Mail, Network, type LucideIcon } from "lucide-react";

export type SpaceId = "home" | "projects" | "career" | "lab" | "creator" | "gaming" | "contact";

export interface Space {
  id: SpaceId;
  href: "/" | "/projects" | "/career" | "/lab" | "/creator" | "/gaming" | "/contact";
  icon: LucideIcon;
  /** Other pages that belong to this space (navigation marks the space as current on them) */
  aliases?: readonly string[];
}

export const SPACES: readonly Space[] = [
  { id: "home", href: "/", icon: House, aliases: ["/baptiste"] },
  { id: "projects", href: "/projects", icon: LayoutGrid },
  { id: "career", href: "/career", icon: Briefcase },
  { id: "lab", href: "/lab", icon: Network },
  { id: "creator", href: "/creator", icon: Clapperboard },
  { id: "gaming", href: "/gaming", icon: Gamepad2 },
  { id: "contact", href: "/contact", icon: Mail, aliases: ["/now"] },
];

export function spaceIndex(id: SpaceId): number {
  return SPACES.findIndex((s) => s.id === id) + 1;
}

export function getSpace(id: SpaceId): Space {
  return SPACES.find((s) => s.id === id)!;
}

/** Next space (the last one leads back home). */
export function nextSpace(id: SpaceId): Space {
  const i = SPACES.findIndex((s) => s.id === id);
  return SPACES[(i + 1) % SPACES.length];
}

/** Current space from a path without its language prefix. */
export function spaceFromPath(pathname: string): Space {
  const path = pathname.replace(/\/$/, "") || "/";
  const match = SPACES.find((s) =>
    [s.href, ...(s.aliases ?? [])].some((href) => href !== "/" && (path === href || path.startsWith(`${href}/`))),
  );
  return match ?? SPACES[0];
}
