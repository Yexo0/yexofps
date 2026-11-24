// src/config/projects.ts — Projects shown on /projects and their own pages (/projects/<slug>).
// Texts (name, one-liner, summary, highlights) live in messages/*.json under projects.items.<id>.
// Rule: only real projects, with facts taken from their repositories. Nothing invented.
//
// cover.motif draws the project's plate (src/components/projects/motifs.tsx); cover.media shows a real
// capture inside it when there is one. Files in public/videos/ are cached one year (immutable): rename
// them (v2…) whenever they change.

export type ProjectId = "yexofx" | "claimd" | "yexoclip" | "site" | "homelab" | "yexound" | "sens" | "weather" | "guides";

export type ProjectStatus = "released" | "inProgress" | "live" | "school";

export interface ProjectMedia {
  type: "image" | "video";
  src: string;
  /** Intrinsic size, for layout without jumps */
  width: number;
  height: number;
  /** Shown before the video plays */
  poster?: string;
}

export interface Project {
  id: ProjectId;
  slug: string;
  year: string;
  status: ProjectStatus;
  stack: readonly string[];
  /** Big tile on the grid */
  featured?: boolean;
  cover: { motif: ProjectId; media?: ProjectMedia };
  /** Extra captures on the project page */
  gallery?: readonly ProjectMedia[];
  /** Source code (public repositories only) */
  repo?: string;
  /** Related page of this site (homelab, hosting, guides…) */
  related?: "/lab" | "/lab/site" | "/career";
  relatedHash?: string;
}

export const PROJECTS: readonly Project[] = [
  {
    id: "yexofx",
    slug: "yexofx",
    year: "2026",
    status: "released",
    stack: ["After Effects", "CEP", "ExtendScript", "JavaScript", "Node.js"],
    featured: true,
    cover: {
      motif: "yexofx",
      media: { type: "video", src: "/videos/projects/yexofx-killhit-v1.mp4", width: 432, height: 540, poster: "/images/projects/yexofx-killhit.webp" },
    },
    gallery: [
      { type: "video", src: "/videos/projects/yexofx-rgbpunch-v1.mp4", width: 432, height: 540, poster: "/images/projects/yexofx-rgbpunch.webp" },
      { type: "video", src: "/videos/projects/yexofx-glitch-v1.mp4", width: 432, height: 540, poster: "/images/projects/yexofx-glitch.webp" },
      { type: "video", src: "/videos/projects/yexofx-feed-v1.mp4", width: 432, height: 540, poster: "/images/projects/yexofx-feed.webp" },
    ],
  },
  {
    id: "claimd",
    slug: "claimd",
    year: "2026",
    status: "released",
    stack: ["Python", "FastAPI", "Docker", "JavaScript"],
    featured: true,
    cover: { motif: "claimd", media: { type: "image", src: "/images/projects/claimd-mobile.webp", width: 585, height: 1266 } },
    gallery: [
      { type: "video", src: "/videos/projects/claimd-demo-v1.mp4", width: 800, height: 786, poster: "/images/projects/claimd-demo.webp" },
      { type: "image", src: "/images/projects/claimd-check.webp", width: 1600, height: 409 },
    ],
    repo: "https://github.com/Yexo0/Claimd",
  },
  {
    id: "yexoclip",
    slug: "yexoclip",
    year: "2026",
    status: "inProgress",
    stack: ["Python", "ffmpeg", "NVENC", "OpenCV", "FastAPI"],
    cover: { motif: "yexoclip" },
  },
  {
    id: "site",
    slug: "yexofps-org",
    year: "2026",
    status: "live",
    stack: ["Next.js", "React", "TypeScript", "three.js", "Tailwind CSS"],
    cover: { motif: "site" },
    related: "/lab/site",
  },
  {
    id: "homelab",
    slug: "homelab",
    year: "2022",
    status: "live",
    stack: ["pfSense", "VMware ESXi", "Zabbix", "Cisco", "MikroTik"],
    cover: { motif: "homelab" },
    related: "/lab",
  },
  {
    id: "yexound",
    slug: "yexound",
    year: "2026",
    status: "inProgress",
    stack: [],
    cover: { motif: "yexound" },
  },
  {
    id: "sens",
    slug: "sensitivity-converter",
    year: "2026",
    status: "live",
    stack: ["TypeScript", "React"],
    cover: { motif: "sens" },
  },
  {
    id: "weather",
    slug: "weather-dashboard",
    year: "2026",
    status: "school",
    stack: ["Python", "Streamlit", "pandas", "Plotly", "SQLite"],
    cover: { motif: "weather" },
    repo: "https://github.com/Yexo0/dashboard_meteo",
  },
  {
    id: "guides",
    slug: "it-guides",
    year: "2024 – 2026",
    status: "school",
    stack: ["Proxmox", "GLPI", "Zabbix", "Active Directory", "IPFire"],
    cover: { motif: "guides" },
    related: "/career",
    relatedHash: "#docs",
  },
];

export function projectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

/** Next project (wraps around), for the link at the bottom of a project page */
export function nextProject(id: ProjectId): Project {
  const i = PROJECTS.findIndex((p) => p.id === id);
  return PROJECTS[(i + 1) % PROJECTS.length];
}
