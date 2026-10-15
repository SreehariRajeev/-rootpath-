/*
 * The senior people who lead and build Root-Path engagements.
 *
 * DRAFT: names, years, previous work, selected work and photos are not filled in yet. Anything left
 * undefined renders as a bracketed placeholder (e.g. "[ Name ]") so it can never be
 * mistaken for real content. Roles, focus lines and stacks are first drafts to confirm.
 * Do not publish this section until every person is complete.
 */

export type Discipline =
  | "design"
  | "frontend"
  | "backend"
  | "engineering management";

export interface Person {
  /** Full name, as it should appear on the site. */
  name?: string;
  role: string;
  discipline: Discipline;
  /** Years of professional experience. */
  years?: number;
  /** One or two lines on what this person leads and is known for. */
  focus: string;
  /** Tools and practices they work in day to day. */
  stack: string[];
  /** Previous companies, sectors or notable products, in one line. */
  previously?: string;
  /** Two or three notable projects or results, one line each. */
  selectedWork?: string[];
  /** Portrait under /public/team/, e.g. "/team/jane-doe.jpg". A monogram is shown without one. */
  photo?: string;
}

export const people: Person[] = [
  {
    role: "Lead Product Designer",
    discipline: "design",
    focus:
      "Leads product and interface design, from research and flows to the production design system.",
    stack: ["Figma", "Design systems", "Prototyping", "Motion", "WCAG 2.2"],
  },
  {
    role: "Lead Frontend Engineer",
    discipline: "frontend",
    focus:
      "Owns the interface architecture: rendering strategy, performance, and motion and 3D on the web.",
    stack: ["Next.js", "React", "TypeScript", "GSAP", "Three.js", "WebGL"],
  },
  {
    role: "Lead Backend Engineer",
    discipline: "backend",
    focus:
      "Designs the APIs, data and infrastructure, and the workflows that keep them reliable under load.",
    stack: ["PostgreSQL", "Redis", "Temporal", "Docker", "Kubernetes", "AWS"],
  },
  {
    role: "Engineering Manager",
    discipline: "engineering management",
    focus:
      "Runs delivery end to end: plans, estimates, reviews, and keeps every stakeholder informed.",
    stack: [
      "Delivery planning",
      "Architecture reviews",
      "Code review",
      "DORA metrics",
    ],
  },
];

/** True once every person has a name and years filled in. */
export const teamComplete = people.every(
  (person) => person.name && person.years !== undefined,
);
