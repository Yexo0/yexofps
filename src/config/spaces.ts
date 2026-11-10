// src/config/spaces.ts — Les 7 espaces du site : ordre, URL, icône.
// Le numéro affiché (01…07) et le raccourci clavier (1…7) suivent l'ordre du tableau.
import {
  Briefcase,
  Clapperboard,
  Gamepad2,
  House,
  Mail,
  Network,
  SlidersHorizontal,
  type LucideIcon,
} from "lucide-react";

export type SpaceId = "home" | "career" | "lab" | "gaming" | "creator" | "tools" | "contact";

export interface Space {
  id: SpaceId;
  href: "/" | "/career" | "/lab" | "/gaming" | "/creator" | "/tools" | "/contact";
  icon: LucideIcon;
  /** Affiché dans la barre mobile principale (les autres passent dans "Plus"). */
  mobile: boolean;
}

export const SPACES: readonly Space[] = [
  { id: "home", href: "/", icon: House, mobile: true },
  { id: "career", href: "/career", icon: Briefcase, mobile: true },
  { id: "lab", href: "/lab", icon: Network, mobile: true },
  { id: "gaming", href: "/gaming", icon: Gamepad2, mobile: true },
  { id: "creator", href: "/creator", icon: Clapperboard, mobile: true },
  { id: "tools", href: "/tools", icon: SlidersHorizontal, mobile: false },
  { id: "contact", href: "/contact", icon: Mail, mobile: false },
];

export function spaceIndex(id: SpaceId): number {
  return SPACES.findIndex((s) => s.id === id) + 1;
}

export function getSpace(id: SpaceId): Space {
  return SPACES.find((s) => s.id === id)!;
}

/** Espace suivant (le dernier renvoie vers l'accueil). */
export function nextSpace(id: SpaceId): Space {
  const i = SPACES.findIndex((s) => s.id === id);
  return SPACES[(i + 1) % SPACES.length];
}

/** Retrouve l'espace actif à partir du chemin (sans préfixe de langue). */
export function spaceFromPath(pathname: string): Space {
  const match = SPACES.filter((s) => s.href !== "/").find(
    (s) => pathname === s.href || pathname.startsWith(`${s.href}/`),
  );
  return match ?? SPACES[0];
}
