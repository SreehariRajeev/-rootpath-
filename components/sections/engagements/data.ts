import type { ContactPrefill } from "@/lib/contact";

/*
 * Copy rules for this section. Each line was tested against them:
 *  - Opens on the visitor's situation, so they can tell in a second whether it is theirs.
 *  - States the commitment and the risk plainly. No prices, timelines, response times or
 *    guarantees, because the site makes none.
 *  - Does not repeat other sections: no tech names (Services), no files or stages (Process),
 *    no "small team / direct access" (Hero), no "not sure which route fits" (end of Services).
 *  - Each call to action names what happens and matches the label on the contact form.
 *
 * The shape each engagement takes over time is drawn in engagements.tsx, as a lane.
 */

export interface Engagement {
  id: "fixed" | "embedded" | "review";
  /** Short mono label beside the number. */
  keyword: string;
  /** The visitor's situation, in the second person. */
  title: string;
  summary: string;
  commitment: string;
  scope: string;
  /** Call to action. Mirrors the form's submit label for the pre-selected request type. */
  cta: string;
  /** What the call to action pre-selects in the contact form. */
  prefill: ContactPrefill;
}

export const engagements: Engagement[] = [
  {
    id: "fixed",
    keyword: "fixed scope",
    title: "You know what needs to be built.",
    summary: "A defined product, release or rebuild with a clear finish line.",
    commitment: "One project, start to finish.",
    scope: "Agreed with an estimate before work begins.",
    cta: "Request a quote",
    prefill: { requestType: "Quote" },
  },
  {
    id: "embedded",
    keyword: "embedded team",
    title: "You have a roadmap, not one project.",
    summary:
      "Designers and engineers working alongside your team, release after release.",
    commitment: "Ongoing, not project by project.",
    scope: "Priorities set with you as the roadmap moves.",
    cta: "Request a proposal",
    prefill: { requestType: "Proposal" },
  },
  {
    id: "review",
    keyword: "review first",
    title: "You need a decision before you build.",
    summary:
      "A focused look at your system, your options and the risks, so the build you commit to is the right one.",
    commitment: "Short and bounded. Act on it with us or without us.",
    scope: "The decision in front of you, answered in writing.",
    cta: "Request a review",
    prefill: { requestType: "Review", service: "Technical consulting" },
  },
];
