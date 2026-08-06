"use client";

import BackgroundScene from "@/components/BackgroundScene";

// Thin wrapper: the heavy 3D scene lives in BackgroundScene (react-three-fiber).
// This component keeps the same name/export/API as the old 2D version so the
// call site in PortfolioShell is unchanged, and keeps the DOM noise + grid
// overlays that sit on top of the WebGL canvas.
export default function BackgroundCanvas() {
  return (
    <>
      <style>{`
        .bg-canvas__stage {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }
        .bg-canvas__noise {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          opacity: 0.022;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }
        .bg-canvas__grid {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.022) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.022) 1px, transparent 1px);
          background-size: 70px 70px;
        }
      `}</style>
      <div className="bg-canvas__stage" aria-hidden="true">
        <BackgroundScene />
      </div>
      <div className="bg-canvas__noise" aria-hidden="true" />
      <div className="bg-canvas__grid grid-bg" aria-hidden="true" />
    </>
  );
}
