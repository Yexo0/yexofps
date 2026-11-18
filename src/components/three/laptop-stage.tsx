// src/components/three/laptop-stage.tsx — Hero de la page Baptiste (côté pro) : un PC portable en 3D,
// écran allumé. Même logique que la Vandal : intro, flottement, inclinaison vers la souris,
// rotation au défilement.
"use client";

import { Suspense, useLayoutEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, useGLTF } from "@react-three/drei";
import { Box3, Vector3, type Group } from "three";
import type { StageInput } from "./vandal-stage";

const LAPTOP = "/models/laptop.glb";

const easeOut = (x: number) => 1 - Math.pow(1 - x, 4);

/** Centre un modèle sur l'origine (base posée à y = 0) et ramène sa plus grande dimension à `size` */
function useFit(ref: React.RefObject<Group | null>, deps: unknown, size: number) {
  useLayoutEffect(() => {
    const g = ref.current;
    if (!g) return;
    g.position.set(0, 0, 0);
    g.scale.setScalar(1);
    const box = new Box3().setFromObject(g);
    const dim = box.getSize(new Vector3());
    const center = box.getCenter(new Vector3());
    const s = size / Math.max(dim.x, dim.y, dim.z, 0.001);
    g.scale.setScalar(s);
    g.position.set(-center.x * s, -box.min.y * s, -center.z * s);
  }, [ref, deps, size]);
}

function Laptop() {
  const { scene } = useGLTF(LAPTOP, false, true);
  const fit = useRef<Group>(null);
  useFit(fit, scene, 2);
  return (
    <group ref={fit}>
      <primitive object={scene} />
    </group>
  );
}

function Rig({ pointer, progress, reduced }: StageInput) {
  const rig = useRef<Group>(null);
  const t0 = useRef<number | null>(null);
  const look = useRef({ x: 0, y: 0 });
  const viewport = useThree((s) => s.viewport);
  // Le PC (2 unités dans sa plus grande dimension) occupe ~55 % de la largeur du canvas
  const scale = Math.min(viewport.width * 0.28, viewport.height * 0.5);

  useFrame((state, dt) => {
    const g = rig.current;
    if (!g) return;
    if (t0.current === null) t0.current = state.clock.elapsedTime;
    const since = reduced ? 10 : state.clock.elapsedTime - t0.current;
    const e = easeOut(Math.min(1, since / 1.8));
    const t = reduced ? 0 : state.clock.elapsedTime;
    const p = progress.current ?? 0;
    const target = reduced ? { x: 0, y: 0 } : (pointer.current ?? { x: 0, y: 0 });
    look.current.x += (target.x - look.current.x) * Math.min(1, dt * 3);
    look.current.y += (target.y - look.current.y) * Math.min(1, dt * 3);
    const { x, y } = look.current;

    // PC : trois-quarts face, arrive en pivotant depuis la droite
    g.scale.setScalar(scale * (0.85 + 0.15 * e));
    g.rotation.y = -0.55 + (1 - e) * 1.4 + Math.sin(t * 0.3) * 0.08 + x * 0.22 + p * 0.9;
    g.rotation.x = 0.12 + y * 0.08;
    g.position.x = viewport.width * 0.02 + (1 - e) * viewport.width * 0.35 - p * viewport.width * 0.1;
    g.position.y = -viewport.height * 0.3 + Math.sin(t * 0.7) * 0.02 + p * viewport.height * 0.15;
  });

  return (
    <group ref={rig}>
      <Laptop />
    </group>
  );
}

useGLTF.preload(LAPTOP, false, true);

export default function LaptopStage({ active, accent, accent2, ...input }: StageInput & { active: boolean; accent: string; accent2: string }) {
  return (
    <Canvas
      dpr={[1, 1.6]}
      frameloop={active ? "always" : "demand"}
      camera={{ position: [0, 0.4, 4.2], fov: 30 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ pointerEvents: "none" }}
    >
      <ambientLight intensity={0.45} />
      <directionalLight position={[2.5, 3, 4]} intensity={2.2} color="#f4f6ff" />
      <directionalLight position={[-4, 1, -3]} intensity={3} color={accent} />
      <directionalLight position={[4, -1, -2]} intensity={1.8} color={accent2} />
      <Environment resolution={64} frames={1}>
        <Lightformer form="rect" intensity={2.2} position={[0, 3, 2]} scale={[8, 1.2, 1]} />
        <Lightformer form="rect" intensity={2.4} color={accent} position={[-4, 0, 1]} rotation-y={Math.PI / 2} scale={[4, 1.4, 1]} />
        <Lightformer form="ring" intensity={1.6} color={accent2} position={[3, -1, -2]} scale={2.2} />
      </Environment>
      <Suspense fallback={null}>
        <Rig {...input} />
      </Suspense>
    </Canvas>
  );
}
