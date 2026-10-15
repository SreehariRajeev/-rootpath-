import * as React from "react";

import { cn } from "@/lib/utils";

interface KineticLine {
  text: string;
  className?: string;
}

interface KineticTextProps {
  lines: KineticLine[];
  /** Seconds before the first word starts. */
  delay?: number;
  /** Seconds between consecutive words. */
  step?: number;
}

/**
 * Headline whose words rise out of a mask one after another on load. Pure CSS (see
 * `.kinetic-*` in globals.css), so it plays before hydration and stays still for reduced motion.
 */
export function KineticText({
  lines,
  delay = 0.1,
  step = 0.07,
}: KineticTextProps) {
  let index = 0;

  return (
    <>
      {lines.map((line, lineIndex) => (
        <React.Fragment key={line.text}>
          <span className={cn("block", line.className)}>
            {line.text.split(" ").map((word, wordIndex, words) => {
              const style = {
                "--kinetic-delay": `${delay + index++ * step}s`,
              } as React.CSSProperties;
              return (
                <React.Fragment key={`${word}-${wordIndex}`}>
                  <span className="kinetic-word">
                    <span className="kinetic-inner" style={style}>
                      {word}
                    </span>
                  </span>
                  {wordIndex < words.length - 1 ? " " : null}
                </React.Fragment>
              );
            })}
          </span>
          {/* Block spans collapse this space visually; text-only readers get "team. Direct". */}
          {lineIndex < lines.length - 1 ? " " : null}
        </React.Fragment>
      ))}
    </>
  );
}
