import type { Variants } from "framer-motion";

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
};

// Per-section entrance variants — each section gets a distinct arrival
// instead of reusing the same fade for everything.

// Skills: capsules pop with a spring overshoot, reads as "assembling"
export const pop: Variants = {
  hidden: { opacity: 0, scale: 0.6 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 340, damping: 18 },
  },
};

export const popStagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, staggerDirection: 1 } },
};

// Projects: cards drop in with a slight overshoot + settle
export const drop: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 20 },
  },
};

export const dropStagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

// Contact: quiet settle, no overshoot — reads as a resting point
export const settle: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: "easeOut" } },
};
