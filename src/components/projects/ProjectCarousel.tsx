"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";

import { motion, useReducedMotion } from "framer-motion";
import type { PanInfo } from "framer-motion";

import ProjectCard from "@/components/projects/ProjectCard";
import type { Project } from "@/types";

/* ------------------------------------------------------------------ */
/* Tuning — auto-advance, swipe commit thresholds, coverflow geometry. */
/* ------------------------------------------------------------------ */

// Auto-advance: long enough that each project gets a real look before the
// next slides in ("briefly showcased"), short enough that the rotation is
// discoverable. 4.8s ≈ twice the entrance settle, reads as a calm showcase.
const AUTO_ADVANCE_MS = 4800;
// Commit a swipe when the drag travels past ~16% of the card width...
const SWIPE_DISTANCE_RATIO = 0.16;
// ...or the release velocity is a decisive flick (px/s). The thresholds are
// deliberately lower than a touch flick's so a slow, deliberate mouse drag
// also commits — a mouse drag often ends with near-zero release velocity.
const SWIPE_VELOCITY = 300;
// Soft rubber-band wall: dragging past 38% of the card width meets
// resistance instead of following the pointer forever.
const DRAG_WALL_RATIO = 0.38;
const DRAG_ELASTIC = 0.12;

// Receded neighbors: smaller, dimmed, softly blurred — "in the background"
// relative to the sharp, full-size center card. Slightly larger and more
// opaque than before so they stay readable.
const NEIGHBOR_SCALE = 0.86;
const NEIGHBOR_OPACITY = 0.6;
const NEIGHBOR_BLUR = "blur(4px)";
const HIDDEN_BLUR = "blur(5px)";
// Room reserved at each stage edge for the arrow buttons: the 52px button
// plus a 16px gap. The desktop neighbor offset pushes each neighbor out to
// (stageHalf - neighborHalf - this clearance), so the coverflow fills the
// stage without the arrows crowding the cards.
const ARROW_CLEARANCE = 68;
// dragSnapToOrigin: with dragMomentum=false framer's release animation is
// an inertia with velocity 0 — which parks the card wherever it was
// released. This prop sets the inertia's bounce bounds to {min:0,max:0},
// so a non-committing drag springs cleanly back to center. (Framer skips
// re-applying an unchanged `animate` target on re-render, so bump() alone
// can't rescue the reset.)
const DRAG_SNAP_TO_ORIGIN = true;
// Narrow screens: shrink the neighbors to a thin peek instead of full
// neighbor cards (there isn't width for them).
// NOTE: the neighbor's scale shrinks it toward its own center, eating into
// the exposed sliver — the offset must compensate:
//   visiblePeek = offset - (1 - scale) * cardW / 2
const MOBILE_VISIBLE_RATIO = 0.21;
// Breathing room between the stage's top and the card's bottom edge, so the
// center card (whose height is measured) never clips against the stage's
// overflow:hidden even if a neighbor's content differs slightly.
const CARD_BOTTOM_BUFFER = 44;

/** Signed wrap-around distance from the center index, in [-n/2, n/2]. */
function wrapDelta(i: number, index: number, n: number): number {
  let d = i - index;
  if (d > n / 2) d -= n;
  else if (d < -n / 2) d += n;
  return d;
}

type SlotTarget = {
  x: number;
  scale: number;
  opacity: number;
  filter: string;
  zIndex: number;
};

/** Coverflow pose for a card at `delta` slots from center. */
function slotTarget(delta: number, offset: number, reduced: boolean): SlotTarget {
  const abs = Math.abs(delta);
  const sign = delta === 0 ? 1 : Math.sign(delta);

  if (reduced) {
    // Static side cards, no blur/scale animation — only the center card
    // cross-fades between rotations.
    if (abs === 0) return { x: 0, scale: 1, opacity: 1, filter: "blur(0px)", zIndex: 3 };
    if (abs === 1)
      return { x: sign * offset, scale: 0.92, opacity: NEIGHBOR_OPACITY, filter: "blur(0px)", zIndex: 2 };
    return { x: sign * offset * 2, scale: 0.85, opacity: 0, filter: "blur(0px)", zIndex: 1 };
  }

  if (abs === 0) return { x: 0, scale: 1, opacity: 1, filter: "blur(0px)", zIndex: 3 };
  if (abs === 1)
    return {
      x: sign * offset,
      scale: NEIGHBOR_SCALE,
      opacity: NEIGHBOR_OPACITY,
      filter: NEIGHBOR_BLUR,
      zIndex: 2,
    };
  return {
    x: sign * offset * 2,
    scale: NEIGHBOR_SCALE - 0.07,
    opacity: 0,
    filter: HIDDEN_BLUR,
    zIndex: 1,
  };
}

const NORMAL_TRANSITION = {
  type: "spring" as const,
  stiffness: 300,
  damping: 32,
  mass: 0.9,
  opacity: { type: "tween" as const, duration: 0.28, ease: "easeOut" as const },
  filter: { type: "tween" as const, duration: 0.3, ease: "easeOut" as const },
};

const REDUCED_TRANSITION = {
  x: { type: "tween" as const, duration: 0 },
  scale: { type: "tween" as const, duration: 0 },
  filter: { type: "tween" as const, duration: 0 },
  opacity: { type: "tween" as const, duration: 0.25, ease: "easeOut" as const },
};

type ProjectCarouselProps = {
  /** Non-featured projects, in rotation order (data order). */
  projects: Project[];
};

export default function ProjectCarousel({ projects }: ProjectCarouselProps) {
  const n = projects.length;
  const reduced = useReducedMotion() ?? false;

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [tick, setTick] = useState(0); // bumped on any manual interaction to restart auto-advance
  const [dragging, setDragging] = useState(false);
  const [cardW, setCardW] = useState(0);
  const [cardH, setCardH] = useState(0);
  const [stageW, setStageW] = useState(0);

  const stageRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const draggedRef = useRef(false);

  /* Measure stage width → card width. Narrower stages get smaller cards
     and (via `offset`) a much smaller neighbor exposure: thin peek on
     mobile, full neighbor cards pushed toward the stage edges on desktop. */
  useLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.getBoundingClientRect().width;
      if (w <= 0) return;
      setStageW(w);
      const desktop = w >= 768;
      const next = desktop
        ? Math.min(450, Math.max(370, Math.round(w * 0.38)))
        : Math.min(300, Math.round(w * 0.82));
      setCardW(next);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* Keep the stage height matched to the current center card — cards are
     absolutely positioned so they can't size the stage themselves. The
     bottom buffer guarantees the measured card never clips against the
     stage's overflow:hidden, even if its content reflows (font load, a
     neighbor with more pill rows). */
  useLayoutEffect(() => {
    const el = centerRef.current;
    if (!el) return;
    const measure = () =>
      setCardH(Math.ceil(el.getBoundingClientRect().height) + CARD_BOTTOM_BUFFER);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [index, cardW]);

  // Desktop: push each neighbor out until its outer edge sits just inside
  // the stage edge (minus the arrow clearance), so the coverflow fills the
  // stage width instead of clustering in the middle. Floored at 0.55x the
  // card width so narrow desktop stages never collapse the neighbors into
  // the center card. Mobile: thin peek.
  const offset =
    cardW > 0 && stageW > 0
      ? stageW >= 768
        ? Math.max(
            Math.round(cardW * 0.55),
            Math.round(stageW / 2 - (cardW * NEIGHBOR_SCALE) / 2 - ARROW_CLEARANCE),
          )
        : Math.round(cardW * MOBILE_VISIBLE_RATIO)
      : 0;

  const bump = useCallback(() => setTick((t) => t + 1), []);

  const go = useCallback(
    (dir: 1 | -1) => {
      setIndex((i) => (i + dir + n) % n);
      setTick((t) => t + 1);
    },
    [n],
  );

  const jump = useCallback(
    (delta: number) => {
      setIndex((i) => (i + delta + n) % n);
      setTick((t) => t + 1);
    },
    [n],
  );

  /* Auto-advance — restarts whenever `tick` changes (any manual
     interaction) and pauses on hover/focus/drag or reduced motion. */
  useEffect(() => {
    if (reduced || paused || n < 2) return;
    const id = window.setTimeout(() => go(1), AUTO_ADVANCE_MS);
    return () => window.clearTimeout(id);
  }, [tick, paused, reduced, n, go]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    }
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    setDragging(false);
    const threshold = cardW * SWIPE_DISTANCE_RATIO;
    if (info.velocity.x < -SWIPE_VELOCITY || info.offset.x < -threshold) {
      go(1);
    } else if (info.velocity.x > SWIPE_VELOCITY || info.offset.x > threshold) {
      go(-1);
    } else {
      bump(); // small drag → spring back to center, restart the timer
    }
    setPaused(false);
  };

  /* Suppress the click that follows a real drag so it doesn't trigger the
     card's internal detail-page link. This lives on the STAGE (capture
     phase) rather than on the center card: when a drag commits, the dragged
     card instantly becomes a neighbor and loses any center-only handler
     before the trailing click event dispatches, so only a stage-level
     capture reliably intercepts it. The flag is set in onDragStart (which
     fires on the first move past framer's threshold) rather than onDragEnd
     — the click event is dispatched by the browser BEFORE framer's
     onDragEnd callback runs (~20ms later), so any flag set there is too
     late. preventDefault stops native anchor navigation; the extra
     stopImmediatePropagation keeps the event from ever reaching the link's
     Next.js onClick. */
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onStageClickCapture = (e: MouseEvent) => {
      if (draggedRef.current) {
        e.preventDefault();
        e.stopImmediatePropagation();
        draggedRef.current = false;
      }
    };
    el.addEventListener("click", onStageClickCapture, true);
    return () => el.removeEventListener("click", onStageClickCapture, true);
  }, []);

  const transition = reduced ? REDUCED_TRANSITION : NORMAL_TRANSITION;

  return (
    <div
      className="carousel"
      role="region"
      aria-label="Project carousel"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="carousel__stage" ref={stageRef} style={{ height: cardH || undefined }}>
        {projects.map((p, i) => {
          const delta = wrapDelta(i, index, n);
          const abs = Math.abs(delta);
          const isCenter = delta === 0;
          const target = slotTarget(delta, offset, reduced);
          const classes = ["carousel__card"];
          if (isCenter) classes.push("carousel__card--center");
          if (isCenter && dragging) classes.push("carousel__card--dragging");
          if (abs > 1) classes.push("carousel__card--far");
          return (
            <div key={p.slug} className="carousel__slot">
              <motion.div
                ref={isCenter ? centerRef : undefined}
                className={classes.join(" ")}
                style={{ width: cardW || undefined }}
                animate={target}
                transition={transition}
                drag={!reduced && isCenter ? "x" : false}
                dragConstraints={{
                  left: -cardW * DRAG_WALL_RATIO,
                  right: cardW * DRAG_WALL_RATIO,
                }}
                dragElastic={DRAG_ELASTIC}
                dragMomentum={false}
                dragSnapToOrigin={DRAG_SNAP_TO_ORIGIN}
                draggable={false}
                onDragStartCapture={(e) => e.preventDefault()}
                onDragStart={
                  isCenter && !reduced
                    ? () => {
                        setPaused(true);
                        setDragging(true);
                        // Mark the gesture as a drag the moment it starts
                        // (first move past framer's threshold) — see the
                        // stage click-capture note above for why this must
                        // not wait for onDragEnd.
                        draggedRef.current = true;
                      }
                    : undefined
                }
                onDragEnd={isCenter && !reduced ? onDragEnd : undefined}
                onMouseDownCapture={
                  isCenter
                    ? () => {
                        draggedRef.current = false;
                      }
                    : undefined
                }
                onClick={!isCenter ? () => jump(delta) : undefined}
              >
                {/* Side cards: inert + aria-hidden so only the center card
                    is interactive/focusable at any moment; clicking a side
                    card jumps straight to it (handled on the wrapper). */}
                <div
                  inert={!isCenter}
                  aria-hidden={!isCenter}
                  style={isCenter ? undefined : { pointerEvents: "none", userSelect: "none" }}
                >
                  <ProjectCard project={p} />
                </div>
              </motion.div>
            </div>
          );
        })}

        {n > 1 ? (
          <>
            <button
              type="button"
              className="carousel__btn carousel__btn--prev"
              aria-label="Previous project"
              onClick={() => go(-1)}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              className="carousel__btn carousel__btn--next"
              aria-label="Next project"
              onClick={() => go(1)}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </>
        ) : null}
      </div>

      {n > 1 ? (
        <div className="carousel__controls">
          <div className="carousel__dots" role="group" aria-label="Jump to project">
            {projects.map((p, i) => (
              <button
                key={p.slug}
                type="button"
                className="carousel__dot"
                aria-label={`Go to ${p.title}`}
                aria-current={i === index ? "true" : undefined}
                data-active={i === index}
                onClick={() => jump(i - index)}
              />
            ))}
          </div>

          <span className="carousel__counter">
            {index + 1} / {n}
          </span>
        </div>
      ) : null}
    </div>
  );
}
