"use client";

import Link from "next/link";

import { projects } from "@/data/projects";
import FeaturedProject from "@/components/projects/FeaturedProject";
import ProjectCarousel from "@/components/projects/ProjectCarousel";
import AnimateSection from "@/components/ui/AnimateSection";
import Reveal from "@/components/ui/Reveal";

export default function ProjectGrid() {
  const featuredProject = projects.find((p) => p.featured) ?? projects[0];
  // Landing presentation: the featured project gets its own standalone
  // panel; every other project rotates through the coverflow carousel.
  // The full list (including any "upcoming" entries) lives on /projects.
  const rest = projects.filter((p) => p.slug !== featuredProject.slug);

  return (
    <>
      <style>{`
        .projects {
          padding: var(--section-pad);
        }
        .projects__header {
          max-width: 1120px;
          margin: 0 auto var(--section-gap);
        }
        .projects__title {
          font-family: var(--fd);
          font-weight: 800;
          font-size: var(--fs-h2);
          line-height: var(--lh-heading);
          letter-spacing: var(--ls-heading);
          color: var(--text);
          margin: 0;
        }
        .projects__subtitle {
          font-family: var(--fb);
          font-size: var(--fs-body);
          color: var(--text-s);
          margin: 0.5rem 0 0;
        }
        .projects__featured {
          max-width: 1120px;
          margin: 0 auto var(--space-8);
        }
        .projects__carousel-zone {
          max-width: 1120px;
          margin: 0 auto;
        }
        .projects__more {
          display: flex;
          justify-content: center;
          margin-top: var(--space-6);
        }
        .projects__more-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 12px 22px;
          border-radius: 10px;
          font-family: var(--fb);
          font-size: var(--fs-body);
          font-weight: 500;
          text-decoration: none;
          color: var(--text);
          border: 1px solid var(--border-h);
          background: transparent;
          transition:
            transform 0.2s ease,
            background 0.2s ease,
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }
        .projects__more-btn:hover {
          border-color: var(--accent);
          background: color-mix(in srgb, var(--accent) 6%, transparent);
        }

        /* Coverflow carousel */
        .carousel {
          outline: none;
        }
        .carousel__stage {
          position: relative;
          min-height: 470px;
          overflow: hidden;
        }
        .carousel__slot {
          position: absolute;
          inset: 0;
          display: flex;
          justify-content: center;
          /* Critical: without this, the card wrapper (a flex item) stretches
             to the slot height (= the stage height), which is measured FROM
             the wrapper — a feedback loop that grows the stage unboundedly. */
          align-items: flex-start;
          pointer-events: none;
        }
        .carousel__card {
          pointer-events: auto;
          will-change: transform, opacity, filter;
        }
        .carousel__card--center {
          user-select: none;
        }
        .carousel__card--center .pc {
          cursor: grab;
        }
        .carousel__card--center.carousel__card--dragging .pc {
          cursor: grabbing;
        }
        .carousel__card--far {
          pointer-events: none;
          visibility: hidden;
        }
        /* In the carousel the card sits directly over the starfield, so it
           needs a stronger backdrop than the site-wide --surface (5.5% white)
           to keep body text legible. Dark translucent + backdrop blur keeps
           the glass aesthetic while fixing contrast. */
        .carousel__card .pc {
          background: color-mix(in srgb, var(--bg) 74%, transparent);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
        }
        .carousel__card .pc:hover {
          background: color-mix(in srgb, var(--bg) 82%, transparent);
        }
        /* Consistent card height: descriptions clamp to 2 lines so every
           card (center + neighbors) shares the same natural height. */
        .carousel__card .pc__desc {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .carousel__controls {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-top: var(--space-5);
        }
        .carousel__btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 5;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 52px;
          height: 52px;
          border-radius: 12px;
          color: var(--text);
          border: 1px solid var(--border-h);
          background: color-mix(in srgb, var(--bg) 55%, transparent);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          transition:
            transform 0.2s ease,
            background 0.2s ease,
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }
        .carousel__btn:hover {
          transform: translateY(-50%) scale(1.06);
          border-color: var(--accent);
          background: color-mix(in srgb, var(--bg) 70%, transparent);
        }
        .carousel__btn--prev {
          left: 0;
        }
        .carousel__btn--next {
          right: 0;
        }
        .carousel__dots {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .carousel__dot {
          width: 9px;
          height: 9px;
          padding: 0;
          border-radius: 50%;
          border: 1px solid var(--border-h);
          background: transparent;
          transition:
            background 0.2s ease,
            border-color 0.2s ease,
            transform 0.2s ease;
        }
        .carousel__dot:hover {
          border-color: var(--accent);
        }
        .carousel__dot[data-active="true"] {
          background: var(--accent);
          border-color: var(--accent);
        }
        .carousel__counter {
          font-family: var(--fm);
          font-size: var(--fs-caption);
          letter-spacing: var(--ls-label);
          color: var(--text-s);
          min-width: 3.5ch;
          text-align: center;
        }
        @media (max-width: 767px) {
          .carousel__stage {
            min-height: 440px;
          }
          .carousel__btn {
            width: 46px;
            height: 46px;
          }
          .carousel__btn--prev {
            left: 4px;
          }
          .carousel__btn--next {
            right: 4px;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .carousel__btn:hover,
          .carousel__dot:hover {
            transform: none;
          }
          .carousel__btn:hover {
            transform: translateY(-50%);
          }
        }
      `}</style>

      <section id="projects" className="projects">
        <Reveal className="projects__header">
          <h2 className="projects__title">Projects</h2>
          <p className="projects__subtitle">Things I&apos;ve built</p>
        </Reveal>

        <AnimateSection className="projects__featured" variant="settle">
          <FeaturedProject project={featuredProject} />
        </AnimateSection>

        <AnimateSection className="projects__carousel-zone" variant="settle">
          <ProjectCarousel projects={rest} />
        </AnimateSection>

        <div className="projects__more">
          <Link href="/projects" className="projects__more-btn" data-magnetic>
            View All Projects
          </Link>
        </div>
      </section>
    </>
  );
}
