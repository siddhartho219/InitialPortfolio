"use client";

import { useEffect, useRef, useState } from "react";

/** Served from public/audio/ — source: Desktop bgm-lofi.mp3 */
const MUSIC_URL = "/audio/bgm-lofi.mp3";

const INITIAL_VOLUME = 0.2;

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [volume, setVolume] = useState(20);
  const [hasUrl] = useState(Boolean(MUSIC_URL.trim()));

  useEffect(() => {
    const audio = new Audio();
    audio.loop = true;
    audio.volume = INITIAL_VOLUME;
    audioRef.current = audio;

    if (!hasUrl) {
      return () => {
        audio.pause();
        audio.src = "";
        audioRef.current = null;
      };
    }

    audio.src = MUSIC_URL;

    const tryPlay = () => {
      void audio.play().catch(() => {});
    };

    tryPlay();

    const unlock = () => {
      tryPlay();
    };

    document.addEventListener("click", unlock, { once: true });
    document.addEventListener("touchstart", unlock, { once: true, passive: true });
    document.addEventListener("mousemove", unlock, { once: true, passive: true });

    return () => {
      document.removeEventListener("click", unlock);
      document.removeEventListener("touchstart", unlock);
      document.removeEventListener("mousemove", unlock);
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, [hasUrl]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !hasUrl) return;

    if (playing) {
      void audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [playing, hasUrl]);

  const togglePlay = () => {
    if (!hasUrl) return;
    setPlaying((p) => !p);
  };

  const togglePanel = () => {
    setPanelOpen((open) => !open);
  };

  const onVolumeChange = (value: number) => {
    setVolume(value);
    if (audioRef.current) {
      audioRef.current.volume = value / 100;
    }
  };

  return (
    <>
      <style>{`
        @keyframes music-pulse {
          0%,
          100% {
            box-shadow: 0 0 0 0 color-mix(in srgb, var(--accent) 35%, transparent);
          }
          50% {
            box-shadow: 0 0 0 10px transparent;
          }
        }
        @keyframes music-fade-up {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes vinyl-spin {
          to {
            transform: rotate(360deg);
          }
        }
        .music-player {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          z-index: 200;
        }
        .music-player__controls {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }
        .music-player__chevron,
        .music-player__btn {
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--surface);
          backdrop-filter: blur(20px);
          cursor: pointer;
          transition:
            border-color 0.2s ease,
            color 0.2s ease,
            box-shadow 0.2s ease,
            transform 0.2s ease;
        }
        .music-player__chevron {
          width: 32px;
          height: 32px;
          border: 1px solid var(--border);
          color: var(--text-m);
          font-size: 0.65rem;
          line-height: 1;
        }
        .music-player__chevron:hover {
          border-color: var(--border-h);
          color: var(--text-s);
          box-shadow: 0 0 14px color-mix(in srgb, var(--accent) 12%, transparent);
        }
        .music-player__chevron:focus-visible,
        .music-player__btn:focus-visible {
          outline: 2px solid color-mix(in srgb, var(--accent) 70%, transparent);
          outline-offset: 3px;
        }
        .music-player__chevron--open {
          transform: rotate(180deg);
        }
        .music-player__btn {
          width: 44px;
          height: 44px;
          border: 1px solid var(--border);
          color: var(--text-m);
          font-size: 1.1rem;
        }
        .music-player__btn:hover {
          color: var(--accent);
          border-color: color-mix(in srgb, var(--accent) 45%, transparent);
          transform: scale(1.07);
          box-shadow: 0 0 20px color-mix(in srgb, var(--accent) 18%, transparent);
        }
        .music-player__btn:active {
          transform: scale(0.96);
        }
        .music-player__btn--playing {
          color: var(--accent);
          border-color: color-mix(in srgb, var(--accent) 25%, transparent);
          animation: music-pulse 2.5s ease-in-out infinite;
        }
        .music-player__panel {
          position: absolute;
          right: 0;
          bottom: 5.5rem;
          width: 210px;
          padding: 0.9rem 1.1rem;
          background: color-mix(in srgb, var(--bg) 96%, transparent);
          border: 1px solid var(--border);
          border-radius: 14px;
          backdrop-filter: blur(30px);
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          transform: translateY(8px);
          transition:
            opacity 0.25s ease,
            transform 0.25s ease,
            visibility 0.25s ease;
        }
        .music-player__panel--open {
          opacity: 1;
          visibility: visible;
          pointer-events: auto;
          animation: music-fade-up 0.25s ease forwards;
        }
        .music-player__status {
          font-family: var(--fm);
          font-size: 10px;
          color: var(--text-m);
          margin: 0 0 0.65rem;
        }
        .music-player__row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .music-player__vinyl {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          flex-shrink: 0;
          background: conic-gradient(
            from 0deg,
            #111 0deg,
            #1e1e3f 120deg,
            #111 240deg,
            #1e1e3f 360deg
          );
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .music-player__vinyl--spin {
          animation: vinyl-spin 3s linear infinite;
        }
        .music-player__vinyl--paused {
          animation-play-state: paused;
        }
        .music-player__vinyl-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--accent);
        }
        .music-player__meta {
          min-width: 0;
        }
        .music-player__track {
          font-family: var(--fb);
          font-size: 12px;
          font-weight: 600;
          color: var(--text);
          margin: 0;
          line-height: 1.3;
        }
        .music-player__artist {
          font-family: var(--fm);
          font-size: 10px;
          color: var(--text-m);
          margin: 0.15rem 0 0;
        }
        .music-player__hint {
          font-family: var(--fm);
          font-size: 10px;
          color: var(--text-m);
          margin: 0;
          line-height: 1.4;
        }
        .music-player__volume {
          margin-top: 0.85rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .music-player__range {
          flex: 1;
          accent-color: var(--accent);
          height: 4px;
          cursor: pointer;
        }
        .music-player__vol-label {
          font-family: var(--fm);
          font-size: 10px;
          color: var(--text-s);
          min-width: 2rem;
          text-align: right;
        }
        @media (prefers-reduced-motion: reduce) {
          .music-player__vinyl--spin {
            animation: none;
          }
          .music-player__btn--playing {
            animation: none;
          }
          .music-player__btn:hover,
          .music-player__btn:active {
            transform: none;
          }
        }
      `}</style>

      <div className="music-player">
        <div
          className={`music-player__panel${panelOpen ? " music-player__panel--open" : ""}`}
          role="region"
          aria-label="Music player"
        >
          {hasUrl ? (
            <>
              <p className="music-player__status">
                {playing ? "Now playing" : "Paused"}
              </p>
              <div className="music-player__row">
                <div
                  className={`music-player__vinyl music-player__vinyl--spin${playing ? "" : " music-player__vinyl--paused"}`}
                  aria-hidden="true"
                >
                  <span className="music-player__vinyl-dot" />
                </div>
                <div className="music-player__meta">
                  <p className="music-player__track">Ambient Focus</p>
                  <p className="music-player__artist">Lo-fi · Cyberpunk Drift</p>
                </div>
              </div>
              <div className="music-player__volume">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={volume}
                  onChange={(e) => onVolumeChange(Number(e.target.value))}
                  className="music-player__range"
                  aria-label="Volume"
                />
                <span className="music-player__vol-label">{volume}%</span>
              </div>
            </>
          ) : (
            <p className="music-player__hint">add .mp3 url in code</p>
          )}
        </div>

        <div className="music-player__controls">
          <button
            type="button"
            className={`music-player__chevron${panelOpen ? " music-player__chevron--open" : ""}`}
            onClick={togglePanel}
            aria-label={panelOpen ? "Close music panel" : "Open music panel"}
            aria-expanded={panelOpen}
          >
            ▾
          </button>
          <button
            type="button"
            className={`music-player__btn${playing ? " music-player__btn--playing" : ""}`}
            onClick={togglePlay}
            aria-label={playing ? "Pause music" : "Play music"}
          >
            ♪
          </button>
        </div>
      </div>
    </>
  );
}
