import { GH_USER } from "@/data/contact";

type TimelineItem = {
  period: string;
  role: string;
  place: string;
  description: string;
  active?: boolean;
};

const EDUCATION: TimelineItem[] = [
  {
    period: "2022 → PRESENT",
    role: "B.Sc. Computer Science & Engineering",
    place: "United International University · Dhaka BD",
    description: "Algorithms, AI, embedded systems. Focus on ML and robotics research.",
    active: true,
  },
  {
    period: "2018 → 2020",
    role: "Higher Secondary Certificate",
    place: "University Laboratory School & College · Science",
    description: "GPA 5.00. Physics, Chemistry, Mathematics.",
  },
  {
    period: "2018",
    role: "Secondary School Certificate",
    place: "Shamsul Haque Khan School & College · Science",
    description: "GPA 5.00.",
  },
];

const HIGHLIGHTS: TimelineItem[] = [
  {
    period: "2026",
    role: "12-Hour Online Hackathon",
    place: "UIU Developers Hub",
    description: "Stage-0 intra-university hackathon, 5 PM–7 AM overnight build.",
    active: true,
  },
  {
    period: "2025–26",
    role: "UIU HackDay",
    place: "UIU Developers Hub × UIU Computer Club",
    description: "First-ever UIU HackDay, 6-hour on-site build, mystery theme revealed at start.",
  },
  {
    period: "Ongoing",
    role: "Green Computing Research",
    place: "Course research, ICCIT (in review)",
    description: "Co-authored paper prepared for short/blind-review submission.",
  },
  {
    period: "2024",
    role: "Embedded Systems Lab",
    place: "Microprocessor Lab · Arduino/ESP32",
    description: "Built a smart-dustbin prototype exploring sensor-triggered automation.",
  },
];

function TimelineColumn({
  title,
  items,
  showGithub,
}: {
  title: string;
  items: TimelineItem[];
  showGithub?: boolean;
}) {
  return (
    <div className="experience__column">
      <h3 className="experience__column-title">{title}</h3>
      <ul className="experience__timeline">
        {items.map((item) => (
          <li
            key={`${item.period}-${item.role}`}
            className={`experience__item${item.active ? " experience__item--active" : ""}`}
          >
            <span className="experience__dot" aria-hidden="true" />
            <div className="experience__content">
              <span className="experience__year">{item.period}</span>
              <p className="experience__role">{item.role}</p>
              <p className="experience__place">{item.place}</p>
              <p className="experience__desc">{item.description}</p>
            </div>
          </li>
        ))}
      </ul>
      {showGithub ? (
        <div className="experience__github">
          <p className="experience__github-label">GITHUB ACTIVITY</p>
          <img
            src={`https://ghchart.rshah.org/00e5ff/${GH_USER}`}
            alt={`${GH_USER} GitHub contribution chart`}
            loading="lazy"
            className="experience__github-chart"
          />
        </div>
      ) : null}
    </div>
  );
}

export default function Experience() {
  return (
    <>
      <style>{`
        .experience {
          padding: 5rem 3rem;
        }
        .experience__grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          max-width: 1120px;
          margin: 0 auto;
        }
        @media (max-width: 767px) {
          .experience__grid {
            grid-template-columns: 1fr;
          }
        }
        .experience__column-title {
          font-family: var(--fm);
          font-size: 11px;
          letter-spacing: 0.14em;
          color: var(--text-s);
          margin: 0 0 1.5rem;
        }
        .experience__timeline {
          list-style: none;
          margin: 0;
          padding: 0 0 0 1.25rem;
          position: relative;
        }
        .experience__timeline::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 1px;
          background: linear-gradient(
            to bottom,
            color-mix(in srgb, var(--accent) 50%, transparent),
            transparent
          );
        }
        .experience__item {
          position: relative;
          padding: 0 0 1.75rem 1.25rem;
        }
        .experience__item:last-child {
          padding-bottom: 0;
        }
        .experience__dot {
          position: absolute;
          left: -1.25rem;
          top: 0.15rem;
          width: 9px;
          height: 9px;
          border-radius: 50%;
          transform: translateX(calc(-50% - 0.5px));
          background: var(--bg);
          border: 2px solid var(--text-m);
          box-sizing: border-box;
        }
        .experience__item--active .experience__dot {
          border-color: var(--accent);
        }
        .experience__year {
          display: block;
          font-family: var(--fm);
          font-size: 10px;
          color: var(--accent);
          letter-spacing: 0.06em;
          margin-bottom: 0.35rem;
        }
        .experience__role {
          font-family: var(--fb);
          font-size: 14px;
          font-weight: 600;
          color: var(--text);
          margin: 0 0 0.25rem;
          line-height: 1.35;
        }
        .experience__place {
          font-family: var(--fm);
          font-size: 11px;
          color: var(--text-s);
          margin: 0 0 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .experience__desc {
          font-family: var(--fb);
          font-size: 12px;
          color: var(--text-m);
          line-height: 1.7;
          margin: 0;
        }
        .experience__github {
          margin-top: 2rem;
        }
        .experience__github-label {
          font-family: var(--fm);
          font-size: 10px;
          color: var(--text-m);
          letter-spacing: 0.12em;
          margin: 0 0 0.75rem;
        }
        .experience__github-chart {
          width: 100%;
          border-radius: 8px;
          border: 1px solid var(--border);
          filter: hue-rotate(200deg) saturate(1.4) brightness(0.85);
        }
      `}</style>

      <section id="experience" className="experience">
        <div className="experience__grid">
          <TimelineColumn title="EDUCATION" items={EDUCATION} />
          <TimelineColumn title="HIGHLIGHTS" items={HIGHLIGHTS} showGithub />
        </div>
      </section>
    </>
  );
}
