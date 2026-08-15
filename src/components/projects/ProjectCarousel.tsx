"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { KeyboardEvent, MouseEvent as ReactMouseEvent } from "react";

import { motion, useReducedMotion } from "framer-motion";
import type { PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import ProjectCard from "@/components/projects/ProjectCard";
import type { Project } from "@/types";

/* ------------------------------------------------------------------ */
/* Tuning — auto-advance, swipe commit thresholds, coverflow geometry. */
/* ------------------------------------------------------------------ */

// Auto-advance: long enough that each project gets a real look before the
// next slides in ("briefly showcased"), short enough that the rotation is
// discoverable. 4.8s ≈ twice the entrance settle, reads as a calm showcase.
const AUTO_ADVANCE_MS = 4800;
// Commit a swipe when the drag travels past ~22% of the card width...
const SWIPE_DISTANCE_RATIO = 0.22;
// ...or the release velocity is a decisive flick (px/s).
const SWIPE_VELOCITY = 400;
// Soft rubber-band wall: dragging past 40% of the card width meets
// resistance instead of following the pointer forever.
const DRAG_WALL_RATIO = 0.4;
const DRAG_ELASTIC = 0.12;

// Receded neighbors: smaller, dimmed, softly blurred — "in the background"
// relative to the sharp, full-size center card.
const NEIGHBOR_SCALE = 0.82;
const NEIGHBOR_OPACITY = 0.5;
const NEIGHBOR_BLUR = "blur(4px)";
const HIDDEN_BLUR = "blur(5px)";
// Side-card exposure: desktop shows roughly half the neighbor card (classic
// coverflow); narrow widths shrink it to a thin peek.
// NOTE: the neighbor's scale shrinks it toward its own center, eating into
// the exposed sliver — the offset must compensate:
//   visible = offset - (1 - scale) * cardW / 2
const DESKTOP_VISIBLE_RATIO = 0.52; // ≈ 43% of card visible on desktop
const MOBILE_VISIBLE_RATIO = 0.21; // ≈ 30px peek on mobile (offset 52-59px)

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
  const [cardW, setCardW] = useState(0);
  const [cardH, setCardH] = useState(0);

  const stageRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const draggedRef = useRef(false);

  /* Measure stage width → card width. Narrower stages get smaller cards
     and (via `offset`) a much smaller neighbor exposure: thin peek on
     mobile, ~half-card exposure on desktop. */
  useLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.getBoundingClientRect().width;
      if (w <= 0) return;
      const desktop = w >= 768;
      const next = desktop
        ? Math.min(380, Math.max(300, Math.round(w * 0.32)))
        : Math.min(280, Math.round(w * 0.8));
      setCardW(next);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* Keep the stage height matched to the current center card — cards are
     absolutely positioned so they can't size the stage themselves. */
  useLayoutEffect(() => {
    const el = centerRef.current;
    if (!el) return;
    const measure = () => setCardH(Math.ceil(el.getBoundingClientRect().height));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [index, cardW]);

  const offset =
    cardW > 0 ? Math.round(cardW * (cardW >= 300 ? DESKTOP_VISIBLE_RATIO : MOBILE_VISIBLE_RATIO)) : 0;

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
    draggedRef.current = Math.abs(info.offset.x) > 6;
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

  const onCardClickCapture = (e: ReactMouseEvent<HTMLDivElement>) => {
    // Suppress the click that follows a real drag so it doesn't trigger the
    // card's internal detail-page link.
    if (draggedRef.current) {
      e.preventDefault();
      e.stopPropagation();
      draggedRef.current = false;
    }
  };

  const transition = reduced ? REDUCED_TRANSITION : NORMAL_TRANSITION;

  return (
    <div
      className="carousel"
      role="region"
      aria-label="Project carousel"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="carousel__stage" ref={stageRef} style={{ height: cardH || undefined }}>
        {projects.map((p, i) => {
          const delta = wrapDelta(i, index, n);
          const abs = Math.abs(delta);
          const isCenter = delta === 0;
          const target = slotTarget(delta, offset, reduced);
          return (
            <div key={p.slug} className="carousel__slot">
              <motion.div
                ref={isCenter ? centerRef : undefined}
                className={`carousel__card${abs > 1 ? " carousel__card--far" : ""}`}
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
                onDragStart={isCenter && !reduced ? () => setPaused(true) : undefined}
                onDragEnd={isCenter && !reduced ? onDragEnd : undefined}
                onClickCapture={isCenter ? onCardClickCapture : undefined}
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
      </div>

      {n > 1 ? (
        <div className="carousel__controls">
          <button
            type="button"
            className="carousel__btn"
            aria-label="Previous project"
            data-magnetic
            onClick={() => go(-1)}
          >
            <ChevronLeft size={18} aria-hidden="true" />
          </button>

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

          <button
            type="button"
            className="carousel__btn"
            aria-label="Next project"
            data-magnetic
            onClick={() => go(1)}
          >
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
