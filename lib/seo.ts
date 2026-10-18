import { contactEmail } from "@/lib/contact";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://root-path.tech"
).replace(/\/$/, "");

export const SITE_NAME = "Root-Path";

/** Other spellings people use for the brand, so they resolve to the same entity. */
export const SITE_ALTERNATE_NAMES = ["RootPath", "Root Path"];

// Title stays under ~60 characters and the description under ~155, where Google starts cutting.
export const SITE_TITLE =
  "Root-Path | Digital Engineering for Web, Mobile & Cloud";

export const SITE_DESCRIPTION =
  "Web platforms, mobile apps, cloud and API engineering and technical consulting, from first brief to production. Work directly with the engineers who ship.";

/** Static file in /public (see scripts/generate-brand-assets.mjs). */
export const OG_IMAGE = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: "Root-Path: small team, direct access, faster decisions",
};

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
        alternateName: SITE_ALTERNATE_NAMES,
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
