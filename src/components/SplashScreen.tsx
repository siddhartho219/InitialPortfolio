"use client";

import { useEffect, useState } from "react";

export default function SplashScreen() {
  // Reduced motion: skip the splash from the first paint — its text animation
  // ends at opacity 0 (fill forwards), so it would otherwise flash a blank
  // black overlay over the page.
  const [visible, setVisible] = useState(
    () =>
      typeof window === "undefined" ||
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [out, setOut] = useState(false);

  useEffect(() => {
    // Reduced motion: skip the splash entirely — its text animation ends
    // at opacity 0 (fill forwards), so under the global animation kill-switch
    // it would show a blank black screen while the overlay still blocks the
    // page for its full duration.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(false);
      return;
    }

    const fadeTimer = window.setTimeout(() => setOut(true), 1800);
    const unmountTimer = window.setTimeout(() => setVisible(false), 2600);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(unmountTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <>
      <style>{`
        @keyframes spIn {
          0% {
            opacity: 0;
            transform: scale(0.85);
          }
          40% {
            opacity: 1;
            transform: scale(1);
          }
          75% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: scale(1.08);
          }
        }
        .splash-screen {
          position: fixed;
          inset: 0;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #000;
          transition: opacity 0.8s ease;
        }
        .splash-screen.out {
          opacity: 0;
        }
        .splash-screen__text {
          font-family: var(--fd);
          font-weight: 800;
          font-size: 3.5rem;
          color: var(--accent);
          animation: spIn 1.4s ease forwards;
        }
      `}</style>
      <div className={`splash-screen${out ? " out" : ""}`} aria-hidden="true">
        <span className="splash-screen__text">SB.</span>
      </div>
    </>
  );
}
