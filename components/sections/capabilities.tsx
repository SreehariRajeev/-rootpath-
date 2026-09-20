"use client";

import { motion, useReducedMotion } from "motion/react";

import { SpotlightCard } from "@/components/ui/spotlight-card";

const spring = {
  type: "spring" as const,
  stiffness: 300,
  damping: 25,
  mass: 0.7,
};

function WebSurface() {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const layers = ["component system", "performance baseline", "clear handoff"];

  return (
    <div className="mt-8 overflow-hidden rounded-lg border border-border bg-surface-elevated/80 p-4 sm:p-5">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-subtle">
          Web development
        </span>
        <span className="text-xs text-muted-subtle">Focused</span>
      </div>
      <div className="mt-5 space-y-3">
        {layers.map((layer, index) => (
          <motion.div
            key={layer}
            initial={shouldReduceMotion ? false : { opacity: 0, transform: "translateY(6px)" }}
            whileInView={{ opacity: 1, transform: "translateY(0)" }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{ ...spring, delay: index * 0.08 }}
            className="flex items-center justify-between border-b border-border pb-3 text-sm"
          >
            <span className="text-foreground">{layer}</span>
            <span className="text-xs text-muted-subtle">in scope</span>
          </motion.div>
        ))}
        <div className="pt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-subtle">
          Built around your next release
        </div>
      </div>
    </div>
  );
}

function MobileSurface() {
  const shouldReduceMotion = useReducedMotion() ?? false;

  return (
    <motion.div
      whileHover={shouldReduceMotion ? undefined : { transform: "translateY(-6px) rotate(1deg)" }}
      transition={spring}
      className="mt-10 ml-auto mr-4 aspect-[0.58] w-28 rounded-[1.35rem] border border-border-strong bg-surface-soft p-2 shadow-[0_20px_40px_rgb(var(--shadow-rgb)/0.12)] sm:mr-8"
    >
      <div className="flex h-full flex-col overflow-hidden rounded-[1rem] border border-border bg-surface-elevated px-2.5 py-3">
        <div className="mx-auto h-1 w-8 rounded-full bg-border-strong" />
        <div className="mt-5 h-16 rounded-md bg-surface" />
        <div className="mt-3 h-2 w-3/4 rounded-full bg-border-strong" />
        <div className="mt-2 h-2 w-1/2 rounded-full bg-border-strong" />
        {/* Mirrors the parent card's hover state, so the mockup's "button" and the card agree */}
        <div className="mt-auto h-10 rounded-md border border-accent-warm/25 bg-transparent transition-colors duration-200 group-hover:border-accent-warm/60 group-hover:bg-accent-warm-soft" />
      </div>
    </motion.div>
  );
}

function StrategyLines() {
  return (
    <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-3">
      {["Architecture review", "Modernization plan", "Technical roadmap"].map((item) => (
        <div key={item} className="border-t border-border pt-3">
          <span className="text-sm text-foreground">{item}</span>
        </div>
      ))}
    </div>
  );
}

export function Capabilities() {
  return (
    <section
      id="services"
      aria-labelledby="capabilities-heading"
      className="mx-auto max-w-7xl px-6 py-20 sm:py-24 lg:px-10 lg:py-28"
    >
      <div className="max-w-3xl">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-subtle">
          01 // SERVICES
        </p>
        <h2
          id="capabilities-heading"
          className="mt-5 text-4xl font-medium leading-[1.04] tracking-[-0.06em] text-foreground sm:text-5xl lg:text-[3.25rem]"
        >
          Focused digital services for teams ready to move.
        </h2>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-3 md:grid-flow-dense md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-[minmax(17rem,auto)_minmax(17rem,auto)] sm:mt-12 lg:mt-14">
        <SpotlightCard className="min-h-[28rem] bg-surface-tint p-6 sm:min-h-[30rem] sm:p-8 md:col-span-2 lg:col-span-2 lg:row-span-2">
          <div className="flex h-full flex-col">
            <div>
              <p className="text-sm text-muted-foreground">Web development</p>
              <h3 className="mt-5 max-w-md text-3xl font-medium tracking-[-0.05em] text-foreground sm:text-4xl">
                Web platforms built for the next release
              </h3>
              <p className="mt-5 max-w-md text-sm leading-6 text-muted-foreground">
                From marketing sites to enterprise platforms, we make the
                structure, content, and performance work together.
              </p>
            </div>
            <WebSurface />
            <div className="mt-auto flex flex-wrap gap-2 pt-8">
              {["Next.js", "SSR", "React", "Performance"].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border-strong bg-surface-elevated/50 px-3 py-1.5 text-xs text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </SpotlightCard>

        <SpotlightCard
          spotlightColorVar="--accent-warm-rgb"
          className="group min-h-[17rem] bg-surface-accent-warm p-6 transition-colors duration-200 hover:border-accent-warm/35 sm:p-8"
        >
          <p className="text-sm text-muted-foreground">Mobile app development</p>
          <h3 className="mt-4 text-2xl font-medium tracking-[-0.05em] text-foreground">
            Mobile apps with a clear path from screen to screen
          </h3>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            We shape the core flows and build the app for iOS, Android, React
            Native, or Flutter.
          </p>
          <MobileSurface />
        </SpotlightCard>

        <SpotlightCard className="min-h-[17rem] bg-surface-soft p-6 sm:p-8">
          <p className="text-sm text-muted-foreground">Cloud and API engineering</p>
          <h3 className="mt-4 text-2xl font-medium tracking-[-0.05em] text-foreground">
            APIs and infrastructure without the black box
          </h3>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            Clear APIs, infrastructure, and integrations for products that need
            to move without unnecessary complexity.
          </p>
          <div className="mt-8 space-y-2 font-mono text-xs text-muted-foreground">
            <div className="flex justify-between border-b border-border pb-2">
              <span>AWS</span>
              <span className="text-muted-subtle">infrastructure</span>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span>GraphQL</span>
              <span className="text-muted-subtle">data layer</span>
            </div>
            <div className="flex justify-between">
              <span>Integrations</span>
              <span className="text-muted-subtle">connected</span>
            </div>
          </div>
        </SpotlightCard>

        <SpotlightCard className="min-h-[17rem] bg-surface-warm p-6 sm:p-8 md:col-span-2 lg:col-span-2">
          <p className="text-sm text-muted-foreground">Technical consulting</p>
          <h3 className="mt-4 max-w-xl text-2xl font-medium tracking-[-0.05em] text-foreground sm:text-3xl">
            Turn technical complexity into a clear next move
          </h3>
          <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">
            Architecture reviews, legacy modernization, and product strategy
            for teams deciding what to build next.
          </p>
          <StrategyLines />
        </SpotlightCard>
      </div>
    </section>
  );
}
