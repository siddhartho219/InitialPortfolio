'use client';

import { useState, useRef, useEffect } from 'react';

import { EMAIL, GITHUB } from '@/data/contact';
import { skills as SKILLS_DATA } from '@/data/skills';
import { projects as PROJECTS_DATA } from '@/data/projects';

const skills = SKILLS_DATA.reduce((acc, s) => {
  acc[s.category] = acc[s.category] || [];
  acc[s.category].push(s.name);
  return acc;
}, {} as Record<string, string[]>);

const projects = PROJECTS_DATA.reduce((acc, p) => {
  acc[p.slug] = {
    title: p.title,
    description: p.description,
    tech: p.tech,
    github: p.github,
    type: `${p.featured ? "★ Featured · " : ""}${p.category}${p.status ? " · " + p.status : ""}`,
  };
  return acc;
}, {} as Record<string, { title: string; description: string; tech: string[]; github?: string; type: string }>);

const PORTFOLIO = {
  name: 'Siddartho Sarker Bipro',
  title: 'Software Engineer & AI Researcher',
  location: 'Dhaka, Bangladesh',
  email: EMAIL,
  github: GITHUB,
  linkedin: 'https://linkedin.com/in/siddhartho-sarker-b5452822a',
  twitter: 'https://x.com/siddartho11',
  status: 'open_to_opportunities=true',
  building: 'RAG pipeline + LLM fine-tuning experiments',
  reading: 'RLHF papers · Attention Is All You Need',
  goal: 'Ship 2 open-source AI tools in 2026',
  skills,
  projects,
};

type OutputLine = { type: 'input' | 'output'; content: string };

function processCommand(raw: string): string[] {
  const cmd = raw.trim().toLowerCase();
  const parts = raw.trim().split(/\s+/);
  if (!cmd) return [];

  if (cmd === 'help') return [
    '┌─ Commands ────────────────────────────────────────┐',
    '│ whoami              → who am I?                   │',
    '│ ls                  → list sections               │',
    '│ ls projects/        → list all projects           │',
    '│ cat about.txt       → about me                    │',
    '│ cat skills.txt      → tech skills                 │',
    '│ cat experience.txt  → education & highlights      │',
    '│ cat contact.txt     → contact info                │',
    '│ cat projects/<name> → project details             │',
    '│ echo $STATUS        → availability                │',
    '│ open github         → open GitHub profile         │',
    '│ open linkedin       → open LinkedIn               │',
    '│ clear               → clear terminal              │',
    '└───────────────────────────────────────────────────┘',
  ];

  if (cmd === 'whoami') return [PORTFOLIO.name, PORTFOLIO.title, `📍 ${PORTFOLIO.location}`];
  if (cmd === 'pwd') return ['/home/siddartho/portfolio'];
  if (cmd === 'ls') return ['about.txt    skills.txt    experience.txt    contact.txt', 'projects/    blog/         resume.pdf'];

  if (cmd === 'ls projects/') return [
    'Projects:',
    ...Object.keys(PORTFOLIO.projects).map(
      (k) => `  ${k.padEnd(32)}→ ${PORTFOLIO.projects[k as keyof typeof PORTFOLIO.projects].type}`
    ),
    '', 'Usage: cat projects/<name>',
  ];

  if (cmd === 'cat about.txt') return [
    '━━━ about.txt ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    `Name     : ${PORTFOLIO.name}`,
    `Role     : ${PORTFOLIO.title}`,
    `Location : ${PORTFOLIO.location}`,
    '', 'Bio:',
    '  Building systems at the intersection of software',
    '  engineering and AI research.',
    '',
    `Building : ${PORTFOLIO.building}`,
    `Reading  : ${PORTFOLIO.reading}`,
    `Goal     : ${PORTFOLIO.goal}`,
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
  ];

  if (cmd === 'cat skills.txt') {
    const lines = ['━━━ skills.txt ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'];
    for (const [cat, items] of Object.entries(PORTFOLIO.skills))
      lines.push(`${cat.padEnd(15)}: ${items.join(' · ')}`);
    lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    return lines;
  }

  if (cmd === 'cat experience.txt') return [
    '━━━ experience.txt ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    'EDUCATION',
    '  2022→NOW  B.Sc. Computer Science & Engineering',
    '             University · Dhaka, BD',
    '  2019→2021 Higher Secondary Certificate',
    '             College · Science Division',
    '', 'HIGHLIGHTS',
    '  2024  Restaurant Delivery Robot — Arduino, sensors',
    '  2023  AI Research Reviewer — LLM, prompt eng.',
    '  2023  Full Stack Web Dev — Django, React, Vercel',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
  ];

  if (cmd === 'cat contact.txt') return [
    '━━━ contact.txt ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    `Email    : ${PORTFOLIO.email}`,
    `GitHub   : ${PORTFOLIO.github}`,
    `LinkedIn : ${PORTFOLIO.linkedin}`,
    `Twitter  : ${PORTFOLIO.twitter}`,
    '', 'Tip: type "open github" or "open linkedin"',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
  ];

  if (cmd === 'echo $status') return [`STATUS: ${PORTFOLIO.status}`];

  if (parts[0] === 'cat' && parts[1]?.startsWith('projects/')) {
    const key = parts[1].replace('projects/', '') as keyof typeof PORTFOLIO.projects;
    const p = PORTFOLIO.projects[key];
    if (!p) return [`cat: projects/${key}: No such file`, `Available: ${Object.keys(PORTFOLIO.projects).join(', ')}`];
    const lines = [
      `━━━ projects/${key} ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `Title  : ${p.title}`,
      `Type   : ${p.type}`,
      `Desc   : ${p.description}`,
      `Tech   : ${p.tech.join(' · ')}`,
    ];
    if (p.github) lines.push(`GitHub : ${p.github}`);
    lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    return lines;
  }

  if (parts[0] === 'open') {
    const urls: Record<string, string> = {
      github: PORTFOLIO.github, linkedin: PORTFOLIO.linkedin,
      twitter: PORTFOLIO.twitter, resume: '/resume.pdf',
    };
    if (urls[parts[1]]) { window.open(urls[parts[1]], '_blank'); return [`Opening ${parts[1]}...`]; }
    return [`open: unknown "${parts[1]}"`, 'Available: github, linkedin, twitter, resume'];
  }

  return [`command not found: ${parts[0]}`, 'Type "help" to see available commands.'];
}

export default function Terminal() {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [history, setHistory] = useState<OutputLine[]>([
    { type: 'output', content: 'siddartho@portfolio:~ — type "help" for commands' },
    { type: 'output', content: '' },
  ]);
  const [input, setInput] = useState('');
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && !closing) {
      setTimeout(() => inputRef.current?.focus(), 320);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 320);
    }
  }, [open, closing]);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, open]);

  const handleOpen = () => {
    setClosing(false);
    setOpen(true);
  };

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, 350);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim();
    if (!cmd) return;
    if (cmd.toLowerCase() === 'clear') { setHistory([]); setInput(''); return; }
    const lines = processCommand(cmd);
    setHistory(prev => [
      ...prev,
      { type: 'input', content: cmd },
      ...lines.map(l => ({ type: 'output' as const, content: l })),
    ]);
    setCmdHistory(prev => [cmd, ...prev]);
    setHistoryIndex(-1);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') { e.preventDefault(); const n = Math.min(historyIndex + 1, cmdHistory.length - 1); setHistoryIndex(n); setInput(cmdHistory[n] ?? ''); }
    if (e.key === 'ArrowDown') { e.preventDefault(); const n = Math.max(historyIndex - 1, -1); setHistoryIndex(n); setInput(n === -1 ? '' : cmdHistory[n]); }
    if (e.key === 'Escape') handleClose();
  };

  return (
    <>
      <style>{`
        /* FAB */
        .term-fab {
          position: fixed;
          bottom: 5.5rem;
          right: 2rem;
          z-index: 1000;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #000;
          border: 1px solid rgba(0,229,255,0.4);
          color: #00e5ff;
          font-size: 1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 16px rgba(0,229,255,0.2);
          transition: box-shadow 0.2s, transform 0.2s, border-color 0.2s;
          font-family: monospace;
          letter-spacing: -1px;
        }
        .term-fab:hover {
          box-shadow: 0 0 28px rgba(0,229,255,0.5);
          transform: scale(1.08);
        }
        .term-fab:active {
          transform: scale(0.94);
        }
        .term-fab:focus-visible {
          outline: 2px solid rgba(0,229,255,0.7);
          outline-offset: 3px;
        }
        @media (prefers-reduced-motion: reduce) {
          .term-fab:hover,
          .term-fab:active {
            transform: none;
          }
          .term-fab--open {
            animation: none;
          }
        }
        .term-fab--open {
          border-color: rgba(0,229,255,0.8);
          box-shadow: 0 0 32px rgba(0,229,255,0.5);
          animation: fab-pulse 1.5s ease-in-out infinite;
        }
        @keyframes fab-pulse {
          0%, 100% { box-shadow: 0 0 16px rgba(0,229,255,0.3); }
          50%       { box-shadow: 0 0 36px rgba(0,229,255,0.7); }
        }

        /* Backdrop */
        .term-backdrop {
          position: fixed;
          inset: 0;
          z-index: 998;
          background: rgba(0,0,0,0);
          backdrop-filter: blur(0px);
          animation: backdropIn 0.3s ease forwards;
        }
        .term-backdrop--closing {
          animation: backdropOut 0.35s ease forwards;
        }
        @keyframes backdropIn {
          to { background: rgba(0,0,0,0.55); backdrop-filter: blur(4px); }
        }
        @keyframes backdropOut {
          from { background: rgba(0,0,0,0.55); backdrop-filter: blur(4px); }
          to   { background: rgba(0,0,0,0);    backdrop-filter: blur(0px); }
        }

        /* Panel — expands from bottom-right to center */
        .term-panel {
          position: fixed;
          z-index: 999;
          width: min(560px, calc(100vw - 2rem));
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: #080808;
          border: 1px solid rgba(0,229,255,0.25);
          border-radius: 14px;
          overflow: hidden;
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
          font-size: 12px;
          box-shadow: 0 0 80px rgba(0,229,255,0.08), 0 30px 80px rgba(0,0,0,0.7);
          animation: termExpand 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .term-panel--closing {
          animation: termCollapse 0.32s cubic-bezier(0.4, 0, 0.6, 1) forwards;
        }

        @keyframes termExpand {
          0% {
            opacity: 0;
            clip-path: circle(0% at calc(100% - 2rem - 24px) calc(100% - 6.5rem - 24px));
            transform: translate(-50%, -50%) scale(0.92);
          }
          40% {
            opacity: 1;
          }
          100% {
            opacity: 1;
            clip-path: circle(150% at calc(100% - 2rem - 24px) calc(100% - 6.5rem - 24px));
            transform: translate(-50%, -50%) scale(1);
          }
        }
        @keyframes termCollapse {
          0% {
            opacity: 1;
            clip-path: circle(150% at calc(100% - 2rem - 24px) calc(100% - 6.5rem - 24px));
            transform: translate(-50%, -50%) scale(1);
          }
          60% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            clip-path: circle(0% at calc(100% - 2rem - 24px) calc(100% - 6.5rem - 24px));
            transform: translate(-50%, -50%) scale(0.92);
          }
        }

        /* Scanline effect */
        .term-panel::before {
          content: '';
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,229,255,0.015) 2px,
            rgba(0,229,255,0.015) 4px
          );
          pointer-events: none;
          z-index: 10;
        }

        .term-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          background: #0d0d0d;
          border-bottom: 1px solid rgba(0,229,255,0.12);
        }
        .term-dots { display: flex; gap: 6px; }
        .term-dots span {
          width: 11px; height: 11px; border-radius: 50%;
          cursor: pointer; transition: opacity 0.15s;
        }
        .term-dots span:hover { opacity: 0.7; }
        .term-dots span:nth-child(1) { background: #ff5f57; }
        .term-dots span:nth-child(2) { background: #febc2e; }
        .term-dots span:nth-child(3) { background: #28c840; }
        .term-title {
          color: #444;
          font-size: 11px;
          margin-left: 6px;
          letter-spacing: 0.05em;
        }
        .term-title span { color: #00e5ff; opacity: 0.7; }
        .term-close {
          margin-left: auto;
          background: none;
          border: none;
          color: #444;
          cursor: pointer;
          font-size: 13px;
          padding: 2px 6px;
          border-radius: 4px;
          transition: color 0.15s, background 0.15s;
        }
        .term-close:hover { color: #fff; background: rgba(255,255,255,0.06); }

        .term-body {
          height: 340px;
          overflow-y: auto;
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 3px;
          scroll-behavior: smooth;
        }
        .term-body::-webkit-scrollbar { width: 3px; }
        .term-body::-webkit-scrollbar-track { background: transparent; }
        .term-body::-webkit-scrollbar-thumb { background: rgba(0,229,255,0.15); border-radius: 2px; }

        .term-line-input { display: flex; gap: 8px; align-items: flex-start; }
        .term-prompt { color: #00e5ff; user-select: none; flex-shrink: 0; }
        .term-cmd { color: #e0e0e0; }
        .term-out { color: #888; white-space: pre; line-height: 1.6; }

        .term-input-row {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          border-top: 1px solid rgba(0,229,255,0.1);
          background: #0a0a0a;
        }
        .term-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: #e0e0e0;
          font-family: inherit;
          font-size: 12px;
          caret-color: #00e5ff;
        }
        .term-input::placeholder { color: #2a2a2a; }

        /* Glitch on open */
        @keyframes glitch {
          0%   { clip-path: inset(0 0 95% 0); transform: translate(-50%,-50%) translate(-2px, 0) scale(1); }
          10%  { clip-path: inset(30% 0 60% 0); transform: translate(-50%,-50%) translate(2px, 0) scale(1); }
          20%  { clip-path: inset(0 0 0 0); transform: translate(-50%,-50%) scale(1); }
          100% { clip-path: inset(0 0 0 0); transform: translate(-50%,-50%) scale(1); }
        }
      `}</style>

      {/* FAB button */}
      <button
        className={`term-fab${open ? ' term-fab--open' : ''}`}
        onClick={open ? handleClose : handleOpen}
        title={open ? 'Close terminal' : 'Open terminal'}
        aria-label="Toggle terminal"
      >
        {open ? '✕' : '>_'}
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className={`term-backdrop${closing ? ' term-backdrop--closing' : ''}`}
          onClick={handleClose}
        />
      )}

      {/* Terminal panel */}
      {open && (
        <div className={`term-panel${closing ? ' term-panel--closing' : ''}`}>
          <div className="term-bar">
            <div className="term-dots">
              <span title="Minimize" />
              <span title="Maximize" />
            </div>
            <span className="term-title">
              <span>siddartho</span>@portfolio:~
            </span>
            <button className="term-close" onClick={handleClose}>✕</button>
          </div>

          <div className="term-body" data-lenis-prevent>
            {history.map((line, i) => (
              <div key={i}>
                {line.type === 'input' ? (
                  <div className="term-line-input">
                    <span className="term-prompt">❯</span>
                    <span className="term-cmd">{line.content}</span>
                  </div>
                ) : (
                  <div className="term-out">{line.content}</div>
                )}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <form className="term-input-row" onSubmit={handleSubmit}>
            <span className="term-prompt">❯</span>
            <input
              ref={inputRef}
              className="term-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="type a command..."
              autoComplete="off"
              spellCheck={false}
            />
          </form>
        </div>
      )}
    </>
  );
}