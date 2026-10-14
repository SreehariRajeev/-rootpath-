"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";

type Theme = "light" | "dark";

const spring = {
  type: "spring" as const,
  stiffness: 260,
  damping: 22,
  mass: 0.8,
};

const rays = [0, 45, 90, 135, 180, 225, 270, 315];

/** Sun and moon share one glyph: the core grows into a sun while a mask disc slides away and the rays rotate in. */
export function ThemeToggle() {
  const [theme, setTheme] = React.useState<Theme>("light");
  const shouldReduceMotion = useReducedMotion() ?? false;
  const maskId = React.useId();

  React.useEffect(() => {
    setTheme(
      document.documentElement.dataset.theme === "dark" ? "dark" : "light",
    );
  }, []);

  function toggle() {
    const next: Theme = theme === "light" ? "dark" : "light";
    const root = document.documentElement;

    setTheme(next);
    root.dataset.theme = next;
    try {
      window.localStorage.setItem("rootpath-theme", next);
    } catch {}

    if (!shouldReduceMotion) {
      root.classList.add("theme-transition");
      window.setTimeout(() => root.classList.remove("theme-transition"), 240);
    }
  }

  const isDark = theme === "dark";
  const transition = shouldReduceMotion ? { duration: 0 } : spring;

  return (
    <button
      type="button"
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      aria-pressed={isDark}
      onClick={toggle}
      className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-md text-foreground outline-none transition-[background-color,transform] duration-500 ease-out hover:bg-surface active:scale-[0.92] focus-visible:ring-2 focus-visible:ring-accent/70"
    >
      <motion.svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="size-[1.15rem]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        initial={false}
        animate={{ transform: isDark ? "rotate(40deg)" : "rotate(90deg)" }}
        transition={transition}
      >
        <mask id={maskId}>
          <rect x="0" y="0" width="24" height="24" fill="white" />
          <motion.circle
            r="8"
            fill="black"
            initial={false}
            animate={{ cx: isDark ? 17 : 32, cy: isDark ? 6.5 : 0 }}
            transition={transition}
          />
        </mask>
        <motion.circle
          cx="12"
          cy="12"
          fill="currentColor"
          stroke="none"
          mask={`url(#${maskId})`}
          initial={false}
          animate={{ r: isDark ? 9 : 4.75 }}
          transition={transition}
        />
        <motion.g
          initial={false}
          animate={{
            opacity: isDark ? 0 : 1,
            transform: isDark ? "scale(0.4)" : "scale(1)",
          }}
          style={{ transformOrigin: "12px 12px" }}
          transition={transition}
        >
          {rays.map((angle) => (
            <line
              key={angle}
              x1="12"
              y1="2"
              x2="12"
              y2="4.25"
              transform={`rotate(${angle} 12 12)`}
            />
          ))}
        </motion.g>
      </motion.svg>
    </button>
  );
}
