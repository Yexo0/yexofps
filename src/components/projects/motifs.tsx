// src/components/projects/motifs.tsx — Line drawings that give each project its plate (800 × 500).
// Same grammar for all: hairlines in the neutral tones, one red element that carries the idea.
// Strokes marked data-draw are drawn one after the other when the plate enters the screen (anime.js).
// When a project has a real capture, the motif stays on the left and the capture sits on the right.
import type { ReactNode } from "react";
import type { ProjectId } from "@/config/projects";

const LINE = "var(--line-strong)";
const MID = "var(--text-dim)";
const RED = "var(--accent-vivid)";

function Svg({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true" fill="none" strokeWidth="1.5">
      {children}
    </svg>
  );
}

const Mono = ({ x, y, children, fill = MID, size = 13, anchor }: { x: number; y: number; children: ReactNode; fill?: string; size?: number; anchor?: "end" | "middle" }) => (
  <text x={x} y={y} fill={fill} fontSize={size} fontFamily="var(--font-mono)" letterSpacing="1.5" textAnchor={anchor} className="motif-text">
    {children}
  </text>
);

/** YexoFX: an After Effects graph editor, the ease curve of a preset and its keyframes */
function YexoFx() {
  return (
    <Svg>
      <path data-draw d="M70 420H430M70 420V90" stroke={LINE} />
      {[160, 250, 340].map((x) => (
        <path key={x} data-draw d={`M${x} 420V90`} stroke={LINE} strokeDasharray="2 6" />
      ))}
      <path data-draw d="M70 400C190 400 170 120 410 110" stroke={RED} strokeWidth="2.5" />
      <path data-draw d="M70 400H170M410 110H300" stroke={MID} />
      {[
        [70, 400],
        [410, 110],
      ].map(([x, y]) => (
        <rect key={x} x={x - 7} y={y - 7} width="14" height="14" transform={`rotate(45 ${x} ${y})`} fill="var(--bg)" stroke={RED} strokeWidth="2" />
      ))}
      <circle cx="170" cy="400" r="4" fill={MID} />
      <circle cx="300" cy="110" r="4" fill={MID} />
      <Mono x={70} y={455}>
        CUBIC-BEZIER(.16, 1, .3, 1)
      </Mono>
      <Mono x={70} y={70}>
        FX · 592
      </Mono>
    </Svg>
  );
}

/** Claimd: one handle, seven platforms checked side by side */
function Claimd() {
  const rows = [1, 0, 0, 2, 0, 1, 0];
  return (
    <Svg>
      <Mono x={70} y={92} fill="var(--text)" size={22}>
        @yexofps
      </Mono>
      <path data-draw d="M70 112H420" stroke={LINE} />
      {rows.map((s, i) => {
        const y = 150 + i * 40;
        return (
          <g key={i}>
            <path data-draw d={`M70 ${y}H${180 + (i % 3) * 30}`} stroke={MID} strokeWidth="6" strokeLinecap="butt" />
            <path data-draw d={`M300 ${y}H420`} stroke={s === 1 ? RED : LINE} strokeWidth={s === 1 ? 2.5 : 1.5} strokeDasharray={s === 2 ? "3 5" : undefined} />
            <circle cx="420" cy={y} r="5" fill={s === 1 ? RED : "var(--bg)"} stroke={s === 1 ? RED : MID} />
          </g>
        );
      })}
      <Mono x={70} y={455}>
        2 / 7 · TWITCH · YOUTUBE · TIKTOK
      </Mono>
    </Svg>
  );
}

/** YexoClip: a replay on a timeline, kills found and cut into clips */
function YexoClip() {
  const wave = Array.from({ length: 64 }, (_, i) => {
    const x = 60 + i * 10.8;
    const h = Math.round(8 + Math.abs(Math.sin(i * 0.9) * 22 + Math.sin(i * 0.31) * 18));
    return `M${x.toFixed(1)} ${300 - h}V${300 + h}`;
  }).join("");
  return (
    <Svg>
      <path data-draw d="M60 160H740" stroke={LINE} />
      {Array.from({ length: 18 }, (_, i) => (
        <path key={i} d={`M${60 + i * 40} 160v${i % 4 === 0 ? 12 : 6}`} stroke={LINE} />
      ))}
      <path d={wave} stroke={MID} strokeWidth="2" className="motif-text" />
      <path data-draw d="M210 200V400M330 200V400" stroke={RED} strokeWidth="2" />
      <path data-draw d="M520 200V400M680 200V400" stroke={MID} />
      <path data-draw d="M210 200H330M210 400H330" stroke={RED} strokeWidth="2" />
      <path data-draw d="M520 200H680M520 400H680" stroke={MID} />
      {[240, 268, 300, 560, 640].map((x, i) => (
        <rect key={x} x={x - 6} y={174} width="12" height="12" transform={`rotate(45 ${x} 180)`} fill={i < 3 ? RED : MID} />
      ))}
      <Mono x={210} y={432} fill="var(--accent-vivid)">
        3K · 120 FPS
      </Mono>
      <Mono x={520} y={432}>
        2K
      </Mono>
      <Mono x={60} y={130}>
        SHADOWPLAY · 21:34:12
      </Mono>
    </Svg>
  );
}

/** yexofps.org: the site's own grid and wordmark */
function Site() {
  return (
    <Svg>
      <rect data-draw x="70" y="70" width="660" height="360" stroke={LINE} />
      <path data-draw d="M70 110H730" stroke={LINE} />
      {[90, 106, 122].map((x) => (
        <circle key={x} cx={x} cy="90" r="4" stroke={MID} />
      ))}
      {[180, 290, 400, 510, 620].map((x) => (
        <path key={x} data-draw d={`M${x} 110V430`} stroke={LINE} strokeDasharray="2 6" />
      ))}
      <text x="100" y="330" fontFamily="var(--font-display)" fontSize="190" fill="none" stroke={MID} strokeWidth="1.2" className="motif-text">
        YEXO
      </text>
      <path data-draw d="M480 180l120 0 -30 120 -120 0z" stroke={RED} strokeWidth="2" />
      <Mono x={100} y={400}>
        NEXT.JS · VPS
      </Mono>
    </Svg>
  );
}

/** Homelab: firewall at the top, one VLAN per use, hosts below */
function Homelab() {
  const hosts = [130, 290, 450, 610];
  return (
    <Svg>
      <rect data-draw x="330" y="60" width="140" height="54" stroke={RED} strokeWidth="2" />
      <Mono x={400} y={93} anchor="middle" fill="var(--text)">
        PFSENSE
      </Mono>
      <path data-draw d="M400 114V180" stroke={MID} />
      <rect data-draw x="300" y="180" width="200" height="40" stroke={LINE} />
      <Mono x={400} y={205} anchor="middle">
        SWITCH · VLAN
      </Mono>
      {hosts.map((x, i) => (
        <g key={x}>
          <path data-draw d={`M400 220V260H${x + 30}V320`} stroke={i === 1 ? RED : LINE} strokeWidth={i === 1 ? 2 : 1.5} />
          <rect data-draw x={x} y="320" width="60" height="60" stroke={MID} />
          <Mono x={x + 30} y={410} anchor="middle">
            {`VLAN ${(i + 1) * 10}`}
          </Mono>
        </g>
      ))}
    </Svg>
  );
}

/** YexoUnd: a sound, as a spectrum around a circle */
function Yexound() {
  const bars = Array.from({ length: 40 }, (_, i) => {
    const a = (i / 40) * Math.PI * 2;
    const r1 = 110;
    const r2 = r1 + 18 + Math.abs(Math.sin(i * 1.7) * 46);
    const p = (r: number) => `${(400 + Math.cos(a) * r).toFixed(1)} ${(250 + Math.sin(a) * r).toFixed(1)}`;
    return `M${p(r1)}L${p(r2)}`;
  }).join("");
  return (
    <Svg>
      <circle data-draw cx="400" cy="250" r="90" stroke={LINE} />
      <circle data-draw cx="400" cy="250" r="56" stroke={RED} strokeWidth="2" />
      <path d={bars} stroke={MID} strokeWidth="3" className="motif-text" />
      <Mono x={70} y={455}>
        V0.1
      </Mono>
    </Svg>
  );
}

/** Sensitivity converter: one full turn, the same distance in every game */
function Sens() {
  return (
    <Svg>
      <circle data-draw cx="400" cy="240" r="150" stroke={LINE} />
      <path data-draw d="M400 90A150 150 0 1 1 250 240" stroke={RED} strokeWidth="2.5" />
      <path data-draw d="M400 205V225M400 255V275M365 240H385M415 240H435" stroke="var(--text)" strokeWidth="2.5" />
      {Array.from({ length: 24 }, (_, i) => {
        const a = (i / 24) * Math.PI * 2;
        const p = (r: number) => `${(400 + Math.cos(a) * r).toFixed(1)} ${(240 + Math.sin(a) * r).toFixed(1)}`;
        return <path key={i} d={`M${p(162)}L${p(172)}`} stroke={LINE} />;
      })}
      <Mono x={70} y={455}>
        CM/360 · VALORANT → CS2
      </Mono>
    </Svg>
  );
}

/** Weather dashboard: a week of readings and the alert threshold */
function Weather() {
  return (
    <Svg>
      <path data-draw d="M70 420H730M70 420V80" stroke={LINE} />
      <path data-draw d="M70 180H730" stroke={RED} strokeDasharray="6 6" />
      <path data-draw d="M70 330L150 300L230 320L310 250L390 270L470 200L550 160L630 210L730 190" stroke="var(--text-muted)" strokeWidth="2" />
      {[150, 230, 310, 390, 470, 550, 630].map((x, i) => (
        <path key={x} data-draw d={`M${x} 420V${400 - (i % 3) * 18 - 10}`} stroke={MID} strokeWidth="10" strokeLinecap="butt" />
      ))}
      <Mono x={730} y={168} anchor="end" fill="var(--accent-vivid)">
        PM2.5 · O3
      </Mono>
      <Mono x={70} y={455}>
        OPEN-METEO API
      </Mono>
    </Svg>
  );
}

/** IT guides: a stack of step-by-step documents */
function Guides() {
  return (
    <Svg>
      {[0, 1, 2].map((i) => (
        <rect key={i} data-draw x={250 + i * 26} y={70 + i * 22} width="260" height="330" stroke={i === 2 ? MID : LINE} fill="var(--surface-2)" />
      ))}
      {Array.from({ length: 8 }, (_, i) => (
        <path key={i} data-draw d={`M330 ${170 + i * 26}H${i % 3 === 2 ? 470 : 540}`} stroke={i === 0 ? RED : LINE} strokeWidth={i === 0 ? 2.5 : 1.5} />
      ))}
      <Mono x={330} y={146} fill="var(--text)">
        PROXMOX · 25 P.
      </Mono>
      <Mono x={70} y={455}>
        10 × PDF
      </Mono>
    </Svg>
  );
}

export const MOTIFS: Record<ProjectId, () => ReactNode> = {
  yexofx: YexoFx,
  claimd: Claimd,
  yexoclip: YexoClip,
  site: Site,
  homelab: Homelab,
  yexound: Yexound,
  sens: Sens,
  weather: Weather,
  guides: Guides,
};
