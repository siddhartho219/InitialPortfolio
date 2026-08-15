import type { Metadata } from "next";

import Link from "next/link";

import { projects } from "@/data/projects";
import ProjectCard from "@/components/projects/ProjectCard";
import AnimateSection from "@/components/ui/AnimateSection";
import Reveal from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Every project by Siddartho Sarker Bipro — shipped and in progress, from full-stack platforms and Chrome extensions to robotics and research.",
};

export default function ProjectsPage() {
  return (
    <>
      <style>{`
        .projects-page {
          padding: var(--section-pad);
        }
        .projects-page__header {
          max-width: 1120px;
          margin: 0 auto var(--section-gap);
        }
        .projects-page__back {
          display: inline-flex;
          font-family: var(--fm);
          font-size: var(--fs-caption);
          letter-spacing: var(--ls-label);
          text-transform: uppercase;
          color: var(--text-s);
          text-decoration: none;
          margin-bottom: 1.5rem;
          transition: color 0.2s ease;
        }
        .projects-page__back:hover {
          color: var(--accent);
        }
        .projects-page__title {
          font-family: var(--fd);
          font-weight: 800;
          font-size: var(--fs-h2);
          line-height: var(--lh-heading);
          letter-spacing: var(--ls-heading);
          color: var(--text);
          margin: 0;
        }
        .projects-page__subtitle {
          font-family: var(--fb);
          font-size: var(--fs-body);
          color: var(--text-s);
          margin: 0.5rem 0 0;
        }
        .projects-page__grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
          gap: 1.1rem;
          max-width: 1120px;
          margin: 0 auto;
        }
        @media (max-width: 767px) {
          .projects-page {
            padding: 5rem 1.2rem 3rem;
          }
        }
      `}</style>

      <main className="projects-page">
        <Reveal className="projects-page__header">
          <Link href="/" className="projects-page__back">
            ← Back to home
          </Link>
          <h1 className="projects-page__title">Projects</h1>
          <p className="projects-page__subtitle">
            Everything I&apos;ve built — shipped and in progress
          </p>
        </Reveal>

        <AnimateSection className="projects-page__grid" variant="settle">
          {projects.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </AnimateSection>
      </main>
    </>
  );
}
