"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

// ---------------------------------------------------------------------------
// #about "space landmark" — PILOT for the idea that each section is a distinct
// place in space. One low-poly wireframe planet (icosahedron detail 1, cheap)
// with a sparse points "atmosphere" ring, living in the #about camera shot.
//
// TWO palette variants, switchable via ?landmark=color (default/absent =
// neutral):
//   - neutral: same white/light-gray wireframe treatment as SectionForms —
//     zero new color, exactly as disciplined as the rest of the site.
//   - color:   a faint warm "distant planet limb" tint applied ONLY to this
//     object's materials — nothing else in the scene changes.
//
// Opacity is scrubbed to the #about scroll range via the same Lenis +
// ScrollTrigger mechanism as SectionForms (fade in → hold while centered →
// fade out). Idle rotation delta-clamped like the existing objects. Under
// prefers-reduced-motion the component returns null — not rendered at all.
// ---------------------------------------------------------------------------

type FormOpacity = { value: number };

type PaletteKey = "neutral" | "color";

const NEUTRAL_LINE = "#e8ecf8"; // identical to SectionForms' wireframe tone
const NEUTRAL_RING = "#f0f3fc"; // identical to SectionForms' node tone
// Faint warm limb tint — "a hint of atmosphere", deliberately desaturated so
// it reads as light on a distant planet, not a colored spotlight.
const COLOR_LINE = "#e2a175";
const COLOR_RING = "#f0c9a8";

const RING_COUNT = 110;
// Ring floats just outside the sphere, slightly squashed in z and tilted, so
// it reads as a thin atmospheric halo rather than a solid disk.
const RING_TILT: [number, number, number] = [1.15, 0.2, 0];

// Deterministic 0..1 pseudo-random from an index (stable between renders).
function hash01(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return Math.abs(x) % 1;
}

function Landmark({
  palette,
  opacity,
  position,
}: {
  palette: PaletteKey;
  opacity: FormOpacity;
  position: [number, number, number];
}) {
  const groupRef = useRef<THREE.Group>(null);
  const linesMat = useRef<THREE.LineBasicMaterial>(null);
  const ringMat = useRef<THREE.PointsMaterial>(null);

  const { sphereGeo, ringGeo } = useMemo(() => {
    // Icosahedron detail 1 = 42 verts / 80 faces — trivially cheap, higher
    // resolution than SectionForms' crystal (detail 0) so the sphere reads
    // as a rounded body rather than a jagged shard.
    const sphereGeo = new THREE.EdgesGeometry(
      new THREE.IcosahedronGeometry(1, 1),
    );

    const pos = new Float32Array(RING_COUNT * 3);
    for (let i = 0; i < RING_COUNT; i += 1) {
      const a = (i / RING_COUNT) * Math.PI * 2;
      const r = 1.28 + hash01(i) * 0.42;
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
    }
    if (linesMat.current) linesMat.current.opacity = opacity.value;
    if (ringMat.current) ringMat.current.opacity = opacity.value * 0.8;
  });

  const lineColor = palette === "color" ? COLOR_LINE : NEUTRAL_LINE;
  const ringColor = palette === "color" ? COLOR_RING : NEUTRAL_RING;

  return (
    <group ref={groupRef} position={position} scale={1.3}>
      <lineSegments geometry={sphereGeo}>
        <lineBasicMaterial
          ref={linesMat}
          color={lineColor}
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
      <points geometry={ringGeo} rotation={RING_TILT}>
        <pointsMaterial
          ref={ringMat}
          color={ringColor}
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

export default function SpaceLandmark() {
  const pathname = usePathname();
  const reduceMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  // Palette from ?landmark=color — read client-side on mount. Default/absent
  // is neutral. The component is only mounted client-side (ssr:false dynamic
  // import), so a direct location read is safe here and needs no Suspense
  // boundary. Opacity starts at 0, so the one-frame neutral default before
  // the effect runs is never visible.
  const [palette, setPalette] = useState<PaletteKey>("neutral");
  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get("landmark");
    setPalette(value === "color" ? "color" : "neutral");
  }, []);

  const opacity = useRef<FormOpacity>({ value: 0 });

  // Opacity scrub over #about's full scroll range — same keyframe/hold
  // pattern as SectionForms: fast ramp in, hold while centered, fade out.
  useEffect(() => {
    // Reduced motion: no per-section 3D choreography at all — the landmark is
    // not rendered (return null below), matching SectionForms' convention.
    if (reduceMotion) return;

    const el = document.getElementById("about");
    if (!el) return;

    const tween = gsap.to(opacity.current, {
      keyframes: [
        { value: 0, duration: 0.15 },
        { value: 1, duration: 0.1 }, // fast ramp in
        { value: 1, duration: 0.55 }, // genuine hold while centered
        { value: 0, duration: 0.2 }, // fade out
      ],
      ease: "none",
      immediateRender: false,
    });

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
      animation: tween,
    });
    ScrollTrigger.refresh();

    return () => {
      trigger.kill();
    };
  }, [reduceMotion, pathname]);

  if (reduceMotion) return null;

  return <Landmark palette={palette} opacity={opacity.current} position={[3.4, 1.8, -8.5]} />;
}
