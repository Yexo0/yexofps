// src/components/three/buddy-stage.tsx — Gun buddy Radiant en 3D, accroché par le haut, qui se
// balance comme un pendule : la souris qui passe lui donne de l'élan, il ralentit puis se repose.
// Petit canvas, rendu seulement quand il est à l'écran (voir PeakBuddy).
"use client";

import { Suspense, useLayoutEffect, useRef, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, useGLTF } from "@react-three/drei";
import { Box3, Vector3, type Group } from "three";

const MODEL = "/models/buddy.glb";

export interface BuddyInput {
  /** Élan à ajouter (vitesse horizontale de la souris), remis à zéro à chaque image */
  impulseRef: RefObject<number>;
  reduced: boolean;
}

function Buddy({ impulseRef, reduced }: BuddyInput) {
  const { scene } = useGLTF(MODEL, false, true);
  const pivot = useRef<Group>(null);
  const model = useRef<Group>(null);
  const swing = useRef({ angle: reduced ? 0 : 0.5, speed: 0 });

  // Pivot en haut du buddy (l'anneau d'accroche), centré horizontalement, hauteur ramenée à 2 unités
  useLayoutEffect(() => {
    const g = model.current;
    if (!g) return;
    g.position.set(0, 0, 0);
    g.scale.setScalar(1);
    const box = new Box3().setFromObject(g);
    const size = box.getSize(new Vector3());
    const center = box.getCenter(new Vector3());
    const s = 2 / Math.max(size.y, 0.001);
    g.scale.setScalar(s);
    g.position.set(-center.x * s, -box.max.y * s, -center.z * s);
  }, [scene]);

  useFrame((state, dt) => {
    const p = pivot.current;
    if (!p) return;
    const step = Math.min(dt, 1 / 30);
    const sw = swing.current;
    if (!reduced) {
      // Pendule amorti : rappel vers la verticale, frottement, élan de la souris
      sw.speed += (-14 * Math.sin(sw.angle) - 1.6 * sw.speed) * step + (impulseRef.current ?? 0) * 0.012;
      sw.angle = Math.max(-1.1, Math.min(1.1, sw.angle + sw.speed * step));
      if (impulseRef.current) impulseRef.current = 0;
    }
    p.rotation.z = sw.angle;
    // Rotation lente sur lui-même, comme suspendu à une chaînette
    p.rotation.y = reduced ? 0.3 : Math.sin(state.clock.elapsedTime * 0.7) * 0.6 + sw.angle * 0.8;
  });

  return (
    <group ref={pivot} position={[0, 1.05, 0]}>
      <group ref={model}>
        <primitive object={scene} />
      </group>
    </group>
  );
}

useGLTF.preload(MODEL, false, true);

export default function BuddyStage({ active, ...input }: BuddyInput & { active: boolean }) {
  return (
    <Canvas
      dpr={[1, 2]}
      frameloop={active ? "always" : "demand"}
      camera={{ position: [0, 0, 4.6], fov: 30 }}
      gl={{ antialias: true, alpha: true }}
      style={{ pointerEvents: "none" }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[2, 3, 4]} intensity={2.4} />
      <directionalLight position={[-3, -1, -2]} intensity={1.5} color="#f2c14e" />
      <Environment resolution={32} frames={1}>
        <Lightformer form="rect" intensity={2.4} position={[0, 2, 3]} scale={[5, 1, 1]} />
        <Lightformer form="ring" intensity={1.8} color="#f2c14e" position={[-3, 0, 1]} scale={2} />
      </Environment>
      <Suspense fallback={null}>
        <Buddy {...input} />
      </Suspense>
    </Canvas>
  );
}
