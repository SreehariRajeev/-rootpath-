"use client";

import * as React from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";

import {
  services as serviceData,
  type Service,
} from "@/components/sections/services/data";
import { LogoMark } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

/*
 * Drawn in a 600 x 480 coordinate space. Routes leave the root node, branch to each
 * service, and converge on the outcome node, the "root -> path -> beyond" idea from the
 * brand book. Lines live in one SVG; the nodes are HTML positioned in percentages of the
 * same space, so they stay crisp, focusable and readable at any size.
 */
const VIEW = { w: 600, h: 480 };
const MID = 240;

/** Vertical position of each route, top to bottom, in the order of the services data. */
const rows = [84, 188, 292, 396];

// The map reads its names, paths and one-liners from the services data, so the two never drift.
const services = serviceData.map((service, index) => ({
  id: service.id,
  path: service.path,
  name: service.name,
  detail: `${service.title}.`,
  y: rows[index],
}));

type ServiceId = Service["id"];
type Active = ServiceId | "root" | "outcome" | null;
type CaptionKey = NonNullable<Active> | "idle";

const captions = {
  idle: {
    label: "Close to the work",
    text: "Fewer handoffs. Direct access to the people making the decisions.",
  },
  root: {
    label: "Start at the root",
    text: "We begin at the fundamental level of the problem and understand the system.",
  },
  outcome: {
    label: "Then take it further",
    text: "Every route ends in a working result your team can own and extend.",
  },
  ...Object.fromEntries(
    services.map((service) => [
      service.id,
      { label: service.name, text: service.detail },
    ]),
  ),
} as Record<CaptionKey, { label: string; text: string }>;

const nodeBox = {
  root: { x: 8, w: 112 },
  service: { x: 232, w: 156 },
  outcome: { x: 480, w: 112 },
  h: 48,
};

/** Orthogonal route with rounded corners from the root, through one service, to the outcome. */
function routePath(y: number) {
  const r = 14;
  const dir = y < MID ? -1 : 1;
  const rootRight = nodeBox.root.x + nodeBox.root.w;
  const branchX = 200;
  const mergeX = 450;
  const outcomeLeft = nodeBox.outcome.x;

  return [
    `M${rootRight} ${MID}`,
    `H${branchX - r}`,
    `Q${branchX} ${MID} ${branchX} ${MID + dir * r}`,
    `V${y - dir * r}`,
    `Q${branchX} ${y} ${branchX + r} ${y}`,
    `H${mergeX - r}`,
    `Q${mergeX} ${y} ${mergeX} ${y - dir * r}`,
    `V${MID + dir * r}`,
    `Q${mergeX} ${MID} ${mergeX + r} ${MID}`,
    `H${outcomeLeft}`,
  ].join(" ");
}

function pct(value: number, total: number) {
  return `${(value / total) * 100}%`;
}

function boxStyle(x: number, y: number, w: number): React.CSSProperties {
  return {
    left: pct(x, VIEW.w),
    top: pct(y - nodeBox.h / 2, VIEW.h),
    width: pct(w, VIEW.w),
    height: pct(nodeBox.h, VIEW.h),
  };
}

const layerSpring = { stiffness: 90, damping: 20, mass: 0.6 };

function useLayer(
  source: MotionValue<number>,
  depth: number,
  scroll?: MotionValue<number>,
) {
  const pointer = useTransform(source, (value) => value * depth);
  return useTransform(
    scroll ? [pointer, scroll] : [pointer],
    ([a, b = 0]: number[]) => a + b,
  );
}

interface SystemMapProps {
  /** Hero scroll progress (0 at rest, 1 when the hero has left the viewport). */
  scrollProgress: MotionValue<number>;
}

export function SystemMap({ scrollProgress }: SystemMapProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const [active, setActive] = React.useState<Active>(null);
  const rootRef = React.useRef<HTMLDivElement>(null);
  // The looping route signals pause once the hero has scrolled out of view.
  const onScreen = useInView(rootRef);

  // Pointer position across the viewport, -0.5..0.5 on each axis, eased.
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const easedX = useSpring(pointerX, layerSpring);
  const easedY = useSpring(pointerY, layerSpring);

  // The latest pointer position is always recorded, but the springs only run while the hero is on
  // screen. On coming back into view they catch up to where the pointer is now.
  const lastPointer = React.useRef({ x: 0, y: 0 });

  React.useEffect(() => {
    if (shouldReduceMotion) return;
    const apply = () => {
      pointerX.set(lastPointer.current.x);
      pointerY.set(lastPointer.current.y);
    };
    const handle = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      lastPointer.current = {
        x: event.clientX / window.innerWidth - 0.5,
        y: event.clientY / window.innerHeight - 0.5,
      };
      if (onScreen) apply();
    };
    if (onScreen) apply();
    window.addEventListener("pointermove", handle, { passive: true });
    return () => window.removeEventListener("pointermove", handle);
  }, [shouldReduceMotion, onScreen, pointerX, pointerY]);

  // Scroll sinks the dot field behind the map; lines and nodes move together so routes stay attached.
  const dotsScroll = useTransform(scrollProgress, [0, 1], [0, 60]);

  const dotsX = useLayer(easedX, -10);
  const dotsY = useLayer(easedY, -10, dotsScroll);
  const linesX = useLayer(easedX, 8);
  const linesY = useLayer(easedY, 8);
  const nodesX = useLayer(easedX, 16);
  const nodesY = useLayer(easedY, 16);

  const isLit = (id: ServiceId) =>
    active === id || active === "root" || active === "outcome";
  const captionKey: CaptionKey = active ?? "idle";

  const layer = (x: MotionValue<number>, y: MotionValue<number>) =>
    shouldReduceMotion ? undefined : { x, y };

  return (
    <div ref={rootRef} data-live={onScreen} className="@container relative w-full">
      <div
        className="relative w-full"
        style={{ aspectRatio: `${VIEW.w} / ${VIEW.h}` }}
        onPointerLeave={() => setActive(null)}
      >
        {/* Depth layer 1: dot field and drawing-frame corner marks */}
        <motion.div
          aria-hidden="true"
          style={layer(dotsX, dotsY)}
          className="load-in pointer-events-none absolute -inset-6 [--load-delay:0.3s]"
        >
          <div className="map-dots absolute inset-0" />
          {[
            "left-0 top-0 border-l border-t",
            "right-0 top-0 border-r border-t",
            "bottom-0 left-0 border-b border-l",
            "bottom-0 right-0 border-b border-r",
          ].map((corner) => (
            <span
              key={corner}
              className={cn("absolute size-4 border-accent/40", corner)}
            />
          ))}
        </motion.div>

        {/* Depth layer 2: routes */}
        <motion.svg
          aria-hidden="true"
          viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
          style={layer(linesX, linesY)}
          className="absolute inset-0 h-full w-full overflow-visible"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {services.map((service, index) => (
            <path
              key={`base-${service.id}`}
              d={routePath(service.y)}
              pathLength={1}
              strokeWidth={1.25}
              className="route-draw"
              style={
                {
                  stroke: "var(--border-strong)",
                  "--route-delay": `${0.7 + index * 0.1}s`,
                } as React.CSSProperties
              }
            />
          ))}
          {services.map((service) => (
            <path
              key={`trace-${service.id}`}
              d={routePath(service.y)}
              pathLength={1}
              strokeWidth={2}
              strokeDasharray={1}
              strokeDashoffset={isLit(service.id) ? 0 : 1}
              style={{
                stroke: "var(--accent)",
                transition: "stroke-dashoffset 0.75s var(--ease-in-out)",
              }}
            />
          ))}
          {services.map((service, index) => (
            <path
              key={`signal-${service.id}`}
              d={routePath(service.y)}
              pathLength={1}
              strokeWidth={2.25}
              className="route-signal"
              style={
                {
                  stroke: "var(--accent)",
                  "--signal-delay": `${2.4 + index * 1.2}s`,
                  opacity: active ? 0 : 1,
                  transition: "opacity 0.3s",
                } as React.CSSProperties
              }
            />
          ))}
          {[nodeBox.root.x + nodeBox.root.w, nodeBox.outcome.x].map((cx) => (
            <circle
              key={cx}
              cx={cx}
              cy={MID}
              r={3.5}
              strokeWidth={1.5}
              className="node-in"
              style={
                {
                  fill: "var(--background)",
                  stroke: "var(--accent)",
                  "--node-delay": "0.6s",
                } as React.CSSProperties
              }
            />
          ))}
        </motion.svg>

        {/* Depth layer 3: nodes */}
        <motion.div style={layer(nodesX, nodesY)} className="absolute inset-0">
          <MapNode
            style={boxStyle(nodeBox.root.x, MID, nodeBox.root.w)}
            delay={0.5}
            lit={active === "root"}
            dimmed={
              active !== null && active !== "root" && active !== "outcome"
            }
            onActivate={() => setActive("root")}
          >
            <LogoMark className="text-[12px] @[480px]:text-[15px]" />
          </MapNode>

          {services.map((service, index) => (
            <MapNode
              key={service.id}
              href={`#service-${service.id}`}
              label={service.name}
              style={boxStyle(nodeBox.service.x, service.y, nodeBox.service.w)}
              delay={1.15 + index * 0.1}
              lit={isLit(service.id)}
              dimmed={active !== null && !isLit(service.id)}
              onActivate={() => setActive(service.id)}
              onDeactivate={() => setActive(null)}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "size-1.5 shrink-0 rounded-full transition-colors duration-300",
                  isLit(service.id) ? "bg-accent" : "bg-border-strong",
                )}
              />
              <span className="font-mono text-[10px] @[480px]:text-[13px]">
                {service.path}
              </span>
              <span
                aria-hidden="true"
                className="ml-auto hidden font-mono text-[11px] text-muted-subtle @[480px]:inline"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
            </MapNode>
          ))}

          <MapNode
            style={boxStyle(nodeBox.outcome.x, MID, nodeBox.outcome.w)}
            delay={1.9}
            lit={active === "outcome"}
            dimmed={
              active !== null && active !== "root" && active !== "outcome"
            }
            onActivate={() => setActive("outcome")}
          >
            <span className="font-mono text-[10px] text-accent @[480px]:text-[13px]">
              --beyond
            </span>
          </MapNode>
        </motion.div>
      </div>

      {/*
        Caption: what the highlighted route means. Every message sits in the same grid cell
        and only the active one is shown, so the block is always as tall as its longest
        message and hovering never shifts the hero's layout.
      */}
      <div className="load-in mt-8 border-t border-border pt-5 [--load-delay:1.2s]">
        <p className="sr-only" aria-live="polite">
          {`${captions[captionKey].label}. ${captions[captionKey].text}`}
        </p>
        <div aria-hidden="true" className="grid">
          {(Object.keys(captions) as CaptionKey[]).map((key) => (
            <div
              key={key}
              className={cn(
                "[grid-area:1/1] transition-[opacity,transform] duration-300 ease-[var(--ease-out)] motion-reduce:transition-none",
                key === captionKey
                  ? "opacity-100"
                  : "pointer-events-none translate-y-1.5 opacity-0",
              )}
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
                {captions[key].label}
              </p>
              <p className="mt-2 text-base leading-7 text-foreground">
                {captions[key].text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface MapNodeProps {
  children: React.ReactNode;
  style: React.CSSProperties;
  delay: number;
  lit: boolean;
  dimmed: boolean;
  href?: string;
  label?: string;
  onActivate: () => void;
  onDeactivate?: () => void;
}

function MapNode({
  children,
  style,
  delay,
  lit,
  dimmed,
  href,
  label,
  onActivate,
  onDeactivate,
}: MapNodeProps) {
  const face = cn(
    "flex h-full w-full items-center gap-1.5 whitespace-nowrap rounded-md border px-1.5 transition-[border-color,background-color,opacity,transform] duration-300 @[480px]:gap-2.5 @[480px]:px-3",
    lit
      ? "-translate-y-0.5 border-accent bg-surface-elevated text-foreground"
      : "border-border-strong bg-background text-muted-foreground",
    dimmed && "opacity-45",
    !href && "justify-center",
  );

  return (
    <div
      className="node-in absolute"
      style={{ ...style, "--node-delay": `${delay}s` } as React.CSSProperties}
      onPointerEnter={onActivate}
    >
      {href ? (
        <a
          href={href}
          aria-label={label}
          onFocus={onActivate}
          onBlur={onDeactivate}
          className={cn(
            face,
            "outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-accent/70",
          )}
        >
          {children}
        </a>
      ) : (
        <div className={face}>{children}</div>
      )}
    </div>
  );
}
