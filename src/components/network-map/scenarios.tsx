// src/components/network-map/scenarios.tsx — Scénarios rejoués sur le schéma réseau, façon pipeline :
// un paquet suit un chemin réel nœud par nœud ; chaque étape passe "en attente" → "en cours" → "fait".
// Lecture automatique quand le schéma est à l'écran et que personne ne le survole ; en mouvement
// réduit, pas de lecture : le scénario choisi s'affiche directement terminé.
"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Check, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export interface MapScenario {
  id: string;
  /** Titre lisible, ex : "Sauvegarde nocturne vers le NAS" */
  label: string;
  /** Identifiants des nœuds traversés, dans l'ordre */
  path: readonly string[];
}

export type StepState = "done" | "running" | "pending";

/** Durée d'une étape, du trajet d'un paquet, et pause à la fin d'un scénario (ms) */
export const STEP_MS = 1050;
export const TRAVEL_MS = 720;
const HOLD_MS = 1800;

export function useScenarioPlayer(scenarios: readonly MapScenario[], { paused, visible }: { paused: boolean; visible: boolean }) {
  const reduced = useReducedMotion();
  const [state, setState] = useState({ scene: 0, step: 0 });
  const [playing, setPlaying] = useState(true);
  const scene = scenarios[state.scene];
  const length = scene?.path.length ?? 0;

  useEffect(() => {
    if (!length || !playing || paused || !visible || reduced) return;
    const delay = state.step === 0 ? 700 : state.step < length ? STEP_MS : HOLD_MS;
    const id = setTimeout(
      () =>
        setState((s) =>
          s.step < length ? { ...s, step: s.step + 1 } : { scene: (s.scene + 1) % scenarios.length, step: 0 },
        ),
      delay,
    );
    return () => clearTimeout(id);
  }, [state, length, playing, paused, visible, reduced, scenarios.length]);

  // Mouvement réduit : scénario affiché terminé
  const step = reduced ? length : state.step;
  const stateOf = (index: number): StepState => (index < step ? "done" : index === step ? "running" : "pending");

  return {
    scene,
    sceneIndex: state.scene,
    step,
    stateOf,
    playing: playing && !reduced,
    reduced,
    toggle: () => setPlaying((p) => !p),
    select: (i: number) => setState({ scene: i, step: 0 }),
  };
}

/** Paquet qui suit un lien (sens du lien ou inverse), recréé à chaque étape */
export function Packet({ d, reverse }: { d: string; reverse: boolean }) {
  const path = useRef<SVGPathElement>(null);
  const dot = useRef<SVGGElement>(null);

  useEffect(() => {
    const p = path.current;
    const g = dot.current;
    if (!p || !g) return;
    const len = p.getTotalLength();
    let frame = 0;
    let start = 0;
    const tick = (now: number) => {
      if (!start) start = now;
      const k = Math.min(1, (now - start) / TRAVEL_MS);
      const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      const pt = p.getPointAtLength((reverse ? 1 - e : e) * len);
      g.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
      g.style.opacity = k >= 1 ? "0" : "1";
      if (k < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [d, reverse]);

  return (
    <g aria-hidden="true" pointerEvents="none">
      <path ref={path} d={d} fill="none" stroke="none" />
      <g ref={dot} style={{ opacity: 0 }}>
        <circle r={9} fill="var(--glow)" />
        <circle r={4} fill="var(--accent)" />
        <circle r={1.8} fill="var(--on-accent-container)" />
      </g>
    </g>
  );
}

/** Pastille d'état en haut à droite d'un nœud */
export function StepBadge({ state, x, y }: { state: StepState; x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`} aria-hidden="true">
      {state === "done" && (
        <>
          <circle r={7} fill="var(--accent)" />
          <path d="M-3 0.2 L-0.8 2.4 L3.2 -2.2" fill="none" stroke="var(--on-accent)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
      {state === "running" && (
        <>
          <circle r={7} fill="var(--surface-solid)" stroke="var(--line-strong)" strokeWidth={1.4} />
          <circle r={7} fill="none" stroke="var(--accent)" strokeWidth={1.8} strokeDasharray="11 33" strokeLinecap="round" className="map-spin" />
        </>
      )}
      {state === "pending" && <circle r={4.5} fill="var(--surface-solid)" stroke="var(--line-strong)" strokeWidth={1.4} />}
    </g>
  );
}

/** Barre au-dessus du schéma : choix du scénario, lecture/pause, étapes avec leur état */
export function ScenarioBar({
  scenarios,
  player,
  nodeLabel,
  labels,
  muted,
}: {
  scenarios: readonly MapScenario[];
  player: ReturnType<typeof useScenarioPlayer>;
  nodeLabel: (id: string) => string;
  labels: { title: string; play: string; pause: string };
  /** Un nœud est survolé ou épinglé : la barre s'efface un peu (le panneau de détail prend le relais) */
  muted: boolean;
}) {
  const { scene, sceneIndex, stateOf, playing, reduced } = player;
  if (!scene) return null;

  return (
    <div className={cn("tile flex flex-col gap-3 px-3.5 py-3 transition-opacity duration-300", muted && "opacity-50")}>
      <div className="flex flex-wrap items-center gap-2">
        {!reduced && (
          <button
            type="button"
            onClick={player.toggle}
            aria-label={playing ? labels.pause : labels.play}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-[4px] bg-accent text-on-accent"
          >
            {playing ? <Pause size={14} aria-hidden="true" /> : <Play size={14} aria-hidden="true" />}
          </button>
        )}
        <span className="label mr-1">{labels.title}</span>
        <div role="tablist" aria-label={labels.title} className="flex flex-wrap gap-1.5">
          {scenarios.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={i === sceneIndex}
              onClick={() => player.select(i)}
              className={cn(
                "min-h-8 rounded-[4px] px-2.5 text-[12.5px] font-semibold transition-colors",
                i === sceneIndex ? "bg-accent-tint text-on-accent-container shadow-[inset_0_0_0_1px_var(--glow-ring)]" : "text-muted hover:bg-surface-3 hover:text-fg",
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <ol key={scene.id} className="flex flex-wrap items-center gap-y-2" aria-label={scene.label}>
        {scene.path.map((id, i) => {
          const state = stateOf(i);
          return (
            <li key={id} className="flex items-center" style={{ "--si": i } as CSSProperties}>
              {i > 0 && (
                <span aria-hidden="true" className="relative mx-1.5 h-px w-5 bg-line-strong sm:w-7">
                  <span className={cn("pipe-fill absolute inset-0 bg-accent", state !== "pending" && "pipe-fill-on")} />
                </span>
              )}
              <span
                className={cn(
                  "flex items-center gap-1.5 rounded-[4px] px-2 py-1 font-mono text-[11.5px] transition-colors duration-300",
                  state === "running" && "bg-accent-tint text-fg",
                  state === "done" && "text-fg",
                  state === "pending" && "text-dim",
                )}
              >
                <span aria-hidden="true" className="grid h-4 w-4 place-items-center">
                  {state === "done" && (
                    <span className="grid h-4 w-4 place-items-center rounded-full bg-accent text-on-accent">
                      <Check size={10} strokeWidth={3} />
                    </span>
                  )}
                  {state === "running" && <span className="pipe-spin h-3.5 w-3.5 rounded-full border-[1.5px] border-line-strong border-t-accent" />}
                  {state === "pending" && <span className="h-2 w-2 rounded-full border border-line-strong" />}
                </span>
                {nodeLabel(id)}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
