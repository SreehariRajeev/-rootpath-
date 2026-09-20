"use client";

import { motion, useReducedMotion } from "motion/react";

import { Button } from "@/components/ui/button";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { contactHref } from "@/lib/contact";

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

const spring = {
  type: "spring" as const,
  stiffness: 280,
  damping: 24,
  mass: 0.7,
};

export function Process() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="process"
      aria-labelledby="process-heading"
      className="mx-auto max-w-7xl px-6 py-20 sm:py-24 lg:px-10 lg:py-28"
    >
      <div className="grid gap-12 lg:grid-cols-[minmax(16rem,0.7fr)_minmax(0,1.3fr)] lg:gap-20">
        <motion.div
          initial={
            shouldReduceMotion
              ? false
              : { opacity: 0, transform: "translateY(14px)" }
          }
          whileInView={{ opacity: 1, transform: "translateY(0)" }}
          viewport={{ once: true, amount: 0.3 }}
          transition={spring}
          className="self-start lg:sticky lg:top-28"
        >
          <p className="eyebrow">How we work</p>
          <h2
            id="process-heading"
            className="mt-5 max-w-xl text-4xl font-medium leading-[0.98] tracking-[-0.065em] text-foreground sm:text-5xl"
          >
            Clear thinking, close collaboration, careful delivery.
          </h2>
          <p className="mt-6 max-w-md text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            The work stays close. You speak directly with the people making
            the technical decisions, from first conversation through handoff.
          </p>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="mt-8"
            onClick={() => {
              window.location.href = contactHref;
            }}
          >
            Start a project
          </Button>
        </motion.div>

        <SpotlightCard
          spotlightColorVar="--accent-pop-rgb"
          spotlightSizePx={640}
          spotlightOpacity={0.15}
          className="bg-surface-elevated p-6 sm:p-8 lg:p-10"
        >
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

          <div>
            {processItems.map((item, index) => (
              <motion.div
                key={item.title}
                initial={
                  shouldReduceMotion
                    ? false
                    : { opacity: 0, transform: "translateY(12px)" }
                }
                whileInView={{ opacity: 1, transform: "translateY(0)" }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ ...spring, delay: index * 0.06 }}
                className="grid gap-3 border-b border-border py-6 last:border-b-0 last:pb-0 first:pt-0 sm:grid-cols-[minmax(10rem,0.55fr)_minmax(0,1fr)] sm:gap-8"
              >
                <h3 className="text-xl font-medium tracking-[-0.035em] text-foreground sm:text-2xl">
                  {item.title}
                </h3>
                <p className="max-w-xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </SpotlightCard>
      </div>
    </section>
  );
}
