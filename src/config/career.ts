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
