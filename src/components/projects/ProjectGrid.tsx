import { projects } from "@/data/projects";
import FeaturedProject from "@/components/projects/FeaturedProject";
import ProjectCard from "@/components/projects/ProjectCard";

export default function ProjectGrid() {
  const featuredProject = projects.find((p) => p.featured) ?? projects[0];
  const rest = projects.filter((p) => p.slug !== featuredProject.slug);

  return (
    <>
      <style>{`
        .projects {
          padding: 5rem 3rem;
        }
        .projects__header {
          max-width: 1120px;
          margin: 0 auto 2.5rem;
        }
        .projects__title {
          font-family: var(--fd);
          font-weight: 800;
          font-size: clamp(1.75rem, 3vw, 2.25rem);
          color: var(--text);
          margin: 0;
        }
        .projects__subtitle {
          font-family: var(--fb);
          font-size: 14px;
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
        .pc {
          display: flex;
          flex-direction: column;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          overflow: hidden;
          cursor: none;
          transition:
            transform 0.25s ease,
            border-color 0.25s ease,
            background 0.25s ease;
        }
        .pc:hover {
          transform: translateY(-4px);
          border-color: var(--border-h);
          background: var(--surface-h);
        }
        .pc--featured {
          grid-column: 1 / -1;
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          background: linear-gradient(
            135deg,
            color-mix(in srgb, var(--accent) 6%, var(--surface)),
            var(--surface)
          );
          border: 1px solid color-mix(in srgb, var(--accent) 30%, var(--border));
          box-shadow: 0 0 0 1px color-mix(in srgb, var(--accent) 10%, transparent),
            0 20px 60px -30px color-mix(in srgb, var(--accent) 35%, transparent);
        }
        @media (max-width: 767px) {
          .pc--featured {
            grid-template-columns: 1fr;
          }
        }
        .pc__media {
          position: relative;
          height: 160px;
          overflow: hidden;
          flex-shrink: 0;
        }
        .pc__media--featured {
          min-height: 210px;
          height: auto;
        }
        .pc--featured .pc__media--featured {
          min-height: 210px;
        }
        @media (max-width: 767px) {
          .pc--featured .pc__media--featured {
            min-height: 210px;
            height: 210px;
          }
        }
        .pc__img {
          object-fit: cover;
          filter: brightness(0.65) saturate(0.65);
          transition: filter 0.3s ease;
        }
        .pc:hover .pc__img {
          filter: brightness(0.85) saturate(1);
        }
        .pc__placeholder {
          width: 100%;
          height: 100%;
          min-height: inherit;
          background: linear-gradient(
            135deg,
            color-mix(in srgb, var(--violet) 35%, var(--bg)),
            color-mix(in srgb, var(--accent) 18%, var(--bg))
          );
        }
        .pc__body {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          flex: 1;
        }
        .pc__tag {
          display: inline-flex;
          width: fit-content;
          font-family: var(--fm);
          font-size: 10px;
          color: var(--text-s);
          border: 1px solid var(--border);
          border-radius: 4px;
          padding: 2px 8px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .pc__tag--featured {
          color: var(--accent);
          border-color: color-mix(in srgb, var(--accent) 25%, transparent);
        }
        .pc__title {
          font-family: var(--fb);
          font-size: 14px;
          font-weight: 600;
          margin: 0;
          line-height: 1.35;
        }
        .pc__title--featured {
          font-size: 20px;
        }
        .pc__title a {
          color: var(--text);
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .pc__title a:hover {
          color: var(--accent);
        }
        .pc__desc {
          font-family: var(--fb);
          font-size: 12px;
          color: var(--text-m);
          line-height: 1.55;
          margin: 0;
          flex: 1;
        }
        .pc__eyebrow {
          font-family: var(--fm);
          font-size: 10px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--accent);
          margin: 0;
        }
        .pc__stack {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 0.15rem;
        }
        .pc__pill {
          font-family: var(--fm);
          font-size: 10px;
          color: var(--text-s);
          border: 1px solid var(--border);
          border-radius: 4px;
          padding: 2px 7px;
        }
        .pc__links {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 0.35rem;
        }
        .pc__link-btn {
          font-family: var(--fm);
          font-size: 10px;
          color: var(--text-s);
          text-decoration: none;
          border: 1px solid var(--border);
          border-radius: 4px;
          padding: 4px 10px;
          transition:
            border-color 0.2s ease,
            color 0.2s ease;
        }
        .pc__link-btn:hover {
          border-color: var(--border-h);
          color: var(--text);
        }
      `}</style>

      <section id="projects" className="projects">
        <header className="projects__header">
          <h2 className="projects__title">Projects</h2>
          <p className="projects__subtitle">Things I&apos;ve built</p>
        </header>

        <div className="projects__grid">
          <FeaturedProject project={featuredProject} />
          {rest.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </section>
    </>
  );
}
