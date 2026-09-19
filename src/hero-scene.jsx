import React, { useMemo, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const palette = ['#f7d58a', '#e5aa40', '#c4801b', '#fff0c8', '#8f5308'];

function FloatingForm({ position, scale, speed, color, phase }) {
  const mesh = useRef();

  useFrame(({ clock, pointer }) => {
    const t = clock.getElapsedTime() * speed + phase;
    mesh.current.position.y = position[1] + Math.sin(t) * 0.16;
    mesh.current.rotation.x = Math.sin(t * 0.55) * 0.22;
    mesh.current.rotation.y = phase + t * 0.18 + pointer.x * 0.08;
    mesh.current.rotation.z = Math.cos(t * 0.65) * 0.14 + pointer.y * 0.05;
  });

  return (
    <mesh ref={mesh} position={position} scale={scale}>
      <icosahedronGeometry args={[1, 3]} />
      <meshPhysicalMaterial
        color={color}
        roughness={0.25}
        metalness={0.1}
        transmission={0.08}
        clearcoat={0.8}
        clearcoatRoughness={0.2}
        transparent
        opacity={0.86}
      />
    </mesh>
  );
}

function GoldDust() {
  const points = useRef();
  const positions = useMemo(() => {
    const data = new Float32Array(360 * 3);
    for (let i = 0; i < 360; i += 1) {
      const index = i * 3;
      const angle = i * 2.39996;
      const radius = 0.4 + Math.sqrt(i) * 0.095;
      data[index] = 1.2 + Math.cos(angle) * radius * 1.35;
      data[index + 1] = Math.sin(angle) * radius * 0.72;
      data[index + 2] = (i % 13) * -0.025 - 0.5;
    }
    return data;
  }, []);

  useFrame(({ clock, pointer }) => {
    points.current.rotation.z = clock.getElapsedTime() * 0.035;
    points.current.rotation.x = pointer.y * 0.07;
    points.current.rotation.y = pointer.x * 0.07;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#ffe8ae" size={0.025} sizeAttenuation transparent opacity={0.72} depthWrite={false} />
    </points>
  );
}

function Scene() {
  const forms = useMemo(() => [
    [[1.45, 0.85, 0], 0.88, 0.34, 0],
    [[2.35, -0.18, -0.45], 0.56, 0.42, 1.1],
    [[0.72, -1.05, -0.25], 0.46, 0.31, 2.2],
    [[3.2, 1.1, -0.9], 0.38, 0.38, 3.1],
    [[-0.08, 1.5, -0.8], 0.28, 0.26, 4.2],
    [[2.25, -1.52, -1.1], 0.3, 0.28, 5.4],
  ], []);

  return (
    <>
      <ambientLight intensity={1.4} color="#ffd98a" />
      <directionalLight position={[-4, 4, 5]} intensity={3.2} color="#fff1cb" />
      <pointLight position={[2.2, 1.4, 2]} intensity={35} distance={7} color="#e8a62f" />
      <GoldDust />
      {forms.map(([position, scale, speed, phase], index) => (
        <FloatingForm
          key={index}
          position={position}
          scale={scale}
          speed={speed}
          phase={phase}
          color={palette[index % palette.length]}
        />
      ))}
    </>
  );
}

function mountScene() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const hero = document.querySelector('.hero');
  if (!hero || document.querySelector('#hero-canvas')) return;

  const host = document.createElement('div');
  host.id = 'hero-canvas';
  host.setAttribute('aria-hidden', 'true');
  hero.prepend(host);

  createRoot(host).render(
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 6.4], fov: 42 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
    >
      <Scene />
    </Canvas>,
  );
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountScene, { once: true });
} else {
  mountScene();
}
