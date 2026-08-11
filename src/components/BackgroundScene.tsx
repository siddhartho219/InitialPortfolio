"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PointMaterial, Points } from "@react-three/drei";
import * as THREE from "three";

import { subscribeScroll } from "@/lib/scrollStore";

// Cap particle count on small screens; 700 elsewhere (single draw call, GPU).
function pickCount() {
  if (typeof window === "undefined") return 700;
  return window.innerWidth < 768 ? 320 : 700;
}

// Deterministic PRNG so the field layout is stable between renders/resizes.
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Colorless background: a dark, depth-y starfield with scroll dolly and mouse
// parallax. No per-section color tint — the scene stays neutral everywhere.
function SceneContent() {
  const fieldRef = useRef<THREE.Points>(null);

  const reduceMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  const scrollRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  const [count] = useState(pickCount);

  const { positions, colors } = useMemo(() => {
    const rand = mulberry32(20260806);
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const x = (rand() - 0.5) * 36;
      const y = (rand() - 0.5) * 18;
      const z = -6 - rand() * 16; // depth volume 6..22 units ahead of camera
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      // Closer points are brighter, so depth reads as light falloff.
      const brightness = 1 - ((z + 6) / 16) * 0.65;
      colors[i * 3] = brightness;
      colors[i * 3 + 1] = brightness;
      colors[i * 3 + 2] = brightness;
    }
    return { positions, colors };
  }, [count]);

  useEffect(() => {
    // Scroll position now comes from the shared store (fed by Lenis, or by a
    // native fallback under reduced motion). Dolly math in useFrame is
    // unchanged — only the source of the scroll value changes.
    const unsubscribe = subscribeScroll(({ progress }) => {
      scrollRef.current = progress;
    });
    const onPointerMove = (event: PointerEvent) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => {
      unsubscribe();
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05); // clamp tab-switch spikes
    const damp = 1 - Math.pow(0.001, dt);

    const camera = state.camera;
    if (!reduceMotion) {
      // Slow forward dolly as the user scrolls down.
      const targetZ = 9 - scrollRef.current * 5;
      camera.position.z += (targetZ - camera.position.z) * damp;
      // Small parallax look-around from the pointer.
      camera.position.x +=
        (mouseRef.current.x * 0.9 - camera.position.x) * damp;
      camera.position.y +=
        (mouseRef.current.y * 0.5 - camera.position.y) * damp;
      camera.lookAt(0, 0, 0);

      // Gentle idle drift of the field itself.
      if (fieldRef.current) {
        fieldRef.current.rotation.y += dt * 0.02;
      }
    } else {
      // Reduced motion: fixed framing, no drift, no parallax.
      camera.position.set(0, 0, 9);
      camera.lookAt(0, 0, 0);
    }
  });

  return (
    <>
      {/* Fixed dark fog only — depth cue for the starfield, no color cycling. */}
      <fogExp2 attach="fog" args={["#060610", 0.02]} />
      <Points
        ref={fieldRef}
        positions={positions}
        colors={colors}
        frustumCulled={false}
      >
        <PointMaterial
          transparent
          vertexColors
          size={0.07}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.85}
        />
      </Points>
    </>
  );
}

export default function BackgroundScene() {
  const [active, setActive] = useState(true);

  useEffect(() => {
    const onVisibilityChange = () => {
      setActive(document.visibilityState === "visible");
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 2]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
      camera={{ position: [0, 0, 9], fov: 60, near: 0.1, far: 120 }}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    >
      <SceneContent />
    </Canvas>
  );
}
