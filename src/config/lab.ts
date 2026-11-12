// src/config/lab.ts — Homelab : tout l'espace Lab (et le fastfetch de l'accueil) est généré depuis ce fichier.
//
// RÉEL (donné par Baptiste) :
//   - homelab perso depuis 2022 : pare-feu pfSense, switchs Cisco et MikroTik, hyperviseur ESXi, supervision Zabbix
//   - un VPS Ubuntu qui héberge ce site
//   - un lab Hyper-V pour l'école : serveur Debian (DHCP, FTP, MariaDB, routage inter-VLAN),
//     Windows Server, clients Windows et Linux
//
// INVENTÉ pour compléter une infra cohérente : chaque élément concerné porte `placeholder: true`
// et un commentaire "PLACEHOLDER" qui dit ce qui est inventé. Remplace les valeurs puis passe
// `placeholder` à false (ou supprime-le).
//
// Les textes (rôle de chaque nœud, description des VLAN) sont dans messages/*.json sous lab.*.

export type LabIcon =
  | "globe"
  | "cloud"
  | "shield"
  | "switch"
  | "wifi"
  | "server"
  | "storage"
  | "desktop"
  | "users"
  | "directory"
  | "monitor"
  | "backup"
  | "container"
  | "proxy"
  | "web"
  | "router"
  | "database"
  | "laptop";

export const LAB_SINCE = 2022; // réel

/* ─── VLAN ──────────────────────────────────────────────── */

export interface Vlan {
  id: number;
  /** Clé des textes dans messages : lab.vlans.<key> */
  key: "admin" | "srv" | "dmz" | "lab" | "home" | "iot";
  name: string;
  subnet: string;
  placeholder?: boolean;
}

// PLACEHOLDER : découpage et plan d'adressage inventés (10.10.<VLAN>.0/24)
export const VLANS: readonly Vlan[] = [
  { id: 10, key: "admin", name: "ADMIN", subnet: "10.10.10.0/24", placeholder: true },
  { id: 20, key: "srv", name: "SRV", subnet: "10.10.20.0/24", placeholder: true },
  { id: 30, key: "dmz", name: "DMZ", subnet: "10.10.30.0/24", placeholder: true },
  { id: 40, key: "lab", name: "LAB", subnet: "10.10.40.0/24", placeholder: true },
  { id: 50, key: "home", name: "HOME", subnet: "10.10.50.0/24", placeholder: true },
  { id: 60, key: "iot", name: "IOT", subnet: "10.10.60.0/24", placeholder: true },
];

/* ─── Machines physiques et VPS ─────────────────────────── */

export interface Host {
  /** Nom d'hôte, sert aussi de clé dans messages : lab.nodes.<id> */
  id: string;
  kind: "firewall" | "switch" | "ap" | "hypervisor" | "nas" | "workstation" | "vps";
  icon: LabIcon;
  hardware: string;
  os: string;
  cpu?: { model: string; cores: number; threads: number };
  ramGb?: number;
  /** Disques, en To */
  storage?: readonly { label: string; tb: number }[];
  vlans: readonly number[];
  tags: readonly string[];
  placeholder?: boolean;
}

export const HOSTS: readonly Host[] = [
  {
    // PLACEHOLDER : matériel, version et specs inventés (pfSense en pare-feu est réel)
    id: "fw01",
    kind: "firewall",
    icon: "shield",
    hardware: "Mini PC N100 · 4 × i226-V",
    os: "pfSense CE 2.7",
    cpu: { model: "Intel N100", cores: 4, threads: 4 },
    ramGb: 8,
    storage: [{ label: "SSD", tb: 0.128 }],
    vlans: [10, 20, 30, 40, 50, 60],
    tags: ["WireGuard", "Unbound", "NAT", "802.1Q"],
    placeholder: true,
  },
  {
    // PLACEHOLDER : modèle inventé (un switch MikroTik dans le homelab est réel)
    id: "sw-core",
    kind: "switch",
    icon: "switch",
    hardware: "MikroTik CRS326-24G-2S+",
    os: "RouterOS 7",
    vlans: [10, 20, 30, 40, 50, 60],
    tags: ["802.1Q", "Trunk", "SFP+"],
    placeholder: true,
  },
  {
    // PLACEHOLDER : modèle inventé (un switch Cisco dans le homelab est réel)
    id: "sw-lab",
    kind: "switch",
    icon: "switch",
    hardware: "Cisco Catalyst 2960-X 24 ports",
    os: "Cisco IOS 15",
    vlans: [10, 40, 50],
    tags: ["IOS", "802.1Q", "SSH"],
    placeholder: true,
  },
  {
    // PLACEHOLDER : borne Wi-Fi entièrement inventée
    id: "ap01",
    kind: "ap",
    icon: "wifi",
    hardware: "TP-Link Omada EAP650",
    os: "Omada",
    vlans: [10, 50, 60],
    tags: ["Wi-Fi 6", "WPA3", "PoE"],
    placeholder: true,
  },
  {
    // PLACEHOLDER : serveur, CPU, RAM, disques et version inventés (l'hyperviseur ESXi est réel)
    id: "esxi01",
    kind: "hypervisor",
    icon: "server",
    hardware: "Dell PowerEdge T330",
    os: "VMware ESXi 8.0",
    cpu: { model: "Xeon E3-1270 v6", cores: 4, threads: 8 },
    ramGb: 64,
    storage: [
      { label: "SSD RAID 1", tb: 1.92 },
      { label: "HDD", tb: 4 },
    ],
    vlans: [10, 20, 30],
    tags: ["vSwitch", "Port groups", "iDRAC"],
    placeholder: true,
  },
  {
    // PLACEHOLDER : NAS entièrement inventé
    id: "nas01",
    kind: "nas",
    icon: "storage",
    hardware: "Synology DS220+",
    os: "DSM 7.2",
    cpu: { model: "Celeron J4025", cores: 2, threads: 2 },
    ramGb: 6,
    storage: [{ label: "HDD RAID 1", tb: 8 }],
    vlans: [10, 20],
    tags: ["SMB", "NFS", "Hyper Backup"],
    placeholder: true,
  },
  {
    // PLACEHOLDER : machine et specs inventées (le lab Hyper-V pour l'école est réel)
    id: "hv-lab",
    kind: "workstation",
    icon: "desktop",
    hardware: "PC Ryzen 7 5700X",
    os: "Windows 11 Pro · Hyper-V",
    cpu: { model: "Ryzen 7 5700X", cores: 8, threads: 16 },
    ramGb: 32,
    storage: [{ label: "NVMe", tb: 1 }],
    vlans: [40, 50],
    tags: ["Hyper-V", "vSwitch"],
    placeholder: true,
  },
  {
    // PLACEHOLDER : specs et version d'Ubuntu inventées (un VPS Ubuntu qui héberge ce site est réel)
    id: "vps01",
    kind: "vps",
    icon: "cloud",
    hardware: "VPS",
    os: "Ubuntu 24.04 LTS",
    cpu: { model: "vCPU", cores: 2, threads: 2 },
    ramGb: 4,
    storage: [{ label: "NVMe", tb: 0.08 }],
    vlans: [],
    tags: ["Nginx", "Let's Encrypt", "UFW", "fail2ban", "Node.js"],
    placeholder: true,
  },
];

/* ─── Machines virtuelles ───────────────────────────────── */

export interface Vm {
  id: string;
  host: string;
  icon: LabIcon;
  os: string;
  vlan: number;
  vcpu: number;
  ramGb: number;
  services: readonly string[];
  placeholder?: boolean;
}

export const VMS: readonly Vm[] = [
  // PLACEHOLDER : VM d'AD de test inventée (domaine lab.yexo.lan)
  { id: "dc01", host: "esxi01", icon: "directory", os: "Windows Server 2022", vlan: 20, vcpu: 2, ramGb: 4, services: ["AD DS", "DNS"], placeholder: true },
  // PLACEHOLDER : OS, version et ressources inventés (Zabbix est réel)
  { id: "zbx01", host: "esxi01", icon: "monitor", os: "Debian 12", vlan: 20, vcpu: 2, ramGb: 4, services: ["Zabbix 7.0 LTS", "PostgreSQL"], placeholder: true },
  // PLACEHOLDER : VM inventée
  { id: "glpi01", host: "esxi01", icon: "database", os: "Debian 12", vlan: 20, vcpu: 1, ramGb: 2, services: ["GLPI 10", "MariaDB"], placeholder: true },
  // PLACEHOLDER : VM inventée
  { id: "bkp01", host: "esxi01", icon: "backup", os: "Windows Server 2022", vlan: 20, vcpu: 2, ramGb: 8, services: ["Veeam B&R CE"], placeholder: true },
  // PLACEHOLDER : VM inventée
  { id: "dock01", host: "esxi01", icon: "container", os: "Debian 12", vlan: 20, vcpu: 2, ramGb: 4, services: ["Docker", "Uptime Kuma", "Homepage"], placeholder: true },
  // PLACEHOLDER : VM inventée
  { id: "rp01", host: "esxi01", icon: "proxy", os: "Debian 12", vlan: 30, vcpu: 1, ramGb: 1, services: ["Nginx"], placeholder: true },
  // PLACEHOLDER : VM inventée
  { id: "web01", host: "esxi01", icon: "web", os: "Ubuntu 24.04", vlan: 30, vcpu: 1, ramGb: 2, services: ["Node.js", "Next.js"], placeholder: true },
  // PLACEHOLDER : version de Debian et ressources inventées (le serveur Debian et ses services sont réels)
  { id: "deb-srv", host: "hv-lab", icon: "router", os: "Debian 12", vlan: 40, vcpu: 2, ramGb: 2, services: ["DHCP", "FTP", "MariaDB", "Inter-VLAN"], placeholder: true },
  // PLACEHOLDER : version et ressources inventées (Windows Server est réel)
  { id: "win-srv", host: "hv-lab", icon: "server", os: "Windows Server 2022", vlan: 40, vcpu: 2, ramGb: 4, services: ["Windows Server"], placeholder: true },
  // PLACEHOLDER : version et ressources inventées (un client Windows est réel)
  { id: "cli-win", host: "hv-lab", icon: "laptop", os: "Windows 11", vlan: 40, vcpu: 2, ramGb: 4, services: ["Client"], placeholder: true },
  // PLACEHOLDER : distribution et ressources inventées (un client Linux est réel)
  { id: "cli-linux", host: "hv-lab", icon: "laptop", os: "Ubuntu Desktop 24.04", vlan: 40, vcpu: 2, ramGb: 4, services: ["Client"], placeholder: true },
];

/* ─── Technos (chips) ───────────────────────────────────── */

export const TECHNOLOGIES = [
  { label: "pfSense", icon: "shield" }, // réel
  { label: "Cisco IOS", icon: "switch" }, // réel (switch Cisco)
  { label: "MikroTik", icon: "switch" }, // réel
  { label: "VMware ESXi", icon: "server" }, // réel
  { label: "Hyper-V", icon: "desktop" }, // réel
  { label: "Zabbix", icon: "monitor" }, // réel
  { label: "Debian", icon: "router" }, // réel
  { label: "Ubuntu", icon: "cloud" }, // réel
  { label: "Windows Server", icon: "directory" }, // réel
  { label: "WireGuard", icon: "proxy", placeholder: true }, // PLACEHOLDER : VPN inventé
  { label: "Veeam", icon: "backup", placeholder: true }, // PLACEHOLDER : sauvegarde inventée
  { label: "Docker", icon: "container", placeholder: true }, // PLACEHOLDER
] as const;

/* ─── Schéma réseau ─────────────────────────────────────── */
// Coordonnées dans un repère de 1000 × 530 (coin haut-gauche des nœuds, nœud = 150 × 46).

export interface LabMapNode {
  id: string;
  icon: LabIcon;
  x: number;
  y: number;
}
export interface LabMapLink {
  from: string;
  to: string;
  /** solid = câble, dashed = tunnel/VPN, logical = relation non dessinée (affichée dans le panneau) */
  kind?: "solid" | "dashed" | "logical";
  /** Clé de texte : lab.map.links.<label> */
  label?: string;
}
export interface LabMapGroup {
  id: string;
  /** Texte affiché tel quel (identifiant technique) */
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export const LAB_MAP = {
  width: 1000,
  height: 530,
  nodes: [
    { id: "internet", icon: "globe", x: 0, y: 236 },
    { id: "vps01", icon: "cloud", x: 195, y: 60 },
    { id: "fw01", icon: "shield", x: 195, y: 236 },
    { id: "sw-core", icon: "switch", x: 390, y: 236 },
    { id: "esxi01", icon: "server", x: 585, y: 120 },
    { id: "nas01", icon: "storage", x: 585, y: 228 },
    { id: "sw-lab", icon: "switch", x: 585, y: 340 },
    { id: "ap01", icon: "wifi", x: 585, y: 440 },
    { id: "dc01", icon: "directory", x: 815, y: 28 },
    { id: "zbx01", icon: "monitor", x: 815, y: 84 },
    { id: "bkp01", icon: "backup", x: 815, y: 140 },
    { id: "rp01", icon: "proxy", x: 815, y: 240 },
    { id: "hv-lab", icon: "desktop", x: 815, y: 340 },
    { id: "clients", icon: "users", x: 815, y: 440 },
  ] satisfies LabMapNode[],
  links: [
    { from: "internet", to: "fw01" },
    { from: "internet", to: "vps01" },
    { from: "vps01", to: "fw01", kind: "dashed", label: "tunnel" },
    { from: "fw01", to: "sw-core" },
    { from: "sw-core", to: "esxi01" },
    { from: "sw-core", to: "nas01" },
    { from: "sw-core", to: "sw-lab" },
    { from: "sw-core", to: "ap01" },
    { from: "esxi01", to: "dc01" },
    { from: "esxi01", to: "zbx01" },
    { from: "esxi01", to: "bkp01" },
    { from: "esxi01", to: "rp01" },
    { from: "sw-lab", to: "hv-lab" },
    { from: "ap01", to: "clients" },
    { from: "bkp01", to: "nas01", kind: "logical" },
    { from: "zbx01", to: "vps01", kind: "logical" },
    { from: "rp01", to: "vps01", kind: "logical" },
  ] satisfies LabMapLink[],
  groups: [
    { id: "srv", label: "VLAN 20 · SRV", x: 795, y: 16, w: 190, h: 200 },
    { id: "dmz", label: "VLAN 30 · DMZ", x: 795, y: 228, w: 190, h: 88 },
    { id: "lab", label: "VLAN 40 · LAB", x: 795, y: 328, w: 190, h: 88 },
    { id: "home", label: "VLAN 50-60 · HOME / IOT", x: 795, y: 428, w: 190, h: 88 },
  ] satisfies LabMapGroup[],
} as const;

/* ─── Totaux (calculés, jamais saisis à la main) ────────── */

export function labStats() {
  const compute = HOSTS.filter((h) => h.cpu);
  const storageTb = HOSTS.reduce((sum, h) => sum + (h.storage ?? []).reduce((s, d) => s + d.tb, 0), 0);
  return {
    machines: compute.length,
    vms: VMS.length,
    vlans: VLANS.length,
    threads: compute.reduce((sum, h) => sum + (h.cpu?.threads ?? 0), 0),
    ramGb: compute.reduce((sum, h) => sum + (h.ramGb ?? 0), 0),
    storageTb: Math.round(storageTb),
  };
}

export function getHost(id: string) {
  return HOSTS.find((h) => h.id === id);
}

export function vmsOf(hostId: string) {
  return VMS.filter((vm) => vm.host === hostId);
}
