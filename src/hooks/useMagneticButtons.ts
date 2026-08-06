"use client";

import { useEffect } from "react";

import { usePathname } from "next/navigation";

function bindMagnetic(btn: HTMLElement) {
  const onMove = (e: MouseEvent) => {
    const rect = btn.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    btn.style.transform = `translateY(-2px) translate(${dx * 0.1}px, ${dy * 0.1}px)`;
  };

  const onLeave = () => {
    btn.style.transform = "";
  };

  btn.addEventListener("mousemove", onMove);
  btn.addEventListener("mouseleave", onLeave);

  return () => {
    btn.removeEventListener("mousemove", onMove);
    btn.removeEventListener("mouseleave", onLeave);
    btn.style.transform = "";
  };
}

export function useMagneticButtons() {
  const pathname = usePathname();

  useEffect(() => {
    const cleanups: Array<() => void> = [];

    document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((btn) => {
      cleanups.push(bindMagnetic(btn));
    });

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, [pathname]);
}
