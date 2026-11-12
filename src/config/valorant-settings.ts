// src/config/valorant-settings.ts — Mes réglages Valorant, relevés dans le jeu (captures d'écran).
// Même organisation que le menu du jeu : onglets → sous-onglets → sections → lignes.
// Les libellés reprennent mon client (en anglais) et restent littéraux, comme les sous-titres
// des cartes : seul le texte autour du menu est traduit (messages valoSettings).
// Les curseurs n'affichent pas toujours de valeur en jeu : `pct` = position relevée sur la capture.
import { MY_SENS } from "./site";

/** Date du relevé (captures envoyées par moi) */
export const SETTINGS_CAPTURED_AT = "2026-11-12";

/** Affichage en jeu */
export const VALO_DISPLAY = { resolution: "1920 × 1080", ratio: "16:9", hz: 144 } as const;

/** Réticule principal (onglet Crosshair → Primary). Options avancées désactivées : pas d'ADS ni de sniper. */
export const CROSSHAIR = {
  profile: "nounours",
  /** Code de profil : seules les valeurs différentes du défaut sont encodées */
  code: "0;P;h;0;f;0;0l;4;0o;0;0a;1;0f;0;1b;0",
  color: { name: "White", hex: "#FFFFFF" },
  outlines: { on: false, opacity: 0.5, thickness: 1 },
  centerDot: { on: false, opacity: 1, thickness: 2 },
  inner: { on: true, opacity: 1, length: 4, thickness: 2, offset: 0, movementError: false, firingError: false },
  outer: { on: false, opacity: 0.35, length: 2, thickness: 2, offset: 10, movementError: true, firingError: true },
} as const;

export type CrosshairLines = { on: boolean; opacity: number; length: number; thickness: number; offset: number };

/* ─── Types ─────────────────────────────────────────────── */

interface RowBase {
  label: string;
  /** Sous-option (trait d'indentation comme en jeu) */
  depth?: 1 | 2;
  /** Grisé en jeu (dépend d'une option désactivée) */
  disabled?: boolean;
  /** Ligne secondaire sous le libellé */
  hint?: string;
}

export type SettingRow = RowBase &
  (
    | { kind: "choice"; options: readonly string[]; value: string }
    | { kind: "slider"; pct: number; value?: string; volume?: boolean }
    | { kind: "select"; value: string }
    | { kind: "field"; value: string }
    | { kind: "color"; value: string; hex: string }
    /** Touche principale et secondaire ("" = non assignée). modified = icône ↻ en jeu */
    | { kind: "bind"; keys: readonly [string, string]; modified?: boolean }
  );

export interface SettingsSection {
  title?: string;
  rows: SettingRow[];
}

export interface SettingsSubTab {
  id: string;
  label: string;
  sections: SettingsSection[];
}

export interface SettingsTab {
  id: string;
  label: string;
  /** Affiche l'aperçu du réticule au-dessus des réglages */
  crosshairPreview?: boolean;
  subTabs: SettingsSubTab[];
}

/* ─── Raccourcis d'écriture ─────────────────────────────── */

type Opts = Pick<RowBase, "depth" | "disabled" | "hint">;

const onOff = (label: string, on: boolean, o: Opts = {}): SettingRow => ({
  kind: "choice",
  label,
  options: ["On", "Off"],
  value: on ? "On" : "Off",
  ...o,
});
const choice = (label: string, options: readonly string[], value: string, o: Opts = {}): SettingRow => ({
  kind: "choice",
  label,
  options,
  value,
  ...o,
});
const slider = (label: string, pct: number, value?: string, o: Opts = {}): SettingRow => ({
  kind: "slider",
  label,
  pct,
  value,
  ...o,
});
/** Curseur de volume : pas de valeur chiffrée en jeu, seulement la position et l'icône du haut-parleur */
const volume = (label: string, pct: number, o: Opts = {}): SettingRow => ({ kind: "slider", label, pct, volume: true, ...o });
const select = (label: string, value: string, o: Opts = {}): SettingRow => ({ kind: "select", label, value, ...o });
const field = (label: string, value: string, o: Opts = {}): SettingRow => ({ kind: "field", label, value, ...o });
const bind = (label: string, key = "", o: Opts & { alt?: string; modified?: boolean } = {}): SettingRow => {
  const { alt = "", modified, ...rest } = o;
  return { kind: "bind", label, keys: [key, alt], modified, ...rest };
};
const STATS = ["Hide", "Text Only", "Graph Only", "Show Both"] as const;
const stat = (label: string, value: (typeof STATS)[number] = "Hide"): SettingRow => choice(label, STATS, value);
const QUALITY = ["High", "Med", "Low"] as const;

/** Clavier AZERTY : "Quote" et "Apostrophe" en jeu sont les touches " (3) et ' (4) */
const QUOTE = '"';
const APOSTROPHE = "'";
const MOD = { modified: true } as const;
const CH = CROSSHAIR;

/* ─── Menu ──────────────────────────────────────────────── */

export const SETTINGS_TABS: SettingsTab[] = [
  {
    id: "general",
    label: "General",
    subTabs: [
      {
        id: "general",
        label: "General",
        sections: [
          {
            title: "Accessibility",
            rows: [
              select("Text Language", "English (United States)"),
              select("Enemy Highlight Color", "Yellow (Deuteranopia)"),
            ],
          },
          {
            title: "Mouse",
            rows: [
              slider("Sensitivity: Aim", 2, MY_SENS.sens),
              slider("Scoped Sensitivity Multiplier", 10, "1"),
              slider("ADS Sensitivity Multiplier", 10, "1"),
              onOff("Invert Mouse", false),
            ],
          },
          {
            title: "Map",
            rows: [
              choice("Rotate", ["Rotate", "Fixed"], "Fixed"),
              choice("Fixed Orientation", ["Always the Same", "Based On Side"], "Always the Same", { depth: 1 }),
              slider("Minimap Size", 100, "1.2"),
              slider("Minimap Zoom", 27, "0.9"),
              onOff("Keep Player Centered", false, { depth: 1 }),
              onOff("Minimap Vision Cones", true),
              choice("Show Map Region Names", ["Never", "Only in Buy Phase", "Always"], "Never"),
            ],
          },
          {
            title: "Privacy",
            rows: [
              onOff("Hide My Riot ID from Players Outside My Party", true),
              onOff("Use Generic Names for Players Outside My Party", false),
              onOff("Auto-Reject Friend Requests", false),
              onOff("Only Allow In-Game Party Requests from Friends", false),
            ],
          },
          {
            title: "User Interface",
            rows: [
              onOff("Show New Player Tips", false),
              choice("First Person Handedness", ["Left", "Right"], "Right"),
              onOff("Hide User Interface In Game", false),
              onOff("Always Show Inventory", false),
              onOff("Player Loadouts Always Visible", false),
              onOff("Cycle to Next/Prev Weapon Wraps Inventory", false),
              onOff("Cycle to Next/Prev Weapon Includes Spike", false),
              onOff("Instability Indicators", true),
              onOff("Show Bullet Tracers", true),
              onOff("Show Spectator Count", true),
              onOff("Hide Outlines and Fresnel", true),
            ],
          },
          {
            title: "Content Filter",
            rows: [
              onOff("Show Mature Content", true),
              onOff("Show Corpses", false, { depth: 1 }),
              onOff("Show Blood", false, { depth: 1 }),
            ],
          },
          {
            title: "Network",
            rows: [choice("Network Buffering", ["Minimum", "Moderate", "Maximum"], "Minimum")],
          },
        ],
      },
    ],
  },
  {
    id: "controls",
    label: "Controls",
    subTabs: [
      {
        id: "actions",
        label: "Actions",
        sections: [
          {
            title: "Abilities",
            rows: [
              bind("Use/Equip Ability: 1", "C"),
              bind("Use/Equip Ability: 2", "Thumb Mouse Button 2", MOD),
              bind("Use/Equip Ability: 3", "E"),
              bind("Use/Equip Ability: Ultimate", "X"),
            ],
          },
          {
            title: "Movement",
            rows: [
              bind("Forward", "Z", MOD),
              bind("Back", "S"),
              bind("Strafe Left", "Q", MOD),
              bind("Strafe Right", "D"),
              choice("Default Movement Mode", ["Walk", "Run"], "Run"),
              bind("Walk", "Left Shift"),
              onOff("Toggle Walk", false),
              bind("Jump", "Space Bar"),
              bind("Crouch (Hold)", "Left Ctrl"),
              onOff("Toggle Crouch", false),
              bind("Fly Up", "Space Bar"),
              bind("Fly Down", "Left Ctrl"),
            ],
          },
          {
            title: "Custom Game Movements",
            rows: [bind("Toggle Cheat: Ghost")],
          },
        ],
      },
      {
        id: "equipment",
        label: "Equipment",
        sections: [
          {
            title: "Weapons",
            rows: [
              bind("Fire", "Left Mouse Button"),
              bind("Alternate Fire", "Right Mouse Button"),
              bind("Toggle Zoom Level"),
              choice("Aim Down Sights", ["Hold", "Toggle"], "Hold"),
              choice("Sniper Rifle Aim", ["Hold", "Toggle"], "Toggle"),
              choice("Operator Zoom", ["Cycle", "Toggle"], "Toggle", { depth: 1 }),
              choice("Operator Zoom (Hold)", ["Cycle", "Toggle"], "Toggle", { depth: 2 }),
              onOff("Auto Re-enter Scope", false, { depth: 1 }),
              bind("Reload", "R"),
            ],
          },
          {
            title: "Equipment",
            rows: [
              bind("Equip Primary Weapon", QUOTE, MOD),
              bind("Equip Secondary Weapon", "W", MOD),
              bind("Equip Melee Weapon", "A", MOD),
              bind("Equip Spike", APOSTROPHE, MOD),
              bind("Cycle to Next Weapon", "Mouse Wheel Up"),
              bind("Cycle to Previous Weapon", "Mouse Wheel Down"),
              bind("Drop Equipped Item", "G"),
              bind("Equip Last Used Weapon"),
              choice("Auto Equip Priority", ["Strongest", "Most Recently Equipped"], "Most Recently Equipped"),
              onOff("Auto Equip Skips Melee", true),
            ],
          },
          {
            title: "Interaction",
            rows: [
              bind("Inspect", "T", MOD),
              bind("Use Object (Hold)", "F"),
              bind("Use Spike (Plant or Defuse)", APOSTROPHE, MOD),
              bind("Use Item (Tap) / Open Expression Wheel (Hold)", "Thumb Mouse Button", MOD),
              onOff("Expression Wheel Open on Hold", true),
              slider("Expression Wheel Hold Delay (milliseconds)", 52, "130", { depth: 1 }),
            ],
          },
        ],
      },
      {
        id: "interface",
        label: "Interface",
        sections: [
          {
            title: "General",
            rows: [
              bind("Show Teammate Loadouts (Hold)", "Dollar", MOD),
              bind("Combat Report", "", MOD),
              bind("Ability Description Tooltip", "F1"),
              bind("Open Armory (Hold)", "B"),
              bind("Open Map (Toggle)", "M"),
              bind("Open Map (Hold)", "Caps Lock"),
              bind("Show Scoreboard (Hold)", "Tab"),
              bind("Toggle Cursor", "Middle Mouse Button", { alt: "Equals" }),
              onOff("Enable Live Diagnostics", false),
              bind("Dump Diagnostics", "Home"),
            ],
          },
          {
            title: "Voting",
            rows: [
              bind("Vote Option 1", "F5"),
              bind("Vote Option 2", "F6"),
              bind("Vote Option 3", "F7"),
              bind("Vote Option 4", "F8"),
            ],
          },
          {
            title: "Replay Options",
            rows: [bind("Add a Bookmark")],
          },
        ],
      },
      {
        id: "communication",
        label: "Communication",
        sections: [
          {
            title: "Voice Chat",
            rows: [
              bind("Party Voice Push To Talk Key", "N", MOD),
              bind("Team Voice Push To Talk Key", "V"),
              bind("Party Voice Clutch Mute Key"),
              bind("Team Voice Clutch Mute Key"),
            ],
          },
          {
            title: "Text Chat",
            rows: [onOff("Tactical Callouts in Chat", false), onOff("Explicit Language Filter", false)],
          },
          {
            title: "Pings",
            rows: [
              bind("Ping (Tap) / Ping Wheel (Hold)", "J", MOD),
              slider("Ping Wheel Hold Delay (milliseconds)", 52, "130"),
              bind("Ping: Caution"),
              bind("Ping: Watching Here"),
              bind("Ping: Need Support"),
              bind("Ping: On My Mark"),
            ],
          },
          {
            title: "Radio Commands Menu",
            rows: [
              bind("Radio Commands Menu Index", "Period"),
              bind("Open Combat Radio Commands Menu"),
              bind("Open Tactics Radio Command Menu"),
              bind("Open Social Radio Command Menu"),
              bind("Open Strategy Radio Command Menu"),
            ],
          },
          {
            title: "Radio Commands Wheel",
            rows: [
              bind("Radio Command Wheel Index", "Comma"),
              bind("Combat/Tactics Radio Command Wheel"),
              bind("Social Radio Command Wheel"),
              bind("Strategy Radio Command Wheel"),
            ],
          },
        ],
      },
    ],
  },
  {
    id: "crosshair",
    label: "Crosshair",
    crosshairPreview: true,
    subTabs: [
      {
        id: "general",
        label: "General",
        sections: [
          { title: "Customization", rows: [onOff("Use Advanced Options", false)] },
          {
            title: "Other",
            rows: [
              onOff("Show Spectated Player's Crosshair", true),
              onOff("Fade Crosshair With Firing Error", false),
              onOff("Disable Crosshair", false),
            ],
          },
        ],
      },
      {
        id: "primary",
        label: "Primary",
        sections: [
          {
            title: "Crosshair",
            rows: [
              { kind: "color", label: "Crosshair Color", value: CH.color.name, hex: CH.color.hex },
              onOff("Outlines", CH.outlines.on),
              slider("Outline Opacity", 50, String(CH.outlines.opacity), { depth: 1, disabled: !CH.outlines.on }),
              slider("Outline Thickness", 0, String(CH.outlines.thickness), { depth: 1, disabled: !CH.outlines.on }),
              onOff("Center Dot", CH.centerDot.on),
              slider("Center Dot Opacity", 100, String(CH.centerDot.opacity), { depth: 1, disabled: !CH.centerDot.on }),
              slider("Center Dot Thickness", 19, String(CH.centerDot.thickness), { depth: 1, disabled: !CH.centerDot.on }),
              onOff("Override Firing Error Offset With Crosshair Offset", false),
              onOff("Override All Primary Crosshairs With My Primary Crosshair", false),
            ],
          },
          {
            title: "Inner Lines",
            rows: [
              onOff("Show Inner Lines", CH.inner.on),
              slider("Inner Line Opacity", 100, String(CH.inner.opacity), { depth: 1 }),
              choice("Allow Vertical Scaling", ["Unbound", "Bound"], "Bound", { depth: 1 }),
              slider("Inner Line Length", 19, String(CH.inner.length), { depth: 2 }),
              slider("Inner Line Thickness", 19, String(CH.inner.thickness), { depth: 1 }),
              slider("Inner Line Offset", 0, String(CH.inner.offset), { depth: 1 }),
              onOff("Movement Error", CH.inner.movementError, { depth: 1 }),
              slider("Movement Error Multiplier", 33, "1", { depth: 2, disabled: !CH.inner.movementError }),
              onOff("Firing Error", CH.inner.firingError, { depth: 1 }),
            ],
          },
          {
            title: "Outer Lines",
            rows: [
              onOff("Show Outer Lines", CH.outer.on),
              slider("Outer Line Opacity", 35, String(CH.outer.opacity), { depth: 1, disabled: true }),
              choice("Allow Vertical Scaling", ["Unbound", "Bound"], "Bound", { depth: 1, disabled: true }),
              slider("Outer Line Length", 19, String(CH.outer.length), { depth: 2, disabled: true }),
              slider("Outer Line Thickness", 19, String(CH.outer.thickness), { depth: 1, disabled: true }),
              slider("Outer Line Offset", 24, String(CH.outer.offset), { depth: 1, disabled: true }),
              onOff("Movement Error", CH.outer.movementError, { depth: 1, disabled: true }),
              slider("Movement Error Multiplier", 33, "1", { depth: 2, disabled: true }),
              onOff("Firing Error", CH.outer.firingError, { depth: 1, disabled: true }),
              slider("Firing Error Multiplier", 33, "1", { depth: 2, disabled: true }),
            ],
          },
        ],
      },
    ],
  },
  {
    id: "video",
    label: "Video",
    subTabs: [
      {
        id: "general",
        label: "General",
        sections: [
          {
            rows: [
              select("Display Mode", "Fullscreen"),
              select("Resolution", "1,920 x 1,080 16:9 (144Hz)"),
              select("Monitor", "2. SAM0F91 (1920 x 1080 16:9)"),
              choice("Aspect Ratio Method", ["Letterbox", "Fill"], "Letterbox"),
              onOff("Limit FPS on Battery", true),
              field("Max FPS on Battery", "60", { depth: 1 }),
              onOff("Limit FPS in Menus", true),
              field("Max FPS in Menus", "144", { depth: 1 }),
              onOff("Limit FPS in Background", true),
              field("Max FPS in Background", "30", { depth: 1 }),
              onOff("Limit Framerate Always", false),
              field("Max FPS Always", "60", { depth: 1, disabled: true }),
              select("NVIDIA Reflex Low Latency", "On"),
            ],
          },
        ],
      },
      {
        id: "graphics",
        label: "Graphics Quality",
        sections: [
          {
            rows: [
              onOff("Multithreaded Rendering", false),
              choice("Material Quality", QUALITY, "Low"),
              choice("Texture Quality", QUALITY, "Low"),
              choice("Detail Quality", QUALITY, "Low"),
              choice("UI Quality", QUALITY, "Low"),
              onOff("Vignette", false),
              onOff("VSync", false),
              select("Anti-Aliasing", "FXAA"),
              select("Anisotropic Filtering", "16x"),
              onOff("Improve Clarity", false),
              onOff("[BETA] Experimental Sharpening", false),
              onOff("Bloom", true),
              onOff("Distortion", false),
              onOff("Cast Shadows", false),
            ],
          },
        ],
      },
      {
        id: "stats",
        label: "Stats",
        sections: [
          {
            title: "Presets",
            rows: [
              select("Selected Preset", "None"),
              choice("Stats Info Visibility Level", ["None", "Show Text", "Show Graph", "Show Both"], "Show Text", {
                disabled: true,
              }),
            ],
          },
          {
            title: "Performance",
            rows: [
              stat("Client FPS", "Text Only"),
              stat("Server Tick Rate"),
              stat("Total Frame Time"),
              stat("Idle Time"),
              stat("CPU (Game) Time"),
              stat("CPU (Render) Time"),
              stat("CPU (RHI) Time"),
              stat("GPU Render Time"),
              stat("Used Physical Memory"),
              stat("CPU Wait GPU Time"),
              stat("Available Physical Memory"),
            ],
          },
          {
            title: "Input Latency",
            rows: [
              stat("Game Latency (CPU)"),
              stat("Render Latency (GPU)"),
              stat("Present Latency (CPU)"),
              stat("Game to Render Latency (CPU+GPU)"),
              stat("Network RTT + Processing Delays"),
            ],
          },
          {
            title: "Network",
            rows: [
              stat("Network RTT"),
              stat("Network RTT Jitter"),
              stat("Packet Loss", "Text Only"),
              stat("Incoming Packet Loss"),
              stat("Outgoing Packet Loss"),
              stat("Packets Lost (Total)"),
              stat("Packets Receive Rate"),
              stat("Packets Send Rate"),
              stat("Uploaded Data"),
              stat("Out Packet Size"),
            ],
          },
          { title: "Gameplay Stats", rows: [stat("Shooting Error")] },
        ],
      },
    ],
  },
  {
    id: "audio",
    label: "Audio",
    subTabs: [
      {
        id: "sounds",
        label: "Sounds",
        sections: [
          {
            rows: [
              volume("Main Volume", 100),
              volume("Sound Effects", 100),
              volume("Voice-Over", 60),
              volume("Agent ID Preview", 0),
              volume("Store Video", 0),
              volume("All Music", 0),
              volume("Menu And Lobby Music", 0, { depth: 1, disabled: true }),
              volume("Agent Select Music", 80, { depth: 1, disabled: true }),
              onOff("Lower Music When a Player Is Speaking", true),
              onOff("Mute Music When Game Window Out Of Focus", false),
              select("Speaker Configuration", "Stereo", { hint: "2.0" }),
              onOff("Simulate Surround Sound (HRTF)", true),
            ],
          },
        ],
      },
      {
        id: "voice-chat",
        label: "Voice Chat",
        sections: [
          {
            title: "Volume",
            rows: [
              select("Output Device", "Default System Device"),
              select("Input Device", "Default System Device"),
              volume("Incoming Volume", 72),
              volume("Mic Volume", 72),
              slider("Mic Sensitivity Threshold", 43, "43"),
              onOff("Loopback Test", false),
            ],
          },
          {
            title: "Voice Channels",
            rows: [
              onOff("Party Voice Chat", true),
              onOff("Party Voice During Custom Game", true),
              choice("Party Voice Activation Mode", ["Push to Talk", "Automatic"], "Push to Talk", {
                hint: "Current push-to-talk (PTT) key: N",
              }),
            ],
          },
          {
            title: "Voice Chat",
            rows: [onOff("Team Voice Chat", true, { hint: "Current push-to-talk (PTT) key: V" })],
          },
        ],
      },
      {
        id: "voice-over",
        label: "Voice-Over",
        sections: [
          {
            rows: [
              onOff("Gameplay", true),
              onOff("Agent Flavor", true),
              onOff("Tactical Callouts", true),
              onOff("Automated Tactical Callouts", true),
              onOff("Announcer", true),
              onOff("Maxbot Gameplay VO", true),
              onOff("Maxbot Flavor VO", true),
              onOff("VOIP Ducks Flavor VO", false),
            ],
          },
        ],
      },
    ],
  },
  {
    id: "viewing",
    label: "Viewing",
    subTabs: [
      {
        id: "general",
        label: "General",
        sections: [
          {
            title: "General Observer & Replays",
            rows: [
              onOff("Hide First Person Arms (Observers Only)", false),
              onOff("Observers See Agent Handedness Based on Team", false),
              onOff("Hide the Spectated Agent Portrait for Observers", false),
              onOff("Show Full Screen Blind for Observers", false),
              onOff("Show Player Keybinds on Minimap", true),
              onOff("Show Player Keybinds on Megamap", false),
              onOff("Use Full Screen Megamap with Opaque Background", false),
              onOff("Use Team Color for Crosshair Color", false),
              onOff("Team Colors Affect HUD for Observers", false),
              slider("Observer Free Camera Fast Speed", 56, "0.6"),
              slider("Observer Free Camera Slow Speed", 22, "0.3"),
              onOff("Observer Press To Toggle Scoreboard", false),
              onOff("Hide Outlines and Fresnel", true),
            ],
          },
          {
            title: "Replay UI (Replays Only)",
            rows: [
              onOff("Show Lines for Kills & Deaths on Match Timeline", true),
              onOff("Show Icons for Ultimate Use on Match Timeline", true),
              onOff("Show Bookmark Icons on Match Timeline", true),
              onOff("Show Button Shortcuts", false),
              onOff("Spectate Dead Players", true),
              onOff("Show Final Match Stats in Scoreboard", false),
              onOff("Player Loadouts Always Visible In Replays", false),
            ],
          },
        ],
      },
      {
        id: "controls",
        label: "Controls",
        sections: [
          {
            title: "Observer Only",
            rows: [
              bind("Cycle Preset Free Camera Locations", "Equals"),
              bind("Hold to Observe Player in Free Camera", "Left Shift"),
              bind("Observe Next Player (Follow-Cam)", "Right Bracket"),
              bind("Observe Previous Player (Follow-Cam)", "Left Bracket"),
            ],
          },
          {
            title: "Replay Only",
            rows: [
              bind("Play / Pause", "Space Bar"),
              bind("Skip Back 5 Seconds", "Left"),
              bind("Skip Forwards 5 Seconds", "Right"),
              bind("Toggle Replay UI", "T"),
            ],
          },
        ],
      },
    ],
  },
];

/** Nombre total de réglages affichés */
export function settingsCount(): number {
  return SETTINGS_TABS.reduce(
    (n, tab) => n + tab.subTabs.reduce((m, sub) => m + sub.sections.reduce((k, s) => k + s.rows.length, 0), 0),
    0,
  );
}
