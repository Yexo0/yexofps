// src/config/career.ts — Données de l'espace Parcours : frise, compétences, missions, tutos, infra BTS.
// Les textes sont dans messages/*.json sous career.* (même id que ci-dessous).
// Règle : aucune expérience, mission ou diplôme ne doit être ajouté ici sans être réel.

/* ─── Tutos PDF (public/docs) ───────────────────────────── */

export const DOCS = [
  { id: "zabbix", file: "/docs/tuto-zabbix.pdf", category: "monitoring", pages: 11 },
  { id: "vlan", file: "/docs/tuto-vlan.pdf", category: "virtualization", pages: 4 },
  { id: "gpo", file: "/docs/tuto-gpo.pdf", category: "system", pages: 6 },
  { id: "ad", file: "/docs/tuto-ad.pdf", category: "system", pages: 5 },
  { id: "wifi", file: "/docs/tuto-wifi.pdf", category: "network", pages: 3 },
  { id: "glpi", file: "/docs/tuto-glpi.pdf", category: "itsm", pages: 16 },
  { id: "ipfire", file: "/docs/tuto-ipfire.pdf", category: "security", pages: 8 },
  { id: "proxmox", file: "/docs/tuto-proxmox.pdf", category: "virtualization", pages: 25 },
  { id: "esxi", file: "/docs/tuto-esxi.pdf", category: "virtualization", pages: 3 },
  { id: "dhcpdns", file: "/docs/tuto-dhcpdns.pdf", category: "network", pages: 6 },
] as const;

export type DocId = (typeof DOCS)[number]["id"];

/* ─── Frise (du plus récent au plus ancien) ─────────────── */
// Dates et textes dans messages : career.timeline.items.<id>

export const TIMELINE = [
  { id: "workStudy", current: true, anchor: undefined },
  { id: "bachelor", current: true, anchor: undefined },
  { id: "bts", current: false, anchor: undefined },
  { id: "internship", current: false, anchor: "#missions" },
  { id: "but", current: false, anchor: undefined },
  { id: "bac", current: false, anchor: undefined },
] as const;

/* ─── Compétences (accordéon) ───────────────────────────── */

export const SKILLS = [
  { id: "support", icon: "headphones", tags: ["GLPI", "Tickets", "N1 / N2"] },
  { id: "windows", icon: "directory", tags: ["Windows Server", "Active Directory", "GPO", "DHCP", "DNS"] },
  { id: "virtualization", icon: "boxes", tags: ["VMware ESXi", "Proxmox", "Hyper-V"] },
  { id: "network", icon: "network", tags: ["VLAN", "Inter-VLAN", "MikroTik", "Zyxel", "Cisco", "pfSense", "IPFire"] },
  { id: "linux", icon: "terminal", tags: ["Debian", "Ubuntu", "Zabbix", "MariaDB"] },
  { id: "inventory", icon: "clipboard", tags: ["GLPI", "FusionInventory", "FOG"] },
  { id: "code", icon: "code", tags: ["Python", "C#", "HTML / CSS / JS", "Git"] },
  { id: "soft", icon: "users", tags: [] },
] as const;

/* ─── Missions de stage (textes : career.missions.items.<id>) ── */

export const MISSIONS = ["support", "project", "assistance", "inventory", "communication"] as const;

/* ─── Schéma du réseau de formation (BTS) ───────────────── */
// Repère 1000 × 510, nœud = 150 × 46. Libellés et rôles : career.infra.nodes.<id>

export const BTS_MAP = {
  width: 1000,
  height: 510,
  nodes: [
    { id: "school", icon: "globe", x: 0, y: 40 },
    { id: "router", icon: "router", x: 0, y: 150 },
    { id: "vswRed", icon: "switch", x: 200, y: 150 },
    { id: "ipfire", icon: "shield", x: 395, y: 150 },
    { id: "vswGreen", icon: "switch", x: 590, y: 150 },
    { id: "glpi", icon: "ticket", x: 830, y: 40 },
    { id: "fog", icon: "deploy", x: 830, y: 150 },
    { id: "winsrv", icon: "directory", x: 830, y: 260 },
    { id: "wordpress", icon: "web", x: 395, y: 276 },
    { id: "switch", icon: "switch", x: 590, y: 455 },
    { id: "wifi", icon: "wifi", x: 830, y: 455 },
  ],
  links: [
    { from: "school", to: "router" },
    { from: "router", to: "vswRed" },
    { from: "vswRed", to: "ipfire" },
    { from: "ipfire", to: "vswGreen" },
    { from: "ipfire", to: "wordpress" },
    { from: "vswGreen", to: "glpi" },
    { from: "vswGreen", to: "fog" },
    { from: "vswGreen", to: "winsrv" },
    { from: "vswGreen", to: "switch" },
    { from: "switch", to: "wifi" },
  ],
  groups: [
    { id: "vmware", x: 180, y: 10, w: 815, h: 412 },
    { id: "dmz", x: 380, y: 262, w: 180, h: 92 },
  ],
} as const;
