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
import {
  RoutePipeline,
  routeServices,
} from "@/components/sections/hero-options/route-pipeline";
import { Button } from "@/components/ui/button";
import { goToContact } from "@/lib/contact";

const CYCLE_MS = 3600;

function delay(seconds: number) {
  return { "--load-delay": `${seconds}s` } as React.CSSProperties;
}

/** Option A: headline and command on top, one clean horizontal route below. */
export function HeroRoute() {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const sectionRef = React.useRef<HTMLElement>(null);
  const [active, setActive] = React.useState(0);
  const [cycle, setCycle] = React.useState(0);
  const [ready, setReady] = React.useState(false);
  const [held, setHeld] = React.useState<number | null>(null);

  // The trunk draws in first; then a route lights up every few seconds.
  React.useEffect(() => {
    if (shouldReduceMotion) {
      setReady(true);
      return;
    }
    const start = window.setTimeout(() => setReady(true), 2100);
    return () => window.clearTimeout(start);
  }, [shouldReduceMotion]);

  React.useEffect(() => {
    if (!ready || shouldReduceMotion || held !== null) return;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % routeServices.length);
      setCycle((current) => current + 1);
    }, CYCLE_MS);
    return () => window.clearInterval(timer);
  }, [ready, shouldReduceMotion, held]);

  const hold = (index: number | null) => {
    setHeld(index);
    if (index !== null && index !== active) {
      setActive(index);
      setCycle((current) => current + 1);
    }
  };

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const copyY = useTransform(scrollYProgress, [0, 1], ["0px", "-70px"]);
  const copyOpacity = useTransform(scrollYProgress, [0.2, 0.75], [1, 0]);
  const routeY = useTransform(scrollYProgress, [0, 1], ["0px", "-30px"]);

  const service = routeServices[active];
  const command = `start ${service.flag}`;

  return (
    <section
      ref={sectionRef}
      id="top"
      aria-labelledby="hero-heading"
      // Shorter than the viewport, so the Services band shows below and grows as you scroll.
      className="relative flex flex-col justify-between lg:min-h-[calc(100svh-9.5rem)]"
    >
      <motion.div
        style={
          shouldReduceMotion ? undefined : { y: copyY, opacity: copyOpacity }
        }
        className="mx-auto grid w-full max-w-7xl gap-10 px-6 pt-14 sm:pt-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-end lg:gap-16 lg:px-10 lg:pt-12"
      >
        <div>
          <p
            className="load-in mb-7 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.16em] text-muted-subtle"
            style={delay(0.05)}
          >
            <span className="font-display text-base font-semibold tracking-[0.22em] text-foreground">
              ROOT-PATH
            </span>
            <span className="h-px w-6 bg-border-strong" />
            digital engineering
          </p>
          <h1
            id="hero-heading"
            className="text-[clamp(2.6rem,4.6vw,4.6rem)] font-medium leading-[0.98] tracking-[-0.035em] text-foreground"
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
        </div>

        <div className="lg:pb-1.5">
          <p
            className="load-in max-w-lg text-base leading-7 text-muted-foreground sm:text-[1.05rem] sm:leading-7"
            style={delay(0.5)}
          >
            Web, mobile and cloud engineering from one senior team. You work
            directly with the people who design, build and ship your product.
          </p>

          <div
            className="load-in mt-6 flex h-12 max-w-lg items-center gap-3 rounded-lg border border-border-strong bg-surface-elevated pl-2 pr-4 font-mono text-sm"
            style={delay(0.65)}
          >
            <span className="rounded-md bg-system-black px-2 py-1 text-[11px] font-semibold text-off-white">
              &gt;<span className="text-brand-green-light">_</span>rp
            </span>
            <span className="text-muted-subtle">$</span>
            <span className="sr-only">{command}</span>
            <span aria-hidden="true" className="flex items-center text-foreground">
              <span
                key={cycle}
                className="type-in"
                style={
                  {
                    "--chars": command.length,
                    "--type-delay": cycle === 0 ? "0.9s" : "0s",
                  } as React.CSSProperties
                }
              >
                {command}
              </span>
              <span className="cursor text-accent" />
            </span>
            <span className="ml-auto tabular-nums text-xs text-muted-subtle">
              {String(active + 1).padStart(2, "0")} / 04
            </span>
          </div>

          <div
            className="load-in mt-6 flex flex-wrap items-center gap-4"
            style={delay(0.8)}
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
              className="inline-flex h-12 items-center rounded-lg border border-border-strong bg-surface-elevated px-5 text-sm font-medium text-foreground outline-none transition-colors hover:border-accent/50 focus-visible:ring-2 focus-visible:ring-accent/60"
            >
              Explore services
            </a>
          </div>
        </div>
      </motion.div>

      <motion.div
        style={shouldReduceMotion ? undefined : { y: routeY }}
        className="mx-auto mt-12 hidden w-full max-w-7xl px-6 pb-12 lg:block lg:px-10"
      >
        <div style={delay(0.9)} className="load-in">
          <div className="mb-6 flex items-center justify-between border-t border-border pt-4 font-mono text-[11px] text-muted-subtle">
            <span>
              <span className="text-accent">~/</span>how-a-project-runs
            </span>
            <span>hover a service to trace its route</span>
          </div>
          <RoutePipeline
            active={active}
            cycle={cycle}
            ready={ready}
            still={shouldReduceMotion}
            onHover={hold}
          />
        </div>
      </motion.div>
    </section>
  );
}
