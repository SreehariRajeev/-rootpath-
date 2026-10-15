"use client";

import * as React from "react";

import { scrollToElement, setLenis } from "@/lib/smooth-scroll";

/**
 * Inertial wheel scrolling for the whole page. It drives the native scroll position, so
 * `useScroll` and IntersectionObserver keep working. Touch keeps the platform's own scrolling,
 * and the effect is skipped entirely for visitors who prefer reduced motion. The library loads
 * after hydration, so it stays out of the initial bundle; until then the browser scrolls natively.
 */
export function SmoothScroll() {
  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let teardown: (() => void) | undefined;

    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;

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
        const link = (event.target as Element | null)?.closest?.(
          'a[href^="#"]',
        );
        const id = link?.getAttribute("href")?.slice(1);
        const target = id ? document.getElementById(id) : null;
        if (!target) return;

        event.preventDefault();
        scrollToElement(target);
        window.history.replaceState(null, "", `#${id}`);
      };
      document.addEventListener("click", handleClick);

      teardown = () => {
        document.removeEventListener("click", handleClick);
        setLenis(null);
        lenis.destroy();
      };
    });

    return () => {
      cancelled = true;
      teardown?.();
    };
  }, []);

  return null;
}
