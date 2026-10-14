export interface Pillar {
  id: string;
  path: string;
  name: string;
  /** One line on what this pillar owns. */
  owns: string;
  /** Specific competencies, phrased the way practitioners would. */
  practice: string[];
  /** How the pillar works with a client, revealed on hover. */
  withYou: string;
  /**
   * Shown in the pillar's footer, e.g. "12+ years". Leave undefined until a real figure is
   * agreed: the card then reads "senior" instead of inventing a number.
   */
  experience?: string;
}

export const pillars: Pillar[] = [
  {
    id: "design",
    path: "/design",
    name: "Design",
    owns: "Product and interface design, from the first flows to a production design system.",
    practice: [
      "User research, flows and information architecture",
      "Interface and interaction design",
      "Design systems and tokens shared with code",
      "Accessibility to WCAG\u00a02.2\u00a0AA",
    ],
    withYou:
      "Works with you from the first workshop, so decisions are tested before they are built.",
  },
  {
    id: "frontend",
    path: "/frontend",
    name: "Frontend",
    owns: "Fast, accessible interfaces on the web and on mobile, built on a typed component system.",
    practice: [
      "React, Next.js and TypeScript",
      "Rendering strategy per route: static, server or client",
      "Performance budgets for Core Web Vitals",
      "React Native and Flutter for cross-platform apps",
    ],
    withYou:
      "Turns designs into production interfaces and keeps the component system consistent as the product grows.",
  },
  {
    id: "backend",
    path: "/backend",
    name: "Backend",
    owns: "APIs, data and the infrastructure the product runs on, designed to be understood.",
    practice: [
      "Contract-first API design, REST and GraphQL",
      "Data modelling, migrations and integrations",
      "Infrastructure as code on AWS",
      "Security, logging, metrics and alerting",
    ],
    withYou:
      "Agrees the contracts with frontend before implementation, and documents how every service runs.",
  },
  {
    id: "engineering-management",
    path: "/eng-management",
    name: "Engineering management",
    owns: "Delivery, technical leadership and one accountable point of contact for your team.",
    practice: [
      "Milestones, estimates and delivery cadence",
      "Architecture decisions and code review standards",
      "Risk, dependency and scope management",
      "Plain-language reporting to stakeholders",
    ],
    withYou:
      "Owns the plan and the cadence, and tells you early when scope, risk or timelines change.",
  },
];
