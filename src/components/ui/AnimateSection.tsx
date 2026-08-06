"use client";

import type { ReactNode } from "react";

import type { Variants } from "framer-motion";
import { motion, useReducedMotion } from "framer-motion";

import { stagger, popStagger, dropStagger, settle } from "@/lib/motion";
import { cn } from "@/lib/utils";

type AnimateSectionVariant = "fade" | "pop" | "drop" | "settle";

const CONTAINER_VARIANTS: Record<AnimateSectionVariant, Variants> = {
  fade: stagger,
  pop: popStagger,
  drop: dropStagger,
  // "settle" animates the container itself as one quiet block — no
  // stagger, no overshoot — rather than sequencing individual children.
  settle,
};

type AnimateSectionProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  /**
   * Which entrance choreography this section uses. Each section should get
   * a distinct feel rather than reusing "fade" everywhere:
   * - fade: default stagger fade+slide (existing behavior)
   * - pop: spring overshoot pop, for grids of small items (e.g. skill capsules)
   * - drop: heavier spring drop, for cards (e.g. project grid)
   * - settle: slow quiet fade, no overshoot — for closing sections (e.g. contact)
   */
  variant?: AnimateSectionVariant;
};

export default function AnimateSection({
  children,
  className,
  delay = 0,
  variant = "fade",
}: AnimateSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={cn(className)}
      variants={CONTAINER_VARIANTS[variant]}
      transition={{ delayChildren: delay }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {children}
    </motion.div>
  );
}
