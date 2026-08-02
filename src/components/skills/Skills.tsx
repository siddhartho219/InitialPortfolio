import SkillCapsule from "@/components/skills/SkillCapsule";

const SKILL_CARDS = [
  {
    icon: "⚛",
    name: "Frontend",
    skills: ["Next.js", "React", "Tailwind", "TypeScript"],
  },
  {
    icon: "⚙",
    name: "Backend",
    skills: ["Django", "Flask", "MySQL", "REST APIs"],
  },
  {
    icon: "🧠",
    name: "AI/Research",
    skills: ["Python", "LLM Workflows", "Prompt Eng."],
  },
  {
    icon: "🔧",
    name: "Embedded",
    skills: ["Arduino", "C++", "Sensors", "Robotics"],
  },
  {
    icon: "🛠",
    name: "Tools",
    skills: ["Git", "Vercel", "Firebase", "Linux"],
  },
  {
    icon: "🎮",
    name: "Game Dev / 3D",
    skills: ["Unity", "Blender"],
  },
] as const;

export default function Skills() {
  return (
    <>
      <style>{`
        .skills {
          padding: 5rem 3rem;
        }
        .skills__header {
          max-width: 1120px;
          margin: 0 auto 2.5rem;
        }
        .skills__title {
          font-family: var(--fd);
          font-weight: 800;
          font-size: clamp(1.75rem, 3vw, 2.25rem);
          color: var(--text);
          margin: 0;
        }
        .skills__grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(195px, 1fr));
          gap: 0.9rem;
          max-width: 1120px;
          margin: 0 auto;
        }
        .skills-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 11px;
          padding: 1.1rem;
          transition:
            transform 0.2s ease,
            border-color 0.2s ease;
        }
        .skills-card:hover {
          transform: translateY(-3px);
          border-color: var(--border-h);
        }
        .skills-card__head {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.85rem;
        }
        .skills-card__icon {
          font-size: 1.1rem;
          line-height: 1;
          opacity: 0.7;
        }
        .skills-card__name {
          font-family: var(--fb);
          font-size: 13px;
          font-weight: 600;
          color: var(--text);
        }
        .skills-card__pills {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .skills-card__pills li {
          display: contents;
        }
        .skills-pill {
          display: inline-block;
          font-family: var(--fm);
          font-size: 10px;
          color: var(--text-s);
          padding: 0.2rem 0.45rem;
          border-radius: 4px;
          border: 1px solid var(--border);
          transition:
            border-color 0.2s ease,
            color 0.2s ease;
        }
        .skills-pill:hover {
          border-color: var(--border-h);
          color: var(--text);
        }
      `}</style>

      <section id="skills" className="skills">
        <div className="skills__header">
          <h2 className="skills__title">Skills</h2>
        </div>

        <div className="skills__grid">
          {SKILL_CARDS.map((card) => (
            <article key={card.name} className="skills-card">
              <div className="skills-card__head">
                <span className="skills-card__icon" aria-hidden="true">
                  {card.icon}
                </span>
                <span className="skills-card__name">{card.name}</span>
              </div>
              <ul className="skills-card__pills">
                {card.skills.map((skill) => (
                  <li key={skill}>
                    <SkillCapsule label={skill} />
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
