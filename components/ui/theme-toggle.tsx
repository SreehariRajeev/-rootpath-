"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

type Theme = "light" | "dark";

const spring = {
  type: "spring" as const,
  stiffness: 340,
  damping: 26,
  mass: 0.65,
};

export function ThemeToggle() {
  const [theme, setTheme] = React.useState<Theme>("light");
  const shouldReduceMotion = useReducedMotion() ?? false;

  React.useEffect(() => {
    const storedTheme = window.localStorage.getItem("rootpath-theme");
    const nextTheme: Theme = storedTheme === "dark" ? "dark" : "light";

    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
  }, []);

  function selectTheme(nextTheme: Theme) {
    if (nextTheme === theme) return;

    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem("rootpath-theme", nextTheme);

    if (!shouldReduceMotion) {
      document.documentElement.classList.add("theme-transition");
      window.setTimeout(() => {
        document.documentElement.classList.remove("theme-transition");
      }, 240);
    }
  }

  const nextTheme = theme === "light" ? "dark" : "light";

  return (
    <button
      type="button"
      aria-label={`Switch to ${nextTheme} theme`}
      onClick={() => selectTheme(nextTheme)}
      className="fixed bottom-4 right-4 z-50 grid size-10 cursor-pointer place-items-center rounded-full border border-border-strong bg-surface/90 text-foreground shadow-[0_8px_24px_rgb(var(--shadow-rgb)/0.12)] outline-none backdrop-blur-md transition-[background-color,border-color,color,box-shadow,transform] duration-500 ease-out hover:bg-surface-elevated active:scale-[0.96] focus-visible:ring-2 focus-visible:ring-accent/70 sm:bottom-5 sm:right-5"
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.span
          key={theme}
          aria-hidden="true"
          initial={shouldReduceMotion ? false : { opacity: 0, transform: "scale(0.75) rotate(-12deg)" }}
          animate={{ opacity: 1, transform: "scale(1) rotate(0deg)" }}
          exit={shouldReduceMotion ? undefined : { opacity: 0, transform: "scale(0.75) rotate(12deg)" }}
          transition={shouldReduceMotion ? { duration: 0 } : spring}
        >
          {theme === "light" ? (
            <span className="block size-4 rounded-full border-[1.5px] border-current" />
          ) : (
            <span className="relative block size-4 overflow-hidden rounded-full bg-current after:absolute after:-right-1 after:-top-1 after:size-4 after:rounded-full after:bg-surface/90" />
          )}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
