"use client";

import * as React from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";

import { GrowIn } from "@/components/motion/grow";
import {
  resetPointerLight,
  trackPointerLight,
} from "@/components/motion/pointer-light";
import { useMediaQuery } from "@/components/motion/use-media-query";
import { pillars, type Pillar } from "@/components/sections/team/data";
import { cn } from "@/lib/utils";

export function Team() {
  const rowRef = React.useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion() ?? false;
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [hovered, setHovered] = React.useState<number | null>(null);

  // The foundation line draws first, then each pillar rises from it in turn.
  const { scrollYProgress } = useScroll({
    target: rowRef,
    offset: ["start 95%", "start 40%"],
  });
  const foundation = useTransform(scrollYProgress, [0, 0.35], [0, 1], {
    clamp: true,
  });

  return (
    <section
      id="team"
      aria-labelledby="team-heading"
      className="mx-auto max-w-7xl px-6 py-24 sm:py-28 lg:px-10 lg:py-36"
    >
      <GrowIn offset={["start 95%", "start 45%"]}>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end lg:gap-16">
          <div>
            <p className="eyebrow">02 · Team</p>
            <h2
              id="team-heading"
              className="mt-5 text-4xl font-medium leading-[1.02] tracking-[-0.03em] text-foreground sm:text-5xl lg:text-[3.5rem]"
            >
              Four pillars. One accountable team.
            </h2>
          </div>
          <p className="max-w-md text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            Senior practitioners in design, frontend, backend and engineering
            management work as one team on your product. You talk to them
            directly, not through an account layer.
          </p>
        </div>
      </GrowIn>

      <div className="relative mt-16 lg:mt-20">
        <div
          ref={rowRef}
          onPointerLeave={() => setHovered(null)}
          className="grid gap-3 md:grid-cols-2 lg:flex lg:gap-3"
        >
          {pillars.map((pillar, index) => (
            <PillarCard
              key={pillar.id}
              pillar={pillar}
              index={index}
              progress={scrollYProgress}
              rise={!shouldReduceMotion}
              expanded={isDesktop && hovered === index}
              compressed={isDesktop && hovered !== null && hovered !== index}
              onHover={() => setHovered(index)}
            />
          ))}
        </div>
        {/* Foundation the pillars stand on. */}
        <motion.span
          aria-hidden="true"
          style={shouldReduceMotion ? undefined : { scaleX: foundation }}
          className="mt-3 block h-px origin-left bg-accent/60"
        />
      </div>
    </section>
  );
}

interface PillarCardProps {
  pillar: Pillar;
  index: number;
  progress: MotionValue<number>;
  rise: boolean;
  expanded: boolean;
  compressed: boolean;
  onHover: () => void;
}

function PillarCard({
  pillar,
  index,
  progress,
  rise,
  expanded,
  compressed,
  onHover,
}: PillarCardProps) {
  const start = 0.2 + index * 0.1;
  const grown = useTransform(progress, [start, start + 0.5], [0, 1], {
    clamp: true,
  });
  // Rise out of the foundation: the card is revealed from its base upward.
  const clipPath = useTransform(
    grown,
    (value) => `inset(${((1 - value) * 100).toFixed(2)}% 0% 0% 0% round 12px)`,
  );
  const y = useTransform(grown, [0, 1], [48, 0]);

  return (
    <motion.article
      aria-labelledby={`pillar-${pillar.id}`}
      onPointerEnter={onHover}
      onPointerMove={trackPointerLight}
      onPointerLeave={resetPointerLight}
      style={{
        ...(rise ? { clipPath } : {}),
        // Desktop: the hovered pillar widens and its neighbours make room.
        flexGrow: expanded ? 1.5 : 1,
      }}
      className={cn(
        "group relative flex min-h-[29rem] flex-col rounded-xl border bg-surface-elevated p-6 transition-[flex-grow,border-color,background-color] duration-500 ease-[var(--ease-out)] lg:min-w-0 lg:basis-0 lg:p-7",
        expanded ? "border-accent/50" : "border-border",
        compressed && "lg:bg-surface-elevated/70",
      )}
    >
      <span aria-hidden="true" className="border-light rounded-xl" />
      <motion.div
        style={rise ? { y } : undefined}
        className="flex h-full flex-col"
      >
        <div className="flex items-center justify-between font-mono text-xs">
          <span className="text-muted-subtle">
            pillar {String(index + 1).padStart(2, "0")}
          </span>
          <span className="text-accent">{pillar.path}</span>
        </div>

        <h3
          id={`pillar-${pillar.id}`}
          className="mt-10 text-2xl font-medium tracking-[-0.02em] text-foreground"
        >
          {pillar.name}
        </h3>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {pillar.owns}
        </p>

        <ul className="mt-6 space-y-2.5 border-t border-border pt-5">
          {pillar.practice.map((item) => (
            <li
              key={item}
              className="flex gap-2.5 text-sm leading-6 text-foreground"
            >
              <span aria-hidden="true" className="font-mono text-accent">
                ▹
              </span>
              {item}
            </li>
          ))}
        </ul>

        <p
          className={cn(
            "mb-6 mt-6 text-sm leading-6 text-muted-foreground transition-opacity duration-500",
            "lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-within:opacity-100",
          )}
        >
          {pillar.withYou}
        </p>

        <div className="mt-auto flex items-baseline justify-between border-t border-border pt-4 font-mono text-xs">
          <span className="text-muted-subtle">
            {pillar.experience ? "experience" : "level"}
          </span>
          <span className="tabular-nums text-foreground">
            {pillar.experience ?? "senior"}
          </span>
        </div>
      </motion.div>
    </motion.article>
  );
}
