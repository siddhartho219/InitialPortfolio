// Shared scroll state — the single source of truth for scroll position.
// SmoothScrollProvider writes to it (from Lenis, or from a native fallback
// under reduced motion); BackgroundScene, Navbar, and any future consumers
// subscribe instead of reading window.scrollY directly.

export type ScrollSnapshot = {
  /** Normalized document scroll 0..1 (same formula BackgroundScene used). */
  progress: number;
  /** Vertical scroll offset in px. */
  scrollY: number;
  /** Instantaneous scroll velocity (px/frame, 0 when native). */
  velocity: number;
  /** True when Lenis is actively driving the scroll. */
  smooth: boolean;
};

const listeners = new Set<(snapshot: ScrollSnapshot) => void>();

let snapshot: ScrollSnapshot = {
  progress: 0,
  scrollY: 0,
  velocity: 0,
  smooth: false,
};

export function getScrollSnapshot(): ScrollSnapshot {
  return snapshot;
}

export function subscribeScroll(
  listener: (snapshot: ScrollSnapshot) => void,
): () => void {
  listeners.add(listener);
  // Replay immediately so subscribers start from the current state.
  listener(snapshot);
  return () => {
    listeners.delete(listener);
  };
}

export function setScrollSnapshot(next: ScrollSnapshot): void {
  snapshot = next;
  listeners.forEach((listener) => listener(snapshot));
}

/** 0..1 normalized scroll, matching BackgroundScene's original formula. */
export function computeProgress(scrollY: number): number {
  if (typeof window === "undefined") return 0;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
}
