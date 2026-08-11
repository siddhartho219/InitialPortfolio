"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

// ---------------------------------------------------------------------------
// Per-section ambient 3D forms (PILOT: #projects + #skills only).
//
// Each form is a cheap wireframe shape rendered in the same colorless palette
// as the starfield. Its opacity is scrubbed to its section's scroll range via
// the same Lenis + ScrollTrigger mechanism the camera choreography uses —
// fade in as the section enters, hold while centered, fade out as it leaves.
// No second animation loop: GSAP writes into a plain object, useFrame reads it.
// ---------------------------------------------------------------------------

type FormOpacity = { value: number };

// --- #projects: a small connected node-graph (nodes + lines) ---
const NODE_POINTS: [number, number, number][] = [
  [-1.4, -0.7, 0],
  [0.2, -1.1, -0.3],
  [1.5, -0.3, 0.2],
  [0.9, 0.9, -0.2],
  [-0.6, 1.0, 0.3],
  [-1.6, 0.4, 0.1],
  [0.1, 0.1, -0.8],
  [1.2, 0.1, 0.7],
];

const NODE_EDGES: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 0],
  [0, 6],
  [1, 6],
  [2, 6],
  [3, 6],
  [4, 6],
  [5, 6],
  [1, 7],
  [2, 7],
  [6, 7],
];

function ProjectGraph({
  opacity,
  position,
}: {
  opacity: FormOpacity;
  position: [number, number, number];
}) {
  const groupRef = useRef<THREE.Group>(null);
  const linesMat = useRef<THREE.LineBasicMaterial>(null);
  const nodesMat = useRef<THREE.PointsMaterial>(null);

  const { linesGeo, nodesGeo } = useMemo(() => {
    const linePos = new Float32Array(NODE_EDGES.length * 2 * 3);
    NODE_EDGES.forEach(([a, b], i) => {
      const pa = NODE_POINTS[a];
      const pb = NODE_POINTS[b];
      linePos[i * 6] = pa[0];
      linePos[i * 6 + 1] = pa[1];
      linePos[i * 6 + 2] = pa[2];
      linePos[i * 6 + 3] = pb[0];
      linePos[i * 6 + 4] = pb[1];
      linePos[i * 6 + 5] = pb[2];
    });
    const linesGeo = new THREE.BufferGeometry();
    linesGeo.setAttribute("position", new THREE.BufferAttribute(linePos, 3));

    const nodePos = new Float32Array(NODE_POINTS.length * 3);
    NODE_POINTS.forEach((p, i) => {
      nodePos[i * 3] = p[0];
      nodePos[i * 3 + 1] = p[1];
      nodePos[i * 3 + 2] = p[2];
    });
    const nodesGeo = new THREE.BufferGeometry();
    nodesGeo.setAttribute("position", new THREE.BufferAttribute(nodePos, 3));
    return { linesGeo, nodesGeo };
  }, []);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05); // clamp tab-switch spikes, same as SceneContent
    const g = groupRef.current;
    if (g) {
      g.rotation.y += dt * 0.06;
      g.rotation.x += dt * 0.02;
    }
    if (linesMat.current) linesMat.current.opacity = opacity.value;
    if (nodesMat.current) nodesMat.current.opacity = opacity.value;
  });

  return (
    <group ref={groupRef} position={position} scale={1.15}>
      <lineSegments geometry={linesGeo}>
        <lineBasicMaterial
          ref={linesMat}
          color="#e8ecf8"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
      <points geometry={nodesGeo}>
        <pointsMaterial
          ref={nodesMat}
          color="#f0f3fc"
          size={0.14}
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

// --- #skills: a single faceted crystalline solid ---
function CrystalForm({
  opacity,
  position,
}: {
  opacity: FormOpacity;
  position: [number, number, number];
}) {
  const groupRef = useRef<THREE.Group>(null);
  const mat = useRef<THREE.LineBasicMaterial>(null);

  // Icosahedron detail 0 = 12 verts / 20 faces — trivially cheap.
  const geo = useMemo(
    () => new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1, 0)),
    [],
  );

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05); // clamp tab-switch spikes, same as SceneContent
    const g = groupRef.current;
    if (g) {
      g.rotation.y -= dt * 0.04;
      g.rotation.z += dt * 0.015;
    }
    if (mat.current) mat.current.opacity = opacity.value;
  });

  return (
    <group ref={groupRef} position={position} scale={1.1}>
      <lineSegments geometry={geo}>
        <lineBasicMaterial
          ref={mat}
          color="#e8ecf8"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}

export default function SectionForms() {
  const pathname = usePathname();
  const reduceMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  const projectsOpacity = useRef<FormOpacity>({ value: 0 });
  const skillsOpacity = useRef<FormOpacity>({ value: 0 });

  // Opacity scrub: one keyframed tween per form over its section's full scroll
  // range (fade in → hold while centered → fade out), driven by ScrollTrigger
  // scrub on the existing Lenis scroll source. No competing loop.
  useEffect(() => {
    // Reduced motion: no per-section choreography of any kind — forms are not
    // rendered at all (return null below), matching the fixed-camera convention.
    if (reduceMotion) return;

    const triggers: ScrollTrigger[] = [];

    const setup = (id: string, refObj: FormOpacity) => {
      const el = document.getElementById(id);
      if (!el) return;
      // Ramp in fast, hold at full opacity through the section's in-view
      // middle, then fade out — so the form is clearly present when the
      // section is centered and when the camera has settled on its shot.
      const tween = gsap.to(refObj, {
        keyframes: [
          { value: 0, duration: 0.15 },
          { value: 1, duration: 0.1 }, // fast ramp in
          { value: 1, duration: 0.55 }, // genuine hold
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

    setup("projects", projectsOpacity.current);
    setup("skills", skillsOpacity.current);
    ScrollTrigger.refresh();

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, [reduceMotion, pathname]);

  if (reduceMotion) return null;

  return (
    <>
      {/* Projects shot: camera z 6.5, fov 61.5, lookAt (0.28, -0.06, 0). */}
      <ProjectGraph opacity={projectsOpacity.current} position={[3.0, 0.6, -8]} />
      {/* Skills shot: camera z 5.8, fov 62, lookAt (-0.2, 0.12, 0). */}
      <CrystalForm opacity={skillsOpacity.current} position={[-2.8, 1.0, -7.5]} />
    </>
  );
}
