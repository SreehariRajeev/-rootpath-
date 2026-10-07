"use client";

import * as React from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";

import { cn } from "@/lib/utils";

/** One easing and one distance for the whole site, so every section moves the same way. */
const ease = [0.22, 1, 0.36, 1] as const;

export const revealItem: Variants = {
  hidden: { opacity: 0, transform: "translateY(18px)" },
  visible: {
    opacity: 1,
    transform: "translateY(0)",
    transition: { duration: 0.7, ease },
  },
};

const group = (stagger: number, delay: number): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Seconds to wait before this element animates in. */
  delay?: number;
  /** Share of the element that must be visible before it animates. */
  amount?: number;
  as?: "div" | "section" | "header" | "aside" | "p" | "ul" | "li";
}

/** Fades and rises once as it enters the viewport. Children marked <RevealItem> stagger instead of animating alone. */
export function Reveal({
  children,
  className,
  delay = 0,
  amount = 0.25,
  as = "div",
  ...rest
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const Tag = motion[as] as typeof motion.div;

  return (
    <Tag
      initial={shouldReduceMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount, margin: "0px 0px -8% 0px" }}
      variants={revealItem}
      transition={{ delay }}
      className={className}
      {...(rest as object)}
    >
      {children}
    </Tag>
  );
}

interface StaggerProps extends React.HTMLAttributes<HTMLDivElement> {
  stagger?: number;
  delay?: number;
  amount?: number;
}

/** Container that reveals its <RevealItem> children one after another. */
export function Stagger({
  children,
  className,
  stagger = 0.09,
  delay = 0,
  amount = 0.15,
  ...rest
}: StaggerProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;

  return (
    <motion.div
      initial={shouldReduceMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount, margin: "0px 0px -8% 0px" }}
      variants={group(stagger, delay)}
      className={className}
      {...(rest as object)}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <motion.div
      variants={revealItem}
      className={cn(className)}
      {...(rest as object)}
    >
      {children}
    </motion.div>
  );
}
