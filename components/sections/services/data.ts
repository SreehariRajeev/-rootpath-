import type { DiagramDefinition } from "@/components/sections/services/diagram";

export interface Service {
  /** Matches the hero system map node, which links to `#service-${id}`. */
  id: "web" | "mobile" | "cloud" | "consult";
  path: string;
  name: string;
  title: string;
  description: string;
  tags: string[];
  /** How the work is done, in the terms a technical reviewer would look for. */
  practices: string[];
  diagram: DiagramDefinition;
}

/*
 * Diagrams share a 560 x 380 drawing space. Labels come from the service copy itself:
 * they illustrate how the work fits together, not claims about results.
 */

const web: DiagramDefinition = {
  width: 560,
  height: 380,
  description:
    "A web platform built in layers: component system, performance baseline and clear handoff, all feeding the next release.",
  frames: [
    {
      kind: "browser",
      x: 16,
      y: 20,
      w: 384,
      h: 340,
      label: "your-product.com",
      at: 0,
    },
  ],
  nodes: [
    {
      id: "components",
      x: 44,
      y: 268,
      w: 328,
      label: "component system",
      sub: "React",
      at: 0.18,
    },
    {
      id: "performance",
      x: 44,
      y: 184,
      w: 328,
      label: "performance baseline",
      sub: "SSR · Next.js",
      at: 0.32,
    },
    {
      id: "handoff",
      x: 44,
      y: 100,
      w: 328,
      label: "clear handoff",
      sub: "documented for your team",
      at: 0.46,
    },
    {
      id: "release",
      x: 426,
      y: 38,
      w: 132,
      label: "next release",
      accent: true,
      at: 0.8,
    },
  ],
  edges: [
    {
      from: "components",
      to: "release",
      points: [
        [372, 292],
        [410, 292],
        [410, 62],
        [426, 62],
      ],
      at: [0.5, 0.74],
      signal: true,
    },
    {
      from: "performance",
      to: "release",
      points: [
        [372, 208],
        [410, 208],
        [410, 62],
        [426, 62],
      ],
      at: [0.54, 0.76],
      signal: true,
    },
    {
      from: "handoff",
      to: "release",
      points: [
        [372, 124],
        [410, 124],
        [410, 62],
        [426, 62],
      ],
      at: [0.58, 0.78],
      signal: true,
    },
  ],
};

const mobile: DiagramDefinition = {
  width: 560,
  height: 380,
  description:
    "Three app screens joined by one path, built for iOS, Android, React Native or Flutter.",
  frames: [
    { kind: "phone", x: 20, y: 12, w: 150, h: 272, at: 0 },
    { kind: "phone", x: 205, y: 12, w: 150, h: 272, at: 0.08 },
    { kind: "phone", x: 390, y: 12, w: 150, h: 272, at: 0.16 },
  ],
  nodes: [
    {
      id: "s1",
      x: 36,
      y: 204,
      w: 118,
      label: "screen 01",
      sub: "entry",
      at: 0.28,
    },
    {
      id: "s2",
      x: 221,
      y: 204,
      w: 118,
      label: "screen 02",
      sub: "core flow",
      at: 0.48,
    },
    {
      id: "s3",
      x: 406,
      y: 204,
      w: 118,
      label: "screen 03",
      sub: "result",
      accent: true,
      at: 0.66,
    },
    { id: "ios", x: 20, y: 314, w: 92, h: 40, label: "iOS", at: 0.76 },
    { id: "android", x: 124, y: 314, w: 112, h: 40, label: "Android", at: 0.8 },
    {
      id: "rn",
      x: 248,
      y: 314,
      w: 148,
      h: 40,
      label: "React Native",
      at: 0.84,
    },
    {
      id: "flutter",
      x: 408,
      y: 314,
      w: 132,
      h: 40,
      label: "Flutter",
      at: 0.88,
    },
  ],
  edges: [
    {
      from: "s1",
      to: "s2",
      points: [
        [154, 228],
        [221, 228],
      ],
      at: [0.34, 0.48],
      signal: true,
    },
    {
      from: "s2",
      to: "s3",
      points: [
        [339, 228],
        [406, 228],
      ],
      at: [0.54, 0.66],
      signal: true,
    },
  ],
};

const cloud: DiagramDefinition = {
  width: 560,
  height: 380,
  description:
    "An open architecture: clients talk to a GraphQL data layer, which connects APIs, integrations and data, all running on AWS infrastructure.",
  nodes: [
    {
      id: "client",
      x: 8,
      y: 128,
      w: 120,
      h: 56,
      label: "client",
      sub: "web · mobile",
      at: 0.12,
    },
    {
      id: "graphql",
      x: 172,
      y: 128,
      w: 148,
      h: 56,
      label: "GraphQL",
      sub: "data layer",
      accent: true,
      at: 0.3,
    },
    {
      id: "api",
      x: 372,
      y: 24,
      w: 180,
      h: 56,
      label: "API",
      sub: "endpoints",
      at: 0.5,
    },
    {
      id: "integrations",
      x: 372,
      y: 128,
      w: 180,
      h: 56,
      label: "integrations",
      sub: "connected",
      at: 0.54,
    },
    {
      id: "data",
      x: 372,
      y: 232,
      w: 180,
      h: 56,
      label: "data",
      sub: "storage",
      at: 0.58,
    },
    {
      id: "aws",
      x: 8,
      y: 320,
      w: 544,
      h: 52,
      label: "AWS",
      sub: "infrastructure",
      at: 0.76,
    },
  ],
  edges: [
    {
      from: "client",
      to: "graphql",
      points: [
        [128, 156],
        [172, 156],
      ],
      at: [0.18, 0.3],
      signal: true,
    },
    {
      from: "graphql",
      to: "api",
      points: [
        [320, 156],
        [346, 156],
        [346, 52],
        [372, 52],
      ],
      at: [0.36, 0.5],
      signal: true,
    },
    {
      from: "graphql",
      to: "integrations",
      points: [
        [320, 156],
        [372, 156],
      ],
      at: [0.38, 0.52],
      signal: true,
    },
    {
      from: "graphql",
      to: "data",
      points: [
        [320, 156],
        [346, 156],
        [346, 260],
        [372, 260],
      ],
      at: [0.4, 0.56],
      signal: true,
    },
    {
      from: "graphql",
      to: "aws",
      points: [
        [246, 184],
        [246, 320],
      ],
      at: [0.62, 0.76],
    },
    {
      from: "data",
      to: "aws",
      points: [
        [462, 288],
        [462, 320],
      ],
      at: [0.64, 0.76],
    },
  ],
};

const consult: DiagramDefinition = {
  width: 560,
  height: 380,
  description:
    "A path from the current system through an architecture review and a modernization plan to a technical roadmap and a clear next move.",
  nodes: [
    {
      id: "current",
      x: 8,
      y: 16,
      w: 184,
      label: "current system",
      sub: "today",
      at: 0.1,
    },
    {
      id: "review",
      x: 64,
      y: 104,
      w: 204,
      label: "architecture review",
      sub: "assess",
      at: 0.3,
    },
    {
      id: "options",
      x: 312,
      y: 104,
      w: 240,
      label: "keep / refactor / replace",
      sub: "per component",
      at: 0.44,
    },
    {
      id: "plan",
      x: 120,
      y: 192,
      w: 200,
      label: "modernization plan",
      sub: "decide",
      at: 0.56,
    },
    {
      id: "roadmap",
      x: 176,
      y: 280,
      w: 196,
      label: "technical roadmap",
      sub: "sequence",
      at: 0.72,
    },
    {
      id: "next",
      x: 412,
      y: 280,
      w: 140,
      label: "next move",
      accent: true,
      at: 0.86,
    },
  ],
  edges: [
    {
      from: "current",
      to: "review",
      points: [
        [32, 64],
        [32, 128],
        [64, 128],
      ],
      at: [0.16, 0.3],
      signal: true,
    },
    {
      from: "review",
      to: "options",
      points: [
        [268, 128],
        [312, 128],
      ],
      at: [0.36, 0.44],
    },
    {
      from: "review",
      to: "plan",
      points: [
        [88, 152],
        [88, 216],
        [120, 216],
      ],
      at: [0.42, 0.56],
      signal: true,
    },
    {
      from: "plan",
      to: "roadmap",
      points: [
        [144, 240],
        [144, 304],
        [176, 304],
      ],
      at: [0.6, 0.72],
      signal: true,
    },
    {
      from: "roadmap",
      to: "next",
      points: [
        [372, 304],
        [412, 304],
      ],
      at: [0.76, 0.86],
      signal: true,
    },
  ],
};

export const services: Service[] = [
  {
    id: "web",
    path: "/web",
    name: "Web development",
    title: "Web platforms built for the next release",
    description:
      "From marketing sites to enterprise platforms, we make the structure, content, and performance work together.",
    tags: ["Next.js", "SSR", "React", "Performance"],
    practices: [
      "Rendering strategy chosen per route: static, server or client",
      "Typed component system with design tokens shared with design",
      "Performance budgets for Core Web Vitals, measured before release",
      "Accessible to WCAG\u00a02.2\u00a0AA",
    ],
    diagram: web,
  },
  {
    id: "mobile",
    path: "/mobile",
    name: "Mobile app development",
    title: "Mobile apps with a clear path from screen to screen",
    description:
      "We shape the core flows and build the app for iOS, Android, React Native, or Flutter.",
    tags: ["iOS", "Android", "React Native", "Flutter"],
    practices: [
      "Native or cross-platform, chosen on product needs",
      "Offline behaviour and data sync designed in where needed",
      "Release pipelines for the App Store and Google Play",
      "Crash reporting and analytics from the first build",
    ],
    diagram: mobile,
  },
  {
    id: "cloud",
    path: "/cloud",
    name: "Cloud and API engineering",
    title: "APIs and infrastructure without the black box",
    description:
      "Clear APIs, infrastructure, and integrations for products that need to move without unnecessary complexity.",
    tags: ["AWS", "GraphQL", "Integrations"],
    practices: [
      "Contract-first APIs: schemas agreed before implementation",
      "Infrastructure as code, with reproducible environments",
      "Logs, metrics, tracing and alerting from day one",
      "Least-privilege access and managed secrets",
    ],
    diagram: cloud,
  },
  {
    id: "consult",
    path: "/consult",
    name: "Technical consulting",
    title: "Turn technical complexity into a clear next move",
    description:
      "Architecture reviews, legacy modernization, and product strategy for teams deciding what to build next.",
    tags: ["Architecture review", "Modernization plan", "Technical roadmap"],
    practices: [
      "Architecture and code review with written findings",
      "Keep, refactor or replace, decided per component",
      "Decision records your team can revisit",
      "A roadmap sequenced by risk and dependency",
    ],
    diagram: consult,
  },
];
