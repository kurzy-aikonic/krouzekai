import { site, schemaSameAsUrls } from "@/lib/site-config";
import { getSiteUrl, rootSchemaDescription } from "@/lib/seo";

/**
 * Globální strukturovaná data na každé stránce (Organization + WebSite).
 * Kurz / FAQ mají vlastní JSON-LD na příslušných stránkách.
 */
export function GlobalJsonLd() {
  const origin = getSiteUrl().toString().replace(/\/$/, "");
  const orgId = `${origin}/#organization`;
  const websiteId = `${origin}/#website`;

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": orgId,
        name: site.shortName,
        alternateName: site.name,
        legalName: site.company.legalName,
        description: rootSchemaDescription(),
        url: origin,
        email: site.contactEmail,
        telephone: site.company.phoneDisplay,
        identifier: {
          "@type": "PropertyValue",
          name: "IČO",
          value: site.company.ic,
        },
        address: {
          "@type": "PostalAddress",
          ...site.company.postalAddress,
        },
        parentOrganization: {
          "@type": "Organization",
          name: site.parentSite.name,
          url: site.parentSite.url,
        },
        sameAs: schemaSameAsUrls(),
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: origin,
        name: site.shortName,
        description: rootSchemaDescription(),
        inLanguage: "cs-CZ",
        publisher: { "@id": orgId },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
