"use client";

import * as React from "react";

type Theme = "light" | "dark";

export function ThemeToggle() {
  const [theme, setTheme] = React.useState<Theme>("light");

  React.useEffect(() => {
    setTheme(
      document.documentElement.dataset.theme === "dark" ? "dark" : "light",
    );
  }, []);

  function toggle() {
    const next: Theme = theme === "light" ? "dark" : "light";
    const root = document.documentElement;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    setTheme(next);
    root.dataset.theme = next;
    try {
      window.localStorage.setItem("rootpath-theme", next);
    } catch {}

    if (!reduce) {
      root.classList.add("theme-transition");
      window.setTimeout(() => root.classList.remove("theme-transition"), 240);
    }
  }

  const next = theme === "light" ? "dark" : "light";

  return (
    <button
      type="button"
      aria-label={`Switch to ${next} theme`}
      onClick={toggle}
      className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-md border border-border-strong px-3 font-mono text-xs text-muted-foreground outline-none transition-[background-color,border-color,color] duration-500 ease-out hover:border-accent/60 hover:bg-surface hover:text-foreground focus-visible:ring-2 focus-visible:ring-accent/70"
    >
      <span aria-hidden="true" className="text-accent">
        {theme === "light" ? "○" : "●"}
      </span>
      {theme}
    </button>
  );
}
