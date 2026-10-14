import type * as React from "react";

/**
 * Pointer handlers for `.border-light`: they keep `--mx` / `--my` on the hovered element in
 * sync with a mouse pointer, so the thin light follows the cursor along its border.
 */
export function trackPointerLight(event: React.PointerEvent<HTMLElement>) {
  if (event.pointerType !== "mouse") return;
  const element = event.currentTarget;
  const bounds = element.getBoundingClientRect();
  element.style.setProperty("--mx", `${event.clientX - bounds.left}px`);
  element.style.setProperty("--my", `${event.clientY - bounds.top}px`);
}

export function resetPointerLight(event: React.PointerEvent<HTMLElement>) {
  event.currentTarget.style.setProperty("--mx", "-999px");
  event.currentTarget.style.setProperty("--my", "-999px");
}
