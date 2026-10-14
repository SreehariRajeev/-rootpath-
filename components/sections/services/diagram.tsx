"use client";

import * as React from "react";
import { motion, useTransform, type MotionValue } from "motion/react";

import { cn } from "@/lib/utils";

export type Point = [number, number];

export interface DiagramNode {
  id: string;
  x: number;
  y: number;
  w: number;
  h?: number;
  label: string;
  sub?: string;
  /** Outcome nodes carry the green signal. */
  accent?: boolean;
  /** Draw progress (0..1) at which the node appears. */
  at: number;
}

export interface DiagramEdge {
  from: string;
  to: string;
  points: Point[];
  /** Draw progress window (0..1) over which the line is drawn. */
  at: [number, number];
  /** A short signal travels the line once it is drawn. */
  signal?: boolean;
}

export interface DiagramFrame {
  kind: "browser" | "phone";
  x: number;
  y: number;
  w: number;
  h: number;
  label?: string;
  at: number;
}

export interface DiagramDefinition {
  width: number;
  height: number;
  /** What the diagram shows, for screen readers. */
  description: string;
  frames?: DiagramFrame[];
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

const NODE_HEIGHT = 48;

/** Orthogonal polyline with rounded corners, in the style of the hero system map. */
export function routePath(points: Point[], radius = 12) {
  if (points.length < 2) return "";
  let d = `M${points[0][0]} ${points[0][1]}`;

  for (let i = 1; i < points.length - 1; i++) {
    const [px, py] = points[i - 1];
    const [cx, cy] = points[i];
    const [nx, ny] = points[i + 1];
    const inLength = Math.hypot(cx - px, cy - py);
    const outLength = Math.hypot(nx - cx, ny - cy);
    const r = Math.min(radius, inLength / 2, outLength / 2);
    const startX = cx - ((cx - px) / inLength) * r;
    const startY = cy - ((cy - py) / inLength) * r;
    const endX = cx + ((nx - cx) / outLength) * r;
    const endY = cy + ((ny - cy) / outLength) * r;
    d += ` L${startX} ${startY} Q${cx} ${cy} ${endX} ${endY}`;
  }

  const [lx, ly] = points[points.length - 1];
  return `${d} L${lx} ${ly}`;
}

interface SystemDiagramProps {
  definition: DiagramDefinition;
  /** Draw progress, 0 (nothing) to 1 (complete). */
  progress: MotionValue<number>;
  /** Whether hover tracing is active (off for diagrams that are not on screen). */
  interactive?: boolean;
  className?: string;
}

/**
 * Architecture-style diagram drawn by scroll progress: frames fade in, routes draw from
 * their source, nodes settle in as their routes reach them, then signals travel the
 * routes. Hovering a node traces every route connected to it.
 */
export function SystemDiagram({
  definition,
  progress,
  interactive = true,
  className,
}: SystemDiagramProps) {
  const [hovered, setHovered] = React.useState<string | null>(null);
  const { width, height, frames = [], nodes, edges } = definition;

  React.useEffect(() => {
    if (!interactive) setHovered(null);
  }, [interactive]);

  const connected = React.useMemo(() => {
    if (!hovered) return null;
    const ids = new Set([hovered]);
    edges.forEach((edge) => {
      if (edge.from === hovered) ids.add(edge.to);
      if (edge.to === hovered) ids.add(edge.from);
    });
    return ids;
  }, [hovered, edges]);

  return (
    <svg
      role="img"
      aria-label={definition.description}
      viewBox={`0 0 ${width} ${height}`}
      className={cn("h-full w-full overflow-visible", className)}
      fill="none"
      onPointerLeave={() => setHovered(null)}
    >
      {frames.map((frame, index) => (
        <Frame key={index} frame={frame} progress={progress} />
      ))}
      {edges.map((edge, index) => (
        <Edge
          key={index}
          edge={edge}
          progress={progress}
          lit={
            hovered !== null && (edge.from === hovered || edge.to === hovered)
          }
          quiet={hovered !== null}
        />
      ))}
      {nodes.map((node) => (
        <Node
          key={node.id}
          node={node}
          progress={progress}
          lit={hovered === node.id}
          dimmed={connected !== null && !connected.has(node.id)}
          onHover={interactive ? () => setHovered(node.id) : undefined}
        />
      ))}
    </svg>
  );
}

function Frame({
  frame,
  progress,
}: {
  frame: DiagramFrame;
  progress: MotionValue<number>;
}) {
  const opacity = useTransform(progress, [frame.at, frame.at + 0.12], [0, 1]);
  const { x, y, w, h } = frame;

  if (frame.kind === "phone") {
    return (
      <motion.g style={{ opacity }}>
        <rect
          x={x}
          y={y}
          width={w}
          height={h}
          rx={22}
          style={{ fill: "var(--surface)", stroke: "var(--border-strong)" }}
        />
        <line
          x1={x + w / 2 - 16}
          x2={x + w / 2 + 16}
          y1={y + 14}
          y2={y + 14}
          strokeWidth={4}
          strokeLinecap="round"
          style={{ stroke: "var(--border-strong)" }}
        />
        <rect
          x={x + 16}
          y={y + 34}
          width={w - 32}
          height={66}
          rx={8}
          style={{ fill: "var(--surface-soft)" }}
        />
        {[0, 1].map((line) => (
          <rect
            key={line}
            x={x + 16}
            y={y + 114 + line * 16}
            width={(w - 32) * (line ? 0.55 : 0.8)}
            height={6}
            rx={3}
            style={{ fill: "var(--border-strong)" }}
          />
        ))}
      </motion.g>
    );
  }

  return (
    <motion.g style={{ opacity }}>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={14}
        style={{ fill: "var(--surface)", stroke: "var(--border-strong)" }}
      />
      <line
        x1={x}
        x2={x + w}
        y1={y + 36}
        y2={y + 36}
        style={{ stroke: "var(--border-strong)" }}
      />
      {frame.label ? (
        <text
          x={x + 18}
          y={y + 23}
          className="font-mono"
          fontSize={11}
          style={{ fill: "var(--muted-subtle)" }}
        >
          {frame.label}
        </text>
      ) : null}
    </motion.g>
  );
}

function Edge({
  edge,
  progress,
  lit,
  quiet,
}: {
  edge: DiagramEdge;
  progress: MotionValue<number>;
  lit: boolean;
  quiet: boolean;
}) {
  const d = React.useMemo(() => routePath(edge.points), [edge.points]);
  const drawn = useTransform(progress, edge.at, [0, 1], { clamp: true });
  const visible = useTransform(drawn, [0, 0.02], [0, 1]);
  const settled = useTransform(drawn, [0.98, 1], [0, 1]);

  return (
    <g>
      <motion.path
        d={d}
        strokeWidth={1.25}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          pathLength: drawn,
          opacity: visible,
          stroke: "var(--border-strong)",
        }}
      />
      <path
        d={d}
        pathLength={1}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={1}
        strokeDashoffset={lit ? 0 : 1}
        style={{
          stroke: "var(--accent)",
          transition: "stroke-dashoffset 0.6s var(--ease-in-out)",
        }}
      />
      {edge.signal ? (
        <motion.g style={{ opacity: settled }}>
          <path
            d={d}
            pathLength={1}
            strokeWidth={2.25}
            strokeLinecap="round"
            className="route-signal"
            style={
              {
                stroke: "var(--accent)",
                opacity: quiet ? 0 : 1,
                transition: "opacity 0.3s",
                "--signal-delay": `${(edge.at[0] * 7).toFixed(2)}s`,
              } as React.CSSProperties
            }
          />
        </motion.g>
      ) : null}
    </g>
  );
}

function Node({
  node,
  progress,
  lit,
  dimmed,
  onHover,
}: {
  node: DiagramNode;
  progress: MotionValue<number>;
  lit: boolean;
  dimmed: boolean;
  onHover?: () => void;
}) {
  const appear = useTransform(progress, [node.at - 0.06, node.at], [0, 1], {
    clamp: true,
  });
  const scale = useTransform(appear, [0, 1], [0.92, 1]);
  const h = node.h ?? NODE_HEIGHT;
  const cy = node.y + h / 2;
  const highlighted = lit || node.accent;

  return (
    <motion.g
      style={{
        opacity: appear,
        scale,
        transformOrigin: `${node.x + node.w / 2}px ${cy}px`,
        transformBox: "view-box",
      }}
      onPointerEnter={onHover}
      className={cn(onHover && "cursor-default")}
    >
      <g
        style={{
          opacity: dimmed ? 0.4 : 1,
          transform: lit ? "translateY(-2px)" : undefined,
          transition: "opacity 0.3s, transform 0.3s var(--ease-out)",
        }}
      >
        <rect
          x={node.x}
          y={node.y}
          width={node.w}
          height={h}
          rx={8}
          style={{
            fill: lit ? "var(--surface-elevated)" : "var(--background)",
            stroke: highlighted ? "var(--accent)" : "var(--border-strong)",
            transition: "fill 0.3s, stroke 0.3s",
          }}
        />
        <circle
          cx={node.x + 16}
          cy={cy}
          r={3}
          style={{
            fill: highlighted ? "var(--accent)" : "var(--border-strong)",
            transition: "fill 0.3s",
          }}
        />
        <text
          x={node.x + 28}
          y={node.sub ? cy - 3 : cy + 4.5}
          className="font-mono"
          fontSize={13}
          style={{
            fill: highlighted ? "var(--foreground)" : "var(--muted-foreground)",
          }}
        >
          {node.label}
        </text>
        {node.sub ? (
          <text
            x={node.x + 28}
            y={cy + 13}
            className="font-mono"
            fontSize={10.5}
            style={{ fill: "var(--muted-subtle)" }}
          >
            {node.sub}
          </text>
        ) : null}
      </g>
    </motion.g>
  );
}
