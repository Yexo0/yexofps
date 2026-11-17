// src/components/three/logo-stage.tsx — Logo Valorant en 3D, façon carton-titre de montage :
// il pivote face caméra en arrivant, puis oscille doucement ; un reflet balaie la surface à
// intervalles réguliers. Matériau métal clair, éclairé aux couleurs de l'espace.
"use client";

import { Suspense, useLayoutEffect, useRef, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, useGLTF } from "@react-three/drei";
import { Box3, Mesh, MeshStandardMaterial, Vector3, type DirectionalLight, type Group } from "three";

const MODEL = "/models/logo.glb";

export interface LogoInput {
  pointer: RefObject<{ x: number; y: number }>;
  reduced: boolean;
}

const easeOut = (x: number) => 1 - Math.pow(1 - x, 4);

function Logo({ pointer, reduced }: LogoInput) {
  const { scene } = useGLTF(MODEL, false, true);
  const outer = useRef<Group>(null);
  const inner = useRef<Group>(null);
  const intro = useRef(reduced ? 1 : 0);
  const look = useRef({ x: 0, y: 0 });

  // Centré, largeur ramenée à 2 unités, matériau métal clair
  useLayoutEffect(() => {
    const g = inner.current;
    if (!g) return;
    // Le fichier pose le logo de profil : un quart de tour pour le mettre face caméra
    g.rotation.set(0, -Math.PI / 2, 0);
    g.position.set(0, 0, 0);
    g.scale.setScalar(1);
    const box = new Box3().setFromObject(g);
    const size = box.getSize(new Vector3());
    const center = box.getCenter(new Vector3());
    const s = 2 / Math.max(size.x, size.y, 0.001);
    g.scale.setScalar(s);
    g.position.set(-center.x * s, -center.y * s, -center.z * s);
    scene.traverse((o) => {
      if (o instanceof Mesh) {
        o.material = new MeshStandardMaterial({ color: "#f4f1ec", metalness: 0.85, roughness: 0.22, envMapIntensity: 1.4 });
      }
    });
  }, [scene]);

  useFrame((state, dt) => {
    const g = outer.current;
    if (!g) return;
    intro.current = Math.min(1, intro.current + dt / 1.6);
    const e = easeOut(intro.current);
    const t = reduced ? 0 : state.clock.elapsedTime;
    const target = reduced ? { x: 0, y: 0 } : (pointer.current ?? { x: 0, y: 0 });
    look.current.x += (target.x - look.current.x) * Math.min(1, dt * 3);
    look.current.y += (target.y - look.current.y) * Math.min(1, dt * 3);
    g.rotation.y = (1 - e) * -Math.PI * 0.9 + Math.sin(t * 0.5) * 0.22 + look.current.x * 0.35;
    g.rotation.x = Math.sin(t * 0.4) * 0.06 + look.current.y * 0.25;
    g.scale.setScalar(0.7 + 0.3 * e);
    g.position.y = Math.sin(t * 0.9) * 0.04;
  });

  return (
    <group ref={outer}>
      <group ref={inner}>
        <primitive object={scene} />
      </group>
    </group>
  );
}

/** Reflet : une lumière qui traverse la scène de gauche à droite toutes les 5 s */
function Sweep({ reduced }: { reduced: boolean }) {
  const light = useRef<DirectionalLight>(null);
  useFrame((state) => {
    const l = light.current;
    if (!l) return;
    const k = reduced ? 0.5 : (state.clock.elapsedTime % 5) / 5;
    l.position.set(-6 + k * 12, 1.5, 3);
    l.intensity = reduced ? 1 : 4 * Math.sin(Math.PI * k);
  });
  return <directionalLight ref={light} color="#ffffff" />;
}

useGLTF.preload(MODEL, false, true);

export default function LogoStage({ active, accent, accent2, ...input }: LogoInput & { active: boolean; accent: string; accent2: string }) {
  return (
    <Canvas
      dpr={[1, 2]}
      frameloop={active ? "always" : "demand"}
      camera={{ position: [0, 0, 5.6], fov: 30 }}
      gl={{ antialias: true, alpha: true }}
      style={{ pointerEvents: "none" }}
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[-4, 2, 3]} intensity={2.6} color={accent} />
      <directionalLight position={[4, -2, 2]} intensity={2.2} color={accent2} />
      <Sweep reduced={input.reduced} />
      <Environment resolution={64} frames={1}>
        <Lightformer form="rect" intensity={2} position={[0, 3, 2]} scale={[8, 1, 1]} />
        <Lightformer form="rect" intensity={3} color={accent} position={[-4, 0, 1]} rotation-y={Math.PI / 2} scale={[4, 2, 1]} />
        <Lightformer form="rect" intensity={2.4} color={accent2} position={[4, 0, 1]} rotation-y={-Math.PI / 2} scale={[4, 2, 1]} />
      </Environment>
      <Suspense fallback={null}>
        <Logo {...input} />
      </Suspense>
    </Canvas>
  );
}
