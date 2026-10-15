"use client";

import * as React from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";

import { GrowBand, GrowIn } from "@/components/motion/grow";
import { Magnetic } from "@/components/motion/magnetic";
import { useMediaQuery } from "@/components/motion/use-media-query";
import { services, type Service } from "@/components/sections/services/data";
import { SystemDiagram } from "@/components/sections/services/diagram";
import { Button } from "@/components/ui/button";
import { goToContact } from "@/lib/contact";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/utils";

const COUNT = services.length;
const FADE = 0.05;

/** Scroll window for step `index`: 0 before it, 1 while it is the active step, 0 after. */
function useStepWindow(
  progress: MotionValue<number>,
  index: number,
  [low, high]: [number, number],
) {
  const start = index / COUNT;
  const end = (index + 1) / COUNT;
  const first = index === 0;
  const last = index === COUNT - 1;
  return useTransform(
    progress,
    [
      first ? -1 : start - FADE,
      first ? 0 : start + FADE,
      last ? 1 : end - FADE,
      last ? 2 : end + FADE,
    ],
    [first ? high : low, high, high, last ? high : low],
  );
}

export function Services() {
  const stepsRef = React.useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const shouldReduceMotion = useReducedMotion() ?? false;
  const [active, setActive] = React.useState(0);

  // 0 when the first step reaches the middle of the viewport, 1 when the last one leaves it.
  const { scrollYProgress } = useScroll({
    target: stepsRef,
    offset: ["start center", "end center"],
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const next = Math.min(COUNT - 1, Math.max(0, Math.floor(value * COUNT)));
    setActive((current) => (current === next ? current : next));
  });

  return (
    <GrowBand>
      <section
        id="services"
        aria-labelledby="services-heading"
        className="relative mx-auto max-w-7xl px-6 pb-20 pt-24 sm:pt-28 lg:px-10 lg:pb-28 lg:pt-36"
      >
        <GrowIn offset={["start 95%", "start 40%"]}>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end lg:gap-16">
            <div>
              <p className="eyebrow">01 · Services</p>
              <h2
                id="services-heading"
                className="mt-5 text-4xl font-medium leading-[1.02] tracking-[-0.03em] text-foreground sm:text-5xl lg:text-[3.5rem]"
              >
                Focused digital services for teams ready to move.
              </h2>
            </div>
            <p className="max-w-md text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              Four routes from the root of the problem to a working result your
              team can own. Take one, or combine them.
            </p>
          </div>
        </GrowIn>

        <div className="mt-16 grid gap-14 lg:mt-20 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
          {/* Extra room below the last step keeps the stage pinned until it has been read. */}
          <div className="lg:pb-[22svh]">
            <div ref={stepsRef}>
              {services.map((service, index) => (
                <Step
                  key={service.id}
                  service={service}
                  index={index}
                  progress={scrollYProgress}
                  scrubbed={isDesktop && !shouldReduceMotion}
                />
              ))}
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-[5.5rem] h-[calc(100svh-7rem)] py-2">
              <Stage progress={scrollYProgress} active={active} />
            </div>
          </div>
        </div>

        <GrowIn offset={["start end", "start 70%"]}>
          <div className="mt-20 flex flex-col gap-6 border-t border-border pt-10 sm:flex-row sm:items-center sm:justify-between lg:mt-24">
            <div>
              <p className="font-mono text-sm text-accent">
                &gt; start --build --beyond
              </p>
              <p className="mt-3 max-w-md text-base leading-7 text-muted-foreground">
                Not sure which route fits? Tell us where you are and we will map
                the path with you.
              </p>
            </div>
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
          </div>
        </GrowIn>
      </section>
    </GrowBand>
  );
}

interface StepProps {
  service: Service;
  index: number;
  progress: MotionValue<number>;
  /** Desktop: emphasis follows the shared scroll progress and the stage shows the diagram. */
  scrubbed: boolean;
}

function Step({ service, index, progress, scrubbed }: StepProps) {
  const ref = React.useRef<HTMLElement>(null);
  const opacity = useStepWindow(progress, index, [0.28, 1]);
  const fill = useTransform(
    progress,
    [index / COUNT, (index + 1) / COUNT],
    [0, 1],
    { clamp: true },
  );

  // Mobile: each step draws its own diagram as it scrolls through.
  const { scrollYProgress: own } = useScroll({
    target: ref,
    offset: ["start 85%", "end 60%"],
  });

  return (
    <article
      ref={ref}
      id={`service-${service.id}`}
      aria-labelledby={`service-${service.id}-title`}
      className="relative scroll-mt-24 pl-6 lg:flex lg:min-h-[72svh] lg:items-center lg:pl-8"
    >
      {/* The path through the services: a rail that fills as each step is read. */}
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-px bg-border-strong"
      >
        <motion.span
          style={{ scaleY: scrubbed ? fill : 1 }}
          className="absolute inset-0 w-[2px] -translate-x-[0.5px] origin-top bg-accent"
        />
      </span>

      <motion.div
        style={scrubbed ? { opacity } : undefined}
        className="py-10 lg:py-0"
      >
        <p className="flex items-center gap-3 font-mono text-xs text-accent">
          <span>{String(index + 1).padStart(2, "0")}</span>
          <span className="h-px w-6 bg-accent/50" />
          <span>{service.path}</span>
        </p>
        <h3
          id={`service-${service.id}-title`}
          className="mt-5 text-3xl font-medium leading-[1.08] tracking-[-0.025em] text-foreground sm:text-4xl"
        >
          {service.title}
        </h3>
        <p className="mt-5 max-w-md text-base leading-7 text-muted-foreground">
          {service.description}
        </p>
        <div className="mt-7 flex max-w-md flex-wrap items-center gap-2">
          <span className="mr-1 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-subtle">
            Stack
          </span>
          <ul
            className="contents"
            aria-label={`${service.name} technology stack`}
          >
            {service.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-md border border-border-strong px-2.5 py-1 font-mono text-xs text-foreground/85 transition-colors duration-300 hover:border-accent/60 hover:text-accent"
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 max-w-md border-t border-border pt-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-subtle">
            How we work
          </p>
          <ul className="mt-3 space-y-2">
            {service.practices.map((practice) => (
              <li
                key={practice}
                className="flex gap-2.5 text-sm leading-6 text-foreground"
              >
                <span aria-hidden="true" className="font-mono text-accent">
                  ▹
                </span>
                {practice}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 rounded-xl border border-border bg-surface/40 p-4 sm:p-6 lg:hidden">
          <SystemDiagram
            definition={service.diagram}
            progress={own}
            className="aspect-[560/380] h-auto"
          />
        </div>
      </motion.div>
    </article>
  );
}

interface StageProps {
  progress: MotionValue<number>;
  active: number;
}

/** Pinned frame beside the steps that draws the active service's system diagram. */
function Stage({ progress, active }: StageProps) {
  const frameRef = React.useRef<HTMLDivElement>(null);
  const service = services[active];

  // Cursor-tracked light along the frame's border.
  const handleMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const frame = frameRef.current;
    if (!frame || event.pointerType !== "mouse") return;
    const bounds = frame.getBoundingClientRect();
    frame.style.setProperty("--mx", `${event.clientX - bounds.left}px`);
    frame.style.setProperty("--my", `${event.clientY - bounds.top}px`);
  };
  const handleLeave = () => {
    frameRef.current?.style.setProperty("--mx", "-999px");
    frameRef.current?.style.setProperty("--my", "-999px");
  };

  return (
    <div
      ref={frameRef}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className="relative flex h-full flex-col rounded-2xl border border-border bg-surface/50"
    >
      <span aria-hidden="true" className="border-light rounded-2xl" />

      <div className="flex items-center justify-between gap-6 border-b border-border px-6 py-4 font-mono text-xs">
        <div className="flex items-center gap-2 text-muted-subtle">
          <span>~/services</span>
          <span className="relative inline-grid overflow-hidden text-accent">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={service.id}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                exit={{ y: "-100%", opacity: 0 }}
                transition={{ duration: 0.35, ease }}
              >
                {service.path}
              </motion.span>
            </AnimatePresence>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-1.5" aria-hidden="true">
            {services.map((item, index) => (
              <StageTick key={item.id} index={index} progress={progress} />
            ))}
          </div>
          <span className="tabular-nums text-muted-subtle">
            {String(active + 1).padStart(2, "0")} /{" "}
            {String(COUNT).padStart(2, "0")}
          </span>
        </div>
      </div>

      <div className="relative min-h-0 flex-1">
        {services.map((item, index) => (
          <StageDiagram
            key={item.id}
            service={item}
            index={index}
            progress={progress}
            isActive={index === active}
          />
        ))}
      </div>

      <div className="border-t border-border px-6 py-4 font-mono text-[11px] text-muted-subtle">
        hover a node to trace its connections
      </div>
    </div>
  );
}

function StageTick({
  index,
  progress,
}: {
  index: number;
  progress: MotionValue<number>;
}) {
  const fill = useTransform(
    progress,
    [index / COUNT, (index + 1) / COUNT],
    [0, 1],
    { clamp: true },
  );
  return (
    <span className="relative h-[3px] w-7 overflow-hidden rounded-full bg-border-strong">
      <motion.span
        style={{ scaleX: fill }}
        className="absolute inset-0 origin-left bg-accent"
      />
    </span>
  );
}

function StageDiagram({
  service,
  index,
  progress,
  isActive,
}: {
  service: Service;
  index: number;
  progress: MotionValue<number>;
  isActive: boolean;
}) {
  const opacity = useStepWindow(progress, index, [0, 1]);
  const lift = useStepWindow(progress, index, [0, 1]);
  const y = useTransform(lift, [0, 1], [28, 0]);
  const scale = useTransform(lift, [0, 1], [0.97, 1]);
  // Draw as the step approaches the middle of the viewport, complete before it is centred.
  const draw = useTransform(
    progress,
    [(index - 0.15) / COUNT, (index + 0.55) / COUNT],
    [0, 1],
    { clamp: true },
  );

  return (
    <motion.div
      style={{ opacity, y, scale }}
      aria-hidden={!isActive}
      className={cn(
        "absolute inset-0 flex items-center justify-center p-8 xl:p-10",
        !isActive && "pointer-events-none",
      )}
    >
      <SystemDiagram
        definition={service.diagram}
        progress={draw}
        interactive={isActive}
        className="max-h-full"
      />
    </motion.div>
  );
}
