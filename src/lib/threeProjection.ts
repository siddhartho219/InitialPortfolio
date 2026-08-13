/**
 * threeProjection.ts — the single trusted projection helper for this project.
 *
 * Every round before this one hand-rolled world→screen projection math and
 * found real bugs in it (an inverted drift-clamp sign, a broken solver loop)
 * only through heavy live debugging. This module centralizes that math so
 * verification tooling and live safety logic share ONE implementation.
 *
 * What it provides:
 *   - projectWorldToNdc(point, cameraState) — stateless world→NDC projection
 *     given camera position / lookAt target / fov / aspect (the form the
 *     verification tooling uses).
 *   - projectWorldToNdcWithCamera(point, camera) — same math against an
 *     already-configured THREE camera (the form About's live drift clamp
 *     uses; it refreshes the view matrices so the current pose/fov is used).
 *   - ndcToScreenX / ndcToScreenY — NDC (−1..1) → CSS pixel conversions.
 *   - runProjectionSanityChecks() — hardcoded invariants that make the math
 *     trustworthy; throws on failure. Runs at module load in non-production
 *     and is exported so tooling can assert it explicitly.
 *
 * The projection itself is three.js's own PerspectiveCamera math — the value
 * of this module is that the camera setup (position, lookAt, fov, aspect,
 * matrix refresh) is done exactly once, in one place, and validated.
 */

import * as THREE from "three";

export type NdcPoint = {
  /** Normalized device coordinate, −1 (left/bottom) .. +1 (right/top). */
  x: number;
  y: number;
  /** True when the point is in front of the near plane (a real projection). */
  valid: boolean;
  /** Distance along the camera's forward axis; positive = in front. */
  depth: number;
};

export type ProjectionCameraState = {
  position: [number, number, number];
  lookAt: [number, number, number];
  /** Vertical field of view in degrees. */
  fov: number;
  /** Viewport aspect (width / height). */
  aspect: number;
  near?: number;
  far?: number;
};

// Scratch objects — the helper is not reentrant, but it is used
// single-threaded (one projection at a time), so reuse avoids GC churn.
const scratchCamera = new THREE.PerspectiveCamera();
const scratchPoint = new THREE.Vector3();
const scratchCamPos = new THREE.Vector3();
const scratchDir = new THREE.Vector3();
const scratchDepth = new THREE.Vector3();
const scratchNdc = new THREE.Vector3();

/** Project a world-space point to NDC from a described camera state. */
export function projectWorldToNdc(
  point: [number, number, number],
  cam: ProjectionCameraState,
): NdcPoint {
  scratchCamera.fov = cam.fov;
  scratchCamera.aspect = cam.aspect;
  scratchCamera.near = cam.near ?? 0.1;
  scratchCamera.far = cam.far ?? 120;
  scratchCamera.position.set(cam.position[0], cam.position[1], cam.position[2]);
  scratchCamera.lookAt(cam.lookAt[0], cam.lookAt[1], cam.lookAt[2]);
  scratchCamera.updateMatrixWorld();
  scratchCamera.updateProjectionMatrix();
  return projectWorldToNdcWithCamera(point, scratchCamera);
}

/**
 * Project a world-space point to NDC using an existing, already-configured
 * THREE.PerspectiveCamera (position + lookAt are whatever the camera currently
 * has). The view matrices are refreshed first so the result reflects the
 * current pose and fov — the same refresh the old inline clamp relied on.
 */
export function projectWorldToNdcWithCamera(
  point: [number, number, number],
  camera: THREE.PerspectiveCamera,
): NdcPoint {
  camera.updateMatrixWorld();
  camera.updateProjectionMatrix();

  scratchPoint.set(point[0], point[1], point[2]);
  scratchCamPos.setFromMatrixPosition(camera.matrixWorld);
  camera.getWorldDirection(scratchDir);
  scratchDepth.copy(scratchPoint).sub(scratchCamPos);
  const depth = scratchDepth.dot(scratchDir);

  scratchNdc.copy(scratchPoint).project(camera);
  return {
    x: scratchNdc.x,
    y: scratchNdc.y,
    valid: depth > camera.near && depth < camera.far,
    depth,
  };
}

/** NDC x (−1..1) → CSS pixel x for a viewport of the given width. */
export function ndcToScreenX(ndcX: number, width: number): number {
  return ((ndcX + 1) / 2) * width;
}

/** NDC y (−1..1) → CSS pixel y (top-origin, as the browser lays out). */
export function ndcToScreenY(ndcY: number, height: number): number {
  return ((1 - ndcY) / 2) * height;
}

export type SanityCheckResult = {
  name: string;
  ok: boolean;
  detail: string;
};

/**
 * Hardcoded invariants that must hold for this projection math to be trusted.
 * Throws if any check fails. Called at module load in non-production and
 * exported so verification tooling can assert it explicitly too.
 */
export function runProjectionSanityChecks(): SanityCheckResult[] {
  const results: SanityCheckResult[] = [];
  const approx = (a: number, b: number, eps = 1e-4) => Math.abs(a - b) <= eps;

  const record = (name: string, ok: boolean, detail: string) => {
    results.push({ name, ok, detail });
    if (!ok) throw new Error(`threeProjection sanity check failed: ${name} — ${detail}`);
  };

  // 1. A point at the exact lookAt target projects to screen center.
  {
    const target: [number, number, number] = [0.3, -0.2, 0];
    const p = projectWorldToNdc(target, {
      position: [0, 0, 7],
      lookAt: target,
      fov: 60,
      aspect: 16 / 9,
    });
    record(
      "lookAt target projects to screen center",
      p.valid && approx(p.x, 0) && approx(p.y, 0),
      `point @ lookAt → ndc (${p.x.toFixed(4)}, ${p.y.toFixed(4)}), valid=${p.valid}`,
    );
  }

  // 2. A point directly behind the camera is not a valid projection.
  {
    const p = projectWorldToNdc([0, 0, 20], {
      position: [0, 0, 7],
      lookAt: [0, 0, 0],
      fov: 60,
      aspect: 16 / 9,
    });
    record(
      "point behind camera is invalid",
      !p.valid && p.depth < 0,
      `behind point → depth ${p.depth.toFixed(2)}, valid=${p.valid}`,
    );
  }

  // 3. A point right of the view center projects to positive NDC x.
  {
    const p = projectWorldToNdc([5, 0, -10], {
      position: [0, 0, 7],
      lookAt: [0, 0, 0],
      fov: 60,
      aspect: 16 / 9,
    });
    record("point right of center → positive x", p.valid && p.x > 0, `x=${p.x.toFixed(4)}`);
  }

  // 4. A point above the view center projects to positive NDC y (y-up NDC).
  {
    const p = projectWorldToNdc([0, 4, -10], {
      position: [0, 0, 7],
      lookAt: [0, 0, 0],
      fov: 60,
      aspect: 16 / 9,
    });
    record("point above center → positive y", p.valid && p.y > 0, `y=${p.y.toFixed(4)}`);
  }

  // 5. NDC→screen conversions round-trip correctly.
  {
    const x = ndcToScreenX(0.5, 1280);
    const y = ndcToScreenY(-0.5, 900);
    record(
      "ndc→screen conversion",
      approx(x, 960) && approx(y, 675),
      `(0.5,−0.5) @1280×900 → (${x}, ${y})`,
    );
  }

  return results;
}

// Fail loud in development so a math regression is caught the moment the
// module loads, not after a round of live debugging.
if (typeof process === "undefined" || process.env.NODE_ENV !== "production") {
  runProjectionSanityChecks();
}
