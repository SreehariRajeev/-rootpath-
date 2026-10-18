"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";

import { LogoMark } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

/*
 * One horizontal route on a single axis, drawn in a fixed 1200 x 264 scene that scales to
 * fit its container. Every node sits on the axis or is mirrored about it, so the drawing is
 * symmetric and nothing floats: product -> brief -> >_rp -> senior team -> one service ->
 * ship -> in production.
 */
const W = 1200;
const H = 264;
const AXIS = 132;
const CARD = { x: 628, w: 280, h: 54, gap: 62 };

export const routeServices = [
  {
    id: "web",
    title: "Web platforms",
    stack: "Next.js · GSAP · Three.js",
    flag: "--web",
  },
  {
    id: "mobile",
    title: "Mobile apps",
    stack: "Swift · Kotlin · React Native",
    flag: "--mobile",
  },
  {
    id: "cloud",
    title: "Cloud and APIs",
    stack: "Docker · Temporal · Redis",
    flag: "--cloud",
  },
  {
    id: "consult",
    title: "Technical consulting",
    stack: "C4 · ADRs · DORA metrics",
    flag: "--consult",
  },
] as const;

const cardY = (index: number) => AXIS + (index - 1.5) * CARD.gap;
const branch = (index: number) =>
  `M548 ${AXIS} C590 ${AXIS} 586 ${cardY(index)} ${CARD.x} ${cardY(index)}`;
const merge = (index: number) =>
  `M${CARD.x + CARD.w} ${cardY(index)} C950 ${cardY(index)} 946 ${AXIS} 988 ${AXIS}`;
const TRUNK = `M168 ${AXIS} H548`;
const TAIL = `M988 ${AXIS} H1090`;

const draw = (delay: number, duration: number) => ({
  initial: { pathLength: 0, opacity: 0 },
  animate: { pathLength: 1, opacity: 1 },
  transition: {
    pathLength: { delay, duration, ease: [0.65, 0, 0.35, 1] as const },
    opacity: { delay, duration: 0.01 },
  },
});

interface RoutePipelineProps {
  active: number;
  /** Increments on every activation, so the route redraws even for the same service. */
  cycle: number;
  /** The trunk has drawn in and routes can light up. */
  ready: boolean;
  still?: boolean;
  onHover?: (index: number | null) => void;
}

export function RoutePipeline({
  active,
  cycle,
  ready,
  still = false,
  onHover,
}: RoutePipelineProps) {
  const frameRef = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState(1);

  React.useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const measure = () => setScale(Math.min(1, frame.clientWidth / W));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={frameRef}
      className="relative w-full"
      style={{ height: H * scale }}
      role="img"
      aria-label="How a project runs: your product, a brief, the Root-Path team, the service it needs, then shipped to production."
    >
      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{ width: W, height: H, transform: `scale(${scale})` }}
      >
        <svg
          aria-hidden="true"
          viewBox={`0 0 ${W} ${H}`}
          width={W}
          height={H}
          className="absolute inset-0 overflow-visible"
          fill="none"
          strokeLinecap="round"
        >
          {/* Every route, quiet */}
          <g style={{ stroke: "var(--border-strong)" }} strokeWidth={1.25}>
            <path d={TRUNK} />
            {routeServices.map((service, index) => (
              <React.Fragment key={service.id}>
                <path d={branch(index)} />
                <path d={merge(index)} />
              </React.Fragment>
            ))}
            <path d={TAIL} />
          </g>

          {/* The trunk draws in once, then stays lit */}
          <motion.path
            d={TRUNK}
            strokeWidth={1.75}
            style={{ stroke: "var(--accent)" }}
            {...(still
              ? {}
              : draw(1.05, 1.1))}
          />

          {/* The active route */}
          <AnimatePresence>
            {ready ? (
              <motion.g
                key={cycle}
                strokeWidth={1.75}
                style={{ stroke: "var(--accent)" }}
                exit={{ opacity: 0, transition: { duration: 0.35 } }}
              >
                <motion.path d={branch(active)} {...(still ? {} : draw(0, 0.55))} />
                <motion.path d={merge(active)} {...(still ? {} : draw(0.6, 0.55))} />
                <motion.path d={TAIL} {...(still ? {} : draw(1.15, 0.4))} />
                <motion.path
                  d="M1082 125 L1091 132 L1082 139"
                  strokeLinejoin="round"
                  initial={still ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: still ? 0 : 1.5, duration: 0.2 }}
                />
              </motion.g>
            ) : null}
          </AnimatePresence>
        </svg>

        {/* Your product */}
        <div
          className="absolute rounded-xl border border-border bg-surface-elevated p-3.5 shadow-[0_18px_40px_-28px_rgb(11_15_14/0.45)]"
          style={{ left: 0, top: AXIS - 75, width: 168, height: 150 }}
        >
          <p className="font-mono text-[11px] text-muted-subtle">your product</p>
          <div className="mt-3 space-y-2">
            <span className="block h-2 w-[72%] rounded-full bg-border" />
            <span className="block h-2 w-[48%] rounded-full bg-border" />
            <span className="block h-9 w-full rounded-md bg-surface" />
            <span className="block h-2 w-[62%] rounded-full bg-border" />
          </div>
        </div>

        <Pill x={232} label="brief" lit={ready || still} />

        {/* Root-Path */}
        <div
          className="absolute grid place-items-center rounded-2xl bg-system-black shadow-[0_22px_36px_-20px_rgb(11_15_14/0.55)]"
          style={{ left: 296, top: AXIS - 45, width: 90, height: 90 }}
        >
          <LogoMark className="text-[21px] text-off-white [&>span]:text-brand-green-light" />
        </div>

        <Pill x={467} label="senior team" lit={ready || still} />

        {/* Services, mirrored about the axis */}
        {routeServices.map((service, index) => {
          const lit = (ready || still) && index === active;
          return (
            <a
              key={service.id}
              href={`#service-${service.id}`}
              onPointerEnter={() => onHover?.(index)}
              onPointerLeave={() => onHover?.(null)}
              className={cn(
                "group absolute flex items-center gap-3 rounded-xl border bg-surface-elevated px-2 outline-none transition-[border-color,box-shadow,transform] duration-300 focus-visible:ring-2 focus-visible:ring-accent/60",
                lit
                  ? "border-accent/55 shadow-[0_14px_30px_-22px_rgb(24_94_63/0.55)]"
                  : "border-border hover:border-border-strong",
              )}
              style={{
                left: CARD.x,
                top: cardY(index) - CARD.h / 2,
                width: CARD.w,
                height: CARD.h,
                transitionDelay: lit ? "250ms" : "0ms",
              }}
            >
              <span
                className={cn(
                  "grid size-[38px] shrink-0 place-items-center rounded-lg border transition-colors duration-300",
                  lit
                    ? "border-accent/50 text-accent"
                    : "border-border text-muted-foreground",
                )}
                style={{ transitionDelay: lit ? "250ms" : "0ms" }}
              >
                <ServiceIcon id={service.id} />
              </span>
              <span className="min-w-0">
                <span className="block font-display text-[15px] font-medium leading-tight text-foreground">
                  {service.title}
                </span>
                <span className="mt-0.5 block truncate font-mono text-[11px] text-muted-subtle">
                  {service.stack}
                </span>
              </span>
            </a>
          );
        })}

        <Pill x={1030} label="ship" lit={(ready || still)} />

        {/* Release status for the active route */}
        <AnimatePresence>
          {ready && !still ? (
            <motion.div
              key={cycle}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.25 } }}
              transition={{ delay: 1.3, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="absolute space-y-1.5 rounded-lg border border-border bg-surface-elevated p-1.5 shadow-[0_14px_30px_-24px_rgb(11_15_14/0.5)]"
              style={{ left: 958, top: AXIS + 26, width: 112 }}
            >
              {["reviewed", "released"].map((step) => (
                <span
                  key={step}
                  className="flex items-center gap-2 rounded-md bg-surface px-2 py-1 font-mono text-[11px] text-foreground"
                >
                  <span className="grid size-3.5 place-items-center rounded-[4px] bg-brand-green text-[9px] text-off-white">
                    ✓
                  </span>
                  {step}
                </span>
              ))}
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* In production */}
        <div
          className="absolute"
          style={{ left: 1096, top: AXIS - 44, width: 88, height: 88 }}
        >
          <span className="production-dots absolute inset-0 rounded-full bg-system-black" />
          <AnimatePresence>
            {ready && !still ? (
              <motion.span
                key={cycle}
                aria-hidden="true"
                className="absolute inset-0 rounded-full border border-accent"
                initial={{ scale: 1, opacity: 0 }}
                animate={{ scale: [1, 1.35], opacity: [0.7, 0] }}
                transition={{ delay: 1.55, duration: 1.1, ease: "easeOut" }}
              />
            ) : null}
          </AnimatePresence>
        </div>
        <span
          className="absolute -translate-x-1/2 whitespace-nowrap rounded-full border border-border bg-surface-elevated px-3 py-1 font-mono text-[11px] text-foreground"
          style={{ left: 1140, top: AXIS + 54 }}
        >
          in production
        </span>
      </div>
    </div>
  );
}

function Pill({ x, label, lit }: { x: number; label: string; lit: boolean }) {
  return (
    <span
      className={cn(
        "absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border bg-background px-3 py-1.5 font-mono text-[12px] leading-none transition-colors duration-500",
        lit
          ? "border-accent/40 text-foreground"
          : "border-border-strong text-muted-foreground",
      )}
      style={{ left: x, top: AXIS, transitionDelay: lit ? "1.6s" : "0s" }}
    >
      {label}
    </span>
  );
}

function ServiceIcon({ id }: { id: string }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (id) {
    case "web":
      return (
        <svg {...common}>
          <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
          <path d="M3 9h18M8 13.5l-2 2 2 2M16 13.5l2 2-2 2" />
        </svg>
      );
    case "mobile":
      return (
        <svg {...common}>
          <rect x="6.5" y="2.5" width="11" height="19" rx="2.5" />
          <path d="M10.5 18h3" />
        </svg>
      );
    case "cloud":
      return (
        <svg {...common}>
          <rect x="3.5" y="4" width="17" height="6" rx="1.5" />
          <rect x="3.5" y="14" width="17" height="6" rx="1.5" />
          <path d="M7 7h.01M7 17h.01M12 10v4" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="6" cy="6" r="2" />
          <circle cx="6" cy="18" r="2" />
          <circle cx="18" cy="12" r="2" />
          <path d="M6 8v8M8 6h3a3 3 0 0 1 3 3v1a2 2 0 0 0 2 2" />
        </svg>
      );
  }
}
