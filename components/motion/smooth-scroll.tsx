"use client";

import * as React from "react";
import Lenis from "lenis";

import { scrollToElement, setLenis } from "@/lib/smooth-scroll";

/**
 * Inertial wheel scrolling for the whole page. It drives the native scroll position, so
 * `useScroll` and IntersectionObserver keep working. Touch keeps the platform's own scrolling,
 * and the effect is skipped entirely for visitors who prefer reduced motion.
 */
export function SmoothScroll() {
  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ autoRaf: true, lerp: 0.09 });
    setLenis(lenis);

    // In-page links glide to their section instead of jumping.
    const handleClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }
      const link = (event.target as Element | null)?.closest?.('a[href^="#"]');
      const id = link?.getAttribute("href")?.slice(1);
      const target = id ? document.getElementById(id) : null;
      if (!target) return;

      event.preventDefault();
      scrollToElement(target);
      window.history.replaceState(null, "", `#${id}`);
    };
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
      setLenis(null);
      lenis.destroy();
    };
  }, []);

  return null;
}
