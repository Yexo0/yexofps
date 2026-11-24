// src/components/three/vandal-stage.tsx — Vandal en 3D du hero de l'accueil (three.js via React Three Fiber).
// Arrivée en "inspection" (rotation qui se pose), flottement lent, inclinaison vers la souris,
// rotation pilotée par le défilement. Lumières : environnement procédural (aucun fichier HDR,
// aucune requête réseau) teinté aux couleurs de l'espace.
// Chargé uniquement côté client, après le chargement de la page (voir HeroStage / useStage) ; rendu en
// continu seulement quand il est visible. Téléphone : modèle allégé (texture 1024 au lieu de 2048)
// et densité de pixels limitée à 1,5.
"use client";

import { Suspense, useEffect, useLayoutEffect, useRef, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, useGLTF } from "@react-three/drei";
import { Mesh, MeshStandardMaterial, type Group } from "three";
import { isPhone } from "@/lib/defer";

// Module chargé côté client seulement (next/dynamic, ssr: false) : window est disponible
const PHONE = typeof window !== "undefined" && isPhone();
const MODEL = PHONE ? "/models/vandal-lite.glb" : "/models/vandal.glb";

export interface StageInput {
  /** Pointeur normalisé (-1 à 1) */
  pointer: RefObject<{ x: number; y: number }>;
  /** Défilement à travers le hero (0 en haut, 1 quand il est sorti de l'écran) */
  progress: RefObject<number>;
  reduced: boolean;
  /** Tour d'inspection à l'arrivée ; faux quand la scène prend le relais d'un poster (même pose de départ) */
  intro?: boolean;
  /** Appelé quand le modèle est chargé et la scène affichée */
  onReady?: () => void;
}

const easeOut = (x: number) => 1 - Math.pow(1 - x, 4);

function Vandal({ pointer, progress, reduced, intro: withIntro = true, onReady }: StageInput) {
  const { scene } = useGLTF(MODEL, false, true);
  const group = useRef<Group>(null);
  const intro = useRef(reduced || !withIntro ? 1 : 0);
  useEffect(() => onReady?.(), [onReady]);
  const look = useRef({ x: 0, y: 0 });
  const viewport = useThree((s) => s.viewport);

  // Matériau : un peu de brillant pour accrocher les lumières colorées
  useLayoutEffect(() => {
    scene.traverse((o) => {
      if (o instanceof Mesh && o.material instanceof MeshStandardMaterial) {
        o.material.roughness = 0.38;
        o.material.metalness = 0.3;
        o.material.envMapIntensity = 1.25;
      }
    });
  }, [scene]);

  // Taille : la longueur de l'arme (1 unité) occupe ~80 % de la largeur du canvas
  const scale = Math.min(viewport.width * 0.84, viewport.height * 2.6);

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    intro.current = Math.min(1, intro.current + dt / 1.8);
    const e = easeOut(intro.current);
    const t = reduced ? 0 : state.clock.elapsedTime;
    const p = progress.current ?? 0;
    const target = reduced ? { x: 0, y: 0 } : (pointer.current ?? { x: 0, y: 0 });
    look.current.x += (target.x - look.current.x) * Math.min(1, dt * 3);
    look.current.y += (target.y - look.current.y) * Math.min(1, dt * 3);
    const { x, y } = look.current;

    // Canon vers la droite, légère diagonale montante ; l'intro fait un tour d'inspection
    g.rotation.y = Math.PI / 2 + (1 - e) * Math.PI * 1.35 + Math.sin(t * 0.32) * 0.16 + x * 0.32 + p * 1.2;
    g.rotation.z = 0.2 + Math.sin(t * 0.45) * 0.025 - y * 0.1 - p * 0.3;
    g.rotation.x = -0.12 + y * 0.18;
    g.position.x = (1 - e) * viewport.width * 0.5 - p * viewport.width * 0.12;
    g.position.y = Math.sin(t * 0.75) * 0.025 + p * viewport.height * 0.18;
    g.scale.setScalar(scale * (0.86 + 0.14 * e));
  });

  return (
    <group ref={group}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload(MODEL, false, true);

export default function VandalStage({ active, accent, accent2, ...input }: StageInput & { active: boolean; accent: string; accent2: string }) {
  return (
    <Canvas
      dpr={[1, PHONE ? 1.5 : 1.6]}
      frameloop={active ? "always" : "demand"}
      camera={{ position: [0, 0, 3.4], fov: 30 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ pointerEvents: "none" }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[2.5, 3, 4]} intensity={2.4} color="#fff4e6" />
      <directionalLight position={[-4, -1, -3]} intensity={3.2} color={accent} />
      <directionalLight position={[4, -2, -2]} intensity={1.6} color={accent2} />
      <Environment resolution={64} frames={1}>
        <Lightformer form="rect" intensity={2.2} position={[0, 3, 2]} scale={[8, 1.2, 1]} />
        <Lightformer form="rect" intensity={2.4} color={accent} position={[-4, 0, 1]} rotation-y={Math.PI / 2} scale={[4, 1.4, 1]} />
        <Lightformer form="ring" intensity={1.6} color={accent2} position={[3, -1, -2]} scale={2.2} />
      </Environment>
      <Suspense fallback={null}>
        <Vandal {...input} />
      </Suspense>
    </Canvas>
  );
}
