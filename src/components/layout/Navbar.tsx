"use client";

import { useEffect, useMemo, useState } from "react";

import Link from "next/link";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
] as const;

export default function Navbar() {
  const [activeHref, setActiveHref] = useState<string>("#home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const navItems = useMemo(() => NAV_LINKS, []);

  useEffect(() => {
    const onScroll = () => {
      const sections = navItems
        .map((item) => item.href)
        .map((href) => document.querySelector(href))
        .filter((el): el is HTMLElement => Boolean(el));

      const current = sections
        .map((el) => ({ el, top: el.getBoundingClientRect().top }))
        .filter(({ top }) => top <= 160)
        .sort((a, b) => b.top - a.top)[0];

      if (current) {
        setActiveHref(`#${current.el.id}`);
      } else {
        setActiveHref("#home");
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [navItems]);

  return (
    <>
      <style>{`
        @keyframes nav-dot-pulse {
          0%,
          100% {
            box-shadow: 0 0 0 0 color-mix(in srgb, var(--green) 45%, transparent);
          }
          50% {
            box-shadow: 0 0 0 6px transparent;
          }
        }
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 3rem;
          background: color-mix(in srgb, var(--bg) 80%, transparent);
          backdrop-filter: blur(24px);
          border-bottom: 1px solid var(--border);
        }
        .navbar__logo {
          font-family: var(--fd);
          font-weight: 800;
          font-size: 1.125rem;
          color: var(--text);
          text-decoration: none;
          flex-shrink: 0;
        }
        .navbar__logo-dot {
          color: var(--accent);
        }
        .navbar__links {
          display: none;
          align-items: center;
          justify-content: center;
          gap: 2rem;
          flex: 1;
        }
        @media (min-width: 768px) {
          .navbar__links {
            display: flex;
          }
        }
        .navbar__links--mobile-open {
          display: flex;
          position: fixed;
          top: 60px;
          left: 0;
          right: 0;
          flex-direction: column;
          align-items: flex-start;
          gap: 0;
          padding: 0.5rem 0;
          background: var(--bg);
          border-bottom: 1px solid var(--border);
        }
        .navbar__links--mobile-open .navbar__link {
          width: 100%;
          padding: 0.9rem 1.5rem;
        }
        .navbar__toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          background: transparent;
          border: 1px solid var(--border);
          border-radius: 8px;
          color: var(--text);
          flex-shrink: 0;
        }
        @media (min-width: 768px) {
          .navbar__toggle {
            display: none;
          }
        }
        .navbar__toggle-bar {
          display: block;
          width: 16px;
          height: 1.5px;
          background: var(--text);
          position: relative;
        }
        .navbar__toggle-bar::before,
        .navbar__toggle-bar::after {
          content: "";
          position: absolute;
          left: 0;
          width: 16px;
          height: 1.5px;
          background: var(--text);
        }
        .navbar__toggle-bar::before {
          top: -5px;
        }
        .navbar__toggle-bar::after {
          top: 5px;
        }
        .navbar__link {
          font-family: var(--fm);
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-s);
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .navbar__link:hover,
        .navbar__link[data-active="true"] {
          color: var(--text);
        }
        .navbar__badge {
          display: none;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          border-radius: 999px;
          background: color-mix(in srgb, var(--green) 6%, transparent);
          border: 1px solid color-mix(in srgb, var(--green) 14%, transparent);
          font-family: var(--fm);
          font-size: 11px;
          color: var(--green);
          flex-shrink: 0;
        }
        @media (min-width: 768px) {
          .navbar__badge {
            display: flex;
          }
        }
        .navbar__badge-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--green);
          animation: nav-dot-pulse 2s ease-in-out infinite;
        }
      `}</style>

      <header className="navbar">
        <Link href="#home" className="navbar__logo">
          Siddartho<span className="navbar__logo-dot">.</span>
        </Link>

        <nav
          className={`navbar__links${mobileOpen ? " navbar__links--mobile-open" : ""}`}
          aria-label="Main navigation"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="navbar__link"
              data-active={activeHref === item.href ? "true" : "false"}
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="navbar__badge" aria-label="Availability status">
          <span className="navbar__badge-dot" aria-hidden="true" />
          <span>Available for work</span>
        </div>

        <button
          type="button"
          className="navbar__toggle"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          <span className="navbar__toggle-bar" />
        </button>
      </header>
    </>
  );
}
