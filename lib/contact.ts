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

/** Smooth-scrolls to the contact form section. */
export function goToContact() {
  const target = document.getElementById("contact");
  if (!target) {
    window.location.hash = "#contact";
    return;
  }
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  target.scrollIntoView({
    behavior: reduce ? "auto" : "smooth",
    block: "start",
  });
  window.history.replaceState(null, "", "#contact");
}
