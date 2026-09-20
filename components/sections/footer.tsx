"use client";

import { motion, useReducedMotion } from "motion/react";

import { contactHref } from "@/lib/contact";

const footerLinks = [
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: contactHref },
] as const;

const spring = {
  type: "spring" as const,
  stiffness: 260,
  damping: 22,
  mass: 0.8,
};

export function Footer() {
  const shouldReduceMotion = useReducedMotion() ?? false;

  return (
    <footer id="footer" className="border-t border-border bg-surface-elevated/35">
      <div className="mx-auto max-w-7xl px-6 py-20 sm:py-24 lg:px-10 lg:py-32">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1.25fr)_minmax(13rem,0.45fr)] lg:gap-24">
          <motion.div
            initial={
              shouldReduceMotion
                ? false
                : { opacity: 0, transform: "translateY(16px)" }
            }
            whileInView={{ opacity: 1, transform: "translateY(0)" }}
            viewport={{ once: true, amount: 0.35 }}
            transition={spring}
          >
            <p className="eyebrow">Start with a conversation</p>
            <h2 className="mt-6 max-w-4xl text-[clamp(3rem,7vw,6.75rem)] font-medium leading-[0.94] tracking-[-0.08em] text-foreground">
              A clearer next move starts here.
            </h2>
            <p className="mt-7 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              Bring a product question, a technical constraint, or a release
              that needs a sharper path.
            </p>
            <motion.a
              href="#process"
              whileHover={shouldReduceMotion ? undefined : "hover"}
              variants={{ rest: {}, hover: {} }}
              className="group mt-8 inline-flex items-center gap-2 rounded-lg border border-border-strong px-5 py-3 text-sm font-medium text-foreground outline-none transition-[background-color,border-color,transform] duration-150 ease-out hover:border-accent/60 hover:bg-surface focus-visible:ring-2 focus-visible:ring-accent/70"
            >
              See how we work
              <motion.span
                aria-hidden="true"
                variants={{
                  rest: { transform: "translateX(0)" },
                  hover: { transform: "translateX(4px)" },
                }}
                transition={spring}
                className="text-accent"
              >
                →
              </motion.span>
            </motion.a>
          </motion.div>

          <motion.aside
            initial={
              shouldReduceMotion
                ? false
                : { opacity: 0, transform: "translateY(16px)" }
            }
            whileInView={{ opacity: 1, transform: "translateY(0)" }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ ...spring, delay: 0.08 }}
            className="border-t border-border pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0"
          >
            <p className="eyebrow">Explore</p>
            <nav aria-label="Footer navigation" className="mt-5 grid gap-4">
              {footerLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="w-fit text-sm text-muted-foreground outline-none transition-colors duration-150 ease-out hover:text-foreground focus-visible:ring-2 focus-visible:ring-accent/70"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </motion.aside>
        </div>

        <div className="mt-20 flex flex-col gap-4 border-t border-border pt-5 text-xs text-muted-subtle sm:mt-24 sm:flex-row sm:items-center sm:justify-between">
          <a
            href="#top"
            className="inline-flex w-fit items-center font-mono text-base font-semibold leading-none tracking-[0.02em] text-foreground outline-none focus-visible:ring-2 focus-visible:ring-accent/70 sm:text-lg"
          >
            &gt;<span className="text-accent">_</span>rp
          </a>
          <p>Digital engineering, kept close.</p>
        </div>
      </div>
    </footer>
  );
}
