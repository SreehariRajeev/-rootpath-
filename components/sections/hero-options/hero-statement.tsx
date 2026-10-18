"use client";

import * as React from "react";
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

import { Magnetic } from "@/components/motion/magnetic";
import { Button } from "@/components/ui/button";
import { goToContact } from "@/lib/contact";
import { cn } from "@/lib/utils";

function delay(seconds: number) {
  return { "--load-delay": `${seconds}s` } as React.CSSProperties;
}

/** Words that rise out of their own masks, using the shared kinetic classes. */
function Words({ text, start, step = 0.08 }: { text: string; start: number; step?: number }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, index) => (
        <React.Fragment key={`${word}-${index}`}>
          <span className="kinetic-word">
            <span
              className="kinetic-inner"
              style={
                { "--kinetic-delay": `${start + index * step}s` } as React.CSSProperties
              }
            >
              {word}
            </span>
          </span>
          {index < words.length - 1 ? " " : null}
        </React.Fragment>
      ))}
    </>
  );
}

/** A highlighter stroke that wipes in behind a phrase. */
function Mark({
  children,
  tone,
  at,
}: {
  children: React.ReactNode;
  tone: "green" | "grey";
  at: number;
}) {
  return (
    <span
      className={cn("hl", tone === "green" ? "hl-green" : "hl-grey")}
      style={{ "--hl-delay": `${at}s` } as React.CSSProperties}
    >
      {children}
    </span>
  );
}

const stages = [
  { index: "01", label: "brief" },
  { index: "02", label: "architect" },
  { index: "03", label: "build" },
  { index: "04", label: "ship" },
  { index: "", label: "--beyond" },
] as const;

/** One straight path with evenly spaced stops; a signal runs along it and lights each stop. */
function LinearPath() {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const progress = useMotionValue(shouldReduceMotion ? 1 : 0);
  const [reached, setReached] = React.useState(shouldReduceMotion ? stages.length : 0);

  React.useEffect(() => {
    if (shouldReduceMotion) return;
    const controls = animate(progress, [0, 1], {
      duration: 4.2,
      delay: 1.6,
      ease: [0.65, 0, 0.35, 1],
      repeat: Infinity,
      repeatDelay: 1.4,
    });
    return () => controls.stop();
  }, [progress, shouldReduceMotion]);

  useMotionValueEvent(progress, "change", (value) => {
    const next = Math.floor(value * (stages.length - 1) + 0.02) + 1;
    setReached((current) => (current === next ? current : next));
  });

  const fill = useTransform(progress, [0, 1], [0, 1]);
  const left = useTransform(progress, (value) => `${value * 100}%`);

  return (
    <div
      className="load-in relative"
      style={delay(1.2)}
      role="img"
      aria-label="Every engagement follows one path: brief, architect, build, ship, then further."
    >
      <div className="relative mx-[10%]">
        <span className="absolute inset-x-0 top-[1.85rem] h-px bg-border-strong" />
        <motion.span
          style={{ scaleX: fill }}
          className="absolute inset-x-0 top-[1.85rem] h-[2px] -translate-y-[0.5px] origin-left bg-accent"
        />
        {!shouldReduceMotion ? (
          <motion.span
            style={{ left }}
            className="absolute top-[1.85rem] size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent"
          />
        ) : null}
      </div>
      <ol className="relative grid grid-cols-5">
        {stages.map((stage, index) => {
          const lit = index < reached;
          const last = index === stages.length - 1;
          return (
            <li key={stage.label} className="flex flex-col items-center text-center">
              <span className="h-4 font-mono text-[11px] tabular-nums text-muted-subtle">
                {stage.index}
              </span>
              <span
                className={cn(
                  "mt-2.5 grid size-[18px] place-items-center rounded-full border-2 bg-background transition-colors duration-300",
                  lit ? "border-accent" : "border-border-strong",
                  last && lit && "bg-accent",
                )}
              >
                <span
                  className={cn(
                    "size-1.5 rounded-full transition-[transform,background-color] duration-300",
                    lit ? "scale-100 bg-accent" : "scale-0 bg-border-strong",
                    last && lit && "bg-off-white",
                  )}
                />
              </span>
              <span
                className={cn(
                  "mt-3 font-mono text-xs transition-colors duration-300",
                  last ? "text-accent" : lit ? "text-foreground" : "text-muted-subtle",
                )}
              >
                {stage.label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/** Option B: a typographic statement, with one clean path underneath. */
export function HeroStatement() {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const sectionRef = React.useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0px", "-80px"]);
  const opacity = useTransform(scrollYProgress, [0.2, 0.8], [1, 0]);

  return (
    <section
      ref={sectionRef}
      id="top"
      aria-labelledby="hero-heading"
      // The navbar (58px in flow: 56px bar plus its 1px borders) and the hero fill 85% of the
      // viewport, so the Services band shows as exactly the bottom 15% of the first screen on
      // phones and desktops. svh keeps that share stable while a phone's browser bar shows.
      className="relative flex min-h-[calc(85svh-58px)] flex-col justify-center"
    >
      <motion.div
        style={shouldReduceMotion ? undefined : { y, opacity }}
        className="mx-auto w-full max-w-7xl px-6 py-6 sm:py-8 lg:px-10"
      >
        <p
          className="load-in font-display text-[clamp(1.05rem,min(1.75vw,2.6svh),1.6rem)] font-medium tracking-[-0.02em] text-foreground"
          style={delay(0.05)}
        >
          Web, mobile and cloud engineering,{" "}
          <span className="text-muted-subtle">from first brief to production.</span>
        </p>

        <h1
          id="hero-heading"
          className="mt-3 text-[clamp(2.4rem,min(7.4vw,10.5svh),7rem)] sm:mt-4 font-medium leading-[1.04] tracking-[-0.045em] text-foreground"
        >
          <span className="block">
            <Words text="Small team." start={0.15} />
          </span>
          <span className="block">
            <Mark tone="green" at={0.9}>
              <Words text="Direct access." start={0.35} />
            </Mark>
          </span>
          <span className="block">
            <Mark tone="grey" at={1.1}>
              <Words text="Faster decisions." start={0.55} />
            </Mark>
          </span>
        </h1>

        <div className="mt-7 grid gap-8 sm:mt-10 lg:mt-[min(3rem,5svh)] lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-end lg:gap-16">
          <div>
            <p
              className="load-in max-w-lg text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8"
              style={delay(0.9)}
            >
              You work directly with the designers and engineers building your
              product, with no account layer in between.
            </p>
            <div
              className="load-in mt-6 flex flex-wrap items-center gap-3 sm:mt-8 sm:gap-4"
              style={delay(1.05)}
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
                href="#process"
                className="inline-flex h-12 items-center gap-2.5 rounded-lg border border-border-strong bg-surface-elevated px-5 text-sm font-medium text-foreground outline-none transition-colors hover:border-accent/50 focus-visible:ring-2 focus-visible:ring-accent/60"
              >
                <span className="grid size-5 place-items-center rounded-full bg-brand-green-light/60 font-mono text-[10px] text-brand-green-dark">
                  ▹
                </span>
                See how we work
              </a>
            </div>
          </div>
          <div className="hidden lg:block">
            <LinearPath />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
