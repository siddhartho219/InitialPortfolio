"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

import { computeProgress, setScrollSnapshot } from "@/lib/scrollStore";

gsap.registerPlugin(ScrollTrigger);

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export default function SmoothScrollProvider({
  children,
}: {
  children: ReactNode;
}) {
  useEffect(() => {
    // Reduced motion: no Lenis at all — native scroll exactly as it works
    // today. The store is still fed from a native listener so consumers
    // (BackgroundScene dolly, Navbar active link) behave identically.
    if (prefersReducedMotion()) {
      const onScroll = () => {
        setScrollSnapshot({
          progress: computeProgress(window.scrollY),
          scrollY: window.scrollY,
          velocity: 0,
          smooth: false,
        });
      };
      const onResize = onScroll;
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onResize);
      return () => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onResize);
      };
    }

    const lenis = new Lenis({
      autoRaf: false, // gsap.ticker drives the loop — single animation loop
      anchors: false, // hash links are intercepted below (Next Link bails on preventDefault)
    });

    // Publish every Lenis scroll frame into the shared store and keep
    // ScrollTrigger in sync (no instances yet — foundation for next round).
    const publish = () => {
      setScrollSnapshot({
        progress: computeProgress(lenis.scroll),
        scrollY: lenis.scroll,
        velocity: lenis.velocity,
        smooth: true,
      });
      ScrollTrigger.update();
    };
    lenis.on("scroll", publish);

    // One animation loop: gsap.ticker drives Lenis's raf (ms), no duplicate RAF.
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Same-page anchor navigation: Next Link's linkClicked bails when the
    // event is defaultPrevented, so a capture-phase interceptor cleanly hands
    // hash links to Lenis's smooth scrollTo instead of a native jump.
    const onAnchorClick = (event: MouseEvent) => {
      // Never hijack modified or middle-clicks (open-in-new-tab etc.).
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
        return;
      const anchor = (event.target as Element | null)?.closest?.(
        'a[href^="#"]',
      );
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.getElementById(href.slice(1));
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target, { offset: 0 });
      history.pushState(null, "", href);
    };
    window.addEventListener("click", onAnchorClick, true);

    // Initial publish so the dolly/nav initialize from the current position.
    publish();

    return () => {
      window.removeEventListener("click", onAnchorClick, true);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
