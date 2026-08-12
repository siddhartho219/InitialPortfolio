"use client";

import { usePathname } from "next/navigation";

import { useMagneticButtons } from "@/hooks/useMagneticButtons";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function PortfolioEffects() {
  const pathname = usePathname();
  const isCmsRoute =
    pathname === "/login" || pathname.startsWith("/dashboard");

  useMagneticButtons();

  return (
    <>
      {!isCmsRoute ? <ScrollRevealOnRoute key={pathname} /> : null}
      <MobileGlobalStyles />
    </>
  );
}

function ScrollRevealOnRoute() {
  useScrollReveal();
  return null;
}

function MobileGlobalStyles() {
  return (
    <style>{`
      @media (max-width: 768px) {
        section#home,
        section#about,
        section#experience,
        section#projects,
        section#blog,
        section#skills,
        section#contact,
        .hero,
        .about,
        .experience,
        .projects,
        .blog,
        .skills,
        .contact {
          padding: 5rem 1.2rem 3rem !important;
        }
        .experience__grid,
        .about__grid,
        .contact__grid,
        .blog__grid {
          grid-template-columns: 1fr !important;
        }
        .pc--featured {
          grid-column: 1 !important;
          grid-template-columns: 1fr !important;
        }
      }
      @media (hover: none) {
        body {
          cursor: auto;
        }
        #cur,
        #cur-r {
          display: none !important;
        }
      }
    `}</style>
  );
}
