"use client";

import { Bot, Leaf, FileText, Globe, RefreshCw, Smartphone, Wifi, Laptop, BadgeCheck, Mail, LayoutDashboard, Lock, Database } from "lucide-react";

const ACCENT = "#00e5ff";
const MUTED = "#5a6b7a";

const lineStyle = {
  position: "absolute" as const,
  inset: 0,
  width: "100%",
  height: "100%",
};

const iconWrap = (left: string, top: string) => ({
  position: "absolute" as const,
  left,
  top,
  transform: "translate(-50%, -50%)",
});

export default function ProjectIllustration({ slug }: { slug: string }) {
  switch (slug) {
    case "restaurant-robot":
      return (
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          <svg viewBox="0 0 100 100" style={lineStyle} preserveAspectRatio="none">
            <circle cx="30" cy="35" r="10" stroke={ACCENT} strokeWidth="0.6" fill="none" opacity="0.25" />
            <circle cx="30" cy="35" r="16" stroke={ACCENT} strokeWidth="0.6" fill="none" opacity="0.15" />
            <path d="M 34 42 Q 55 20, 74 50" stroke={ACCENT} strokeWidth="1" strokeDasharray="3 3" fill="none" opacity="0.6" />
          </svg>
          <div style={iconWrap("30%", "38%")}><Bot size={38} color={ACCENT} strokeWidth={1.5} /></div>
          <div style={{ ...iconWrap("74%", "52%"), width: 8, height: 8, borderRadius: "50%", background: ACCENT }} />
        </div>
      );
    case "green-computing-research":
      return (
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          <svg viewBox="0 0 100 100" style={lineStyle} preserveAspectRatio="none">
            <path d="M 38 50 L 62 50" stroke={ACCENT} strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
          </svg>
          <div style={iconWrap("32%", "48%")}><Leaf size={34} color={ACCENT} strokeWidth={1.5} /></div>
          <div style={iconWrap("68%", "48%")}><FileText size={34} color={MUTED} strokeWidth={1.5} /></div>
        </div>
      );
    case "ieee-template-crawler":
      return (
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          <svg viewBox="0 0 100 100" style={lineStyle} preserveAspectRatio="none">
            <path d="M 36 50 L 64 50" stroke={ACCENT} strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
            <path d="M 58 44 L 64 50 L 58 56" stroke={ACCENT} strokeWidth="1" fill="none" opacity="0.6" />
          </svg>
          <div style={iconWrap("30%", "48%")}><Globe size={34} color={MUTED} strokeWidth={1.5} /></div>
          <div style={iconWrap("70%", "48%")}><FileText size={34} color={ACCENT} strokeWidth={1.5} /></div>
          <div style={iconWrap("82%", "28%")}><RefreshCw size={16} color={ACCENT} strokeWidth={1.5} /></div>
        </div>
      );
    case "openshare":
      return (
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          <svg viewBox="0 0 100 100" style={lineStyle} preserveAspectRatio="none">
            <path d="M 34 52 L 66 52" stroke={ACCENT} strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
          </svg>
          <div style={iconWrap("28%", "50%")}><Smartphone size={32} color={MUTED} strokeWidth={1.5} /></div>
          <div style={iconWrap("72%", "50%")}><Laptop size={34} color={MUTED} strokeWidth={1.5} /></div>
          <div style={iconWrap("50%", "24%")}><Wifi size={20} color={ACCENT} strokeWidth={1.5} /></div>
        </div>
      );
    case "assistive-touch":
      return (
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          <svg viewBox="0 0 100 100" style={lineStyle} preserveAspectRatio="none">
            <circle cx="66" cy="34" r="9" stroke={ACCENT} strokeWidth="0.8" fill="none" opacity="0.3" />
            <circle cx="66" cy="34" r="14" stroke={ACCENT} strokeWidth="0.8" fill="none" opacity="0.18" />
          </svg>
          <div style={iconWrap("42%", "55%")}><Smartphone size={40} color={MUTED} strokeWidth={1.5} /></div>
          <div style={{ ...iconWrap("66%", "34%"), width: 14, height: 14, borderRadius: "50%", background: ACCENT }} />
        </div>
      );
    case "bdletter":
      return (
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          <svg viewBox="0 0 100 100" style={lineStyle} preserveAspectRatio="none">
            <path d="M 32 50 L 68 50" stroke={ACCENT} strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
          </svg>
          <div style={iconWrap("26%", "48%")}><Mail size={32} color={MUTED} strokeWidth={1.5} /></div>
          <div style={iconWrap("52%", "48%")}><FileText size={32} color={ACCENT} strokeWidth={1.5} /></div>
          <div style={iconWrap("78%", "34%")}><BadgeCheck size={18} color={ACCENT} strokeWidth={1.5} /></div>
        </div>
      );
    case "portfolio-cms":
      return (
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          <svg viewBox="0 0 100 100" style={lineStyle} preserveAspectRatio="none">
            <path d="M 38 50 L 62 50" stroke={ACCENT} strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
          </svg>
          <div style={iconWrap("30%", "48%")}><LayoutDashboard size={34} color={ACCENT} strokeWidth={1.5} /></div>
          <div style={iconWrap("70%", "48%")}><Database size={30} color={MUTED} strokeWidth={1.5} /></div>
          <div style={iconWrap("50%", "24%")}><Lock size={16} color={ACCENT} strokeWidth={1.5} /></div>
        </div>
      );
    default:
      return null;
  }
}
