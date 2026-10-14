import type Lenis from "lenis";

let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
}

/** The active smooth-scroll instance, or null when it is off (reduced motion, before mount). */
export function getLenis() {
  return instance;
}

/**
 * Smoothly scrolls an element to the top of the viewport, below the sticky navbar
 * (`scroll-padding-top` on <html>). The target is computed from the live scroll position,
 * so it lands correctly even if something else moved the page a moment earlier.
 */
export function scrollToElement(element: HTMLElement) {
  const padding =
    Number.parseFloat(
      getComputedStyle(document.documentElement).scrollPaddingTop,
    ) || 0;
  const top = element.getBoundingClientRect().top + window.scrollY - padding;
  const lenis = getLenis();

  if (lenis) {
    lenis.scrollTo(top);
    return;
  }
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
}
