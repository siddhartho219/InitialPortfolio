"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

// ---------------------------------------------------------------------------
// The "space journey" landmark system — FINALIZED (was a #about-only pilot).
//
// Every section of the page is a distinct place in space. Four sections carry
// their own landmark object (scrubbed to that section's scroll range), while
// #home stays a clean establishing shot and #projects/#skills already have
// their own wireframe identity via SectionForms.
//
//   #about      → a low-poly wireframe planet + atmosphere ring (the pilot,
//                 now permanently in its color variant — the neutral/toggle
//                 path is gone).
//   #experience → a dense star cluster (two Points layers: dim halo + bright
//                 core), drifting as one group.
//   #blog       → an asteroid/debris field: several small irregular wireframe
//                 fragments, each tumbling on its own axis/speed.
//   #contact    → the "arrival" object: the largest, closest landmark — a
//                 wireframe sphere with a counter-rotating ring, reading as a
//                 portal/gate, the most substantial moment of the journey.
//
// ALL landmarks share ONE accent palette (the pilot's color variant values) —
// a single constant, so future tuning is a one-place change and per-section
// color drift is structurally impossible. Nothing else in the scene carries
// this color.
//
// Opacity of every landmark is scrubbed to its section's scroll range via the
// same Lenis + ScrollTrigger mechanism as SectionForms (fade in → hold while
// centered → fade out). Idle rotation is delta-clamped (0.05) like every
// other animated object. Under prefers-reduced-motion the whole component
// returns null — no landmark renders at all, matching the established
// convention for SectionForms and the pilot.
// ---------------------------------------------------------------------------

// --- Shared accent palette (the pilot's approved color variant) ------------
// Faint warm "distant planet limb" tint — deliberately desaturated so it reads
// as light on distant objects, not a colored spotlight. Used by ALL four
// landmarks; this is the single source of truth for the whole system.
export const LANDMARK_LINE = "#e2a175"; // wireframe lines
export const LANDMARK_PARTICLE = "#f0c9a8"; // atmosphere/particle accents

type FormOpacity = { value: number };

// ---------------------------------------------------------------------------
// #about PILOT: cursor-reactive drift + fog-density scrub (this round).
//
// The planet gently drifts toward the visitor's cursor while #about is in
// view, and the scene's fog density (never its color) rises modestly while the
// section is centered — "arriving somewhere" without any color change.
//
// Drift cap in world units: the audit measured ≥49px of clearance between the
// planet and real content at 1280. At the planet's depth under the About shot
// (camera z 7, fov 60; object z -36) one world unit ≈ 18.4-18.7px, so 0.85
// world units ≈ 16px of screen movement — full drift plus the existing camera
// parallax swing still leaves ~30px clear. Opacity-scaling keeps the drift
// tiny at the section fringes where the scroll envelope is tightest.
const ABOUT_DRIFT_CAP = 0.85; // world units ≈ 16px of screen movement at 1280
const ABOUT_OPACITY_PEAK = 0.4; // the scrub hold value (see setup() below)

// Fog is a fixed FogExp2 at #060610, density 0.02, defined in SceneContent.
// While #about is centered we scrub the DENSITY up modestly and back down —
// same color, same keyframe/hold shape as the opacity scrubs. Peak 0.024 was
// tuned live: the far starfield (≈29 units) dims ~0.71 → ~0.59 and the
// landmark (≈43 units) loses ~18% of its pixels — clearly hazier, but the
// planet stays fully legible (0.026+ starts burying it, 0.025 was tried and
// rejected). Fog never touches 2D content (DOM renders above the canvas).
const FOG_BASELINE = 0.02;
const ABOUT_FOG_PEAK = 0.024;

// Deterministic 0..1 pseudo-random from an index (stable between renders).
function hash01(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return Math.abs(x) % 1;
}

// ---------------------------------------------------------------------------
// #about — planet + atmosphere ring (the pilot, color locked)
// ---------------------------------------------------------------------------
const ABOUT_RING_COUNT = 110;
// Ring floats just outside the sphere, slightly squashed in z and tilted, so
// it reads as a thin atmospheric halo rather than a solid disk.
// Extent reduced 1.7 -> 1.25 (magnitude correction): the ring dominated the
// object's screen footprint; with group scale 0.85 the planet now projects to
// ~24px radius at 1280 instead of ~145px.
const ABOUT_RING_TILT: [number, number, number] = [1.15, 0.2, 0];

function AboutPlanet({
  opacity,
  position,
}: {
  opacity: FormOpacity;
  position: [number, number, number];
}) {
  const groupRef = useRef<THREE.Group>(null);
  const linesMat = useRef<THREE.LineBasicMaterial>(null);
  const ringMat = useRef<THREE.PointsMaterial>(null);

  // #about pilot: cursor-reactive drift. Self-contained listener mirroring
  // SceneContent's normalization (x,y in -1..1). The planet never follows
  // instantly — it eases toward the capped target with the same damp used for
  // the camera parallax, and scales down with the opacity scrub so it only
  // strays while actually visible and composed.
  const mouseRef = useRef({ x: 0, y: 0 });
  const driftRef = useRef({ x: 0, y: 0 });
  // Live camera for the drift safety clamp (see useFrame) — read-only.
  const camera = useThree((state) => state.camera) as THREE.PerspectiveCamera;
  // Scratch vectors for projection (no per-frame allocation).
  const projNoDrift = useMemo(() => new THREE.Vector3(), []);
  const projDrift = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, []);

  const { sphereGeo, ringGeo } = useMemo(() => {
    // Icosahedron detail 1 = 42 verts / 80 faces — trivially cheap, higher
    // resolution than SectionForms' crystal (detail 0) so the sphere reads
    // as a rounded body rather than a jagged shard.
    const sphereGeo = new THREE.EdgesGeometry(
      new THREE.IcosahedronGeometry(1, 1),
    );

    const pos = new Float32Array(ABOUT_RING_COUNT * 3);
    for (let i = 0; i < ABOUT_RING_COUNT; i += 1) {
      const a = (i / ABOUT_RING_COUNT) * Math.PI * 2;
      const r = 0.94 + hash01(i) * 0.31; // 0.94..1.25 (was 1.28..1.7)
      const y = (hash01(i + 7) - 0.5) * 0.16; // thin band
      pos[i * 3] = Math.cos(a) * r;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = Math.sin(a) * r * 0.38; // squashed → elliptical halo
    }
    const ringGeo = new THREE.BufferGeometry();
    ringGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return { sphereGeo, ringGeo };
  }, []);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05); // clamp tab-switch spikes, same as SceneContent
    const g = groupRef.current;
    if (g) {
      // Slow, majestic idle rotation — distinct from the field/forms.
      g.rotation.y += dt * 0.03;
      g.rotation.x += dt * 0.012;

      // Gentle magnetic drift toward the cursor. Target is clamped to a
      // circle of radius ABOUT_DRIFT_CAP, then damped (spring-like ease, same
      // damp constant as SceneContent's camera parallax) and scaled by the
      // opacity scrub so drift vanishes at the section's fringes.
      const visScale = Math.min(1, opacity.value / ABOUT_OPACITY_PEAK);
      let tx = mouseRef.current.x * ABOUT_DRIFT_CAP;
      let ty = mouseRef.current.y * ABOUT_DRIFT_CAP;
      const mag = Math.hypot(tx, ty);
      if (mag > ABOUT_DRIFT_CAP) {
        const k = ABOUT_DRIFT_CAP / mag;
        tx *= k;
        ty *= k;
      }
      const damp = 1 - Math.pow(0.001, dt);
      driftRef.current.x += (tx - driftRef.current.x) * damp;
      driftRef.current.y += (ty - driftRef.current.y) * damp;

      // ---- Drift safety clamp (hard gate) --------------------------------
      // SceneContent's pointer parallax swings the whole scene ±0.9 world
      // units via a lookAt pivot — measured live, that alone moves the planet
      // from x≈1415 (mouse far right) to x≈1133 (mouse far left, 81px inside
      // the 1120px content band) at 1280. Our drift must never WIDEN that
      // reach: project the planet's leftmost footprint point (center − 0.75
      // world: the atmosphere ring reaches ~1.25 · scale 0.6 = 0.75 right of
      // center) through the live camera each frame, and back the X drift off
      // toward zero (never leftward) until that edge is no closer to content
      // than BOTH (a) the content band plus a small margin AND (b) where it
      // would sit with zero drift at this same camera position (parity — we
      // never make the audited parallax worst case worse). At neutral mouse
      // the full 16px cap is inside the 48px audited margin, so drift is
      // unrestricted there; as the parallax swings the planet toward content
      // the safe range auto-shrinks to zero — the "reduce the drift range
      // further" remedy, applied continuously, without touching the audited
      // base position.
      camera.updateMatrixWorld();
      projNoDrift.set(position[0] - 0.75, g.position.y, position[2]).project(camera);
      projDrift
        .set(position[0] - 0.75 + driftRef.current.x, g.position.y, position[2])
        .project(camera);
      const noDriftLeft = ((projNoDrift.x + 1) / 2) * window.innerWidth;
      const driftLeft = ((projDrift.x + 1) / 2) * window.innerWidth;
      // Content band is 1120px centered (right edge = innerWidth*0.9375);
      // keep a small breathing margin so "touching" counts as a fail.
      const contentEdgePx = window.innerWidth * 0.9375 + 12;
      const floorPx = Math.min(noDriftLeft, contentEdgePx);
      let dx = driftRef.current.x;
      if (dx < 0 && driftLeft < floorPx - 0.5) {
        // Monotonic, near-linear here: step dx toward the floor, never past
        // zero (the planet must not drift left of the safe edge, and must
        // never be pushed right of base against the cursor direction).
        const slope = Math.max(
          4,
          (driftLeft - noDriftLeft) / Math.max(1e-4, dx),
        );
        dx = Math.min(0, dx + (floorPx - driftLeft) / slope);
      }

      g.position.x = position[0] + dx * visScale;
      g.position.y = position[1] + driftRef.current.y * visScale;
    }
    if (linesMat.current) linesMat.current.opacity = opacity.value;
    if (ringMat.current) ringMat.current.opacity = opacity.value * 0.8;
  });

  return (
    <group ref={groupRef} position={position} scale={0.6}>
      <lineSegments geometry={sphereGeo}>
        <lineBasicMaterial
          ref={linesMat}
          color={LANDMARK_LINE}
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
      <points geometry={ringGeo} rotation={ABOUT_RING_TILT}>
        <pointsMaterial
          ref={ringMat}
          color={LANDMARK_PARTICLE}
          size={0.05}
          transparent
          opacity={0}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

// ---------------------------------------------------------------------------
// #experience — dense star cluster
// ---------------------------------------------------------------------------
// A tight, roughly spherical cluster (opposite of the sparse full-depth
// starfield): a dim shell of small points plus a smaller, brighter/larger
// core so it reads as a genuine cluster with depth, not a random patch of the
// background field. Rotates slowly as one group (no individual twitching).
const CLUSTER_HALO = 130;
const CLUSTER_CORE = 26;

function ExperienceCluster({
  opacity,
  position,
}: {
  opacity: FormOpacity;
  position: [number, number, number];
}) {
  const groupRef = useRef<THREE.Group>(null);
  const haloMat = useRef<THREE.PointsMaterial>(null);
  const coreMat = useRef<THREE.PointsMaterial>(null);

  const { haloGeo, coreGeo } = useMemo(() => {
    // Uniform points in a sphere (cbrt for volume-uniform density).
    const make = (count: number, radius: number, seedOffset: number) => {
      const pos = new Float32Array(count * 3);
      for (let i = 0; i < count; i += 1) {
        const r = Math.cbrt(hash01(i + seedOffset)) * radius;
        const theta = hash01(i + seedOffset + 11) * Math.PI * 2;
        const phi = Math.acos(2 * hash01(i + seedOffset + 23) - 1);
        pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        pos[i * 3 + 2] = r * Math.cos(phi);
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      return geo;
    };

    return {
      haloGeo: make(CLUSTER_HALO, 1.6, 0),
      coreGeo: make(CLUSTER_CORE, 0.55, 500),
    };
  }, []);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const g = groupRef.current;
    if (g) {
      // Slow group drift — reads as one body floating, not twinkling.
      g.rotation.y += dt * 0.025;
      g.rotation.x += dt * 0.008;
    }
    // Halo stays dim; core reads brighter. Both fade with the scrub.
    if (haloMat.current) haloMat.current.opacity = opacity.value * 0.5;
    if (coreMat.current) coreMat.current.opacity = opacity.value * 0.95;
  });

  return (
    <group ref={groupRef} position={position} scale={0.48}>
      <points geometry={haloGeo}>
        <pointsMaterial
          ref={haloMat}
          color={LANDMARK_PARTICLE}
          size={0.11}
          transparent
          opacity={0}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <points geometry={coreGeo}>
        <pointsMaterial
          ref={coreMat}
          color={LANDMARK_PARTICLE}
          size={0.24}
          transparent
          opacity={0}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

// ---------------------------------------------------------------------------
// #blog — asteroid / debris field
// ---------------------------------------------------------------------------
// Several small irregular wireframe fragments (mix of icosahedron detail 0
// and tetrahedron), scattered in a loose cluster. Each fragment has its OWN
// independent slow rotation (distinct axis/speed per fragment) so they read
// as tumbling debris, not one rigid group. The whole field also drifts very
// gently. Low fragment count keeps it cheap — several small meshes, not one
// complex one.
type FragmentKind = "ico" | "tet";

type FragmentConfig = {
  kind: FragmentKind;
  offset: [number, number, number];
  scale: number;
  rotSpeed: [number, number, number];
};

const DEBRIS_FRAGMENTS: FragmentConfig[] = [
  { kind: "ico", offset: [0, 0.25, 0], scale: 0.55, rotSpeed: [0.4, 0.28, 0.12] },
  { kind: "tet", offset: [1.0, -0.15, 0.25], scale: 0.42, rotSpeed: [0.25, -0.4, 0.18] },
  { kind: "tet", offset: [-0.9, 0.1, 0.4], scale: 0.5, rotSpeed: [-0.32, 0.22, -0.2] },
  { kind: "ico", offset: [0.55, -0.55, 0.15], scale: 0.34, rotSpeed: [0.22, 0.5, 0.1] },
  { kind: "tet", offset: [-0.35, 0.6, -0.3], scale: 0.3, rotSpeed: [0.5, -0.18, 0.28] },
  { kind: "ico", offset: [-0.7, -0.45, -0.35], scale: 0.38, rotSpeed: [-0.2, 0.35, 0.45] },
  { kind: "tet", offset: [0.15, 0.85, 0.1], scale: 0.26, rotSpeed: [0.4, 0.3, -0.25] },
];

function BlogDebris({
  opacity,
  position,
}: {
  opacity: FormOpacity;
  position: [number, number, number];
}) {
  const groupRef = useRef<THREE.Group>(null);
  const fragRefs = useRef<(THREE.Group | null)[]>([]);
  const matRefs = useRef<(THREE.LineBasicMaterial | null)[]>([]);

  const geometries = useMemo(
    () =>
      DEBRIS_FRAGMENTS.map((f) => {
        const base =
          f.kind === "ico"
            ? new THREE.IcosahedronGeometry(1, 0)
            : new THREE.TetrahedronGeometry(1);
        return new THREE.EdgesGeometry(base);
      }),
    [],
  );

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const g = groupRef.current;
    if (g) {
      // Very gentle whole-field drift so the cluster feels loosely bound.
      g.rotation.y += dt * 0.02;
    }
    DEBRIS_FRAGMENTS.forEach((config, i) => {
      const frag = fragRefs.current[i];
      if (frag) {
        // Independent tumble per fragment — distinct axis and speed.
        frag.rotation.x += dt * config.rotSpeed[0];
        frag.rotation.y += dt * config.rotSpeed[1];
        frag.rotation.z += dt * config.rotSpeed[2];
      }
      if (matRefs.current[i]) {
        matRefs.current[i].opacity = opacity.value;
      }
    });
  });

  return (
    <group ref={groupRef} position={position} scale={0.48}>
      {DEBRIS_FRAGMENTS.map((config, i) => (
        <group
          key={i}
          ref={(el) => {
            fragRefs.current[i] = el;
          }}
          position={config.offset}
          scale={config.scale}
        >
          <lineSegments geometry={geometries[i]}>
            <lineBasicMaterial
              ref={(el) => {
                matRefs.current[i] = el;
              }}
              color={LANDMARK_LINE}
              transparent
              opacity={0}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </lineSegments>
        </group>
      ))}
    </group>
  );
}

// ---------------------------------------------------------------------------
// #contact — "arrival" object
// ---------------------------------------------------------------------------
// The largest and closest of the four landmarks: a wireframe sphere (reusing
// the planet approach at a bigger scale) with a tilted ring suggesting a
// portal/gate. Counter-rotating ring + sphere give a slow "arrival" feel.
// Restrained relative to the contact form/socials — ambient, not competing.
// Ring radius reduced 2.15 -> 1.6 (magnitude correction): with group scale 0.68
// the portal now projects to ~24px radius at 1280 instead of ~171px.
const ARRIVAL_RING_RADIUS = 1.6;
const ARRIVAL_RING_SEGMENTS = 48;
const ARRIVAL_RING_TILT: [number, number, number] = [1.2, 0, 0.4];

function ContactArrival({
  opacity,
  position,
}: {
  opacity: FormOpacity;
  position: [number, number, number];
}) {
  const groupRef = useRef<THREE.Group>(null);
  const sphereMat = useRef<THREE.LineBasicMaterial>(null);
  const ringMat = useRef<THREE.LineBasicMaterial>(null);
  const ringRef = useRef<THREE.Group>(null);

  const { sphereGeo, ringGeo } = useMemo(() => {
    const sphereGeo = new THREE.EdgesGeometry(
      new THREE.IcosahedronGeometry(1, 1),
    );

    // A clean circular LineLoop for the portal ring (48 segments, one cheap
    // draw call) rather than a subdivided torus mesh.
    const pos = new Float32Array(ARRIVAL_RING_SEGMENTS * 3);
    for (let i = 0; i < ARRIVAL_RING_SEGMENTS; i += 1) {
      const a = (i / ARRIVAL_RING_SEGMENTS) * Math.PI * 2;
      pos[i * 3] = Math.cos(a) * ARRIVAL_RING_RADIUS;
      pos[i * 3 + 1] = 0;
      pos[i * 3 + 2] = Math.sin(a) * ARRIVAL_RING_RADIUS;
    }
    const ringGeo = new THREE.BufferGeometry();
    ringGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return { sphereGeo, ringGeo };
  }, []);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const g = groupRef.current;
    if (g) {
      g.rotation.y += dt * 0.025;
    }
    // Ring counter-rotates against the sphere → slow portal churn.
    if (ringRef.current) ringRef.current.rotation.z += dt * -0.02;
    if (sphereMat.current) sphereMat.current.opacity = opacity.value;
    if (ringMat.current) ringMat.current.opacity = opacity.value * 0.9;
  });

  return (
    <group ref={groupRef} position={position} scale={0.48}>
      <lineSegments geometry={sphereGeo}>
        <lineBasicMaterial
          ref={sphereMat}
          color={LANDMARK_LINE}
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
      <group ref={ringRef} rotation={ARRIVAL_RING_TILT}>
        <lineLoop geometry={ringGeo}>
          <lineBasicMaterial
            ref={ringMat}
            color={LANDMARK_PARTICLE}
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </lineLoop>
      </group>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Parent — mounts all four landmarks, scrubs each to its own section.
// ---------------------------------------------------------------------------
export default function SpaceLandmarks() {
  const pathname = usePathname();
  const reduceMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  const aboutOpacity = useRef<FormOpacity>({ value: 0 });
  const experienceOpacity = useRef<FormOpacity>({ value: 0 });
  const blogOpacity = useRef<FormOpacity>({ value: 0 });
  const contactOpacity = useRef<FormOpacity>({ value: 0 });

  // #about pilot: scrubbed fog density (0..1 multiplier; 1 = ABOUT_FOG_PEAK).
  // Reads the fog that SceneContent attaches to the scene (never its color),
  // writes scene.fog.density each frame. Under reduced motion the scrub is
  // never created, so the density stays at baseline throughout.
  const scene = useThree((state) => state.scene);
  const fogRef = useRef<THREE.FogExp2 | null>(null);
  const fogDensity = useRef<FormOpacity>({ value: 0 });

  useEffect(() => {
    if (scene.fog instanceof THREE.FogExp2) {
      fogRef.current = scene.fog;
    }
  }, [scene]);

  // Restore baseline density if this component unmounts mid-scrub (route
  // change while #about is in view) so the fog never leaks to other pages.
  useEffect(
    () => () => {
      if (fogRef.current) fogRef.current.density = FOG_BASELINE;
    },
    [],
  );

  useFrame(() => {
    if (fogRef.current) {
      const v = fogDensity.current.value;
      fogRef.current.density =
        FOG_BASELINE + (ABOUT_FOG_PEAK - FOG_BASELINE) * v;
    }
  });

  // Opacity scrub: one keyframed tween per landmark over its section's full
  // scroll range (fade in → hold while centered → fade out), driven by
  // ScrollTrigger scrub on the existing Lenis scroll source. No new loop.
  useEffect(() => {
    // Reduced motion: no per-section 3D choreography of any kind — landmarks
    // are not rendered at all (return null below), matching SectionForms and
    // the pilot convention.
    if (reduceMotion) return;

    const triggers: ScrollTrigger[] = [];

    const setup = (id: string, refObj: FormOpacity) => {
      const el = document.getElementById(id);
      if (!el) return;
      // Ramp in fast, hold at full opacity through the section's in-view
      // middle, then fade out — so the landmark is clearly present when the
      // section is centered and the camera has settled on its shot.
      // Peak hold value 0.4 — ambient presence, never a foreground element.
      // (The fade-in/hold/fade-out TIMING shape is unchanged.)
      const tween = gsap.to(refObj, {
        keyframes: [
          { value: 0, duration: 0.15 },
          { value: 0.4, duration: 0.1 }, // fast ramp in
          { value: 0.4, duration: 0.55 }, // genuine hold
          { value: 0, duration: 0.2 }, // fade out
        ],
        ease: "none",
        immediateRender: false,
      });
      triggers.push(
        ScrollTrigger.create({
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          animation: tween,
        }),
      );
    };

    setup("about", aboutOpacity.current);
    setup("experience", experienceOpacity.current);
    setup("blog", blogOpacity.current);
    setup("contact", contactOpacity.current);

    // #about pilot: scrub fog DENSITY (not color) up while #about is centered
    // and back to baseline as the section is entered/exited — same
    // keyframe/hold shape as the opacity scrubs, riding the same scroll
    // source. The value (0..1) is consumed in useFrame above.
    const fogEl = document.getElementById("about");
    if (fogEl) {
      const fogTween = gsap.to(fogDensity.current, {
        keyframes: [
          { value: 0, duration: 0.15 },
          { value: 1, duration: 0.1 }, // fast ramp in
          { value: 1, duration: 0.55 }, // genuine hold while centered
          { value: 0, duration: 0.2 }, // fade back out
        ],
        ease: "none",
        immediateRender: false,
      });
      triggers.push(
        ScrollTrigger.create({
          trigger: fogEl,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          animation: fogTween,
        }),
      );
    }

    ScrollTrigger.refresh();

    return () => {
      triggers.forEach((t) => t.kill());
      fogDensity.current.value = 0; // density returns to baseline with the tween killed
    };
  }, [reduceMotion, pathname]);

  if (reduceMotion) return null;

  return (
    <>
      {/* All landmarks now live in the side band OUTSIDE the 1120px content
          column, so they can never sit over section text/cards at any desktop
          width. Each position was solved with the real camera projection at
          1280/1440/1920 (see the audit): at 1280 the footprint is 26px clear
          of content (6-10px from the screen edge); at 1440+ it gains 86-199px. */}
      {/* About shot: camera z 7.0, fov 60, lookAt (-0.14, 0.16, 0). Composed
          for the centered viewing camera: ≥49px clear of content at all three
          audit widths; the ring extent (1.25) now projects to ~14px. */}
      <AboutPlanet opacity={aboutOpacity.current} position={[33.3, 3.9, -36]} />
      {/* Experience shot: camera z 8.0, fov 59.5, lookAt (0.15, 0.03, 0). */}
      <ExperienceCluster
        opacity={experienceOpacity.current}
        position={[36.1, 2.4, -36]}
      />
      {/* Blog shot: camera z 6.1, fov 61.8, lookAt (0.08, 0.02, 0). */}
      <BlogDebris opacity={blogOpacity.current} position={[36.1, 3.6, -36]} />
      {/* Contact shot: camera z 8.5, fov 59, lookAt (0, 0.05, 0). */}
      <ContactArrival opacity={contactOpacity.current} position={[34.3, 1.6, -36]} />
    </>
  );
}
