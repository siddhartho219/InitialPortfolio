export default function Footer() {
  return (
    <>
      <style>{`
        .site-footer {
          border-top: 1px solid var(--border);
          text-align: center;
          padding: 2.2rem 1.2rem;
          font-family: var(--fm);
          font-size: var(--fs-label);
          color: var(--text-m);
        }
        .site-footer__line {
          margin: 0;
          line-height: 1.6;
        }
        .site-footer__line--sub {
          margin-top: 0.35rem;
          opacity: 0.35;
          font-size: var(--fs-caption);
        }
        .site-footer__name {
          color: color-mix(in srgb, var(--accent) 55%, transparent);
        }
      `}</style>

      <footer className="site-footer">
        <p className="site-footer__line">
          Designed &amp; built by{" "}
          <span className="site-footer__name">Siddartho Sarker Bipro</span> · 2026
        </p>
        <p className="site-footer__line site-footer__line--sub">
          Designed in Figma · Built in Cursor · Debugged at 2am ☕
        </p>
      </footer>
    </>
  );
}
