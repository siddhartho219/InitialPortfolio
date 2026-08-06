"use client";

import { useEffect } from "react";

const BASE_CLASS = "scroll-reveal";
const VISIBLE_CLASS = "scroll-reveal--visible";
const STYLE_ID = "scroll-reveal-styles";

export function useScrollReveal() {
  useEffect(() => {
    if (!document.getElementById(STYLE_ID)) {
      const style = document.createElement("style");
      style.id = STYLE_ID;
      style.textContent = `
        .scroll-reveal {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .scroll-reveal--visible {
          opacity: 1;
          transform: translateY(0);
        }
      `;
      document.head.appendChild(style);
    }

    const observers: IntersectionObserver[] = [];
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("section[id]"),
    );

    sections.forEach((section) => {
      section.classList.add(BASE_CLASS);

      if (section.id === "home") {
        section.classList.add(VISIBLE_CLASS);
        return;
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) {
            section.classList.add(VISIBLE_CLASS);
            observer.disconnect();
          }
        },
        { threshold: 0.07 },
      );

      observer.observe(section);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);
}
