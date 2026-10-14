export interface Artifact {
  /** Folder in the client's repository. */
  dir: string;
  files: string[];
}

export interface Stage {
  id: string;
  /** Short verb shown in mono beside the stage number. */
  keyword: string;
  title: string;
  description: string;
  practices: string[];
  /** What the stage leaves behind in the client's repository. */
  artifacts: Artifact[];
}

export const stages: Stage[] = [
  {
    id: "discover",
    keyword: "discover",
    title: "Start with context",
    description:
      "We begin with the problem, the users, what exists today, and what needs deciding. Engineers and designers review the current system before anyone proposes a solution.",
    practices: [
      "Stakeholder and user interviews",
      "Audit of code, infrastructure and analytics",
      "Constraints, risks and success criteria agreed",
    ],
    artifacts: [
      {
        dir: "discovery/",
        files: ["brief.md", "system-audit.md", "success-criteria.md"],
      },
    ],
  },
  {
    id: "architect",
    keyword: "architect",
    title: "Set a clear path",
    description:
      "We turn the findings into an architecture and a delivery plan. Options are written down with their trade-offs, and you decide with the people who will build it.",
    practices: [
      "Architecture options with trade-offs",
      "Data model and API contracts agreed up front",
      "Milestones, estimates and known risks",
    ],
    artifacts: [
      {
        dir: "decisions/",
        files: ["0001-architecture.md", "0002-data-model.md"],
      },
      { dir: "contracts/", files: ["schema.graphql"] },
    ],
  },
  {
    id: "build",
    keyword: "build",
    title: "Build in the open",
    description:
      "We work in small, reviewed increments. Every change runs through automated checks and gets a preview you can click through while it is still easy to change.",
    practices: [
      "Code review on every change",
      "Type checks and automated tests in CI",
      "A preview environment for each change",
    ],
    artifacts: [
      { dir: "src/", files: [] },
      { dir: "tests/", files: [] },
      { dir: ".github/workflows/", files: ["ci.yml"] },
    ],
  },
  {
    id: "ship",
    keyword: "ship",
    title: "Deliver with care",
    description:
      "We release with monitoring in place, write down how the system runs, and hand over a codebase your team can understand and continue to own.",
    practices: [
      "Staged releases with a rollback path",
      "Monitoring, alerting and runbooks",
      "Handover sessions and documentation",
    ],
    artifacts: [
      { dir: "runbooks/", files: ["deploy.md", "incidents.md"] },
      { dir: "docs/", files: ["handover.md"] },
    ],
  },
];
