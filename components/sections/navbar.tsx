"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { Button } from "@/components/ui/button";
import { contactHref } from "@/lib/contact";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "mailto:connect@root-path.tech" },
] as const;

const spring = {
  type: "spring" as const,
  stiffness: 320,
  damping: 24,
  mass: 0.7,
};

export function Navbar() {
  const [hoveredItem, setHoveredItem] = React.useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [mobileShellOpen, setMobileShellOpen] = React.useState(false);
  const shouldReduceMotion = useReducedMotion() ?? false;

  const closeMobileMenu = () => setMobileOpen(false);
  const toggleMobileMenu = () => {
    setMobileOpen((open) => {
      const nextOpen = !open;
      if (nextOpen) setMobileShellOpen(true);
      return nextOpen;
    });
  };

  return (
    <header className="sticky top-4 z-40 mx-4 sm:mx-6 lg:mx-auto lg:max-w-7xl">
      <div
        className={cn(
          "relative rounded-lg border border-border-strong/70 bg-surface-elevated/80 shadow-[0_12px_36px_rgb(var(--shadow-rgb)/0.08)] backdrop-blur-xl",
          mobileShellOpen && "rounded-b-none border-b-0",
        )}
      >
        <div className="flex h-14 items-center justify-between px-3 sm:px-4">
          <a
            href="#top"
            aria-label="RootPath home"
            className="group inline-flex items-center font-mono text-base font-semibold tracking-[0.02em] text-foreground sm:text-[17px]"
          >
            &gt;<span className="text-accent">_</span>rp
          </a>

          <nav
            aria-label="Primary navigation"
            onMouseLeave={() => setHoveredItem(null)}
            className="hidden items-center gap-1 md:flex"
          >
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onMouseEnter={() => setHoveredItem(item.label)}
                onFocus={() => setHoveredItem(item.label)}
                onBlur={() => setHoveredItem(null)}
                className="relative rounded-md px-3 py-2 text-sm text-muted-foreground outline-none transition-colors duration-500 hover:text-foreground focus-visible:ring-2 focus-visible:ring-accent/70"
              >
                {hoveredItem === item.label ? (
                  <motion.span
                    layoutId="nav-hover-surface"
                    className="absolute inset-0 rounded-md bg-surface"
                    transition={shouldReduceMotion ? { duration: 0 } : spring}
                  />
                ) : null}
                <span className="relative z-10">{item.label}</span>
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => {
                window.location.href = contactHref;
              }}
              className="hidden md:inline-flex"
            >
              Start a project
            </Button>
            <button
              type="button"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
              onClick={toggleMobileMenu}
              className="relative z-10 inline-flex cursor-pointer rounded-md border border-border-strong px-3.5 py-2 text-xs font-medium text-foreground outline-none transition-[background-color,transform] duration-500 ease-out hover:bg-surface active:scale-[0.96] focus-visible:ring-2 focus-visible:ring-accent/70 md:hidden"
            >
              {mobileOpen ? "Close" : "Menu"}
            </button>
          </div>
        </div>

        <AnimatePresence
          initial={false}
          onExitComplete={() => setMobileShellOpen(false)}
        >
          {mobileOpen ? (
            <motion.nav
              id="mobile-navigation"
              key="mobile-navigation"
              aria-label="Mobile navigation"
              initial={
                shouldReduceMotion
                  ? false
                  : {
                      transform: "translateY(-6px)",
                      clipPath: "inset(0 0 100% 0)",
                    }
              }
              animate={{
                transform: "translateY(0)",
                clipPath: "inset(0 0 0% 0)",
              }}
              exit={
                shouldReduceMotion
                  ? undefined
                  : {
                      transform: "translateY(-6px)",
                      clipPath: "inset(0 0 100% 0)",
                    }
              }
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { duration: 0.5, ease: [0.23, 1, 0.32, 1] }
              }
              style={{ transformOrigin: "top" }}
              className="absolute -left-px -right-px top-[calc(100%-1px)] z-50 rounded-b-lg border-x border-b border-border-strong/70 bg-surface-elevated px-3 pb-3 pt-2 shadow-[0_12px_36px_rgb(var(--shadow-rgb)/0.08)] backdrop-blur-xl will-change-[clip-path,transform] md:hidden"
            >
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className="block rounded-md px-3 py-2.5 text-sm text-muted-foreground outline-none transition-colors duration-500 hover:bg-surface hover:text-foreground focus-visible:ring-2 focus-visible:ring-accent/70"
                >
                  {item.label}
                </a>
              ))}
              <Button
                size="default"
                onClick={() => {
                  closeMobileMenu();
                  window.location.href = contactHref;
                }}
                className="mt-2 w-full"
              >
                Start a project
              </Button>
            </motion.nav>
          ) : null}
        </AnimatePresence>
      </div>
    </header>
  );
}
