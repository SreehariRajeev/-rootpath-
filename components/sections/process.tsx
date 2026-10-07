"use client";

import * as React from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Reveal, RevealItem, Stagger } from "@/components/ui/reveal";
import { goToContact } from "@/lib/contact";

const processItems = [
  {
    title: "Start with context",
    description:
      "We begin with the problem, the users, what exists today, and what needs deciding. The first conversation is about scope and fit.",
  },
  {
    title: "Set a clear path",
    description:
      "We turn the conversation into a focused working plan. Questions go directly to the people making the technical decisions.",
  },
  {
    title: "Build in the open",
    description:
      "We work in small, visible increments. You review the important decisions while the work is still easy to change.",
  },
  {
    title: "Deliver with care",
    description:
      "We prepare the release, document the important pieces, and hand over a codebase your team can understand and continue to own.",
  },
] as const;

/** Vertical track along the card edge that fills as the steps scroll past. */
function StepProgress({
  target,
}: {
  target: React.RefObject<HTMLElement | null>;
}) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({
    target,
    offset: ["start 75%", "end 55%"],
  });
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    mass: 0.4,
  });

  return (
    <div
      aria-hidden="true"
      className="absolute inset-y-0 -left-6 w-px bg-border-strong sm:-left-8 lg:-left-10"
    >
      <motion.div
        style={shouldReduceMotion ? { transform: "scaleY(1)" } : { scaleY }}
        className="h-full w-[3px] -translate-x-px origin-top rounded-full bg-accent"
      />
    </div>
  );
}

export function Process() {
  const stepsRef = React.useRef<HTMLDivElement>(null);

  return (
    <section
      id="process"
      aria-labelledby="process-heading"
      className="mx-auto max-w-7xl px-6 py-20 sm:py-24 lg:px-10 lg:py-28"
    >
      <div className="grid gap-12 lg:grid-cols-[minmax(16rem,0.7fr)_minmax(0,1.3fr)] lg:gap-20">
        <Reveal className="self-start lg:sticky lg:top-28">
          <p className="eyebrow">How we work</p>
          <h2
            id="process-heading"
            className="mt-5 max-w-xl text-4xl font-medium leading-[0.98] tracking-[-0.03em] text-foreground sm:text-5xl"
          >
            Clear thinking, close collaboration, careful delivery.
          </h2>
          <p className="mt-6 max-w-md text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            The work stays close. You speak directly with the people making the
            technical decisions, from first conversation through handoff.
          </p>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="mt-8"
            onClick={() => {
              goToContact();
            }}
          >
            Start a project
          </Button>
        </Reveal>

        <Reveal delay={0.08} amount={0.1}>
          <Card className="bg-surface-elevated p-6 sm:p-8 lg:p-10">
            <div className="mb-8 flex items-end justify-between gap-6 border-b border-border pb-5">
              <div>
                <p className="eyebrow">Working style</p>
                <p className="mt-3 text-lg font-medium tracking-[-0.02em] text-foreground">
                  Fewer handoffs. Faster decisions.
                </p>
              </div>
              <span className="hidden font-mono text-xs uppercase tracking-[0.18em] text-muted-subtle sm:block">
                Direct / focused
              </span>
            </div>

            <div ref={stepsRef} className="relative">
              <StepProgress target={stepsRef} />
              <Stagger stagger={0.12} amount={0.2}>
                {processItems.map((item, index) => (
                  <RevealItem
                    key={item.title}
                    className="grid gap-3 border-b border-border py-6 first:pt-0 last:border-b-0 last:pb-0 sm:grid-cols-[minmax(10rem,0.55fr)_minmax(0,1fr)] sm:gap-8"
                  >
                    <div>
                      <span className="font-mono text-xs text-accent">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h3 className="mt-1 text-xl font-medium tracking-[-0.02em] text-foreground sm:text-2xl">
                        {item.title}
                      </h3>
                    </div>
                    <p className="max-w-xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
                      {item.description}
                    </p>
                  </RevealItem>
                ))}
              </Stagger>
            </div>
          </Card>
        </Reveal>
      </div>
    </section>
  );
}
