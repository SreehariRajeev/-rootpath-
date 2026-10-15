"use client";

import * as React from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

import { KineticText } from "@/components/motion/kinetic-text";
import { Magnetic } from "@/components/motion/magnetic";
import { SystemMap } from "@/components/sections/hero-system-map";
import { Button } from "@/components/ui/button";
import { goToContact } from "@/lib/contact";

const command = "> start --build --beyond";

function delay(seconds: number) {
  return { "--load-delay": `${seconds}s` } as React.CSSProperties;
}

export function Hero() {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const sectionRef = React.useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // As the hero leaves: the grid drifts down, the copy lifts and fades, the map rises
  // slower than the copy so the two separate in depth.
  const gridY = useTransform(scrollYProgress, [0, 1], ["0px", "140px"]);
  const copyY = useTransform(scrollYProgress, [0, 1], ["0px", "-90px"]);
  const copyOpacity = useTransform(scrollYProgress, [0.25, 0.85], [1, 0]);
  const mapY = useTransform(scrollYProgress, [0, 1], ["0px", "-40px"]);
  const mapOpacity = useTransform(scrollYProgress, [0.4, 1], [1, 0.2]);

  return (
    <section
      ref={sectionRef}
      id="top"
      aria-labelledby="hero-heading"
      className="relative overflow-hidden border-b border-border"
    >
      <motion.div
        aria-hidden="true"
        style={shouldReduceMotion ? undefined : { y: gridY }}
        className="grid-motif pointer-events-none absolute inset-x-0 -top-32 bottom-0"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 pb-28 pt-16 sm:pt-20 lg:min-h-[calc(100svh-5.5rem)] lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:gap-12 lg:px-10 lg:pb-32 lg:pt-12">
        <motion.div
          style={
            shouldReduceMotion ? undefined : { y: copyY, opacity: copyOpacity }
          }
        >
          <p
            className="load-in mb-8 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.16em] text-accent"
            style={delay(0.05)}
          >
            <span
              aria-hidden="true"
              className="size-[7px] rounded-full bg-brand-green ring-4 ring-brand-green/25"
            />
            <span className="font-display text-base font-semibold tracking-[0.22em] text-foreground sm:text-lg">
              ROOT-PATH
            </span>
            <span className="hidden text-muted-subtle sm:inline">
              / digital engineering
            </span>
          </p>

          <h1
            id="hero-heading"
            className="text-[clamp(2.6rem,4.7vw,4.75rem)] font-medium leading-[0.95] tracking-[-0.035em] text-foreground"
          >
            <KineticText
              delay={0.15}
              lines={[
                { text: "Small team." },
                { text: "Direct access." },
                { text: "Faster decisions.", className: "text-accent" },
              ]}
            />
          </h1>

          <p
            className="load-in mt-8 max-w-lg text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8"
            style={delay(0.55)}
          >
            Web, mobile and cloud engineering from one senior team: design,
            frontend, backend and engineering management. You work directly
            with the people who design, build and ship your product.
          </p>

          <p className="mt-6 font-mono text-sm text-accent sm:text-base">
            <span className="sr-only">{command}</span>
            <span
              aria-hidden="true"
              className="type-in"
              style={
                {
                  "--chars": command.length,
                  "--type-delay": "0.9s",
                } as React.CSSProperties
              }
            >
              {command}
            </span>
            <span aria-hidden="true" className="cursor" />
          </p>

          <div
            className="load-in mt-10 flex flex-col items-start gap-6 sm:flex-row sm:items-center"
            style={delay(0.75)}
          >
            <Magnetic>
              <Button size="lg" onClick={() => goToContact()}>
                Start a project
                <span
                  aria-hidden="true"
                  className="transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-x-1"
                >
                  →
                </span>
              </Button>
            </Magnetic>
            <a
              href="#services"
              className="group inline-flex items-center gap-2 bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-1 text-sm font-medium text-foreground outline-none transition-[background-size] duration-500 ease-[var(--ease-out)] hover:bg-[length:100%_1px] focus-visible:bg-[length:100%_1px]"
            >
              Explore services
              <span
                aria-hidden="true"
                className="text-muted-foreground transition-[color,transform] duration-500 ease-[var(--ease-out)] group-hover:translate-x-1 group-hover:text-accent"
              >
                →
              </span>
            </a>
          </div>
        </motion.div>

        <motion.div
          role="group"
          aria-label="How a Root-Path project connects: from the root of the problem, through each service, to the outcome"
          style={
            shouldReduceMotion ? undefined : { y: mapY, opacity: mapOpacity }
          }
        >
          <SystemMap scrollProgress={scrollYProgress} />
        </motion.div>
      </div>

      <a
        href="#services"
        className="load-in absolute bottom-8 left-1/2 hidden -translate-x-1/2 items-center gap-3 font-mono text-xs tracking-[0.04em] text-muted-subtle outline-none transition-colors hover:text-accent focus-visible:text-accent lg:flex"
        style={delay(1.6)}
      >
        <span className="relative h-8 w-px overflow-hidden bg-border-strong">
          <span className="scroll-cue-line absolute inset-0 bg-accent" />
        </span>
        cd ./services
      </a>
    </section>
  );
}
