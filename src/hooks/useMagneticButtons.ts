"use client";

import { useEffect } from "react";

import { usePathname } from "next/navigation";

// Subtle magnetic pull — a few px of travel max, never gimmicky.
const MAX_TRAVEL = 6; // px
const STRENGTH = 0.12; // fraction of cursor offset from center
const SPRING_BACK_MS = 320;

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function bindMagnetic(btn: HTMLElement) {
  const onMove = (e: MouseEvent) => {
    // Supersede any in-flight spring-back — WAAPI animations override
    // inline styles, so without this the button keeps springing back
    // instead of following the cursor on quick re-entry.
    btn.getAnimations().forEach((a) => a.cancel());
    const rect = btn.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    const tx = clamp(dx * STRENGTH, -MAX_TRAVEL, MAX_TRAVEL);
    const ty = clamp(dy * STRENGTH, -MAX_TRAVEL, MAX_TRAVEL);
    btn.style.transform = `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px)`;
  };

  const onLeave = () => {
    // Smooth spring-back via the Web Animations API instead of a hard snap.
    const from = btn.style.transform || "none";
    const animation = btn.animate(
      [{ transform: from }, { transform: "none" }],
      {
        duration: SPRING_BACK_MS,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    );
    animation.onfinish = () => {
      btn.style.transform = "";
    };
  };

  btn.addEventListener("mousemove", onMove);
  btn.addEventListener("mouseleave", onLeave);

  return () => {
    btn.removeEventListener("mousemove", onMove);
    btn.removeEventListener("mouseleave", onLeave);
    btn.getAnimations().forEach((a) => a.cancel());
    btn.style.transform = "";
  };
}

export function useMagneticButtons() {
  const pathname = usePathname();

  useEffect(() => {
    // Reduced motion: skip magnetic movement entirely — plain hover only.
    if (prefersReducedMotion()) return;

    const cleanups: Array<() => void> = [];

    document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((btn) => {
      cleanups.push(bindMagnetic(btn));
    });

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, [pathname]);
}
