import type { Project } from "@/types";

import Link from "next/link";

import ProjectMedia from "@/components/projects/ProjectMedia";

type FeaturedProjectProps = {
  project: Project;
};

export default function FeaturedProject({ project }: FeaturedProjectProps) {
  return (
    <article className="pc pc--featured">
      <ProjectMedia
        slug={project.slug}
        alt={project.title}
        featured
        priority
      />

      <div className="pc__body">
        <span className="pc__tag pc__tag--featured">
          ★ Featured · {project.category}
        </span>
        {project.status ? <span className="pc__tag pc__tag--featured">{project.status}</span> : null}

        <p className="pc__eyebrow">→ the tool managing this very page</p>

        <h3 className="pc__title pc__title--featured">
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
      </div>
    </article>
  );
}
