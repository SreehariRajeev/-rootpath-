import { contactHref } from "@/lib/contact";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://root-path.tech"
).replace(/\/$/, "");

export const SITE_NAME = "Root-Path";

export const SITE_TITLE = "Root-Path | Small-team digital engineering";

export const SITE_DESCRIPTION =
  "Root-Path is a lean digital engineering team for web, mobile, cloud, and technical strategy. Direct collaboration, focused scope, and fast delivery.";

const contactEmail = contactHref.replace(/^mailto:/i, "");

export function getJsonLd() {
  const organizationId = `${SITE_URL}/#organization`;
  const websiteId = `${SITE_URL}/#website`;
  const serviceId = `${SITE_URL}/#service`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: SITE_NAME,
        url: SITE_URL,
        email: contactEmail,
        slogan: "Small team. Direct access. Faster decisions.",
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: SITE_URL,
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        inLanguage: "en",
        publisher: { "@id": organizationId },
      },
      {
        "@type": "ProfessionalService",
        "@id": serviceId,
        name: SITE_NAME,
        url: SITE_URL,
        email: contactEmail,
        description:
          "Digital engineering for web platforms, mobile apps, cloud infrastructure, and technical consulting.",
        parentOrganization: { "@id": organizationId },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Digital engineering services",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: { "@type": "Service", name: "Web development" },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Mobile app development",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Cloud and API engineering",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Technical consulting",
              },
            },
          ],
        },
      },
    ],
  };
}
