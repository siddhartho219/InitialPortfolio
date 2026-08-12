"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PointMaterial, Points } from "@react-three/drei";
import { usePathname } from "next/navigation";
import SectionForms from "@/components/SectionForms";
import SpaceLandmarks from "@/components/SpaceLandmarks";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

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

// ---------------------------------------------------------------------------
// Per-section camera "shots" — each section gets its own character (depth,
// FOV, look-at drift) so scrolling reads as one continuous camera move through
// a single space, restrained cinematography rather than jump cuts. Deltas
// between adjacent sections are intentionally small.
// ---------------------------------------------------------------------------
type SectionShot = {
  /** Camera depth (z). Lower = closer/tighter, higher = wider/farther. */
  z: number;
  /** Field of view in degrees. */
  fov: number;
  /** Small look-at yaw offset (world units, tiny angles). */
  lookX: number;
  /** Small look-at pitch offset (world units, tiny angles). */
  lookY: number;
};

// NOTE: there is intentionally no fixed SECTION_ORDER array here. The scrub
// pairing below derives the section sequence from live DOM order at runtime,
// so reordering sections in page.tsx can never break the camera choreography.
// (Explicit union rather than keyof typeof SECTION_SHOTS to avoid a circular
// type alias.)
type SectionId =
  | "home"
  | "about"
  | "experience"
  | "projects"
  | "blog"
  | "skills"
  | "contact";

const SECTION_SHOTS: Record<SectionId, SectionShot> = {
  // Establishing shot: widest, farthest, slight upward gaze.
  home: { z: 9.0, fov: 58, lookX: 0.0, lookY: 0.06 },
  // Pull in gently, subtle yaw right.
  experience: { z: 8.0, fov: 59.5, lookX: 0.15, lookY: 0.03 },
  // Closer/tighter, yaw right and slightly down.
  projects: { z: 6.5, fov: 61.5, lookX: 0.28, lookY: -0.06 },
  // Between projects and skills: continuing the inward arc, near-neutral yaw.
  blog: { z: 6.1, fov: 61.8, lookX: 0.08, lookY: 0.02 },
  // Closest, swing left and up.
  skills: { z: 5.8, fov: 62, lookX: -0.2, lookY: 0.12 },
  // Ease back out, gentle up.
  about: { z: 7.0, fov: 60, lookX: -0.14, lookY: 0.16 },
  // Calm resting position, centered.
  contact: { z: 8.5, fov: 59, lookX: 0.0, lookY: 0.05 },
};

const HOME_SHOT: SectionShot = { ...SECTION_SHOTS.home };

// Colorless background: a dark, depth-y starfield whose camera is scrubbed
// per-section via ScrollTrigger (fed by the Lenis scroll source), with pointer
// parallax and idle field drift layered on top. No per-section color tint.
function SceneContent({ pathname }: { pathname: string }) {
  const fieldRef = useRef<THREE.Points>(null);

  const reduceMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  const mouseRef = useRef({ x: 0, y: 0 });

  // Mutable camera proxy GSAP writes into each scroll frame; useFrame damps
  // toward it so the camera never snaps.
  const shotRef = useRef<SectionShot>({ ...HOME_SHOT });

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
    const onPointerMove = (event: PointerEvent) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, []);

  // Per-section scrubbed camera choreography. One scrubbed fromTo per adjacent
  // section pair, ranges contiguous (start: section i top at viewport top →
  // end: section i+1 top at viewport top), so exactly one tween is active at
  // any scroll position — a continuous interpolated number, never stepped.
  // Rides the existing Lenis + ScrollTrigger scroll source; no new loop.
  useEffect(() => {
    // Reduced motion: no ScrollTrigger instances at all — useFrame keeps the
    // camera fixed, matching the rest of the codebase's reduced-motion
    // convention.
    if (reduceMotion) return;

    // Derive the actual section sequence from live DOM order (all
    // <section id> elements whose id has a shot in SECTION_SHOTS). This is
    // order-agnostic: reordering sections in page.tsx just changes the DOM
    // order, and the adjacent-pair tweens below follow it automatically.
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>("section[id]"),
    ).filter((el) => el.id in SECTION_SHOTS);

    // Reset to the establishing shot (also covers route changes to pages that
    // have no section DOM, e.g. /projects/[slug]).
    Object.assign(shotRef.current, HOME_SHOT);

    if (elements.length < 2) return;

    const triggers: ScrollTrigger[] = [];

    for (let i = 0; i < elements.length - 1; i += 1) {
      const from = SECTION_SHOTS[elements[i].id as SectionId];
      const to = SECTION_SHOTS[elements[i + 1].id as SectionId];

      const tween = gsap.fromTo(
        shotRef.current,
        { ...from },
        { ...to, ease: "none", immediateRender: false },
      );

      triggers.push(
        ScrollTrigger.create({
          trigger: elements[i],
          start: "top top",
          endTrigger: elements[i + 1],
          end: "top top",
          scrub: true,
          animation: tween,
        }),
      );
    }

    // Re-measure now that triggers exist; ScrollTrigger also refreshes on load.
    ScrollTrigger.refresh();

    return () => {
      triggers.forEach((trigger) => trigger.kill());
    };
  }, [reduceMotion, pathname]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05); // clamp tab-switch spikes
    const damp = 1 - Math.pow(0.001, dt);

    // The Canvas is configured with a PerspectiveCamera; state.camera is typed
    // as the base Camera union which has no fov.
    const camera = state.camera as THREE.PerspectiveCamera;
    if (!reduceMotion) {
      const shot = shotRef.current;

      // Per-section depth/FOV (replaces the old linear dolly) — damped.
      camera.position.z += (shot.z - camera.position.z) * damp;
      camera.fov += (shot.fov - camera.fov) * damp;
      camera.updateProjectionMatrix();

      // Small parallax look-around from the pointer (unchanged, layered on top).
      camera.position.x +=
        (mouseRef.current.x * 0.9 - camera.position.x) * damp;
      camera.position.y +=
        (mouseRef.current.y * 0.5 - camera.position.y) * damp;

      // Small per-section look-at drift (restrained yaw/pitch).
      camera.lookAt(shot.lookX, shot.lookY, 0);

      // Gentle idle drift of the field itself (unchanged).
      if (fieldRef.current) {
        fieldRef.current.rotation.y += dt * 0.02;
      }
    } else {
      // Reduced motion: fixed framing, no drift, no parallax, no choreography.
      camera.position.set(0, 0, 9);
      camera.fov = 60;
      camera.updateProjectionMatrix();
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
  const pathname = usePathname();
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
      <SceneContent pathname={pathname} />
      {/* Pilot: scrubbed wireframe forms for #projects and #skills. */}
      <SectionForms />
      {/* Space-journey landmarks: #about planet, #experience star cluster,
          #blog debris field, #contact arrival — one shared accent palette,
          scrubbed to their own sections. */}
      <SpaceLandmarks />
    </Canvas>
  );
}
