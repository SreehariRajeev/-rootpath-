import { scrollToElement } from "@/lib/smooth-scroll";

export const contactEmail = "connect@root-path.tech";
export const contactHref = `mailto:${contactEmail}`;

/**
 * Where the quote form posts. The site is a static export, so there is no server of our own:
 * the default is FormSubmit's AJAX endpoint, which forwards each submission to `contactEmail`.
 * Set NEXT_PUBLIC_CONTACT_ENDPOINT at build time to point at a different service (e.g. Formspree).
 */
export const contactEndpoint =
  process.env.NEXT_PUBLIC_CONTACT_ENDPOINT ??
  `https://formsubmit.co/ajax/${contactEmail}`;

export type RequestType = "Quote" | "Proposal" | "Review";

/** Form fields a call to action pre-selects. A service left out is cleared; a request type left out is kept. */
export interface ContactPrefill {
  requestType?: RequestType;
  service?: string;
}

export const PREFILL_EVENT = "rootpath:prefill";

/** Pre-selects the request form, then smooth-scrolls to it. */
export function startRequest(prefill: ContactPrefill) {
  window.dispatchEvent(
    new CustomEvent<ContactPrefill>(PREFILL_EVENT, { detail: prefill }),
  );
  goToContact();
}

/** Smooth-scrolls to the contact form section. */
export function goToContact() {
  const target = document.getElementById("contact");
  if (!target) {
    window.location.hash = "#contact";
    return;
  }
  scrollToElement(target);
  window.history.replaceState(null, "", "#contact");
}
