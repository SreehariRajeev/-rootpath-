"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

const hoverSpring = {
  type: "spring" as const,
  stiffness: 300,
  damping: 25,
  mass: 0.7,
};

interface CardProps {
  "aria-label"?: string;
  children: React.ReactNode;
  className?: string;
}

/** Structural card: a quiet lift and a green border on hover. No glow or gradient effects, per the brand book. */
export function Card({
  "aria-label": ariaLabel,
  children,
  className,
}: CardProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;

  return (
    <motion.article
      aria-label={ariaLabel}
      whileHover={
        shouldReduceMotion ? undefined : { transform: "translateY(-3px)" }
      }
      transition={hoverSpring}
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border bg-surface-elevated transition-colors duration-500 hover:border-accent/50",
        className,
      )}
    >
      {children}
    </motion.article>
  );
}
