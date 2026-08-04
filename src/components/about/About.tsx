"use client";
import type { ReactNode } from "react";
import { useState } from "react";

import Image from "next/image";
import Link from "next/link";


const STATS = [
  { value: "6", label: "PROJECTS SHIPPED" },
  { value: "1", label: "PAPER IN PROGRESS" },
  { value: "2", label: "HACKATHONS" },
] as const;

const NOW_ROWS = [
  { icon: "📍", label: "location", value: "Dhaka, Bangladesh" },
  {
    icon: "🔨",
    label: "building",
    value: "RAG pipeline + LLM fine-tuning experiments",
  },
  {
    icon: "📚",
    label: "reading",
    value: "RLHF papers · Attention Is All You Need",
  },
  { icon: "🎯", label: "goal 2026", value: "Ship 2 open-source AI tools" },
  {
    icon: "⚡",
    label: "uptime",
    value: "3+ years coding · still going",
    highlight: true,
  },
] as const;


function AboutButton({
  href,
  variant,
  download,
  children,
}: {
  href: string;
  variant: "primary" | "outline";
  download?: boolean;
  children: ReactNode;
}) {
  const className =
    variant === "primary"
      ? "about-btn about-btn--primary bp"
      : "about-btn about-btn--outline bo";

  if (download) {
    return (
      <a href={href} className={className} data-magnetic download>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className} data-magnetic>
      {children}
    </Link>
  );
}

function ProfilePhoto() {
  const [failed, setFailed] = useState(false);

  return (
    <div className="about__photo-block">
      <div className="about__photo-deco" aria-hidden="true" />
      <div className="about__photo">
        {failed ? (
          <div className="about__photo-fallback" role="img" aria-label="Siddartho Sarker Bipro">
            SB
          </div>
        ) : (
          <Image
            src="/images/profile.jpg"
            alt="Siddartho Sarker Bipro"
            fill
            className="about__photo-img"
            sizes="260px"
            onError={() => setFailed(true)}
          />
        )}
      </div>
    </div>
  );
}

export default function About() {
  return (
    <>
      <style>{`
        .about {
          padding: 5rem 3rem;
        }
        .about__grid {
          display: grid;
          grid-template-columns: 260px 1fr;
          gap: 3rem;
          align-items: start;
          max-width: 1120px;
          margin: 0 auto;
        }
        @media (max-width: 767px) {
          .about__grid {
            grid-template-columns: 1fr;
          }
        }
        .about__left {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .about__photo-block {
          position: relative;
        }
        .about__photo-deco {
          position: absolute;
          bottom: -9px;
          right: -9px;
          width: 100%;
          height: 100%;
          border: 1px solid color-mix(in srgb, var(--accent) 7%, transparent);
          border-radius: 11px;
          z-index: -1;
          pointer-events: none;
        }
        .about__photo {
          position: relative;
          width: 100%;
          aspect-ratio: 1;
          border-radius: 11px;
          border: 1px solid var(--border);
          overflow: hidden;
        }
        .about__photo-img {
          object-fit: cover;
          filter: grayscale(0.15);
        }
        .about__photo-fallback {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          font-family: var(--fd);
          font-weight: 800;
          font-size: 2.5rem;
          color: var(--accent);
          background: linear-gradient(
            135deg,
            color-mix(in srgb, var(--violet) 35%, var(--bg)),
            color-mix(in srgb, var(--accent) 18%, var(--bg))
          );
        }
        .about__stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.5rem;
        }
        .about__stat {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 0.75rem;
          text-align: center;
        }
        .about__stat-value {
          display: block;
          font-family: var(--fd);
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--accent);
          line-height: 1.1;
        }
        .about__stat-label {
          display: block;
          margin-top: 0.25rem;
          font-family: var(--fm);
          font-size: 9px;
          color: var(--text-m);
          letter-spacing: 0.08em;
        }
        .about__heading {
          font-family: var(--fb);
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text);
          margin: 0 0 1rem;
          line-height: 1.45;
        }
        .about__copy {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .about__copy p {
          font-family: var(--fb);
          font-size: 14px;
          line-height: 1.65;
          color: var(--text-s);
          margin: 0;
        }
        .about__now {
          margin-top: 1.25rem;
          background: color-mix(in srgb, var(--bg) 30%, transparent);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 0.9rem 1rem;
          font-family: var(--fm);
          font-size: 12px;
        }
        .about__now-row {
          display: flex;
          gap: 0.6rem;
          align-items: flex-start;
          padding: 0.2rem 0;
        }
        .about__now-label {
          color: var(--accent);
          min-width: 80px;
          flex-shrink: 0;
        }
        .about__now-value {
          color: var(--text-m);
          line-height: 1.5;
        }
        .about__now-value--uptime {
          color: color-mix(in srgb, var(--green) 55%, var(--text));
        }
        .about__terminal {
          margin-top: 1.25rem;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 10px;
          overflow: hidden;
        }
        .about__terminal-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-bottom: 1px solid var(--border);
        }
        .about__terminal-dots {
          display: flex;
          gap: 5px;
        }
        .about__terminal-dots span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--border-h);
        }
        .about__terminal-dots span:nth-child(1) {
          background: var(--accent);
          opacity: 0.55;
        }
        .about__terminal-dots span:nth-child(2) {
          background: var(--violet-s);
          opacity: 0.55;
        }
        .about__terminal-dots span:nth-child(3) {
          background: var(--green);
          opacity: 0.55;
        }
        .about__terminal-title {
          font-family: var(--fm);
          font-size: 10px;
          color: var(--text-s);
        }
        .about__terminal-body {
          padding: 10px 12px 12px;
          font-family: var(--fm);
          font-size: 11px;
          color: var(--text-m);
          line-height: 1.75;
        }
        .about__terminal-body p {
          margin: 0;
        }
        .about__actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 1.5rem;
        }
        .about-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 12px 22px;
          border-radius: 10px;
          font-family: var(--fb);
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          transition:
            transform 0.2s ease,
            background 0.2s ease,
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }
        .about-btn--primary {
          background: var(--violet);
          color: var(--text);
          border: 1px solid transparent;
        }
        .about-btn--primary:hover {
          background: color-mix(in srgb, var(--violet) 82%, var(--bg));
          box-shadow: 0 10px 28px color-mix(in srgb, var(--violet) 35%, transparent);
        }
        .about-btn--outline {
          background: transparent;
          color: var(--text);
          border: 1px solid var(--border-h);
        }
        .about-btn--outline:hover {
          border-color: var(--accent);
        }
      `}</style>

      <section id="about" className="about">
        <div className="about__grid">
          <div className="about__left">
            <ProfilePhoto />
            <div className="about__stats">
              {STATS.map((stat) => (
                <div key={stat.label} className="about__stat">
                  <span className="about__stat-value">{stat.value}</span>
                  <span className="about__stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="about__right">
            <h3 className="about__heading">
              Software Engineer &amp; AI Researcher from Bangladesh 🇧🇩
            </h3>

            <div className="about__copy">
              <p>
                I&apos;m a software engineer and AI research engineer based in
                Bangladesh, building systems that sit at the intersection of
                intelligence and engineering.
              </p>
              <p>
                My work spans embedded robotics, full-stack web platforms, and
                LLM-based research tooling. I care deeply about systems that are
                fast, readable, and actually useful.
              </p>
              <p>
                When I&apos;m not coding I&apos;m running experiments, reading
                papers, or working on side projects that probably involve a
                microcontroller.
              </p>
            </div>

            <div className="about__now">
              {NOW_ROWS.map((row) => (
                <div key={row.label} className="about__now-row">
                  <span className="about__now-label">
                    {row.icon} {row.label}
                  </span>
                  <span
                    className={`about__now-value${"highlight" in row && row.highlight ? " about__now-value--uptime" : ""}`}
                  >
                    {row.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="about__actions">
              <AboutButton href="/resume.pdf" variant="primary" download>
                View Resume
              </AboutButton>
              <AboutButton href="#contact" variant="outline">
                Contact Me
              </AboutButton>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
