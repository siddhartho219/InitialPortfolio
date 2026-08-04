"use client";

import type { ReactNode } from "react";

import Link from "next/link";
import { useReducedMotion } from "framer-motion";

import RoleSwitcher from "@/components/hero/RoleSwitcher";

const TICKER_TEXT =
  "⟩ Currently exploring: LLM Fine-tuning · RAG Systems · Embedded AI · Computer Vision · Neural Architecture Search · Robotics Control ·";

function HeroButton({
  href,
  variant,
  download,
  children,
}: {
  href: string;
  variant: "primary" | "secondary";
  download?: boolean;
  children: ReactNode;
}) {
  const className =
    variant === "primary"
      ? "hero-btn hero-btn--primary bp"
      : "hero-btn hero-btn--secondary bo";

  if (download || href.startsWith("http")) {
    return (
      <a
        href={href}
        className={className}
        data-magnetic
        download={download || undefined}
      >
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

export default function Hero() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      <style>{`
        @keyframes hero-fade-up {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes hero-dot-pulse {
          0%,
          100% {
            box-shadow: 0 0 0 0 color-mix(in srgb, var(--green) 45%, transparent);
          }
          50% {
            box-shadow: 0 0 0 6px transparent;
          }
        }
        @keyframes hero-scroll-pulse {
          0%,
          100% {
            opacity: 0.35;
          }
          50% {
            opacity: 1;
          }
        }
        @keyframes hero-cursor-blink {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
        }
        @keyframes hero-ticker {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        .hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 9rem 3rem 4rem;
          overflow: hidden;
          text-align: center;
        }
        .hero__inner {
          max-width: 720px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.25rem;
        }
        .hero-fade {
          opacity: 0;
          animation: hero-fade-up 0.75s ease forwards;
        }
        .hero-fade--reduced {
          opacity: 1;
          transform: none;
          animation: none;
        }
        .hero__tag {
          font-family: var(--fm);
          font-size: 11px;
          color: var(--accent);
          text-transform: uppercase;
          letter-spacing: 0.18em;
          margin: 0;
        }
        .hero__name {
          font-family: var(--fd);
          font-weight: 800;
          font-size: clamp(2.8rem, 5.5vw, 4.6rem);
          line-height: 1.03;
          color: var(--text);
          margin: 0;
        }
        .hero__name em {
          font-style: normal;
          color: var(--accent);
          display: block;
        }
        .hero-typewriter {
          font-family: var(--fd);
          font-weight: 700;
          font-size: clamp(1rem, 2.2vw, 1.45rem);
          color: var(--violet-s);
          margin: 0;
          min-height: 1.5em;
        }
        .hero-typewriter__cursor {
          display: inline-block;
          width: 2px;
          height: 1em;
          margin-left: 2px;
          vertical-align: -0.1em;
          background: var(--accent);
          animation: hero-cursor-blink 1s step-end infinite;
        }
        .hero__status {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          width: fit-content;
          padding: 6px 12px;
          border-radius: 999px;
          background: color-mix(in srgb, var(--green) 6%, transparent);
          border: 1px solid color-mix(in srgb, var(--green) 14%, transparent);
          font-family: var(--fm);
          font-size: 11px;
          color: var(--green);
        }
        .hero__status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--green);
          animation: hero-dot-pulse 2s ease-in-out infinite;
        }
        .hero__bio {
          font-family: var(--fb);
          font-size: 14px;
          line-height: 1.65;
          color: var(--text-s);
          max-width: 500px;
          margin: 0;
        }
        .hero__ticker {
          overflow: hidden;
          max-width: 100%;
          border-left: 2px solid color-mix(in srgb, var(--accent) 18%, transparent);
          padding-left: 10px;
        }
        .hero__ticker-track {
          display: flex;
          width: max-content;
          font-family: var(--fm);
          font-size: 10px;
          color: var(--text-m);
          white-space: nowrap;
          animation: hero-ticker 28s linear infinite;
        }
        .hero__ticker-track--paused {
          animation: none;
        }
        .hero__ticker-item {
          padding-right: 2rem;
        }
        .hero__buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 0.25rem;
        }
        .hero-btn {
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
        .hero-btn--primary {
          background: var(--violet);
          color: var(--text);
          border: 1px solid transparent;
        }
        .hero-btn--primary:hover {
          background: color-mix(in srgb, var(--violet) 82%, var(--bg));
          box-shadow: 0 10px 28px color-mix(in srgb, var(--violet) 35%, transparent);
        }
        .hero-btn--secondary {
          background: transparent;
          color: var(--text);
          border: 1px solid var(--border-h);
        }
        .hero-btn--secondary:hover {
          border-color: var(--accent);
        }
        .hero__scroll {
          position: absolute;
          left: 50%;
          bottom: 2rem;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        .hero__scroll-line {
          width: 1px;
          height: 36px;
          background: linear-gradient(
            to bottom,
            var(--accent),
            transparent
          );
          animation: hero-scroll-pulse 2s ease-in-out infinite;
        }
        .hero__scroll-label {
          font-family: var(--fm);
          font-size: 10px;
          color: var(--text-m);
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
      `}</style>

      <section id="home" className="hero">
        <div className="hero__inner">
          <p
            className={`hero__tag hero-fade${shouldReduceMotion ? " hero-fade--reduced" : ""}`}
            style={{ animationDelay: "0.3s" }}
          >
            // software engineer &amp; ai researcher · dhaka, bangladesh
          </p>

          <h1
            className={`hero__name hero-fade${shouldReduceMotion ? " hero-fade--reduced" : ""}`}
            style={{ animationDelay: "0.5s" }}
          >
            Siddartho
            <em>Sarker Bipro</em>
          </h1>

          <div
            className={`hero-fade${shouldReduceMotion ? " hero-fade--reduced" : ""}`}
            style={{ animationDelay: "0.7s" }}
          >
            <RoleSwitcher />
          </div>

          <div
            className={`hero__status hero-fade${shouldReduceMotion ? " hero-fade--reduced" : ""}`}
            style={{ animationDelay: "1s" }}
          >
            <span className="hero__status-dot" aria-hidden="true" />
            <span>Open to internships &amp; collaborations</span>
          </div>

          <p
            className={`hero__bio hero-fade${shouldReduceMotion ? " hero-fade--reduced" : ""}`}
            style={{ animationDelay: "0.9s" }}
          >
            I build intelligent systems at the intersection of software engineering
            and AI research. From embedded robotics to full-stack platforms — I
            ship things that work.
          </p>

          <div
            className={`hero__ticker hero-fade${shouldReduceMotion ? " hero-fade--reduced" : ""}`}
            style={{ animationDelay: "1.1s" }}
          >
            <div
              className={`hero__ticker-track${shouldReduceMotion ? " hero__ticker-track--paused" : ""}`}
            >
              <span className="hero__ticker-item">{TICKER_TEXT}</span>
              <span className="hero__ticker-item" aria-hidden="true">
                {TICKER_TEXT}
              </span>
            </div>
          </div>

          <div
            className={`hero__buttons hero-fade${shouldReduceMotion ? " hero-fade--reduced" : ""}`}
            style={{ animationDelay: "1.2s" }}
          >
            <HeroButton href="#projects" variant="primary">
              View Projects
            </HeroButton>
            <HeroButton href="/resume.pdf" variant="secondary" download>
              Download Resume
            </HeroButton>
          </div>
        </div>

        <div
          className={`hero__scroll hero-fade${shouldReduceMotion ? " hero-fade--reduced" : ""}`}
          style={{ animationDelay: "1.4s" }}
          aria-hidden="true"
        >
          <span className="hero__scroll-line" />
          <span className="hero__scroll-label">scroll</span>
        </div>
      </section>
    </>
  );
}
