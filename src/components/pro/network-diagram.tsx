// src/components/pro/network-diagram.tsx
"use client";

import { useState } from "react";

/* ─── Data ────────────────────────────────────────────────── */

interface DeviceInfo {
  id: string;
  label: string;
  ip: string;
  details: string;
  zone: "red" | "green" | "dmz" | "ext" | "vm";
}

const DEVICES: DeviceInfo[] = [
  { id: "cloud", label: "Réseau Lycée", ip: "DHCP", details: "Réseau externe du Lycée — attribution d'adresse par DHCP", zone: "ext" },
  { id: "router", label: "Routeur", ip: "192.168.1.1/24", details: "Routeur principal — passerelle vers le réseau du lycée via DHCP", zone: "ext" },
  { id: "vswitch-red", label: "VSwitch Red", ip: "192.168.1.0/24", details: "Switch virtuel VMware côté WAN — réseau 192.168.1.0/24", zone: "red" },
  { id: "firewall", label: "FireWall", ip: "Red: .1.14 | Green: .2.10", details: "IPFire — NAT, filtrage, passerelle Red↔Green. Interface Red: 192.168.1.14/24 — Interface Green: 192.168.2.10/24", zone: "vm" },
  { id: "vswitch-green", label: "VSwitch Green", ip: "192.168.2.0/24", details: "Switch virtuel VMware côté LAN — réseau 192.168.2.0/24", zone: "green" },
  { id: "switch", label: "Switch", ip: "—", details: "Switch physique — distribution LAN vers la borne WiFi", zone: "green" },
  { id: "wifi", label: "Borne Wifi", ip: "192.168.2.250/24", details: "Borne WiFi Cisco — accès sans fil au réseau LAN", zone: "green" },
  { id: "wordpress", label: "WordPress", ip: "192.168.2.13", details: "Serveur web en zone DMZ — héberge le site WordPress", zone: "dmz" },
  { id: "glpi", label: "GLPI", ip: "192.168.2.15", details: "ITSM — Inventaire, tickets, gestion du parc informatique", zone: "green" },
  { id: "fog", label: "FOG", ip: "192.168.2.156", details: "Serveur Linux — déploiement et clonage d'images", zone: "green" },
  { id: "winserver", label: "Windows Serveur", ip: "192.168.2.254", details: "Contrôleur de domaine — DHCP, DNS, Active Directory", zone: "green" },
];

const ZONE_STYLE: Record<string, { dot: string; text: string; border: string }> = {
  red: { dot: "bg-red-400", text: "text-red-400", border: "rgba(239,68,68,0.3)" },
  green: { dot: "bg-emerald-400", text: "text-emerald-400", border: "rgba(34,197,94,0.3)" },
  dmz: { dot: "bg-amber-400", text: "text-amber-400", border: "rgba(251,191,36,0.3)" },
  ext: { dot: "bg-purple-400", text: "text-purple-400", border: "rgba(167,139,250,0.3)" },
  vm: { dot: "bg-white/60", text: "text-white/80", border: "rgba(255,255,255,0.2)" },
};

/* ─── Animated dot (glow + white center) ─────────────────── */

function Dot({ path, color, dur, delay }: { path: string; color: string; dur: number; delay: number }) {
  return (
    <>
      <circle r="5" fill={color} opacity="0.3" filter="url(#glow)">
        <animateMotion dur={`${dur}s`} repeatCount="indefinite" begin={`${delay}s`} path={path} />
      </circle>
      <circle r="2.5" fill="white" opacity="0.85">
        <animateMotion dur={`${dur}s`} repeatCount="indefinite" begin={`${delay}s`} path={path} />
      </circle>
    </>
  );
}

/* ─── Connection definitions ─────────────────────────────── */

const FLOWS = [
  { path: "M120,400 L188,400", color: "#a78bfa", dur: 2 },
  { path: "M272,400 L495,400", color: "#e74c3c", dur: 3 },
  { path: "M560,378 L560,255", color: "#e74c3c", dur: 2.5 },
  { path: "M605,210 L895,210", color: "#2ecc71", dur: 3 },
  { path: "M960,178 L960,68", color: "#2ecc71", dur: 2 },
  { path: "M1020,38 L1148,38", color: "#2ecc71", dur: 2 },
  { path: "M960,240 L960,478 L700,478 L700,558", color: "#2ecc71", dur: 4 },
  { path: "M960,240 L960,478 L850,478 L850,558", color: "#2ecc71", dur: 3.8 },
  { path: "M960,240 L960,478 L1030,478 L1030,558", color: "#2ecc71", dur: 3.5 },
  { path: "M548,428 L548,472 L508,472 L508,552", color: "#f39c12", dur: 3 },
];

/* ─── Main component ─────────────────────────────────────── */

export function NetworkDiagram() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  const active = selected ?? hovered;
  const info = active ? DEVICES.find((d) => d.id === active) : null;
  const ev = (id: string) => ({
    onMouseEnter: () => setHovered(id),
    onMouseLeave: () => setHovered(null),
    onClick: () => setSelected(selected === id ? null : id),
  });
  const dim = (id: string) => (active && active !== id ? 0.25 : 1);

  return (
    <div className="space-y-4">
      {/* ──────── SVG Diagram ──────── */}
      <div className="glass-panel !p-4 sm:!p-6 overflow-x-auto">
        <svg viewBox="0 0 1300 750" className="w-full h-auto" style={{ minWidth: "600px" }}>
          <defs>
            {/* Gradients */}
            <linearGradient id="g-router" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#667eea" /><stop offset="100%" stopColor="#764ba2" /></linearGradient>
            <linearGradient id="g-fw" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#fc5c7d" /><stop offset="100%" stopColor="#e74c3c" /></linearGradient>
            <linearGradient id="g-swr" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#e74c3c" /><stop offset="100%" stopColor="#c0392b" /></linearGradient>
            <linearGradient id="g-swg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#2ecc71" /><stop offset="100%" stopColor="#27ae60" /></linearGradient>
            <linearGradient id="g-switch" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#4a5568" /><stop offset="100%" stopColor="#2d3748" /></linearGradient>
            <linearGradient id="g-wifi" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#38b2ac" /><stop offset="100%" stopColor="#2ecc71" /></linearGradient>
            <linearGradient id="g-wp" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f6ad55" /><stop offset="100%" stopColor="#ed8936" /></linearGradient>
            <linearGradient id="g-glpi" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#48bb78" /><stop offset="100%" stopColor="#38a169" /></linearGradient>
            <linearGradient id="g-fog" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#4299e1" /><stop offset="100%" stopColor="#3182ce" /></linearGradient>
            <linearGradient id="g-win" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#667eea" /><stop offset="100%" stopColor="#5a67d8" /></linearGradient>
            {/* Filters */}
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#000" floodOpacity="0.35" /></filter>
            <filter id="glow" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur stdDeviation="4" /></filter>
          </defs>

          {/* ════════ BACKGROUNDS ════════ */}

          {/* VMware box */}
          <rect x="350" y="85" width="790" height="630" rx="20" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
          <text x="745" y="118" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="18" fontWeight="700" letterSpacing="2">Serveur VMware</text>

          {/* DMZ zone */}
          <rect x="408" y="498" width="200" height="185" rx="12" fill="rgba(243,156,18,0.04)" stroke="rgba(243,156,18,0.3)" strokeWidth="1.5" strokeDasharray="8 4" />
          <text x="508" y="522" textAnchor="middle" fill="rgba(243,156,18,0.65)" fontSize="14" fontWeight="700">DMZ</text>

          {/* WinServices detail */}
          <rect x="965" y="648" width="130" height="52" rx="8" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          <text x="1030" y="666" textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="10" fontWeight="700">SERVICES :</text>
          <text x="1030" y="680" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="9">DHCP · DNS · Active Directory</text>
          <text x="1030" y="692" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="9">GPO</text>
          <line x1="1030" y1="640" x2="1030" y2="648" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

          {/* ════════ CONNECTION LINES ════════ */}

          {/* Cloud → Router (purple) */}
          <line x1="120" y1="400" x2="188" y2="400" stroke="rgba(167,139,250,0.45)" strokeWidth="3" />
          {/* Router → VSwitch Red (red, enters VMware) */}
          <line x1="272" y1="400" x2="495" y2="400" stroke="rgba(231,76,60,0.45)" strokeWidth="3" />
          {/* VSwitch Red → FireWall (red, vertical up) */}
          <line x1="560" y1="378" x2="560" y2="255" stroke="rgba(231,76,60,0.45)" strokeWidth="3" />
          {/* FireWall → VSwitch Green (green, horizontal right) */}
          <line x1="605" y1="210" x2="895" y2="210" stroke="rgba(46,204,113,0.45)" strokeWidth="3" />
          {/* VSwitch Green → Switch (green, vertical up, exits VMware) */}
          <line x1="960" y1="178" x2="960" y2="68" stroke="rgba(46,204,113,0.45)" strokeWidth="3" />
          {/* Switch → WiFi (green, horizontal right) */}
          <line x1="1020" y1="38" x2="1148" y2="38" stroke="rgba(46,204,113,0.45)" strokeWidth="3" />

          {/* VSwitch Green → servers (green tree with right angles) */}
          <line x1="960" y1="240" x2="960" y2="478" stroke="rgba(46,204,113,0.38)" strokeWidth="2.5" />
          <line x1="700" y1="478" x2="1030" y2="478" stroke="rgba(46,204,113,0.38)" strokeWidth="2.5" />
          <line x1="700" y1="478" x2="700" y2="558" stroke="rgba(46,204,113,0.38)" strokeWidth="2.5" />
          <line x1="850" y1="478" x2="850" y2="558" stroke="rgba(46,204,113,0.38)" strokeWidth="2.5" />
          <line x1="1030" y1="478" x2="1030" y2="558" stroke="rgba(46,204,113,0.38)" strokeWidth="2.5" />

          {/* VSwitch Red → DMZ (amber dashed, right angles) */}
          <polyline points="548,428 548,472 508,472 508,552" fill="none" stroke="rgba(243,156,18,0.4)" strokeWidth="2.5" strokeDasharray="8 4" />

          {/* ════════ ANIMATED DOTS ════════ */}
          {FLOWS.map((f, i) => (
            <g key={i}>
              <Dot path={f.path} color={f.color} dur={f.dur} delay={0} />
              <Dot path={f.path} color={f.color} dur={f.dur} delay={f.dur * 0.5} />
            </g>
          ))}

          {/* ════════ IP LABELS ON CONNECTIONS ════════ */}

          <text x="150" y="390" textAnchor="middle" fill="rgba(167,139,250,0.6)" fontSize="12" fontWeight="600">DHCP</text>

          <text x="380" y="390" textAnchor="middle" fill="rgba(231,76,60,0.55)" fontSize="11" fontWeight="600">IP Fixe :</text>
          <text x="380" y="376" textAnchor="middle" fill="rgba(231,76,60,0.7)" fontSize="12" fontFamily="ui-monospace,monospace">192.168.1.1/24</text>

          <text x="580" y="320" fill="rgba(231,76,60,0.55)" fontSize="11" fontWeight="600">IP Fixe :</text>
          <text x="580" y="335" fill="rgba(231,76,60,0.7)" fontSize="12" fontFamily="ui-monospace,monospace">192.168.1.14/24</text>

          <text x="750" y="198" fill="rgba(46,204,113,0.55)" fontSize="11" fontWeight="600">IP Fixe :</text>
          <text x="750" y="230" fill="rgba(46,204,113,0.7)" fontSize="12" fontFamily="ui-monospace,monospace">192.168.2.10/24</text>

          {/* ════════ DEVICES ════════ */}

          {/* ── Cloud ── */}
          <g className="cursor-pointer" opacity={dim("cloud")} style={{ transition: "opacity .2s" }} {...ev("cloud")}>
            <ellipse cx="80" cy="395" rx="55" ry="28" fill="rgba(167,139,250,0.06)" stroke="rgba(167,139,250,0.25)" strokeWidth="1.5" />
            <text x="80" y="391" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="13" fontWeight="600">Réseau</text>
            <text x="80" y="407" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="13" fontWeight="600">Lycée</text>
          </g>

          {/* ── Router ── */}
          <g transform="translate(230,400)" className="cursor-pointer" opacity={dim("router")} style={{ transition: "opacity .2s" }} {...ev("router")}>
            <rect x="-42" y="-42" width="84" height="84" rx="18" fill="url(#g-router)" filter="url(#shadow)" />
            <rect x="-22" y="-8" width="44" height="16" rx="3" fill="white" opacity="0.85" />
            <line x1="-8" y1="-8" x2="-14" y2="-25" stroke="white" strokeWidth="2.5" opacity="0.7" />
            <circle cx="-14" cy="-27" r="3" fill="white" opacity="0.6" />
            <line x1="8" y1="-8" x2="14" y2="-25" stroke="white" strokeWidth="2.5" opacity="0.7" />
            <circle cx="14" cy="-27" r="3" fill="white" opacity="0.6" />
            <circle cx="-10" cy="0" r="2" fill="#2ecc71" /><circle cx="-2" cy="0" r="2" fill="#2ecc71" opacity="0.6" /><circle cx="6" cy="0" r="2" fill="#ef4444" opacity="0.5" />
            <text x="0" y="58" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="15" fontWeight="600">Routeur</text>
          </g>

          {/* ── VSwitch Red (inside VMware) ── */}
          <g transform="translate(560,400)" className="cursor-pointer" opacity={dim("vswitch-red")} style={{ transition: "opacity .2s" }} {...ev("vswitch-red")}>
            <rect x="-65" y="-23" width="130" height="46" rx="12" fill="url(#g-swr)" filter="url(#shadow)" />
            <rect x="-42" y="-10" width="84" height="20" rx="3" fill="white" opacity="0.15" />
            {[-32, -22, -12, -2, 8, 18, 28].map(px => <rect key={px} x={px} y={-6} width="6" height="12" rx="1" fill="white" opacity="0.5" />)}
            <text x="0" y="38" textAnchor="middle" fill="rgba(231,76,60,0.8)" fontSize="14" fontWeight="700">VSwitch Red</text>
          </g>

          {/* ── FireWall (inside VMware) ── */}
          <g transform="translate(560,210)" className="cursor-pointer" opacity={dim("firewall")} style={{ transition: "opacity .2s" }} {...ev("firewall")}>
            <rect x="-45" y="-45" width="90" height="90" rx="20" fill="url(#g-fw)" filter="url(#shadow)" />
            <rect x="-25" y="-6" width="50" height="20" rx="2" fill="white" opacity="0.15" />
            <line x1="-25" y1="1" x2="25" y2="1" stroke="white" strokeWidth="0.7" opacity="0.35" />
            <line x1="-25" y1="7" x2="25" y2="7" stroke="white" strokeWidth="0.7" opacity="0.35" />
            <line x1="0" y1="-6" x2="0" y2="1" stroke="white" strokeWidth="0.7" opacity="0.35" />
            <line x1="-12" y1="1" x2="-12" y2="7" stroke="white" strokeWidth="0.7" opacity="0.35" />
            <line x1="12" y1="1" x2="12" y2="7" stroke="white" strokeWidth="0.7" opacity="0.35" />
            <path d="M0,-22 C-4,-17 -8,-11 -8,-4 C-8,1 -4,3 0,1 C4,3 8,1 8,-4 C8,-11 4,-17 0,-22Z" fill="white" opacity="0.75" />
            <text x="0" y="62" textAnchor="middle" fill="rgba(255,255,255,0.75)" fontSize="16" fontWeight="700">FireWall</text>
          </g>

          {/* ── VSwitch Green (inside VMware) ── */}
          <g transform="translate(960,210)" className="cursor-pointer" opacity={dim("vswitch-green")} style={{ transition: "opacity .2s" }} {...ev("vswitch-green")}>
            <rect x="-65" y="-25" width="130" height="50" rx="12" fill="url(#g-swg)" filter="url(#shadow)" />
            <rect x="-42" y="-10" width="84" height="20" rx="3" fill="white" opacity="0.15" />
            {[-32, -22, -12, -2, 8, 18, 28].map(px => <rect key={px} x={px} y={-6} width="6" height="12" rx="1" fill="white" opacity="0.5" />)}
            <text x="0" y="42" textAnchor="middle" fill="rgba(46,204,113,0.85)" fontSize="14" fontWeight="700">VSwitch Green</text>
          </g>

          {/* ── Switch (outside VMware, top) ── */}
          <g transform="translate(960,38)" className="cursor-pointer" opacity={dim("switch")} style={{ transition: "opacity .2s" }} {...ev("switch")}>
            <rect x="-60" y="-22" width="120" height="44" rx="10" fill="url(#g-switch)" filter="url(#shadow)" />
            <rect x="-40" y="-10" width="80" height="16" rx="3" fill="white" opacity="0.15" />
            {[-30, -20, -10, 0, 10, 20, 30].map(px => <rect key={px} x={px - 3} y={-7} width="6" height="10" rx="1" fill="white" opacity="0.45" />)}
            <text x="0" y="35" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="14" fontWeight="600">Switch</text>
          </g>

          {/* ── Borne WiFi (outside VMware, top-right) ── */}
          <g transform="translate(1190,38)" className="cursor-pointer" opacity={dim("wifi")} style={{ transition: "opacity .2s" }} {...ev("wifi")}>
            <rect x="-42" y="-42" width="84" height="84" rx="18" fill="url(#g-wifi)" filter="url(#shadow)" />
            <rect x="-12" y="5" width="24" height="10" rx="3" fill="white" opacity="0.7" />
            <circle cx="0" cy="-3" r="3" fill="white" opacity="0.8" />
            <path d="M-8,-11 A11,11 0 0,1 8,-11" fill="none" stroke="white" strokeWidth="2.2" opacity="0.6" />
            <path d="M-15,-18 A19,19 0 0,1 15,-18" fill="none" stroke="white" strokeWidth="2.2" opacity="0.45" />
            <path d="M-22,-25 A27,27 0 0,1 22,-25" fill="none" stroke="white" strokeWidth="2.2" opacity="0.3" />
            <text x="0" y="58" textAnchor="middle" fill="rgba(255,255,255,0.65)" fontSize="14" fontWeight="600">Borne Wifi</text>
            <text x="0" y="74" textAnchor="middle" fill="rgba(46,204,113,0.6)" fontSize="11" fontFamily="ui-monospace,monospace">192.168.2.250</text>
          </g>

          {/* ── WordPress / DMZ (inside VMware) ── */}
          <g transform="translate(508,598)" className="cursor-pointer" opacity={dim("wordpress")} style={{ transition: "opacity .2s" }} {...ev("wordpress")}>
            <rect x="-40" y="-40" width="80" height="80" rx="16" fill="url(#g-wp)" filter="url(#shadow)" />
            <rect x="-16" y="-18" width="32" height="9" rx="2" fill="white" opacity="0.7" />
            <rect x="-16" y="-7" width="32" height="9" rx="2" fill="white" opacity="0.6" />
            <rect x="-16" y="4" width="32" height="9" rx="2" fill="white" opacity="0.5" />
            <circle cx="-8" cy="-14" r="2" fill="#f39c12" /><circle cx="-8" cy="-3" r="2" fill="#f39c12" opacity="0.7" /><circle cx="-8" cy="8" r="2" fill="#f39c12" opacity="0.5" />
            <text x="0" y="56" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="14" fontWeight="600">WordPress</text>
            <text x="0" y="72" textAnchor="middle" fill="rgba(243,156,18,0.65)" fontSize="11" fontFamily="ui-monospace,monospace">192.168.2.13</text>
          </g>

          {/* ── GLPI (inside VMware) ── */}
          <g transform="translate(700,598)" className="cursor-pointer" opacity={dim("glpi")} style={{ transition: "opacity .2s" }} {...ev("glpi")}>
            <rect x="-40" y="-40" width="80" height="80" rx="16" fill="url(#g-glpi)" filter="url(#shadow)" />
            <rect x="-16" y="-18" width="32" height="9" rx="2" fill="white" opacity="0.7" />
            <rect x="-16" y="-7" width="32" height="9" rx="2" fill="white" opacity="0.6" />
            <rect x="-16" y="4" width="32" height="9" rx="2" fill="white" opacity="0.5" />
            <circle cx="-8" cy="-14" r="2" fill="#2ecc71" /><circle cx="-8" cy="-3" r="2" fill="#2ecc71" opacity="0.7" /><circle cx="-8" cy="8" r="2" fill="#2ecc71" opacity="0.5" />
            <text x="0" y="56" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="14" fontWeight="600">GLPI</text>
            <text x="0" y="72" textAnchor="middle" fill="rgba(46,204,113,0.6)" fontSize="11" fontFamily="ui-monospace,monospace">192.168.2.15</text>
          </g>

          {/* ── FOG (inside VMware) ── */}
          <g transform="translate(850,598)" className="cursor-pointer" opacity={dim("fog")} style={{ transition: "opacity .2s" }} {...ev("fog")}>
            <rect x="-40" y="-40" width="80" height="80" rx="16" fill="url(#g-fog)" filter="url(#shadow)" />
            <ellipse cx="0" cy="0" rx="11" ry="14" fill="white" opacity="0.15" />
            <ellipse cx="0" cy="-10" rx="8" ry="8" fill="white" opacity="0.15" />
            <circle cx="-3" cy="-11" r="2" fill="white" opacity="0.8" />
            <circle cx="4" cy="-11" r="2" fill="white" opacity="0.8" />
            <path d="M-1,-7 L0.5,-4.5 L2,-7" fill="#e67e22" stroke="#e67e22" strokeWidth="0.7" />
            <ellipse cx="0" cy="2" rx="7" ry="9" fill="white" opacity="0.08" />
            <text x="0" y="56" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="14" fontWeight="600">FOG</text>
            <text x="0" y="72" textAnchor="middle" fill="rgba(66,153,225,0.65)" fontSize="11" fontFamily="ui-monospace,monospace">192.168.2.156</text>
          </g>

          {/* ── Windows Serveur (inside VMware) ── */}
          <g transform="translate(1030,598)" className="cursor-pointer" opacity={dim("winserver")} style={{ transition: "opacity .2s" }} {...ev("winserver")}>
            <rect x="-40" y="-40" width="80" height="80" rx="16" fill="url(#g-win)" filter="url(#shadow)" />
            <rect x="-16" y="-18" width="32" height="9" rx="2" fill="white" opacity="0.7" />
            <rect x="-16" y="-7" width="32" height="9" rx="2" fill="white" opacity="0.6" />
            <rect x="-16" y="4" width="32" height="9" rx="2" fill="white" opacity="0.5" />
            <circle cx="-8" cy="-14" r="2" fill="#60a5fa" /><circle cx="-8" cy="-3" r="2" fill="#60a5fa" opacity="0.7" /><circle cx="-8" cy="8" r="2" fill="#60a5fa" opacity="0.5" />
            <text x="0" y="56" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="13" fontWeight="600">Windows Serveur</text>
            <text x="0" y="72" textAnchor="middle" fill="rgba(102,126,234,0.65)" fontSize="11" fontFamily="ui-monospace,monospace">192.168.2.254</text>
          </g>

        </svg>
      </div>

      {/* ──────── Legend + Config panels (HTML) ──────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Legend */}
        <div className="glass-panel !p-5">
          <h3 className="text-white/50 font-bold text-sm tracking-widest mb-4">LÉGENDE</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-8 h-1 rounded-full bg-red-500 shrink-0" />
              <span className="text-white/50 text-sm">Réseau Red (WAN) : 192.168.1.0/24</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-8 h-1 rounded-full bg-emerald-500 shrink-0" />
              <span className="text-white/50 text-sm">Réseau Green (LAN) : 192.168.2.0/24</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-8 h-1 rounded-full bg-amber-500 shrink-0" />
              <span className="text-white/50 text-sm">DMZ : WordPress (192.168.2.13)</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-8 h-0.5 rounded-full shrink-0 border-t-2 border-dashed border-amber-500/60" />
              <span className="text-white/40 text-sm">Connexion DMZ (isolée)</span>
            </div>
          </div>
        </div>

        {/* Config */}
        <div className="glass-panel !p-5">
          <h3 className="text-white/50 font-bold text-sm tracking-widest mb-4">CONFIGURATION RÉSEAU</h3>
          <div className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-2">
            <span className="text-white/40 text-sm font-semibold">Réseau Green :</span>
            <span className="text-white/60 text-sm font-mono">192.168.2.0/24</span>
            <span className="text-white/40 text-sm font-semibold">Plage DHCP :</span>
            <span className="text-white/60 text-sm font-mono">192.168.2.1 — .253</span>
            <span className="text-white/40 text-sm font-semibold">IP réservées :</span>
            <span className="text-white/60 text-sm font-mono">.1 .10 .11 .13 .15 .156 .250 .254</span>
            <span className="text-white/40 text-sm font-semibold">Masque :</span>
            <span className="text-white/60 text-sm font-mono">255.255.255.0</span>
            <span className="text-white/40 text-sm font-semibold">Passerelle :</span>
            <span className="text-white/60 text-sm font-mono">192.168.2.10</span>
            <span className="text-white/40 text-sm font-semibold">DNS :</span>
            <span className="text-white/60 text-sm font-mono">192.168.2.254</span>
          </div>
        </div>
      </div>

      {/* ──────── Tooltip ──────── */}
      {info ? (
        <div className="glass-panel !p-5 transition-all duration-200" style={{ borderColor: ZONE_STYLE[info.zone]?.border }}>
          <div className="flex items-center gap-2.5 mb-2">
            <span className={`w-2.5 h-2.5 rounded-full ${ZONE_STYLE[info.zone]?.dot}`} />
            <h4 className={`font-bold text-sm ${ZONE_STYLE[info.zone]?.text}`}>{info.label}</h4>
          </div>
          <p className="text-white/70 text-xs font-mono mb-1.5">{info.ip}</p>
          <p className="text-white/50 text-sm leading-relaxed">{info.details}</p>
        </div>
      ) : (
        <p className="text-white/20 text-xs text-center italic py-2">Survolez ou cliquez sur un équipement pour voir les détails</p>
      )}
    </div>
  );
}
