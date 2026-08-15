"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { projects } from "@/data/projects";
import FeaturedProject from "@/components/projects/FeaturedProject";
import ProjectCard from "@/components/projects/ProjectCard";
import AnimateSection from "@/components/ui/AnimateSection";
import Reveal from "@/components/ui/Reveal";
import { drop } from "@/lib/motion";

export default function ProjectGrid() {
  const featuredProject = projects.find((p) => p.featured) ?? projects[0];
  // Landing grid is deliberately curated: featured + the next 6 shipped
  // projects, in data order. The full list (including any "upcoming"
  // entries) lives on the /projects page — adding entries to the data
  // file must not silently change the landing grid's content or count.
  const rest = projects
    .filter((p) => p.slug !== featuredProject.slug)
    .slice(0, 6);

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
        .projects__grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
          gap: 1.1rem;
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
      `}</style>

      <section id="projects" className="projects">
        <Reveal className="projects__header">
          <h2 className="projects__title">Projects</h2>
          <p className="projects__subtitle">Things I&apos;ve built</p>
        </Reveal>

        <AnimateSection className="projects__grid" variant="drop">
          <motion.div variants={drop} style={{ gridColumn: "1 / -1" }}>
            <FeaturedProject project={featuredProject} />
          </motion.div>
          {rest.map((p) => (
            <motion.div key={p.slug} variants={drop}>
              <ProjectCard project={p} />
            </motion.div>
          ))}
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
