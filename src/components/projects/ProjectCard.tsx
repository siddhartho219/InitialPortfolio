import type { Project } from "@/types";

import Link from "next/link";

import ProjectMedia from "@/components/projects/ProjectMedia";

type ProjectCardProps = {
  project: Project;
};

export default function ProjectCard({ project }: ProjectCardProps) {
  const isUpcoming = project.stage === "upcoming";

  return (
    <article className={`pc${isUpcoming ? " pc--upcoming" : ""}`}>
      <ProjectMedia slug={project.slug} alt={project.title} />

      <div className="pc__body">
        <span className="pc__tag">{project.category}</span>
        {project.status ? <span className="pc__tag">{project.status}</span> : null}
        {isUpcoming ? (
          <span className="pc__tag pc__tag--upcoming">In Progress</span>
        ) : null}

        {project.impact ? <p className="pc__eyebrow">{project.impact}</p> : null}

        <h3 className="pc__title">
          <Link href={`/projects/${project.slug}`}>{project.title}</Link>
        </h3>

        <p className="pc__desc">{project.description}</p>

        <div className="pc__stack">
          {project.tech.map((t) => (
            <span key={t} className="pc__pill">
              {t}
            </span>
          ))}
        </div>

        {!isUpcoming ? (
          <div className="pc__links">
            {project.github ? (
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                className="pc__link-btn"
              >
                GitHub ↗
              </a>
            ) : null}
            {project.video ? (
              <a
                href={project.video}
                target="_blank"
                rel="noreferrer"
                className="pc__link-btn"
              >
                Watch Demo ↗
              </a>
            ) : null}
            {project.demo ? (
              <a
                href={project.demo}
                target="_blank"
                rel="noreferrer"
                className="pc__link-btn"
              >
                Demo ↗
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}
